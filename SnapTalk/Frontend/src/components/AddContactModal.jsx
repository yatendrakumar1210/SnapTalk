import React, { useState } from 'react';
import { X, UserPlus, AtSign, Phone, Check, Smartphone } from 'lucide-react';
import { getAvatarByName } from '../utils/storage';

const AddContactModal = ({ onAddContact, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !username.trim())) return;

    const formattedUsername = username.trim() 
      ? username.trim().toLowerCase().replace('@', '')
      : `user_${phone.replace(/\D/g, '').slice(-6)}`;

    onAddContact({
      id: `c_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '+1 (555) 234-5678',
      username: formattedUsername,
      avatar: getAvatarByName(name.trim()),
      status: 'Online',
      bio: 'SnapTalk Contact'
    });

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#F7F7F8] border border-[#E5E7EB] flex items-center justify-center text-[#2563EB]">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#171717]">Add New Contact</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#171717] rounded-lg hover:bg-[#F7F7F8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#171717]">Contact Added!</h4>
            <p className="text-xs text-[#6B7280]">You can now message {name}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aman Sharma"
                className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Username (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                  <AtSign className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="amansharma"
                  className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#171717] focus:bg-white focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#171717]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold"
              >
                Add Contact
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddContactModal;
