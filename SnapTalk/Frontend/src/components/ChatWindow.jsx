import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
  Pin,
  Star,
  CornerUpLeft,
  Trash2,
  Edit2,
  X,
  FileText,
  Play,
  Pause,
  ShieldCheck,
  Image as ImageIcon,
  StopCircle
} from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ conversation, onStartCall }) => {
  const { socket, onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Indicators
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const recordIntervalRef = useRef(null);

  // Options & Popups
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const isDirect = conversation?.type === 'direct';
  const otherUser = isDirect ? conversation.participants?.find(p => (p._id || p.id) !== currentUser?.id) : null;
  const title = isDirect ? (otherUser?.name || 'User') : (conversation?.group?.name || 'Group');
  const avatar = isDirect
    ? (otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=00a884&color=fff`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=2563EB&color=fff`;

  const isOnline = isDirect && onlineUsers.get(otherUser?._id);

  useEffect(() => {
    if (conversation?._id) {
      fetchMessages();

      if (socket) {
        socket.emit('conversation:join', conversation._id);

        const onNewMessage = (msg) => {
          setMessages(prev => [...prev, msg]);
          scrollToBottom();
        };

        const onTypingStart = ({ user }) => {
          if ((user?._id || user?.id) !== currentUser?.id) {
            setTypingUsers(prev => new Set(prev).add(user?.name || 'Someone'));
          }
        };

        const onTypingStop = () => {
          setTypingUsers(new Set());
        };

        socket.on('message:new', onNewMessage);
        socket.on('typing:start', onTypingStart);
        socket.on('typing:stop', onTypingStop);

        return () => {
          socket.emit('conversation:leave', conversation._id);
          socket.off('message:new', onNewMessage);
          socket.off('typing:start', onTypingStart);
          socket.off('typing:stop', onTypingStop);
        };
      }
    }
  }, [conversation, socket, currentUser]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/chats/messages/${conversation._id}`);
      if (res.success) {
        setMessages(res.messages || []);
        scrollToBottom();
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !editingMessage) return;

    if (editingMessage) {
      try {
        const res = await api.put(`/chats/messages/${editingMessage._id}`, { text: inputText });
        if (res.success) {
          setMessages(prev => prev.map(m => (m._id === editingMessage._id ? res.message : m)));
          setEditingMessage(null);
          setInputText('');
        }
      } catch (err) {
        alert(err.message || 'Failed to edit message');
      }
      return;
    }

    const payload = {
      conversationId: conversation._id,
      text: inputText.trim(),
      replyToId: replyToMessage?._id
    };

    setInputText('');
    setReplyToMessage(null);

    try {
      const res = await api.post('/chats/messages', payload);
      if (res.success && res.message) {
        setMessages(prev => [...prev, res.message]);
        scrollToBottom();
        if (socket) {
          socket.emit('message:send', { conversationId: conversation._id, message: res.message });
          socket.emit('typing:stop', { conversationId: conversation._id });
        }
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const fileRes = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (fileRes.success && fileRes.file) {
        const fileDoc = fileRes.file;
        let type = 'file';
        if (fileDoc.mimeType.startsWith('image/')) type = 'image';
        else if (fileDoc.mimeType.startsWith('video/')) type = 'video';
        else if (fileDoc.mimeType.startsWith('audio/')) type = 'audio';

        const msgRes = await api.post('/chats/messages', {
          conversationId: conversation._id,
          type,
          mediaUrl: fileDoc.url,
          fileName: fileDoc.originalName,
          fileSize: fileDoc.size
        });

        if (msgRes.success) {
          setMessages(prev => [...prev, msgRes.message]);
          scrollToBottom();
        }
      }
    } catch (err) {
      alert(err.message || 'File upload failed');
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordTimer(0);
    recordIntervalRef.current = setInterval(() => {
      setRecordTimer(prev => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = async (send = true) => {
    clearInterval(recordIntervalRef.current);
    setIsRecording(false);

    if (send && recordTimer > 0) {
      const msgRes = await api.post('/chats/messages', {
        conversationId: conversation._id,
        type: 'audio',
        text: `🎤 Voice note (${recordTimer}s)`
      });

      if (msgRes.success) {
        setMessages(prev => [...prev, msgRes.message]);
        scrollToBottom();
      }
    }
    setRecordTimer(0);
  };

  const handleToggleReaction = async (messageId, emoji) => {
    try {
      const res = await api.post(`/chats/messages/${messageId}/reaction`, { emoji });
      if (res.success) {
        setMessages(prev => prev.map(m => (m._id === messageId ? res.message : m)));
        setActiveReactionMsgId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await api.post(`/chats/messages/${messageId}/delete`, { deleteForEveryone: true });
      if (res.success) {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      }
    } catch (e) {
      alert(e.message || 'Failed to delete message');
    }
  };

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉'];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative overflow-hidden select-none font-sans">
      
      {/* Header Bar */}
      <div className="h-16 px-4 bg-[#111b21] border-b border-[#222d34] flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <img src={avatar} alt={title} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00a884]/30" />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full ring-2 ring-[#111b21]" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-sm text-[#e9edef] leading-tight truncate max-w-xs">{title}</h2>
            <p className="text-xs text-[#8696a0]">
              {typingUsers.size > 0
                ? <span className="text-[#00a884] font-medium animate-pulse">{Array.from(typingUsers).join(', ')} is typing...</span>
                : isOnline ? <span className="text-[#00a884]">online</span> : 'last seen recently'}
            </p>
          </div>
        </div>

        {/* Call & Utility Icons */}
        <div className="flex items-center space-x-1 text-[#8696a0]">
          {isDirect && otherUser && (
            <>
              <button
                onClick={() => onStartCall(otherUser, 'audio')}
                className="p-2.5 rounded-full hover:bg-[#202c33] hover:text-white transition-colors"
                title="Voice Call"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStartCall(otherUser, 'video')}
                className="p-2.5 rounded-full hover:bg-[#202c33] hover:text-white transition-colors"
                title="Video Call"
              >
                <Video className="w-5 h-5" />
              </button>
            </>
          )}
          <div className="w-px h-6 bg-[#222d34] mx-1" />
          <button className="p-2.5 rounded-full hover:bg-[#202c33] hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-[#202c33] hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area with Wallpaper Pattern */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 snaptalk-wallpaper-dark">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-7 h-7 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-[#182229] border border-[#222d34] px-4 py-2 rounded-xl flex items-center space-x-2 text-xs text-[#8696a0] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#00a884]" />
              <span>Messages and calls are end-to-end encrypted. No one outside of this chat can read them.</span>
            </div>
          </div>
        ) : (
          messages.map(m => {
            const isMe = (m.sender?._id || m.sender?.id || m.sender) === currentUser?.id;
            const isShowReactions = activeReactionMsgId === m._id;

            return (
              <div
                key={m._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
              >
                {/* Sender Name in Group */}
                {!isMe && !isDirect && (
                  <span className="text-[11px] font-semibold text-[#00a884] mb-1 ml-2">
                    {m.sender?.name || 'Group Member'}
                  </span>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-xl px-3.5 py-2 shadow-md relative transition-all text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#005c4b] text-[#e9edef] st-bubble-out'
                      : 'bg-[#202c33] text-[#e9edef] st-bubble-in'
                  }`}
                >
                  {/* Reply Reference if present */}
                  {m.replyTo && (
                    <div className="mb-1.5 p-2 rounded-lg bg-black/20 border-l-4 border-[#00a884] text-[11px]">
                      <span className="font-semibold text-[#00a884]">Replying to</span>
                      <p className="truncate text-gray-300">{m.replyTo.text}</p>
                    </div>
                  )}

                  {/* Text Content */}
                  {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}

                  {/* Image Attachment */}
                  {m.type === 'image' && m.mediaUrl && (
                    <img src={m.mediaUrl} alt="" className="rounded-lg max-h-64 object-cover my-1 border border-black/20" />
                  )}

                  {/* File Attachment */}
                  {m.type === 'file' && m.mediaUrl && (
                    <a
                      href={m.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 rounded-lg bg-black/20 hover:bg-black/30 text-xs my-1"
                    >
                      <FileText className="w-4 h-4 text-[#00a884] shrink-0" />
                      <span className="truncate">{m.fileName || 'Download Document'}</span>
                    </a>
                  )}

                  {/* Time & Double Checkmarks */}
                  <div className="flex items-center justify-end space-x-1 text-[10px] text-[#8696a0] mt-1 float-right ml-4">
                    <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>

                  {/* Message Reactions */}
                  {m.reactions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 -mb-1">
                      {m.reactions.map((r, idx) => (
                        <span key={idx} className="bg-[#0b141a] px-1.5 py-0.5 rounded-full text-[10px] border border-[#222d34]">
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Menu popover trigger */}
                  <div className={`absolute top-1 ${isMe ? '-left-16' : '-right-16'} hidden group-hover:flex items-center space-x-1 bg-[#0b141a] p-1 rounded-full border border-[#222d34] shadow-lg`}>
                    <button onClick={() => setActiveReactionMsgId(isShowReactions ? null : m._id)} className="p-1 text-xs hover:bg-[#202c33] rounded-full">
                      😊
                    </button>
                    <button onClick={() => setReplyToMessage(m)} className="p-1 text-xs hover:bg-[#202c33] rounded-full text-[#8696a0]">
                      <CornerUpLeft className="w-3 h-3" />
                    </button>
                    {isMe && (
                      <button onClick={() => handleDeleteMessage(m._id)} className="p-1 text-xs hover:bg-[#202c33] rounded-full text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Emoji Reactions Picker */}
                  {isShowReactions && (
                    <div className="absolute -top-10 left-0 bg-[#202c33] border border-[#222d34] p-1.5 rounded-full flex space-x-1 shadow-2xl z-20">
                      {emojis.map(e => (
                        <button key={e} onClick={() => handleToggleReaction(m._id, e)} className="hover:scale-125 transition-transform text-sm px-1">
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview Bar */}
      {replyToMessage && (
        <div className="px-4 py-2 bg-[#111b21] border-t border-[#222d34] flex items-center justify-between text-xs text-[#e9edef]">
          <div className="flex items-center space-x-2">
            <CornerUpLeft className="w-4 h-4 text-[#00a884]" />
            <div>
              <span className="font-semibold text-[#00a884]">Replying to message</span>
              <p className="text-[#8696a0] truncate max-w-sm">{replyToMessage.text}</p>
            </div>
          </div>
          <button onClick={() => setReplyToMessage(null)} className="text-[#8696a0] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message Input Toolbar */}
      <div className="p-3 bg-[#111b21] border-t border-[#222d34] flex items-center space-x-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2.5 rounded-full text-[#8696a0] hover:bg-[#202c33] hover:text-white transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* File Clip Button */}
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-full text-[#8696a0] hover:bg-[#202c33] hover:text-white transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        {!isRecording ? (
          <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (socket) socket.emit('typing:start', { conversationId: conversation._id, user: currentUser });
              }}
              placeholder="Type a message..."
              className="w-full bg-[#202c33] border-0 rounded-xl px-4 py-2.5 text-xs text-[#e9edef] placeholder-[#8696a0] focus:outline-none"
            />
            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] text-white shadow-md transition-all cursor-pointer shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startVoiceRecording}
                className="p-2.5 rounded-full text-[#8696a0] hover:bg-[#202c33] hover:text-white transition-colors shrink-0"
                title="Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        ) : (
          /* Voice Note Recording UI */
          <div className="flex-1 flex items-center justify-between bg-[#202c33] rounded-xl px-4 py-2 text-xs text-[#e9edef]">
            <div className="flex items-center space-x-2 text-red-400 font-semibold animate-pulse">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
              <span>Recording Voice Note... {recordTimer}s</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => stopVoiceRecording(false)} className="p-1 text-[#8696a0] hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
              <button onClick={() => stopVoiceRecording(true)} className="p-1.5 rounded-full bg-[#00a884] text-white">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatWindow;
