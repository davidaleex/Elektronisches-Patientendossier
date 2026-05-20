// Arzt-Personas für die Doctor-UI (M4)
// Diese Personas haben role: 'doctor' und werden im Frontend
// als separate Rolle behandelt — andere Navigation, andere Pages.
// Im Backend (M6) wird das später als `Practitioner`-Entity modelliert.

export const doctorsData = {
  // 1. Dr. med. Hans Müller - Allgemeinmediziner
  'dr-mueller': {
    id: 'dr-mueller',
    role: 'doctor',
    name: 'Dr. med. Hans Müller',
    profileImage: '/profiles/dr-mueller.png',
    title: 'Dr. med.',
    specialty: 'Allgemeinmedizin',
    institution: 'Praxis Müller, Zürich',
    // GLN = Swiss Global Location Number (Pflicht für E-Health CH).
    // Wert hier rein fiktiv (echte GLN ist 13-stellig, beginnt mit 7601).
    gln: '7601000000123',
    birthDate: '03.06.1972',
    gender: 'Männlich',
    address: {
      street: 'Bahnhofstrasse 42',
      city: '8001 Zürich',
      country: 'Schweiz'
    },
    email: 'h.mueller@praxis-mueller.ch',
    phone: '+41 44 123 45 67',

    // Bewusst KEINE eigene Patientenliste mehr (Issue #14):
    // Single Source of Truth für Zugriffe ist patient.accessGrants in usersData.
    // Die Arzt-Patientenliste wird daraus derived (siehe DoctorDashboard).
    // Pending Requests leben im UserContext (shared state mit der Patient-Seite).

    // Default-Settings — gleiche Struktur wie Patienten, damit UserContext
    // nicht angepasst werden muss (settings-localStorage-Pfad funktioniert).
    defaultSettings: {
      fontSize: 'mittel',
      highContrast: false,
      language: 'de',
      notifications: {
        email: true,
        push: true,
        appointments: true,
        labResults: false,
        medications: false
      },
      dataSharing: {
        research: false,
        quality: false,
        statistics: false
      },
      twoFactorAuth: true,
      autoLogout: '15'
    }
  }
};
