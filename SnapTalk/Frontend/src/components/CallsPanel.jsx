import React, { useState, useEffect } from 'react';
import { PhoneCall, Phone, Video, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import api from '../services/api';

const CallsPanel = ({ onStartCall }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const res = await api.get('/calls/history');
      if (res.success) {
        setCalls(res.calls || []);
      }
    } catch (e) {
      console.error("Failed to load calls:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Call History</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Recent WebRTC audio & video calls</p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {calls.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <PhoneCall className="w-12 h-12 mx-auto mb-2 opacity-40 text-blue-500" />
            <p className="text-sm font-medium">No call logs yet</p>
            <p className="text-xs text-gray-400 mt-1">Start an audio or video call directly from any chat window.</p>
          </div>
        ) : (
          calls.map(c => (
            <div key={c._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
              <div className="flex items-center space-x-3">
                <img
                  src={c.receiver?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.receiver?.name || 'Contact')}&background=2563EB&color=fff`}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{c.receiver?.name || 'User'}</h4>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    {c.status === 'completed' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span className="capitalize">{c.type} Call</span>
                    <span>• {c.duration ? `${c.duration}s` : 'Missed'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onStartCall(c.receiver, c.type)}
                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
              >
                {c.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default CallsPanel;
