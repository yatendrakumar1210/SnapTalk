import React from 'react';
import { MicOff, Hand } from 'lucide-react';

const ParticipantGrid = ({ participants, currentUser, localStream, peerStreams }) => {
  const allParticipants = [
    {
      socketId: 'local',
      user: currentUser,
      isLocal: true,
      isMuted: false,
      handRaised: false
    },
    ...(participants || [])
  ];

  return (
    <div className="w-full h-full p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr overflow-y-auto">
      {allParticipants.map((p, idx) => {
        const name = p.user?.name || `Participant ${idx + 1}`;
        const avatar = p.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`;

        return (
          <div
            key={p.socketId || idx}
            className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex flex-col items-center justify-center shadow-lg group"
          >
            {/* Participant Video / Avatar */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/20 shadow-md mb-2"
              />
              <span className="text-sm font-semibold text-white tracking-wide">{name}</span>
              {p.isLocal && (
                <span className="text-[10px] bg-blue-600/30 text-blue-400 font-bold px-2 py-0.5 rounded-full mt-1 border border-blue-500/20">
                  You
                </span>
              )}
            </div>

            {/* Hand Raised Banner */}
            {p.handRaised && (
              <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md text-gray-950 px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-md animate-bounce">
                <Hand className="w-3.5 h-3.5 fill-current" />
                <span>Raised Hand</span>
              </div>
            )}

            {/* Status Indicators (Bottom Left / Right) */}
            <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-gray-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-800">
              <span className="text-xs text-gray-200 font-medium truncate max-w-[120px]">{name}</span>
            </div>

            {p.isMuted && (
              <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-red-600/90 text-white shadow-md">
                <MicOff className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantGrid;
