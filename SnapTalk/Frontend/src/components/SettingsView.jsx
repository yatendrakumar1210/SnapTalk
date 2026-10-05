import React, { useState } from 'react';
import { Shield, Eye, Lock, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const SettingsView = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [lastSeen, setLastSeen] = useState(user?.privacySettings?.lastSeen || 'everyone');
  const [profilePhoto, setProfilePhoto] = useState(user?.privacySettings?.profilePhoto || 'everyone');
  const [about, setAbout] = useState(user?.privacySettings?.about || 'everyone');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/users/privacy', {
        lastSeen,
        profilePhoto,
        about
      });
      if (res.success) {
        updateUser({ privacySettings: { lastSeen, profilePhoto, about } });
        setMsg('Privacy settings updated!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      setMsg(err.message || 'Failed to update privacy');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Disconnect all active sessions on other devices?")) return;
    try {
      await api.post('/auth/logout-all');
      logout();
    } catch (e) {
      alert(e.message || 'Failed to logout from sessions');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">App Settings & Privacy</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Configure your account privacy, theme, and security</p>
        </div>

        {/* Theme Settings */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Appearance Theme</span>
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Current theme mode</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <form onSubmit={handleSavePrivacy} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Privacy Controls</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Who can see my Last Seen?</label>
            <select
              value={lastSeen}
              onChange={(e) => setLastSeen(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts Only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Who can see my Profile Photo?</label>
            <select
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts Only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Who can see my About / Bio?</label>
            <select
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts Only</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {msg && <p className="text-xs font-semibold text-emerald-500">{msg}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md"
          >
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </form>

        {/* Security & Sessions */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Active Sessions & Devices</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Log out from all other web and mobile sessions instantly.</p>
          <button
            onClick={handleLogoutAll}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from All Devices</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
