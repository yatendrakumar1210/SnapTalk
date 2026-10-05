import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Video,
  PhoneCall,
  ShieldAlert,
  Layers,
  Trash2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboardView = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'reports'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [sRes, uRes, rRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/reports')
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (uRes.success) setUsers(uRes.users || []);
      if (rRes.success) setReports(rRes.reports || []);
    } catch (e) {
      console.error("Admin data error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, { status });
      if (res.success) {
        fetchAdminData();
      }
    } catch (e) {
      alert(e.message || 'Failed to update report');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.success) {
        fetchAdminData();
      }
    } catch (e) {
      alert(e.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Online', value: stats?.activeUsers || 0, icon: Users, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Total Messages', value: stats?.totalMessages || 0, icon: MessageSquare, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Active Meetings', value: stats?.activeMeetings || 0, icon: Video, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Calls Logged', value: stats?.totalCalls || 0, icon: PhoneCall, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Pending Reports', value: stats?.pendingReports || 0, icon: ShieldAlert, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Platform Oversight
          </span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">SnapTalk Admin Dashboard</h1>
        </div>

        {/* Tab switcher */}
        <div className="bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 flex">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'stats' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            User Control ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'reports' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Reports ({reports.length})
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{c.label}</p>
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{c.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${c.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Phone / Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <td className="p-4 font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=2563EB&color=fff`} className="w-8 h-8 rounded-full" alt="" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4">{u.phone || u.email}</td>
                  <td className="p-4 font-bold text-blue-600 dark:text-blue-400 capitalize">{u.role}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'Online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {u.status || 'Offline'}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports Table */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4">Reporter</th>
                <th className="p-4">Target Type</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No user reports submitted yet.</td>
                </tr>
              ) : (
                reports.map(r => (
                  <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">{r.reporter?.name || 'Anonymous'}</td>
                    <td className="p-4 font-medium uppercase text-blue-500">{r.targetType}</td>
                    <td className="p-4">{r.reason}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateReport(r._id, 'Resolved')}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleUpdateReport(r._id, 'Rejected')}
                        className="px-2.5 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardView;
