import { createContext, useContext, useState, useEffect } from 'react';
import { usersData } from '../data/usersData';
import { doctorsData } from '../data/doctorsData';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// Patienten und Ärzte teilen sich denselben Persona-Switcher — die Rolle
// (`role: 'patient' | 'doctor'`) entscheidet erst nach dem Wechsel, welche
// Navigation und Pages der Frontend anzeigt (siehe SecondaryNav, App-Routes).
const allPersonas = { ...usersData, ...doctorsData };

// Seed-Pending-Requests für die Demo (entsprechen früher doctor.pendingRequests).
// Liegen jetzt im shared State, damit Patient (Freigaben) und Arzt (Dashboard)
// denselben Datenstand sehen — entspricht später dem Backend-AccessRequest.
const seedAccessRequests = [
  {
    requestId: 'req-001',
    doctorId: 'dr-mueller',
    patientId: 'markus-huber',
    requestedAt: '2024-11-15',
    grantType: 'specific',
    cases: ['Alle Fälle'],
    documentTypes: ['Laborberichte', 'Arztbriefe'],
    message: 'Mitbehandlung kardiovaskuläres Risiko',
    status: 'pending'
  }
];

export const UserProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState('luca-frei');
  const [users, setUsers] = useState(allPersonas);

  // Shared Permission-State zwischen Arzt und Patient (Issue #14 / #16).
  // accessRequests sind anhängige Zugriffsanfragen, die der Patient noch
  // annehmen oder ablehnen muss. Bestätigte Anfragen werden in den
  // patient.accessGrants des Patienten überführt und aus dieser Liste entfernt.
  const [accessRequests, setAccessRequests] = useState(seedAccessRequests);

  // Arzt stellt eine neue Zugriffsanfrage — schreibt sie in den shared State.
  const requestAccess = (request) => {
    const newReq = {
      requestId: `req-${Date.now()}`,
      requestedAt: new Date().toISOString().slice(0, 10),
      status: 'pending',
      ...request
    };
    setAccessRequests(prev => [...prev, newReq]);
    return newReq;
  };

  // Patient bestätigt eine Anfrage → wird zu einem patient.accessGrants-Eintrag.
  // doctor wird aus doctorsData gelookt, damit Name/Specialty mitkommen.
  const approveAccessRequest = (requestId) => {
    const req = accessRequests.find(r => r.requestId === requestId);
    if (!req) return;
    const doctor = doctorsData[req.doctorId];
    if (!doctor) return;
    const newGrant = {
      id: `g-${Date.now()}`,
      doctorId: req.doctorId,
      name: doctor.name,
      specialty: doctor.specialty,
      institution: doctor.institution,
      phone: doctor.phone,
      isActive: true,
      grantType: req.grantType || 'specific',
      grantedDate: new Date().toISOString().slice(0, 10),
      expiryDate: req.validUntil || null,
      validFrom: req.validFrom || null,
      validUntil: req.validUntil || null,
      accessLevel: req.grantType === 'treatment-period' ? 'Vollzugriff' : (req.accessLevel || 'Eingeschränkt'),
      cases: req.cases || ['Alle Fälle'],
      documentTypes: req.documentTypes || ['Alle'],
      treatmentReason: req.treatmentReason || null
    };
    setUsers(prev => ({
      ...prev,
      [req.patientId]: {
        ...prev[req.patientId],
        accessGrants: [...(prev[req.patientId].accessGrants || []), newGrant]
      }
    }));
    setAccessRequests(prev => prev.filter(r => r.requestId !== requestId));
  };

  // Patient lehnt eine Anfrage ab — Request wird entfernt (Audit-Trail wäre Backend).
  const declineAccessRequest = (requestId) => {
    setAccessRequests(prev => prev.filter(r => r.requestId !== requestId));
  };

  // Toggle isActive an einem accessGrant des aktuellen Patienten —
  // erlaubt dem Patienten den Zugriff temporär zu pausieren.
  const toggleAccessGrant = (grantId) => {
    setUsers(prev => ({
      ...prev,
      [currentUserId]: {
        ...prev[currentUserId],
        accessGrants: (prev[currentUserId].accessGrants || []).map(g =>
          g.id === grantId ? { ...g, isActive: !g.isActive } : g
        )
      }
    }));
  };

  // Permanenter Widerruf eines accessGrants durch den Patienten.
  const revokeAccessGrant = (grantId) => {
    setUsers(prev => ({
      ...prev,
      [currentUserId]: {
        ...prev[currentUserId],
        accessGrants: (prev[currentUserId].accessGrants || []).filter(g => g.id !== grantId)
      }
    }));
  };

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
      currentRole: currentUser?.role || 'patient',
      switchUser,
      getAllUsers,
      currentUserId,
      // Permission / Request shared state (Issue #14, #16)
      accessRequests,
      requestAccess,
      approveAccessRequest,
      declineAccessRequest,
      toggleAccessGrant,
      revokeAccessGrant,
      users,
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
