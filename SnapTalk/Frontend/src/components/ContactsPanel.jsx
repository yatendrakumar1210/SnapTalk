import React, { useState } from 'react';
import { Search, UserPlus, MessageCircle, Phone } from 'lucide-react';

const ContactsPanel = ({
  contacts,
  onStartChatWithContact,
  onCallContact,
  onOpenAddContactModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineContacts = filteredContacts.filter(c => c.status === 'Online');
  const offlineContacts = filteredContacts.filter(c => c.status !== 'Online');

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white border-r border-[#E5E7EB] flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#171717] tracking-tight">Contacts</h2>
          <button
            onClick={onOpenAddContactModal}
            className="inline-flex items-center space-x-1.5 bg-[#F7F7F8] hover:bg-[#E5E7EB] text-[#171717] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E5E7EB] transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-[#F7F7F8] border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#171717] placeholder-[#6B7280] focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* Online Contacts Section */}
        {onlineContacts.length > 0 && (
          <div>
            <div className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Online ({onlineContacts.length})</span>
            </div>
            <div className="space-y-1">
              {onlineContacts.map(contact => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  onMessage={() => onStartChatWithContact(contact)}
                  onCall={() => onCallContact(contact)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Contacts Section */}
        {offlineContacts.length > 0 && (
          <div>
            <div className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
              All Contacts ({offlineContacts.length})
            </div>
            <div className="space-y-1">
              {offlineContacts.map(contact => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  onMessage={() => onStartChatWithContact(contact)}
                  onCall={() => onCallContact(contact)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredContacts.length === 0 && (
          <div className="p-8 text-center text-[#6B7280] text-sm">
            No contacts match your search.
          </div>
        )}
      </div>
    </div>
  );
};

const ContactRow = ({ contact, onMessage, onCall }) => {
  return (
    <div className="p-3 bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-xl flex items-center justify-between transition-all group">
      <div className="flex items-center space-x-3 min-w-0">
        <div className="relative shrink-0">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
          />
          {contact.status === 'Online' && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[#171717] truncate">{contact.name}</h4>
          <p className="text-xs text-[#6B7280] truncate">@{contact.username}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
        {/* Subtle Outlined Message Button */}
        <button
          onClick={onMessage}
          title="Send Message"
          className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#171717] hover:bg-[#F7F7F8] hover:border-[#D1D5DB] transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#6B7280] group-hover:text-[#171717]" />
        </button>
        {/* Subtle Outlined Call Button */}
        <button
          onClick={onCall}
          title="Call"
          className="p-1.5 rounded-lg border border-[#E5E7EB] text-[#171717] hover:bg-[#F7F7F8] hover:border-[#D1D5DB] transition-colors cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#6B7280] group-hover:text-[#171717]" />
        </button>
      </div>
    </div>
  );
};

export default ContactsPanel;
