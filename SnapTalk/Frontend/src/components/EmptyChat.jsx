import React from 'react';
import { MessageSquare, Lock, Laptop, Smartphone, ShieldCheck } from 'lucide-react';

const EmptyChat = ({ onOpenNewChat }) => {
  return (
    <div className="flex-1 bg-[#111b21] flex flex-col items-center justify-center p-8 text-center h-full select-none font-sans">
      
      {/* Laptop / Phone Graphics Container */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-[#202c33] border border-[#222d34] flex items-center justify-center text-[#00a884] shadow-2xl">
          <MessageSquare className="w-16 h-16 fill-current opacity-80" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-lg border-2 border-[#111b21]">
          <Laptop className="w-5 h-5" />
        </div>
      </div>

      {/* Main Title & Description */}
      <h2 className="text-2xl font-light text-[#e9edef] tracking-tight mb-2">
        SnapTalk Web
      </h2>
      <p className="text-xs text-[#8696a0] max-w-sm leading-relaxed mb-6 font-normal">
        Send and receive messages without keeping your phone online. <br />
        Use SnapTalk on up to 4 linked devices and 1 phone at the same time.
      </p>

      {/* Action Button */}
      {onOpenNewChat && (
        <button
          onClick={onOpenNewChat}
          className="bg-[#00a884] hover:bg-[#008069] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md mb-10"
        >
          Start New Conversation
        </button>
      )}

      {/* End-to-End Encryption Banner */}
      <div className="flex items-center space-x-2 text-[11px] text-[#8696a0] mt-4">
        <Lock className="w-3.5 h-3.5 text-[#8696a0]" />
        <span>End-to-end encrypted</span>
      </div>

    </div>
  );
};

export default EmptyChat;
