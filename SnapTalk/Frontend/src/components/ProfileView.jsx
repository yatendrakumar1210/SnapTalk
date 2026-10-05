import React, { useState } from 'react';
import { User, Phone, Mail, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfileView = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/users/profile', {
        name,
        bio,
        avatar
      });
      if (res.success && res.user) {
        updateUser(res.user);
        setMsg('Profile updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      setMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Your Profile</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage your display name, avatar, and personal info</p>
        </div>

        {/* Profile Card Form */}
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-5">
          
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-3">
              <img
                src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=2563EB&color=fff`}
                alt={name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/20 shadow-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio / About</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell contacts something about yourself..."
              rows={3}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
              <input
                type="text"
                disabled
                value={user?.phone || 'N/A'}
                className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
              <input
                type="text"
                disabled
                value={user?.role || 'user'}
                className="w-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-500 capitalize cursor-not-allowed"
              />
            </div>
          </div>

          {msg && <p className="text-xs font-semibold text-emerald-500 text-center">{msg}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default ProfileView;
