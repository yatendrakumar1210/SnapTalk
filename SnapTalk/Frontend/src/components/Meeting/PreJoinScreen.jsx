import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Shield, ArrowRight } from 'lucide-react';

const PreJoinScreen = ({ meetingId, meetingTitle, initialName, passcodeRequired, onJoin }) => {
  const [name, setName] = useState(initialName || '');
  const [passcode, setPasscode] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let localStream = null;
    const setupCamera = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = localStream;
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.warn("Could not access camera/mic preview:", err);
        setIsCameraOn(false);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
    setIsCameraOn(!isCameraOn);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin({
      name: name.trim(),
      passcode: passcode.trim(),
      isMuted,
      isCameraOn
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gray-800/80 backdrop-blur-xl border border-gray-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Shield className="w-3.5 h-3.5" /> SnapTalk Secure Meeting
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to join?</h1>
          <p className="text-sm text-gray-400 mt-1">{meetingTitle || `Meeting ID: ${meetingId}`}</p>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video bg-gray-950 rounded-2xl overflow-hidden mb-6 border border-gray-700 shadow-inner group">
          {isCameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-400 border border-gray-700 mb-2">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs">Camera is Off</span>
            </div>
          )}

          {/* Quick Audio/Video Toggle overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700/80 shadow-lg">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              className={`p-3 rounded-full transition-colors ${
                !isCameraOn ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {!isCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {passcodeRequired && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Meeting Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Join Meeting Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default PreJoinScreen;
