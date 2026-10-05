export const currentUser = {
  id: 'user_current',
  name: 'Yatendra Kumar',
  username: 'yatendrakumar',
  email: 'yatendra@snaptalk.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  status: 'Online',
  bio: 'Building ideas, one message at a time.',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA'
};

export const initialConversations = [
  {
    id: 'chat_1',
    name: 'Alex Johnson',
    username: 'alexj',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    status: 'Online',
    unreadCount: 2,
    lastSeen: 'Just now',
    bio: 'Product Designer & Frontend Enthusiast 🎨',
    phone: '+1 (555) 019-2834',
    email: 'alex.johnson@example.com',
    messages: [
      { id: 'm1', senderId: 'chat_1', text: 'Hey Yatendra! Are you joining the product review meeting today?', timestamp: '10:35 PM', read: true },
      { id: 'm2', senderId: 'user_current', text: "Hey Alex! Yes, I'm just polishing the new SnapTalk minimal white UI.", timestamp: '10:38 PM', read: true },
      { id: 'm3', senderId: 'chat_1', text: 'That sounds amazing! Is the white background layout ready?', timestamp: '10:40 PM', read: true },
      { id: 'm4', senderId: 'chat_1', text: 'Hey, are you free today?', timestamp: '10:42 PM', read: false },
      { id: 'm5', senderId: 'user_current', text: "Yes, I'm free after 6 PM.", timestamp: '10:42 PM', read: true }
    ]
  },
  {
    id: 'chat_2',
    name: 'Rahul Sharma',
    username: 'rahuls',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'Online',
    unreadCount: 0,
    lastSeen: '5m ago',
    bio: 'Backend & Infrastructure Lead ⚡',
    phone: '+1 (555) 432-8765',
    email: 'rahul.sharma@example.com',
    messages: [
      { id: 'm6', senderId: 'chat_2', text: "Let's complete the project today.", timestamp: '9:18 PM', read: true },
      { id: 'm7', senderId: 'user_current', text: 'Everything on the client side is super smooth and responsive.', timestamp: '9:20 PM', read: true }
    ]
  },
  {
    id: 'chat_3',
    name: 'Priya Singh',
    username: 'priya_s',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'Offline',
    unreadCount: 1,
    lastSeen: 'Yesterday at 8:15 PM',
    bio: 'Brand Strategist & Visual Designer ✨',
    phone: '+1 (555) 876-5432',
    email: 'priya.singh@example.com',
    messages: [
      { id: 'm8', senderId: 'user_current', text: 'Hi Priya! Could you send over the updated icon assets?', timestamp: 'Yesterday', read: true },
      { id: 'm9', senderId: 'chat_3', text: 'Sent an image of the logo options.', timestamp: 'Yesterday', read: false }
    ]
  },
  {
    id: 'chat_4',
    name: 'Aman Kumar',
    username: 'amank',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'Offline',
    unreadCount: 0,
    lastSeen: '2 hours ago',
    bio: 'Mobile Dev & Open Source Contributor 📱',
    phone: '+1 (555) 654-3210',
    email: 'aman.kumar@example.com',
    messages: [
      { id: 'm10', senderId: 'chat_4', text: 'Thanks for the quick response on the API docs!', timestamp: '2 days ago', read: true }
    ]
  },
  {
    id: 'chat_5',
    name: 'Neha Sharma',
    username: 'nehasharma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    status: 'Offline',
    unreadCount: 0,
    lastSeen: '3 days ago',
    bio: 'QA Engineer & Test Automation Specialist 🧪',
    phone: '+1 (555) 987-6543',
    email: 'neha.sharma@example.com',
    messages: [
      { id: 'm11', senderId: 'chat_5', text: 'See you at the Tech Conference next week!', timestamp: '3 days ago', read: true }
    ]
  }
];

export const initialContacts = [
  {
    id: 'c1',
    name: 'Alex Johnson',
    username: 'alexj',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    status: 'Online',
    bio: 'Product Designer & Frontend Enthusiast 🎨',
    chatId: 'chat_1'
  },
  {
    id: 'c2',
    name: 'Rahul Sharma',
    username: 'rahuls',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'Online',
    bio: 'Backend & Infrastructure Lead ⚡',
    chatId: 'chat_2'
  },
  {
    id: 'c3',
    name: 'Priya Singh',
    username: 'priya_s',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'Offline',
    bio: 'Brand Strategist & Visual Designer ✨',
    chatId: 'chat_3'
  },
  {
    id: 'c4',
    name: 'Aman Kumar',
    username: 'amank',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'Offline',
    bio: 'Mobile Dev & Open Source Contributor 📱',
    chatId: 'chat_4'
  },
  {
    id: 'c5',
    name: 'Neha Sharma',
    username: 'nehasharma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    status: 'Offline',
    bio: 'QA Engineer & Test Automation Specialist 🧪',
    chatId: 'chat_5'
  }
];

export const initialCallHistory = [
  {
    id: 'call_1',
    contactName: 'Alex Johnson',
    username: 'alexj',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    type: 'Incoming', // Incoming, Outgoing, Missed
    media: 'Voice',   // Voice, Video
    timestamp: 'Today, 10:45 PM',
    duration: '04m 12s'
  },
  {
    id: 'call_2',
    contactName: 'Rahul Sharma',
    username: 'rahuls',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    type: 'Outgoing',
    media: 'Video',
    timestamp: 'Yesterday, 8:30 PM',
    duration: '18m 05s'
  },
  {
    id: 'call_3',
    contactName: 'Priya Singh',
    username: 'priya_s',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    type: 'Missed',
    media: 'Voice',
    timestamp: 'Aug 29, 5:12 PM',
    duration: '00m 00s'
  }
];
