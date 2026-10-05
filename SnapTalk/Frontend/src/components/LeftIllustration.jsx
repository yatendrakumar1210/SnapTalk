import React from 'react';
import { MessageSquare } from 'lucide-react';

const LeftIllustration = () => {
  return (
    <div className="h-full bg-[#FAFBFD] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden select-none border-r border-[#E2E8F0] font-sans">
      
      {/* Background Subtle Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:18px_18px]"></div>
      
      {/* Top Logo */}
      <div className="flex items-center space-x-3 z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1D4ED8] to-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>
        <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">SnapTalk</span>
      </div>

      {/* Main Copy Heading */}
      <div className="my-auto z-10 max-w-sm">
        <div className="space-y-1 mb-4">
          <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
            Connect.<br />
            Chat.<br />
            Collaborate.
          </h1>
        </div>
        <p className="text-sm md:text-base text-[#64748B] font-normal leading-relaxed">
          Seamless messaging for teams and friends.
        </p>

        {/* Dynamic Graphic Mockup Illustration matching user request */}
        <div className="mt-10 relative w-full max-w-xs mx-auto py-6">
          
          {/* Top Floating Mini Bubble */}
          <div className="absolute -top-3 left-8 bg-[#EEF2FF] border border-[#E0E7FF] px-3.5 py-1.5 rounded-2xl shadow-xs animate-bounce duration-1000">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full"></span>
            </div>
          </div>

          {/* Incoming Message Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-md mb-4 max-w-[88%] flex items-start space-x-3 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-full bg-[#EFF6FF] text-[#1D4ED8] font-bold flex items-center justify-center text-xs shrink-0 border border-[#DBEAFE] shadow-2xs">
              <span className="text-sm">👨‍💼</span>
            </div>
            <div className="space-y-1.5 flex-1 pt-1">
              <div className="h-2.5 bg-[#E2E8F0] rounded-full w-4/5"></div>
              <div className="h-2.5 bg-[#F1F5F9] rounded-full w-3/5"></div>
            </div>
          </div>

          {/* Outgoing Message Card (Gradient Blue accent) */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl p-3.5 shadow-lg shadow-blue-500/20 ml-auto max-w-[88%] flex items-start space-x-3 text-white">
            <div className="space-y-1.5 flex-1 pt-1">
              <div className="h-2.5 bg-white/90 rounded-full w-full"></div>
              <div className="h-2.5 bg-white/65 rounded-full w-3/4"></div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 font-bold flex items-center justify-center text-xs shrink-0 border border-white/30">
              <span className="text-sm">👩‍💻</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <div className="z-10 text-xs text-[#94A3B8] font-normal">
        © 2024 SnapTalk. All rights reserved.
      </div>

    </div>
  );
};

export default LeftIllustration;
