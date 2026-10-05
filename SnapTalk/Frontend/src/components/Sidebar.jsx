import React from 'react';
import {
  MessageSquare,
  Users,
  Layers,
  PhoneCall,
  Video,
  CircleDashed,
  Bookmark,
  ShieldAlert,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Radio,
  Star
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ activeTab, setActiveTab, currentUser, unreadTotal, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'chats', label: 'Chats', icon: MessageSquare, badge: unreadTotal },
    { id: 'status', label: 'Status', icon: CircleDashed, hasUnreadStatus: true },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'calls', label: 'Calls', icon: PhoneCall },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'saved', label: 'Starred', icon: Star },
    ...(currentUser?.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: ShieldAlert }] : [])
  ];

  return (
    <div className="w-16 lg:w-64 bg-[#111b21] dark:bg-[#111b21] border-r border-[#222d34] flex flex-col justify-between h-full select-none transition-all duration-200">
      
      {/* Top Header Rail */}
      <div>
        <div className="p-3.5 flex items-center justify-between border-b border-[#222d34]">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chats')}>
            <div className="w-10 h-10 rounded-2xl bg-[#00a884] flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-bold text-base text-[#e9edef] tracking-tight leading-none">SnapTalk Web</h1>
              <span className="text-[10px] text-[#00a884] font-semibold tracking-wide uppercase">Real-Time Platform</span>
            </div>
          </div>
        </div>

        {/* Navigation Rail Items */}
        <div className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-[#202c33] text-[#00a884] font-semibold shadow-xs'
                    : 'text-[#8696a0] hover:bg-[#202c33]/60 hover:text-[#e9edef]'
                }`}
                title={item.label}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#00a884] rounded-r-full" />
                )}

                <div className="relative flex items-center justify-center mx-auto lg:mx-0">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#00a884]' : ''}`} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#00a884] text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                  {item.hasUnreadStatus && !item.badge && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-[#111b21]" />
                  )}
                </div>
                <span className="hidden lg:block ml-3.5 text-xs tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-2 border-t border-[#222d34] space-y-1">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-[#8696a0] hover:bg-[#202c33]/60 hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400 mx-auto lg:mx-0" /> : <Moon className="w-5 h-5 text-indigo-400 mx-auto lg:mx-0" />}
          <span className="hidden lg:block ml-3.5 text-xs">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-colors ${
            activeTab === 'settings'
              ? 'bg-[#202c33] text-[#00a884] font-semibold'
              : 'text-[#8696a0] hover:bg-[#202c33]/60 hover:text-white'
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5 mx-auto lg:mx-0" />
          <span className="hidden lg:block ml-3.5 text-xs">Settings</span>
        </button>

        {/* User Card */}
        <div
          onClick={() => setActiveTab('profile')}
          className="cursor-pointer flex items-center p-2 rounded-xl hover:bg-[#202c33]/60 transition-colors mt-1"
          title="View Profile"
        >
          <div className="relative shrink-0 mx-auto lg:mx-0">
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=00a884&color=fff`}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00a884]/40"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-[#111b21]"></span>
          </div>
          <div className="hidden lg:block ml-3 overflow-hidden">
            <p className="text-xs font-semibold text-[#e9edef] truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-[#8696a0] truncate">{currentUser?.phone || 'Online'}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium"
          title="Logout"
        >
          <LogOut className="w-4 h-4 mx-auto lg:mx-0" />
          <span className="hidden lg:block ml-3.5">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
