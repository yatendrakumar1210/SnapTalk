import React, { useState, useEffect } from 'react';
import { Plus, Eye, Clock, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatusView = () => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#2563EB');

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await api.get('/status');
      if (res.success) {
        setStatuses(res.statuses || []);
      }
    } catch (e) {
      console.error("Failed to fetch statuses:", e);
    }
  };

  const handleCreateStatus = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await api.post('/status', {
        type: 'text',
        content: text.trim(),
        bgColor
      });
      if (res.success) {
        setText('');
        setShowCreateModal(false);
        fetchStatuses();
      }
    } catch (e) {
      alert(e.message || 'Failed to post status');
    }
  };

  const handleViewStatus = async (statusItem) => {
    setActiveStatus(statusItem);
    try {
      await api.post(`/status/${statusItem._id}/view`);
    } catch (e) {
      // silent catch
    }
  };

  const handleDeleteStatus = async (statusId) => {
    try {
      await api.delete(`/status/${statusId}`);
      setActiveStatus(null);
      fetchStatuses();
    } catch (e) {
      alert(e.message || 'Failed to delete status');
    }
  };

  const colors = ['#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706', '#111827'];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Status & Stories</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Updates disappear after 24 hours</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Status</span>
        </button>
      </div>

      {/* My Status Card */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'My Status')}&background=2563EB&color=fff`}
              alt="My Status"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div
              onClick={() => setShowCreateModal(true)}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white dark:border-gray-900 cursor-pointer hover:bg-blue-500"
            >
              <Plus className="w-3 h-3" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">My Status</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tap to add status update</p>
          </div>
        </div>
      </div>

      {/* Recent Updates List */}
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        Recent Updates
      </h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {statuses.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No recent status updates from your contacts.</p>
        ) : (
          statuses.map(s => {
            const isOwner = s.user?._id === user?.id || s.user === user?.id;
            return (
              <div
                key={s._id}
                onClick={() => handleViewStatus(s)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500">
                    <img
                      src={s.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.user?.name || 'U')}&background=2563EB&color=fff`}
                      alt={s.user?.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {isOwner ? 'Your Status' : s.user?.name || 'Contact'}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Active Story Modal */}
      {activeStatus && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="max-w-md w-full h-[600px] rounded-3xl p-6 flex flex-col justify-between text-white relative shadow-2xl overflow-hidden"
            style={{ backgroundColor: activeStatus.bgColor || '#2563EB' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <img
                  src={activeStatus.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeStatus.user?.name || 'U')}&background=fff&color=000`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                />
                <div>
                  <h4 className="font-bold text-sm">{activeStatus.user?.name}</h4>
                  <span className="text-xs opacity-80">24h Status</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {(activeStatus.user?._id === user?.id || activeStatus.user === user?.id) && (
                  <button onClick={() => handleDeleteStatus(activeStatus._id)} className="p-2 hover:bg-black/20 rounded-full">
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                )}
                <button onClick={() => setActiveStatus(null)} className="p-2 hover:bg-black/20 rounded-full">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center text-center p-6 my-auto">
              <p className="text-2xl font-bold tracking-wide leading-relaxed drop-shadow-md">
                {activeStatus.content}
              </p>
            </div>

            {/* Footer View count */}
            <div className="flex items-center justify-center space-x-1.5 opacity-80 text-xs py-2">
              <Eye className="w-4 h-4" />
              <span>{activeStatus.viewers?.length || 0} Views</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Status Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Post Status Update</h3>
            <form onSubmit={handleCreateStatus} className="space-y-4">
              <div
                className="h-44 rounded-2xl p-4 flex items-center justify-center text-white text-center shadow-inner"
                style={{ backgroundColor: bgColor }}
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a status update..."
                  rows={3}
                  className="w-full bg-transparent text-center text-lg font-bold text-white placeholder-white/60 focus:outline-none resize-none"
                />
              </div>

              {/* Background Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Background Color</label>
                <div className="flex items-center space-x-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBgColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${bgColor === c ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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
                  Share Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StatusView;
