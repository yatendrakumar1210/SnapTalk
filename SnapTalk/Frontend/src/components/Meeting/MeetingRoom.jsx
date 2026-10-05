import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PenTool,
  MessageSquare,
  Users,
  Hand,
  PhoneOff,
  Shield,
  X,
  Send,
  Lock,
  GraduationCap
} from 'lucide-react';
import ParticipantGrid from './ParticipantGrid';
import WhiteboardCanvas from '../Whiteboard/WhiteboardCanvas';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const MeetingRoom = ({ meetingId, meeting, onLeave }) => {
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'board'
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const isHost = meeting?.host?._id === currentUser?.id || meeting?.host === currentUser?.id;
  const isOnlineClass = meeting?.mode === 'online_class';

  useEffect(() => {
    if (socket && meetingId) {
      socket.emit('meeting:join', {
        meetingId,
        user: currentUser
      });

      socket.on('meeting:joined', ({ participants: existing }) => {
        setParticipants(existing || []);
      });

      socket.on('meeting:participant-joined', (p) => {
        setParticipants(prev => [...prev.filter(x => x.socketId !== p.socketId), p]);
      });

      socket.on('meeting:participant-left', ({ socketId }) => {
        setParticipants(prev => prev.filter(x => x.socketId !== socketId));
      });

      socket.on('meeting:hand-raised', ({ socketId, user }) => {
        setParticipants(prev =>
          prev.map(p => (p.socketId === socketId ? { ...p, handRaised: true } : p))
        );
      });

      socket.on('meeting:hand-lowered', ({ socketId }) => {
        setParticipants(prev =>
          prev.map(p => (p.socketId === socketId ? { ...p, handRaised: false } : p))
        );
      });

      socket.on('meeting:chat-message', (msg) => {
        setChatMessages(prev => [...prev, msg]);
      });

      socket.on('meeting:force-muted', () => {
        setIsMuted(true);
      });

      return () => {
        socket.emit('meeting:leave', { meetingId });
        socket.off('meeting:joined');
        socket.off('meeting:participant-joined');
        socket.off('meeting:participant-left');
        socket.off('meeting:hand-raised');
        socket.off('meeting:hand-lowered');
        socket.off('meeting:chat-message');
        socket.off('meeting:force-muted');
      };
    }
  }, [socket, meetingId, currentUser]);

  const toggleMic = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (socket) socket.emit('meeting:toggle-audio', { meetingId, isMuted: nextState });
  };

  const toggleCamera = () => {
    const nextState = !isCameraOn;
    setIsCameraOn(nextState);
    if (socket) socket.emit('meeting:toggle-video', { meetingId, isCameraOn: nextState });
  };

  const toggleRaiseHand = () => {
    const nextState = !handRaised;
    setHandRaised(nextState);
    if (socket) {
      if (nextState) {
        socket.emit('meeting:raise-hand', { meetingId, user: currentUser });
      } else {
        socket.emit('meeting:lower-hand', { meetingId });
      }
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      senderName: currentUser?.name || 'You',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (socket) socket.emit('meeting:chat-message', { meetingId, message: newMsg });
    setChatInput('');
  };

  const handleMuteParticipant = (socketId) => {
    if (socket && isHost) {
      socket.emit('meeting:host-mute-participant', { meetingId, targetSocketId: socketId });
    }
  };

  const handleRemoveParticipant = (socketId) => {
    if (socket && isHost) {
      socket.emit('meeting:host-remove-participant', { meetingId, targetSocketId: socketId });
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-950 text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* Top Header */}
      <div className="h-14 px-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            ST
          </div>
          <div>
            <h2 className="font-semibold text-sm text-gray-100 flex items-center gap-2">
              {meeting?.title || `Meeting: ${meetingId}`}
              {isOnlineClass && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Online Class Mode
                </span>
              )}
            </h2>
            <span className="text-[11px] text-gray-400">ID: {meetingId}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Switcher: Grid vs Smartboard */}
          <div className="bg-gray-800 p-1 rounded-xl flex items-center space-x-1 border border-gray-700">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Video Grid
            </button>
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                activeTab === 'board' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Smartboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Workspace View (Grid or Smartboard) */}
        <div className="flex-1 h-full overflow-hidden relative bg-gray-950">
          {activeTab === 'grid' ? (
            <ParticipantGrid
              participants={participants}
              currentUser={currentUser}
            />
          ) : (
            <WhiteboardCanvas
              meetingId={meetingId}
              isHost={isHost}
              studentDrawingEnabled={true}
            />
          )}
        </div>

        {/* Right Drawer: Participants */}
        {showParticipants && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full z-20">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-200">Participants ({participants.length + 1})</h3>
              <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-800/60">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                    {currentUser?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{currentUser?.name} (You)</p>
                    <span className="text-[10px] text-blue-400">{isHost ? 'Host' : 'Participant'}</span>
                  </div>
                </div>
              </div>

              {participants.map(p => (
                <div key={p.socketId} className="flex items-center justify-between p-2 rounded-xl bg-gray-800/40 hover:bg-gray-800/80">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs text-white">
                      {p.user?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{p.user?.name || 'Participant'}</p>
                      {p.handRaised && <span className="text-[10px] text-amber-400 font-bold">✋ Raised Hand</span>}
                    </div>
                  </div>
                  {isHost && (
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleMuteParticipant(p.socketId)} className="p-1 rounded text-gray-400 hover:text-red-400" title="Mute">
                        <MicOff className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleRemoveParticipant(p.socketId)} className="p-1 rounded text-gray-400 hover:text-red-400" title="Remove">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Drawer: Meeting Chat */}
        {showChat && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col h-full z-20">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-200">In-Meeting Chat</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-10">No messages in meeting chat yet.</p>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">{msg.senderName}</span>
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>
                    <div className="bg-gray-800 p-2.5 rounded-xl text-xs text-gray-200">
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-gray-800 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to everyone..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Bottom Control Bar */}
      <div className="h-16 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between shrink-0">
        
        {/* Left Info */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-400 font-medium">Live Connection • HD WebRTC</span>
        </div>

        {/* Center Meeting Controls */}
        <div className="flex items-center space-x-3 mx-auto sm:mx-0">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-2xl transition-all ${
              isMuted ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-3 rounded-2xl transition-all ${
              !isCameraOn ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            }`}
            title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {!isCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleRaiseHand}
            className={`p-3 rounded-2xl transition-all ${
              handRaised ? 'bg-amber-500 text-gray-950 font-bold' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            }`}
            title="Raise Hand"
          >
            <Hand className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab(prev => (prev === 'board' ? 'grid' : 'board'))}
            className={`p-3 rounded-2xl transition-all ${
              activeTab === 'board' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
            }`}
            title="Collaborative Smartboard"
          >
            <PenTool className="w-5 h-5" />
          </button>

          <button
            onClick={onLeave}
            className="p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30 transition-all flex items-center space-x-2"
            title="Leave Meeting"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden md:inline text-xs font-semibold">Leave</span>
          </button>
        </div>

        {/* Right Action Drawers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setShowParticipants(!showParticipants);
              setShowChat(false);
            }}
            className={`p-2.5 rounded-xl transition-colors ${
              showParticipants ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setShowChat(!showChat);
              setShowParticipants(false);
            }}
            className={`p-2.5 rounded-xl transition-colors ${
              showChat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default MeetingRoom;
