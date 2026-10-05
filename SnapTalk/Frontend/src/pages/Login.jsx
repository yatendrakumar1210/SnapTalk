import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, MessageSquare, ArrowRight, ShieldCheck, QrCode, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+1', flag: '🇨🇦', name: 'Canada' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState('phone'); // 'phone' | 'demo'
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [rawPhone, setRawPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fullPhone = `${selectedCountry.code}${rawPhone.replace(/\D/g, '')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ phone: fullPhone, password });
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your phone number and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoUser) => {
    setError('');
    setLoading(true);
    try {
      let res = await login({ phone: demoUser.phone, password: demoUser.password });
      if (res.success) {
        navigate('/');
        return;
      }
    } catch (e) {
      try {
        const regRes = await register({
          name: demoUser.name,
          phone: demoUser.phone,
          password: demoUser.password
        });
        if (regRes.success) {
          const logRes = await login({ phone: demoUser.phone, password: demoUser.password });
          if (logRes.success) {
            navigate('/');
            return;
          }
        }
      } catch (regErr) {
        setError(regErr.message || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0b141a] text-[#e9edef] flex flex-col items-center justify-between select-none relative overflow-hidden font-sans">
      
      {/* Top Banner Accent */}
      <div className="w-full h-56 bg-gradient-to-r from-[#00a884] via-[#008069] to-[#006653] flex items-center px-8 lg:px-24 justify-between shadow-lg">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white text-[#00a884] flex items-center justify-center shadow-md transform -rotate-3">
            <MessageSquare className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-white text-2xl font-black tracking-wider uppercase">SnapTalk Web</span>
            <span className="block text-[10px] text-emerald-100 font-medium tracking-wide uppercase">Real-Time Messaging & WebRTC Platform</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-white/95 text-xs font-semibold bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>End-to-End Encrypted</span>
        </div>
      </div>

      {/* Main SnapTalk Login Card */}
      <div className="-mt-32 mb-12 max-w-4xl w-full mx-4 bg-[#111b21] border border-[#222d34] rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Form Area (7 cols) */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#222d34] bg-[#111b21]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#e9edef] tracking-tight">Access SnapTalk Web</h2>
              <span className="text-[11px] font-semibold text-[#00a884] bg-[#00a884]/10 px-2.5 py-1 rounded-full border border-[#00a884]/30">v2.5 Release</span>
            </div>
            <p className="text-xs text-[#8696a0] mt-1">Sign in with your phone number or test with 1-click demo accounts.</p>

            {/* Auth Mode Tabs */}
            <div className="flex items-center bg-[#0b141a] p-1 rounded-2xl mt-6 border border-[#222d34]">
              <button
                type="button"
                onClick={() => setActiveTab('phone')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'phone'
                    ? 'bg-[#00a884] text-white shadow-md'
                    : 'text-[#8696a0] hover:text-white'
                }`}
              >
                Phone Authentication
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'demo'
                    ? 'bg-[#00a884] text-white shadow-md'
                    : 'text-[#8696a0] hover:text-white'
                }`}
              >
                1-Click Quick Demo
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {activeTab === 'phone' ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
                    Country Code & Mobile
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative shrink-0">
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = COUNTRIES.find(c => c.code === e.target.value);
                          if (found) setSelectedCountry(found);
                        }}
                        className="bg-[#0b141a] border border-[#222d34] rounded-xl px-3 py-3 text-xs text-[#e9edef] appearance-none focus:outline-none focus:border-[#00a884] pr-7 font-medium"
                      >
                        {COUNTRIES.map((c, idx) => (
                          <option key={idx} value={c.code} className="bg-[#111b21] text-white">
                            {c.flag} {c.code} ({c.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
                      <input
                        type="tel"
                        required
                        value={rawPhone}
                        onChange={(e) => setRawPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-[#0b141a] border border-[#222d34] rounded-xl pl-10 pr-4 py-3 text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0b141a] border border-[#222d34] rounded-xl pl-10 pr-4 py-3 text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#00a884] hover:bg-[#008069] text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all mt-6 cursor-pointer"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In with Phone'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="mt-6 space-y-3">
                <p className="text-xs text-[#8696a0]">Select a pre-configured account to evaluate SnapTalk instantly:</p>

                <div
                  onClick={() => handleDemoLogin({ name: 'Alex Morgan', phone: '+919988776655', password: 'Password123!' })}
                  className="p-3.5 rounded-xl bg-[#0b141a] border border-[#222d34] hover:border-[#00a884] cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00a884]/40" alt="" />
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#00a884]">Alex Morgan</p>
                      <p className="text-[10px] text-[#8696a0]">+91 99887 76655 (Student Demo)</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#00a884] font-semibold flex items-center space-x-1">
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div
                  onClick={() => handleDemoLogin({ name: 'Sarah Connor', phone: '+918877665544', password: 'Password123!' })}
                  className="p-3.5 rounded-xl bg-[#0b141a] border border-[#222d34] hover:border-[#00a884] cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#00a884]/40" alt="" />
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#00a884]">Sarah Connor</p>
                      <p className="text-[10px] text-[#8696a0]">+91 88776 65544 (User Demo)</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#00a884] font-semibold flex items-center space-x-1">
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div
                  onClick={() => handleDemoLogin({ name: 'Admin Manager', phone: '+917766554433', password: 'Password123!' })}
                  className="p-3.5 rounded-xl bg-[#0b141a] border border-[#222d34] hover:border-[#00a884] cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs ring-2 ring-amber-500/40">
                      ADM
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#00a884]">Admin Manager</p>
                      <p className="text-[10px] text-[#8696a0]">+91 77665 54433 (System Admin)</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#00a884] font-semibold flex items-center space-x-1">
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#222d34] text-center text-xs text-[#8696a0]">
            Don't have a SnapTalk account?{' '}
            <Link to="/register" className="text-[#00a884] font-semibold hover:underline">
              Create New Account
            </Link>
          </div>
        </div>

        {/* Right Sync & Details Area (5 cols) */}
        <div className="md:col-span-5 p-8 bg-[#0b141a] flex flex-col justify-between items-center text-center">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#00a884]/15 text-[#00a884] flex items-center justify-center mx-auto mb-4 border border-[#00a884]/30">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">SnapTalk Device Pairing</h3>
            
            <ol className="text-left text-xs text-[#8696a0] space-y-3 mt-5">
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#111b21] border border-[#222d34] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <span>Open SnapTalk app on your primary device</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#111b21] border border-[#222d34] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <span>Navigate to <strong>Settings</strong> & select <strong>Linked Devices</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#111b21] border border-[#222d34] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <span>Scan the secure QR code below to authorize sync</span>
              </li>
            </ol>
          </div>

          {/* QR Code box */}
          <div className="my-6 p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center border-4 border-[#00a884]">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://snaptalk.app/pair"
              alt="SnapTalk QR Code"
              className="w-32 h-32"
            />
            <p className="text-[10px] font-bold text-gray-800 mt-2">Scan with SnapTalk Camera</p>
          </div>

          <p className="text-[11px] text-[#8696a0]">
            Final Year Capstone Project • <span className="text-[#00a884] font-medium">Real-Time Web Architecture</span>
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="py-4 text-xs text-[#8696a0] text-center">
        SnapTalk Communication Platform • Real-Time Web Architecture Capstone Project
      </div>

    </div>
  );
};

export default Login;
