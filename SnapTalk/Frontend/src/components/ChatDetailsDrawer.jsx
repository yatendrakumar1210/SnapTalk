import React from 'react';
import { X, Phone, Video, Bell, Shield, Trash2, FileText, Image as ImageIcon } from 'lucide-react';

const ChatDetailsDrawer = ({ activeChat, onClose, onCallContact }) => {
  if (!activeChat) return null;

  return (
    <div className="w-full md:w-80 lg:w-84 bg-white border-l border-[#E5E7EB] flex flex-col h-full shrink-0 z-10 select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-base font-bold text-[#171717]">Contact Details</h3>
        <button
          onClick={onClose}
          className="p-1 text-[#6B7280] hover:text-[#171717] rounded-lg hover:bg-[#F7F7F8]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Contact Header Card */}
        <div className="text-center">
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            className="w-20 h-20 rounded-full object-cover border border-[#E5E7EB] mx-auto mb-3 shadow-2xs"
          />
          <h4 className="text-lg font-bold text-[#171717]">{activeChat.name}</h4>
          <p className="text-xs text-[#6B7280]">@{activeChat.username}</p>
          <div className="inline-flex items-center space-x-1.5 bg-[#F7F7F8] border border-[#E5E7EB] px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#171717] mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{activeChat.status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onCallContact(activeChat, 'audio')}
            className="p-2.5 border border-[#E5E7EB] rounded-xl hover:bg-[#F7F7F8] flex flex-col items-center justify-center space-y-1 transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#171717]" />
            <span className="text-xs font-medium text-[#171717]">Audio</span>
          </button>

          <button
            onClick={() => onCallContact(activeChat, 'video')}
            className="p-2.5 border border-[#E5E7EB] rounded-xl hover:bg-[#F7F7F8] flex flex-col items-center justify-center space-y-1 transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4 text-[#171717]" />
            <span className="text-xs font-medium text-[#171717]">Video</span>
          </button>
        </div>

        {/* Bio / About */}
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">About</div>
          <p className="text-xs text-[#171717] bg-[#F7F7F8] border border-[#E5E7EB] p-3 rounded-xl">
            {activeChat.bio || 'Available on SnapTalk.'}
          </p>
        </div>

        {/* Shared Media Simulation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-[#6B7280]">Shared Media</span>
            <span className="text-[#2563EB] cursor-pointer hover:underline">View All</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="aspect-square bg-[#F7F7F8] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#6B7280]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="aspect-square bg-[#F7F7F8] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#6B7280]">
              <FileText className="w-4 h-4" />
            </div>
            <div className="aspect-square bg-[#F7F7F8] border border-[#E5E7EB] rounded-lg flex items-center justify-center text-[#6B7280]">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Mute & Block Actions */}
        <div className="border-t border-[#E5E7EB] pt-4 space-y-2 text-xs font-medium">
          <button className="w-full flex items-center space-x-3 p-2.5 hover:bg-[#F7F7F8] rounded-xl text-[#171717] cursor-pointer">
            <Bell className="w-4 h-4 text-[#6B7280]" />
            <span>Mute Notifications</span>
          </button>

          <button className="w-full flex items-center space-x-3 p-2.5 hover:bg-red-50 rounded-xl text-red-600 cursor-pointer">
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Clear Chat History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailsDrawer;
