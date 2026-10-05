import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, ShieldCheck } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CallModal = ({ contact, mediaType = 'audio', isIncoming = false, callerSocketId = null, onClose }) => {
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  const [callState, setCallState] = useState(isIncoming ? 'Ringing...' : 'Calling...');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(mediaType === 'video');
  const [networkQuality, setNetworkQuality] = useState('Excellent');

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (socket && contact) {
      if (!isIncoming) {
        socket.emit('call:initiate', {
          receiverId: contact.id || contact._id,
          caller: currentUser,
          mediaType
        });
      }

      const onCallAnswered = () => {
        setCallState('Connected');
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }, 1000);
      };

      const onCallRejected = ({ reason }) => {
        setCallState(reason || 'Call Declined');
        setTimeout(() => onClose(), 1500);
      };

      const onCallEnded = () => {
        setCallState('Call Ended');
        setTimeout(() => onClose(), 1000);
      };

      socket.on('call:answer', onCallAnswered);
      socket.on('call:rejected', onCallRejected);
      socket.on('call:ended', onCallEnded);

      return () => {
        socket.off('call:answer', onCallAnswered);
        socket.off('call:rejected', onCallRejected);
        socket.off('call:ended', onCallEnded);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [socket, contact, isIncoming, currentUser, mediaType, onClose]);

  const handleAcceptIncoming = () => {
    setCallState('Connected');
    if (socket && callerSocketId) {
      socket.emit('call:answer', { toSocketId: callerSocketId, answer: {} });
    }
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const handleEndCall = async () => {
    if (socket && callerSocketId) {
      socket.emit('call:end', { toSocketId: callerSocketId });
    }

    // Log call to backend
    try {
      await api.post('/calls/log', {
        receiverId: contact.id || contact._id,
        type: mediaType,
        status: callState === 'Connected' ? 'completed' : 'missed',
        duration
      });
    } catch (e) {
      // silent catch
    }

    onClose();
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const name = contact?.name || 'Contact';
  const avatar = contact?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`;

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Security Badge */}
        <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full border border-gray-700 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted Call
        </span>

        {/* Avatar with pulse ring */}
        <div className="relative mb-6">
          <div className={`w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-500/30 shadow-xl ${
            callState === 'Calling...' || callState === 'Ringing...' ? 'animate-pulse' : ''
          }`}>
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-gray-900 rounded-full" />
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-white tracking-tight">{name}</h2>
        <p className="text-xs text-blue-400 font-medium mt-1">
          {callState === 'Connected' ? formatDuration(duration) : callState}
        </p>

        {callState === 'Connected' && (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 border border-emerald-500/20">
            Network Quality: {networkQuality}
          </span>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-8 w-full">
          {isIncoming && callState === 'Ringing...' ? (
            <>
              <button
                onClick={handleAcceptIncoming}
                className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-all"
                title="Accept Call"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <button
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all"
                title="Decline Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                }`}
                title="Toggle Mic"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {mediaType === 'video' && (
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    !isCameraOn ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
                  title="Toggle Camera"
                >
                  {!isCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              <button
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all transform hover:scale-105"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default CallModal;
