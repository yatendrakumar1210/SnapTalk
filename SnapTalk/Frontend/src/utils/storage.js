// Helper functions to manage user session and local data persistence

export const getStoredToken = () => {
  return localStorage.getItem('snaptalk_token');
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('snaptalk_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (err) {
    return null;
  }
};

export const setStoredUserSession = (token, user) => {
  if (token) localStorage.setItem('snaptalk_token', token);
  if (user) localStorage.setItem('snaptalk_user', JSON.stringify(user));
};

export const saveStoredUserSession = setStoredUserSession;

export const clearStoredUserSession = () => {
  localStorage.removeItem('snaptalk_token');
  localStorage.removeItem('snaptalk_user');
};

// Data persistence per logged-in user
export const getStoredConversations = (userId) => {
  if (!userId) return [];
  try {
    const data = localStorage.getItem(`snaptalk_conversations_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveStoredConversations = (userId, conversations) => {
  if (!userId) return;
  localStorage.setItem(`snaptalk_conversations_${userId}`, JSON.stringify(conversations));
};

export const getStoredContacts = (userId) => {
  if (!userId) return [];
  try {
    const data = localStorage.getItem(`snaptalk_contacts_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveStoredContacts = (userId, contacts) => {
  if (!userId) return;
  localStorage.setItem(`snaptalk_contacts_${userId}`, JSON.stringify(contacts));
};

export const getStoredCalls = (userId) => {
  if (!userId) return [];
  try {
    const data = localStorage.getItem(`snaptalk_calls_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const saveStoredCalls = (userId, calls) => {
  if (!userId) return;
  localStorage.setItem(`snaptalk_calls_${userId}`, JSON.stringify(calls));
};

// Generate avatar URL from name initials
export const getAvatarByName = (name) => {
  if (!name) return 'https://api.dicebear.com/7.x/initials/svg?seed=User';
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=2563EB&color=fff&bold=true`;
};
