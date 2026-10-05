import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ConversationsPanel from '../components/ConversationsPanel';
import CommunitiesPanel from '../components/CommunitiesPanel';
import CallsPanel from '../components/CallsPanel';
import MeetingsPanel from '../components/MeetingsPanel';
import StatusView from '../components/Status/StatusView';
import SavedMessagesView from '../components/Saved/SavedMessagesView';
import AdminDashboardView from '../components/Admin/AdminDashboardView';
import ProfileView from '../components/ProfileView';
import SettingsView from '../components/SettingsView';
import ChatWindow from '../components/ChatWindow';
import EmptyChat from '../components/EmptyChat';
import CallModal from '../components/CallModal';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Home = () => {
  const { user: currentUser, logout } = useAuth();
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'groups' | 'communities' | 'calls' | 'meetings' | 'status' | 'saved' | 'admin' | 'profile' | 'settings'
  const [activeChat, setActiveChat] = useState(null);

  // WebRTC Call Modal state
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    if (socket) {
      const onIncomingCall = ({ caller, mediaType, socketId }) => {
        setActiveCall({
          contact: caller,
          mediaType,
          isIncoming: true,
          callerSocketId: socketId
        });
      };

      socket.on('call:incoming', onIncomingCall);

      return () => {
        socket.off('call:incoming', onIncomingCall);
      };
    }
  }, [socket]);

  const handleStartCall = (targetUser, mediaType = 'audio') => {
    setActiveCall({
      contact: targetUser,
      mediaType,
      isIncoming: false
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#111b21] dark:bg-[#111b21] overflow-hidden font-sans antialiased select-none">
      
      {/* 1. Leftmost Navigation Rail */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        unreadTotal={0}
        onLogout={logout}
      />

      {/* 2. Middle Sub-Panel */}
      <div className="w-80 lg:w-96 h-full shrink-0 flex flex-col border-r border-[#222d34] bg-[#111b21]">
        {(activeTab === 'chats' || activeTab === 'groups') && (
          <ConversationsPanel
            activeChat={activeChat}
            onSelectChat={setActiveChat}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'communities' && (
          <CommunitiesPanel
            onSelectCommunityChat={setActiveChat}
          />
        )}

        {activeTab === 'calls' && (
          <CallsPanel
            onStartCall={handleStartCall}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingsPanel />
        )}

        {activeTab === 'status' && (
          <StatusView />
        )}

        {activeTab === 'saved' && (
          <SavedMessagesView />
        )}

        {activeTab === 'admin' && (
          <AdminDashboardView />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </div>

      {/* 3. Right Main Chat / Empty View */}
      <div className="flex-1 h-full flex flex-col bg-[#0b141a] overflow-hidden border-l border-[#222d34]/40">
        {activeChat ? (
          <ChatWindow
            conversation={activeChat}
            onStartCall={handleStartCall}
          />
        ) : (
          <EmptyChat onOpenNewChat={() => setActiveTab('chats')} />
        )}
      </div>

      {/* 4. Active WebRTC Call Modal Overlay */}
      {activeCall && (
        <CallModal
          contact={activeCall.contact}
          mediaType={activeCall.mediaType}
          isIncoming={activeCall.isIncoming}
          callerSocketId={activeCall.callerSocketId}
          onClose={() => setActiveCall(null)}
        />
      )}

    </div>
  );
};

export default Home;
