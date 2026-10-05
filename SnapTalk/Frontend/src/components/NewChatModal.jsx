import React, { useState } from 'react';
import { X, Search, MessageCircle } from 'lucide-react';

const NewChatModal = ({ contacts, onSelectContact, onClose }) => {
  const [query, setQuery] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#171717]">New Conversation</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#171717] rounded-lg hover:bg-[#F7F7F8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search contacts to chat..."
              className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#171717] focus:bg-white focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.map(contact => (
            <div
              key={contact.id}
              onClick={() => {
                onSelectContact(contact);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-[#F7F7F8] border border-transparent hover:border-[#E5E7EB] flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#171717]">{contact.name}</h4>
                  <p className="text-xs text-[#6B7280]">@{contact.username}</p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#F7F7F8] border border-[#E5E7EB] flex items-center justify-center text-[#2563EB]">
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
