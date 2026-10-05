import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Lock, ArrowRight, ShieldCheck, MessageSquare, Camera } from 'lucide-react';
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

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [rawPhone, setRawPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fullPhone = `${selectedCountry.code}${rawPhone.replace(/\D/g, '')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register({
        name: name.trim(),
        phone: fullPhone,
        username: username.trim() || undefined,
        password
      });

      if (res.success) {
        navigate('/otp-verify', { state: { phone: fullPhone, otpDemo: res.otpDemo } });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0b141a] text-[#e9edef] flex flex-col items-center justify-between font-sans select-none overflow-hidden">
      
      {/* Top Banner */}
      <div className="w-full h-44 bg-gradient-to-r from-[#00a884] via-[#008069] to-[#006653] flex items-center justify-center shadow-md">
        <div className="flex items-center space-x-3 text-white">
          <MessageSquare className="w-8 h-8 fill-current" />
          <span className="text-2xl font-black tracking-wide uppercase">CREATE SNAPTALK ACCOUNT</span>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="-mt-20 max-w-md w-full bg-[#111b21] border border-[#222d34] rounded-2xl p-8 shadow-2xl z-10 mx-4">
        
        {/* Profile Avatar Placeholder */}
        <div className="relative w-20 h-20 mx-auto mb-6 group cursor-pointer">
          <div className="w-full h-full rounded-full bg-[#0b141a] border-2 border-[#00a884] flex items-center justify-center text-[#8696a0] overflow-hidden shadow-inner">
            {name ? (
              <span className="text-2xl font-bold text-[#00a884]">{name[0].toUpperCase()}</span>
            ) : (
              <User className="w-9 h-9" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#00a884] text-white shadow-md">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-center text-[#e9edef] tracking-tight">Set up your profile</h1>
        <p className="text-xs text-center text-[#8696a0] mt-1">Please enter your name and phone number to continue.</p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8696a0]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-[#0b141a] border border-[#222d34] rounded-xl pl-10 pr-4 py-3 text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#8696a0] uppercase tracking-wider mb-1.5">
              Country Code & Mobile
            </label>
            <div className="flex space-x-2">
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
                placeholder="Password123!"
                className="w-full bg-[#0b141a] border border-[#222d34] rounded-xl pl-10 pr-4 py-3 text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00a884]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#00a884] hover:bg-[#008069] text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all mt-6 cursor-pointer"
          >
            <span>{loading ? 'Registering...' : 'Continue to Verification'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#8696a0]">
          Already registered?{' '}
          <Link to="/login" className="text-[#00a884] font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>

      <div className="py-4 text-xs text-[#8696a0]">
        SnapTalk Communication Platform • End-to-End Encrypted
      </div>

    </div>
  );
};

export default Register;
