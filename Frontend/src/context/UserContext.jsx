import { createContext, useContext, useState, useEffect } from 'react';
import { usersData } from '../data/usersData';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState('luca-frei');
  const [users, setUsers] = useState(usersData);

  // Settings State - startet mit den Defaults des ersten Users
  const [settings, setSettings] = useState(() => {
    // Versuche Settings aus localStorage zu laden, ansonsten Default
    const savedSettings = localStorage.getItem(`settings-luca-frei`);
    return savedSettings ? JSON.parse(savedSettings) : usersData['luca-frei'].defaultSettings;
  });

  const currentUser = users[currentUserId];

  // Beim User-Wechsel: Lade Settings aus localStorage oder Default
  const switchUser = (userId) => {
    setCurrentUserId(userId);
    const savedSettings = localStorage.getItem(`settings-${userId}`);
    const newSettings = savedSettings ? JSON.parse(savedSettings) : users[userId].defaultSettings;
    setSettings(newSettings);

    // Wende Font-Size sofort an
    const fontSizeMap = {
      'klein': '14px',
      'mittel': '16px',
      'gross': '18px',
      'sehr-gross': '20px'
    };
    document.documentElement.style.fontSize = fontSizeMap[newSettings.fontSize] || '16px';
  };

  // Update Settings und speichere in localStorage
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`settings-${currentUserId}`, JSON.stringify(newSettings));

    // Wende Font-Size sofort an
    const fontSizeMap = {
      'klein': '14px',
      'mittel': '16px',
      'gross': '18px',
      'sehr-gross': '20px'
    };
    document.documentElement.style.fontSize = fontSizeMap[newSettings.fontSize] || '16px';
  };

  // Reset Settings auf User-Defaults
  const resetSettingsToDefault = () => {
    const defaultSettings = currentUser.defaultSettings;
    setSettings(defaultSettings);
    localStorage.setItem(`settings-${currentUserId}`, JSON.stringify(defaultSettings));

    const fontSizeMap = {
      'klein': '14px',
      'mittel': '16px',
      'gross': '18px',
      'sehr-gross': '20px'
    };
    document.documentElement.style.fontSize = fontSizeMap[defaultSettings.fontSize] || '16px';
  };

  // Initial Font-Size setzen
  useEffect(() => {
    const fontSizeMap = {
      'klein': '14px',
      'mittel': '16px',
      'gross': '18px',
      'sehr-gross': '20px'
    };
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize] || '16px';
  }, []);

  const getAllUsers = () => {
    return Object.values(users);
  };

  const addDocument = (newDocument) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        documents: [newDocument, ...prevUsers[currentUserId].documents]
      }
    }));
  };

  const updateDocument = (documentId, updatedData) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        documents: prevUsers[currentUserId].documents.map(doc =>
          doc.id === documentId ? { ...doc, ...updatedData } : doc
        )
      }
    }));
  };

  const deleteDocument = (documentId) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        documents: prevUsers[currentUserId].documents.filter(doc => doc.id !== documentId)
      }
    }));
  };

  // Case Management Functions
  const addCase = (newCase) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        cases: [newCase, ...(prevUsers[currentUserId].cases || [])]
      }
    }));
  };

  const updateCase = (caseId, updatedData) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        cases: prevUsers[currentUserId].cases.map(c =>
          c.id === caseId ? { ...c, ...updatedData } : c
        )
      }
    }));
  };

  const deleteCase = (caseId) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        cases: prevUsers[currentUserId].cases.filter(c => c.id !== caseId)
      }
    }));
  };

  const addPainDiaryEntry = (caseId, entry) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        cases: prevUsers[currentUserId].cases.map(c =>
          c.id === caseId ? {
            ...c,
            painDiary: [entry, ...(c.painDiary || [])]
          } : c
        )
      }
    }));
  };

  const deletePainDiaryEntry = (caseId, entryIndex) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        cases: prevUsers[currentUserId].cases.map(c =>
          c.id === caseId ? {
            ...c,
            painDiary: c.painDiary.filter((_, index) => index !== entryIndex)
          } : c
        )
      }
    }));
  };

  // Prevention Management Functions
  const addPreventionItem = (newItem) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        preventionData: [...prevUsers[currentUserId].preventionData, newItem]
      }
    }));
  };

  const deletePreventionItem = (itemIndex) => {
    setUsers(prevUsers => ({
      ...prevUsers,
      [currentUserId]: {
        ...prevUsers[currentUserId],
        preventionData: prevUsers[currentUserId].preventionData.filter((_, index) => index !== itemIndex)
      }
    }));
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      switchUser,
      getAllUsers,
      currentUserId,
      addDocument,
      updateDocument,
      deleteDocument,
      addCase,
      updateCase,
      deleteCase,
      addPainDiaryEntry,
      deletePainDiaryEntry,
      addPreventionItem,
      deletePreventionItem,
      // Settings Management
      settings,
      updateSettings,
      resetSettingsToDefault
    }}>
      {children}
    </UserContext.Provider>
  );
};
