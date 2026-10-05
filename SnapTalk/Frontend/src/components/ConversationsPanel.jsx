import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, UserPlus, Pin, ShieldCheck, CheckCheck, MoreVertical, Filter, MessageSquarePlus } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

const ConversationsPanel = ({ activeChat, onSelectChat, currentUser }) => {
  const { onlineUsers } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'groups'
  const [loading, setLoading] = useState(true);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Group creation states
  const [groupName, setGroupName] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  // Add contact state
  const [contactQuery, setContactQuery] = useState('');

  useEffect(() => {
    fetchConversations();
    fetchContacts();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chats/conversations');
      if (res.success) {
        setConversations(res.conversations || []);
      }
    } catch (e) {
      console.error("Error fetching conversations:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      if (res.success) {
        setContacts(res.contacts || []);
      }
    } catch (e) {
      console.error("Error fetching contacts:", e);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMemberIds.length === 0) return;
    try {
      const res = await api.post('/groups', {
        name: groupName.trim(),
        memberIds: selectedMemberIds
      });

      if (res.success && res.group) {
        setGroupName('');
        setSelectedMemberIds([]);
        setShowGroupModal(false);
        fetchConversations();
      }
    } catch (e) {
      alert(e.message || 'Failed to create group');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!contactQuery.trim()) return;
    try {
      const res = await api.post('/contacts', { contactUserPhone: contactQuery.trim() });
      if (res.success) {
        setContactQuery('');
        setShowContactModal(false);
        fetchContacts();
        fetchConversations();
      }
    } catch (e) {
      alert(e.message || 'Failed to add contact');
    }
  };

  const filteredConversations = conversations.filter(c => {
    const isDirect = c.type === 'direct';
    const title = isDirect
      ? c.participants?.find(p => (p._id || p.id) !== currentUser?.id)?.name || 'Direct Chat'
      : c.group?.name || 'Group';

    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'unread') return (c.unreadCount > 0);
    if (filter === 'groups') return c.type === 'group';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#111b21] dark:bg-[#111b21] border-r border-[#222d34] select-none font-sans">
      
      {/* Header Bar */}
      <div className="p-3.5 bg-[#202c33] border-b border-[#222d34] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#e9edef] tracking-tight">Chats</h2>
          <div className="flex items-center space-x-1 text-[#8696a0]">
            <button
              onClick={() => setShowContactModal(true)}
              className="p-2 rounded-full hover:bg-[#2a3942] hover:text-white transition-colors"
              title="Add Contact / Start New Chat"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowGroupModal(true)}
              className="p-2 rounded-full hover:bg-[#2a3942] hover:text-white transition-colors"
              title="New Group"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8696a0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full bg-[#111b21] border border-[#222d34] rounded-xl pl-9 pr-4 py-2 text-xs text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884]"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 font-semibold'
                : 'bg-[#202c33] text-[#8696a0] border border-[#222d34] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === 'unread'
                ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 font-semibold'
                : 'bg-[#202c33] text-[#8696a0] border border-[#222d34] hover:text-white'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('groups')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === 'groups'
                ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40 font-semibold'
                : 'bg-[#202c33] text-[#8696a0] border border-[#222d34] hover:text-white'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/40">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-12 text-[#8696a0]">
            <MessageSquarePlus className="w-10 h-10 mx-auto opacity-40 mb-2" />
            <p className="text-xs font-medium">No chats found</p>
            <p className="text-[11px] text-[#8696a0] mt-1">Tap the add button to message a contact.</p>
          </div>
        ) : (
          filteredConversations.map(conv => {
            const isDirect = conv.type === 'direct';
            const otherUser = isDirect ? conv.participants?.find(p => (p._id || p.id) !== currentUser?.id) : null;
            const title = isDirect ? (otherUser?.name || 'User') : (conv.group?.name || 'Group Chat');
            const avatar = isDirect
              ? (otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=00a884&color=fff`)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=2563EB&color=fff`;

            const isOnline = isDirect && onlineUsers.get(otherUser?._id);
            const isSelected = activeChat?._id === conv._id;

            return (
              <div
                key={conv._id}
                onClick={() => onSelectChat(conv)}
                className={`flex items-center px-4 py-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2a3942]'
                    : 'hover:bg-[#202c33]'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img src={avatar} alt={title} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full ring-2 ring-[#111b21]" />
                  )}
                </div>

                {/* Info */}
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#e9edef] truncate">{title}</h3>
                    {conv.lastMessage && (
                      <span className={`text-[10px] shrink-0 ${conv.unreadCount > 0 ? 'text-[#00a884] font-semibold' : 'text-[#8696a0]'}`}>
                        {new Date(conv.lastMessage.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-1 text-xs text-[#8696a0] truncate">
                      {conv.lastMessage && (conv.lastMessage.sender?._id === currentUser?.id || conv.lastMessage.sender === currentUser?.id) && (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />
                      )}
                      <p className="truncate">
                        {conv.lastMessage ? conv.lastMessage.text || 'Attachment' : 'Tap to start conversation'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="bg-[#00a884] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#202c33] border border-[#222d34] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#e9edef] mb-4">Create New Group Chat</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group title"
                  className="w-full bg-[#111b21] border border-[#2a3942] rounded-xl px-3 py-2 text-sm text-[#e9edef] focus:outline-none focus:border-[#00a884]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8696a0] mb-2">Select Contacts</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-[#222d34] rounded-xl p-2 bg-[#111b21]">
                  {contacts.length === 0 ? (
                    <p className="text-xs text-[#8696a0] text-center py-4">No contacts available.</p>
                  ) : (
                    contacts.map(c => {
                      const cu = c.contactUser;
                      if (!cu) return null;
                      const isSelected = selectedMemberIds.includes(cu._id || cu.id);
                      return (
                        <div
                          key={cu._id || cu.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMemberIds(selectedMemberIds.filter(id => id !== (cu._id || cu.id)));
                            } else {
                              setSelectedMemberIds([...selectedMemberIds, cu._id || cu.id]);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <img src={cu.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cu.name)}`} className="w-7 h-7 rounded-full" alt="" />
                            <span className="text-xs font-medium text-[#e9edef]">{cu.name}</span>
                          </div>
                          <input type="checkbox" checked={isSelected} readOnly className="accent-[#00a884]" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8696a0] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#00a884] text-white rounded-xl hover:bg-[#008069] shadow-md cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#202c33] border border-[#222d34] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#e9edef] mb-4">Add Contact</h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8696a0] mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  placeholder="e.g. +91 99887 76655"
                  className="w-full bg-[#111b21] border border-[#2a3942] rounded-xl px-3 py-2 text-sm text-[#e9edef] focus:outline-none focus:border-[#00a884]"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8696a0] hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-[#00a884] text-white rounded-xl hover:bg-[#008069] shadow-md cursor-pointer"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConversationsPanel;
