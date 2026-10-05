import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  const phone = location.state?.phone || '';
  const initialOtp = location.state?.otpDemo || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (initialOtp && initialOtp.length === 6) {
      setDigits(initialOtp.split(''));
    }
  }, [initialOtp]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(paste)) {
      setDigits(paste.split(''));
      inputRefs[5].current?.focus();
    }
  };

  const otpCode = digits.join('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await verifyOTP(phone, otpCode);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await api.post('/auth/request-otp', { phone });
      if (res.success && res.otpDemo) {
        setDigits(res.otpDemo.split(''));
        setTimer(30);
        alert(`New SnapTalk Verification Code: ${res.otpDemo}`);
      }
    } catch (e) {
      alert(e.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#0b141a] text-[#e9edef] flex flex-col items-center justify-between font-sans select-none overflow-hidden">
      
      {/* Top Banner */}
      <div className="w-full h-44 bg-gradient-to-r from-[#00a884] via-[#008069] to-[#006653] flex items-center justify-center shadow-md">
        <div className="flex items-center space-x-3 text-white">
          <MessageSquare className="w-8 h-8 fill-current" />
          <span className="text-2xl font-black tracking-wide uppercase">SNAPTALK VERIFICATION</span>
        </div>
      </div>

      {/* Main Box */}
      <div className="-mt-20 max-w-md w-full bg-[#111b21] border border-[#222d34] rounded-2xl p-8 shadow-2xl z-10 text-center mx-4">
        
        <div className="w-14 h-14 rounded-full bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-[#e9edef]">Verify your mobile number</h1>
        <p className="text-xs text-[#8696a0] mt-1">
          Enter the 6-digit OTP security code sent to <br />
          <span className="text-white font-semibold">{phone || 'your mobile number'}</span>
        </p>

        {error && (
          <div className="my-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-center space-x-2 sm:space-x-3" onPaste={handlePaste}>
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 bg-[#0b141a] border border-[#222d34] rounded-xl text-center text-xl font-bold text-[#00a884] focus:outline-none focus:border-[#00a884] shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length < 6}
            className="w-full py-3.5 px-6 rounded-xl bg-[#00a884] hover:bg-[#008069] disabled:opacity-50 text-white font-semibold text-sm shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>{loading ? 'Verifying Code...' : 'Verify & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#222d34] text-xs text-[#8696a0] flex items-center justify-between">
          <span>Didn't receive code?</span>
          {timer > 0 ? (
            <span className="text-[#8696a0] font-mono">Resend Code in {timer}s</span>
          ) : (
            <button onClick={handleResend} className="text-[#00a884] font-semibold hover:underline flex items-center space-x-1 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend Code</span>
            </button>
          )}
        </div>

      </div>

      <div className="py-4 text-xs text-[#8696a0]">
        SnapTalk Security Engine • End-to-End Encrypted Verification
      </div>

    </div>
  );
};

export default OTPVerify;
