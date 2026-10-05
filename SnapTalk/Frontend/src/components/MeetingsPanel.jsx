import React, { useState, useEffect } from 'react';
import { Video, Plus, Key, Copy, Check, Shield, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MeetingsPanel = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [title, setTitle] = useState('');
  const [passcode, setPasscode] = useState('');
  const [mode, setMode] = useState('normal'); // 'normal' | 'online_class'
  const [inputMeetingId, setInputMeetingId] = useState('');

  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchActiveMeetings();
  }, []);

  const fetchActiveMeetings = async () => {
    try {
      const res = await api.get('/meetings/active');
      if (res.success) {
        setMeetings(res.meetings || []);
      }
    } catch (e) {
      console.error("Failed to load active meetings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/meetings', {
        title: title.trim() || 'SnapTalk Collaboration Room',
        passcode: passcode.trim(),
        mode
      });

      if (res.success && res.meeting) {
        setShowCreateModal(false);
        navigate(`/app/meetings/${res.meeting.meetingId}`);
      }
    } catch (e) {
      alert(e.message || 'Failed to create meeting');
    }
  };

  const handleJoinMeetingById = (e) => {
    e.preventDefault();
    if (!inputMeetingId.trim()) return;
    setShowJoinModal(false);
    navigate(`/app/meetings/${inputMeetingId.trim()}`);
  };

  const copyJoinLink = (mId) => {
    navigator.clipboard.writeText(`${window.location.origin}/app/meetings/${mId}`);
    setCopiedId(mId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Meetings & Classes</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Zoom/Meet style rooms with Smartboard</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-xs hover:bg-gray-200"
          >
            Join with ID
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Meeting</span>
          </button>
        </div>
      </div>

      {/* Active Meetings List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {meetings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-2 opacity-40 text-blue-500" />
            <p className="text-sm font-medium">No active meetings right now</p>
            <p className="text-xs text-gray-400 mt-1">Start an instant meeting or online classroom now.</p>
          </div>
        ) : (
          meetings.map(m => (
            <div key={m._id} className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                    {m.mode === 'online_class' ? <GraduationCap className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{m.title}</h4>
                    <span className="text-[11px] text-gray-400">Host: {m.host?.name || 'User'}</span>
                  </div>
                </div>
                {m.passcode && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                    Passcode Protected
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                <button
                  onClick={() => copyJoinLink(m.meetingId)}
                  className="text-xs text-gray-500 hover:text-blue-500 flex items-center space-x-1"
                >
                  {copiedId === m.meetingId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === m.meetingId ? 'Copied' : m.meetingId}</span>
                </button>

                <button
                  onClick={() => navigate(`/app/meetings/${m.meetingId}`)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-xs"
                >
                  <span>Join Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Start New Meeting</h3>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mathematics Smartboard Class"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Meeting Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal Meeting (Collaborative)</option>
                  <option value="online_class">Online Classroom (Teacher / Smartboard Controls)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Optional Passcode</label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Leave empty for public access"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-md"
                >
                  Start Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join by ID Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Join Meeting by ID</h3>
            <form onSubmit={handleJoinMeetingById} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Meeting ID</label>
                <input
                  type="text"
                  required
                  value={inputMeetingId}
                  onChange={(e) => setInputMeetingId(e.target.value)}
                  placeholder="e.g. meet-xxxx-xxxx"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-md"
                >
                  Join Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MeetingsPanel;
