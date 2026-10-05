import React, { useState, useEffect } from 'react';
import { Layers, Plus, Radio, MessageSquare, Shield, Check } from 'lucide-react';
import api from '../services/api';

const CommunitiesPanel = ({ onSelectCommunityChat }) => {
  const [communities, setCommunities] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activeTab, setActiveTab] = useState('communities'); // 'communities' | 'channels'
  const [loading, setLoading] = useState(true);

  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commRes, chanRes] = await Promise.all([
        api.get('/communities'),
        api.get('/channels')
      ]);
      if (commRes.success) setCommunities(commRes.communities || []);
      if (chanRes.success) setChannels(chanRes.channels || []);
    } catch (e) {
      console.error("Failed to load communities:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await api.post('/communities', { name, description });
      if (res.success) {
        setName('');
        setDescription('');
        setShowCreateCommunity(false);
        fetchData();
      }
    } catch (e) {
      alert(e.message || 'Failed to create community');
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await api.post('/channels', { name, description });
      if (res.success) {
        setName('');
        setDescription('');
        setShowCreateChannel(false);
        fetchData();
      }
    } catch (e) {
      alert(e.message || 'Failed to create channel');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      
      {/* Top Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Communities & Channels</h2>
          <button
            onClick={() => (activeTab === 'communities' ? setShowCreateCommunity(true) : setShowCreateChannel(true))}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all"
            title="Create New"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('communities')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'communities'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Communities
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'channels'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Broadcast Channels
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeTab === 'communities' ? (
          communities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Layers className="w-12 h-12 mx-auto mb-2 opacity-40 text-blue-500" />
              <p className="text-sm font-medium">No Communities yet</p>
              <p className="text-xs text-gray-400 mt-1">Create a community to combine sub-groups & channels.</p>
            </div>
          ) : (
            communities.map(comm => (
              <div
                key={comm._id}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center">
                    {comm.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{comm.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{comm.members?.length || 1} members</span>
                  </div>
                </div>
                {comm.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{comm.description}</p>
                )}
              </div>
            ))
          )
        ) : (
          channels.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Radio className="w-12 h-12 mx-auto mb-2 opacity-40 text-blue-500" />
              <p className="text-sm font-medium">No Broadcast Channels yet</p>
              <p className="text-xs text-gray-400 mt-1">Create a channel for 1-to-many announcements.</p>
            </div>
          ) : (
            channels.map(chan => (
              <div
                key={chan._id}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white font-bold flex items-center justify-center">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">{chan.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{chan.subscribers?.length || 1} Subscribers</span>
                    </div>
                  </div>
                </div>
                {chan.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{chan.description}</p>
                )}
              </div>
            ))
          )
        )}
      </div>

      {/* Create Modal */}
      {(showCreateCommunity || showCreateChannel) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {showCreateCommunity ? 'Create Community' : 'Create Broadcast Channel'}
            </h3>
            <form onSubmit={showCreateCommunity ? handleCreateCommunity : handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateCommunity(false);
                    setShowCreateChannel(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-md"
                >
                  Create Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunitiesPanel;
