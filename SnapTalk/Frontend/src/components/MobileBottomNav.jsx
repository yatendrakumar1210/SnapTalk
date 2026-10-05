import React from 'react';
import { MessageCircle, Users, Phone, User, Settings } from 'lucide-react';

const MobileBottomNav = ({ activeTab, setActiveTab, unreadTotal }) => {
  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageCircle, badge: unreadTotal > 0 ? unreadTotal : null },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="md:hidden bg-white border-t border-[#E5E7EB] flex items-center justify-around py-2 shrink-0 z-30 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center space-y-1 py-1 px-3 rounded-xl relative cursor-pointer ${
              isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 bg-[#2563EB] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
