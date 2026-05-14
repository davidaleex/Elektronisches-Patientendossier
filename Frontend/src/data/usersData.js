// 4 verschiedene User-Profile mit unterschiedlichen Gesundheitsdaten

export const usersData = {
  // 1. Luca Frei - Junger Mann, 20 Jahre, sportlich
  'luca-frei': {
    id: 'luca-frei',
    name: "Luca Frei",
    profileImage: "/profiles/luca-frei.png",
    birthDate: "12.03.2004",
    gender: "Männlich",
    address: {
      street: "Sportstrasse 45",
      city: "8050 Zürich",
      country: "Schweiz"
    },
    email: "luca.frei@example.ch",
    phone: "+41 78 234 56 78",
    ahvNumber: "756.9012.3456.78",
    bloodType: "O+",
    height: "185 cm",
    weight: "78 kg",

    // Persona-spezifische Default-Einstellungen (20 Jahre, sportlich, gesund)
    defaultSettings: {
      fontSize: 'mittel',
      highContrast: false,
      language: 'de',
      notifications: {
        email: true,
        push: false,
        appointments: true,
        labResults: true,
        medications: false
      },
      dataSharing: {
        research: false,
        quality: true,
        statistics: false
      },
      twoFactorAuth: false,
      autoLogout: '30'
    },

    insuranceData: {
      healthInsurance: "Swica Versicherung",
      insuranceNumber: "90012345679",
      insuranceType: "Grundversicherung",
      additionalInsurances: ["Unfallversicherung"],
      validSince: "01.01.2022"
    },

    primaryDoctor: {
      name: "Dr. med. Andreas Keller",
      specialty: "Allgemeine Medizin",
      phone: "+41 44 456 78 90",
      address: "Universitätsstrasse 88, 8050 Zürich",
      email: "praxis@keller-med.ch"
    },

    emergencyContact: {
      name: "Maria Frei",
      relationship: "Mutter",
      phone: "+41 79 345 67 89",
      alternativePhone: "+41 44 876 54 32",
      email: "maria.frei@example.ch"
    },

    allergies: [],
    chronicConditions: [],

    criticalValues: [
      { name: "Blutdruck", value: "118/75 mmHg", status: "good", reference: "< 140/90 mmHg", date: "20.11.2024" },
      { name: "Cholesterin", value: "165 mg/dl", status: "good", reference: "< 200 mg/dl", date: "15.10.2024" }
    ],

    currentMedications: [],

    upcomingAppointments: [
      { type: "Sportmedizinische Untersuchung", doctor: "Dr. Keller", date: "15.12.2024", time: "14:00", source: "Termindokument von Dr. Keller" }
    ],

    healthGoals: [
      { goal: "Muskelmasse auf 80 kg erhöhen", status: "in_progress", progress: 85 },
      { goal: "Marathon unter 3:30h laufen", status: "in_progress", progress: 60 }
    ],

    // Dokumente & Fälle (40 Dokumente über 20 Lebensjahre verteilt)
    documents: [
      // 2024 - Aktuell (20 Jahre)
      { id: 'lf1', title: "Sportmedizinische Untersuchung", category: "Vorsorge", date: "2024-11-20", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Sport", "Vorsorge"] },
      { id: 'lf2', title: "Blutbild Routine-Check", category: "Labor", date: "2024-10-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor", "Blut"] },
      { id: 'lf3', title: "Knie-MRT nach Fussballverletzung", category: "Bildgebung", date: "2024-09-05", type: "Radiologie", status: "aktuell", thumbnail: "mri", tags: ["Bildgebung", "Knie", "Sport"] },
      { id: 'lf4', title: "Physiotherapie-Bericht Knie", category: "Diagnosen", date: "2024-09-20", type: "Therapiebericht", status: "aktuell", thumbnail: "report", tags: ["Physiotherapie"] },
      { id: 'lf5', title: "Tetanus-Impfung Auffrischung", category: "Impfungen", date: "2024-08-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf6', title: "Leistungsdiagnostik VO2max", category: "Vorsorge", date: "2024-05-15", type: "Sportmedizin", status: "aktuell", thumbnail: "checkup", tags: ["Sport"] },
      { id: 'lf7', title: "Ernährungsberatung Sportler", category: "Vorsorge", date: "2024-03-10", type: "Beratung", status: "aktuell", thumbnail: "report", tags: ["Ernährung"] },

      // 2023 (19 Jahre)
      { id: 'lf8', title: "FSME-Impfung Auffrischung", category: "Impfungen", date: "2023-05-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf9', title: "Knöchelverletzung Röntgen", category: "Bildgebung", date: "2023-08-22", type: "Radiologie", status: "aktuell", thumbnail: "xray", tags: ["Bildgebung", "Sport"] },
      { id: 'lf10', title: "Sporttauglichkeitsuntersuchung", category: "Vorsorge", date: "2023-01-18", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Sport"] },

      // 2022 (18 Jahre)
      { id: 'lf11', title: "Blutbild Check-up 18 Jahre", category: "Labor", date: "2022-09-05", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'lf12', title: "Gesundheitszeugnis Studium", category: "Vorsorge", date: "2022-08-20", type: "Attest", status: "aktuell", thumbnail: "report", tags: ["Vorsorge"] },

      // 2021 (17 Jahre)
      { id: 'lf13', title: "Hautscreening Leberfleck", category: "Vorsorge", date: "2021-06-10", type: "Dermatologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'lf14', title: "COVID-19 Impfung 1. Dosis", category: "Impfungen", date: "2021-07-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf15', title: "COVID-19 Impfung 2. Dosis", category: "Impfungen", date: "2021-08-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2020 (16 Jahre)
      { id: 'lf16', title: "Belastungs-EKG Sporttauglichkeit", category: "Bildgebung", date: "2020-09-12", type: "Kardiologie", status: "aktuell", thumbnail: "ecg", tags: ["Sport"] },

      // 2019 (15 Jahre)
      { id: 'lf17', title: "Schulsportmedizinische Untersuchung", category: "Vorsorge", date: "2019-08-20", type: "Schulmedizin", status: "aktuell", thumbnail: "checkup", tags: ["Schule"] },

      // 2018 (14 Jahre)
      { id: 'lf18', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2018-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf19', title: "Handgelenkfraktur Röntgen", category: "Bildgebung", date: "2018-11-03", type: "Radiologie", status: "aktuell", thumbnail: "xray", tags: ["Unfall"] },

      // 2016 (12 Jahre) - Jugenduntersuchung
      { id: 'lf20', title: "J1 Jugendgesundheitsuntersuchung", category: "Vorsorge", date: "2016-04-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["J1"] },
      { id: 'lf21', title: "HPV-Impfung 1. Dosis", category: "Impfungen", date: "2016-05-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf22', title: "HPV-Impfung 2. Dosis", category: "Impfungen", date: "2016-11-25", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2014 (10 Jahre)
      { id: 'lf23', title: "FSME-Grundimmunisierung 3. Dosis", category: "Impfungen", date: "2014-04-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2013 (9 Jahre)
      { id: 'lf24', title: "U9 Schuleingangsuntersuchung", category: "Vorsorge", date: "2013-05-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U9"] },
      { id: 'lf25', title: "FSME-Grundimmunisierung 2. Dosis", category: "Impfungen", date: "2013-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf26', title: "FSME-Grundimmunisierung 1. Dosis", category: "Impfungen", date: "2013-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2012 (8 Jahre)
      { id: 'lf27', title: "U8 Untersuchung", category: "Vorsorge", date: "2012-04-20", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U8"] },

      // 2010 (6 Jahre)
      { id: 'lf28', title: "U7 Vorschuluntersuchung", category: "Vorsorge", date: "2010-05-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U7"] },
      { id: 'lf29', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2010-03-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2009 (5 Jahre)
      { id: 'lf30', title: "MMR-Impfung 2. Dosis", category: "Impfungen", date: "2009-04-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2007 (3 Jahre)
      { id: 'lf31', title: "U6 Entwicklungsuntersuchung", category: "Vorsorge", date: "2007-09-12", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U6"] },

      // 2005 (1 Jahr)
      { id: 'lf32', title: "U5 Untersuchung", category: "Vorsorge", date: "2005-03-12", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U5"] },
      { id: 'lf33', title: "MMR-Impfung 1. Dosis", category: "Impfungen", date: "2005-04-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf34', title: "6-fach-Impfung 4. Dosis", category: "Impfungen", date: "2005-07-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2004 (< 1 Jahr) - Geburt & Säugling
      { id: 'lf35', title: "U4 Untersuchung", category: "Vorsorge", date: "2004-09-12", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U4"] },
      { id: 'lf36', title: "6-fach-Impfung 3. Dosis", category: "Impfungen", date: "2004-09-12", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf37', title: "U3 Untersuchung", category: "Vorsorge", date: "2004-06-12", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U3"] },
      { id: 'lf38', title: "6-fach-Impfung 2. Dosis", category: "Impfungen", date: "2004-06-12", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf39', title: "U2 Neugeborenenuntersuchung", category: "Vorsorge", date: "2004-04-12", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U2"] },
      { id: 'lf40', title: "6-fach-Impfung 1. Dosis", category: "Impfungen", date: "2004-05-12", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'lf41', title: "U1 Erstuntersuchung Geburt", category: "Vorsorge", date: "2004-03-12", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U1", "Geburt"] }
    ],

    cases: [
      {
        id: 'lfc1',
        title: "Meniskusverletzung links",
        status: "laufend",
        startDate: "2024-09-01",
        category: "Orthopädie",
        doctor: "Dr. med. Andreas Keller",
        painDiary: [
          { date: "2024-11-25", time: "08:00", painLevel: 3, location: "Knie links", notes: "Leichte Schmerzen nach dem Aufstehen" },
          { date: "2024-11-24", time: "14:30", painLevel: 5, location: "Knie links", notes: "Nach Physiotherapie, Schwellung" },
          { date: "2024-11-23", time: "09:15", painLevel: 2, location: "Knie links", notes: "Morgens kaum Schmerzen" },
          { date: "2024-11-22", time: "18:00", painLevel: 6, location: "Knie links", notes: "Nach längerem Stehen im Training" },
          { date: "2024-11-21", time: "12:00", painLevel: 4, location: "Knie links", notes: "Mittelmässig, leichte Belastung" },
          { date: "2024-11-20", time: "07:30", painLevel: 3, location: "Knie links", notes: "Morgensteifigkeit" },
          { date: "2024-11-19", time: "16:00", painLevel: 5, location: "Knie links", notes: "Nach Treppensteigen verschlimmert" },
          { date: "2024-11-18", time: "10:00", painLevel: 2, location: "Knie links", notes: "Ruhetag, kaum Beschwerden" }
        ]
      },
      {
        id: 'lfc2',
        title: "Routine Gesundheitscheck",
        status: "abgeschlossen",
        startDate: "2024-10-15",
        endDate: "2024-11-20",
        category: "Vorsorge",
        doctor: "Dr. med. Andreas Keller"
      }
    ],

    // Visualisierungen - Gesunde junge Person
    healthData: {
      labTrends: {
        hba1c: [],
        cholesterol: [
          { date: 'Okt 24', ldl: 165, hdl: 58, reference: 116 }
        ],
        bloodPressure: [
          { date: 'Aug 24', systolic: 115, diastolic: 72, refSys: 140, refDia: 90 },
          { date: 'Sep 24', systolic: 118, diastolic: 75, refSys: 140, refDia: 90 },
          { date: 'Okt 24', systolic: 116, diastolic: 73, refSys: 140, refDia: 90 },
          { date: 'Nov 24', systolic: 118, diastolic: 75, refSys: 140, refDia: 90 }
        ]
      },
      currentVitals: [
        { name: 'Blutdruck Sys', value: 118, max: 180, reference: 140, unit: 'mmHg', status: 'good' },
        { name: 'Blutdruck Dia', value: 75, max: 120, reference: 90, unit: 'mmHg', status: 'good' },
        { name: 'Cholesterin', value: 165, max: 250, reference: 200, unit: 'mg/dl', status: 'good' },
        { name: 'Puls', value: 68, max: 100, reference: 80, unit: 'bpm', status: 'good' }
      ],
      medicationTimeline: [],
      vaccinations: [
        { name: 'Tetanus', lastDate: '2024-08-10', nextDue: '2034-08-10', status: 'aktuell', daysUntilDue: 3545 },
        { name: 'FSME', lastDate: '2023-05-15', nextDue: '2026-05-15', status: 'aktuell', daysUntilDue: 525 },
        { name: 'COVID-19', lastDate: '2024-01-20', nextDue: '2025-01-20', status: 'aktuell', daysUntilDue: 44 },
        { name: 'Grippe', lastDate: null, nextDue: '2025-10-01', status: 'empfohlen', daysUntilDue: 298 }
      ]
    },

    // Prävention & Vorsorge
    preventionData: [
      { name: 'Tetanus-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2024-08-10', nextDue: '2034-08-10', daysUntilDue: 3545, interval: 'Alle 10 Jahre', doctor: 'Dr. med. Andreas Keller', doctorPhone: '+41 44 456 78 90', doctorSpecialty: 'Allgemeinmedizin' },
      { name: 'FSME-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2023-05-15', nextDue: '2026-05-15', daysUntilDue: 525, interval: 'Alle 3 Jahre', doctor: 'Dr. med. Andreas Keller', doctorPhone: '+41 44 456 78 90', doctorSpecialty: 'Allgemeinmedizin' },
      { name: 'COVID-19 Booster', category: 'Impfungen', status: 'aktuell', lastDate: '2024-01-20', nextDue: '2025-01-20', daysUntilDue: 44, interval: 'Jährlich', doctor: 'Dr. med. Andreas Keller', doctorPhone: '+41 44 456 78 90', doctorSpecialty: 'Allgemeinmedizin' },
      { name: 'Grippe-Impfung', category: 'Impfungen', status: 'empfohlen', lastDate: null, nextDue: '2025-10-01', daysUntilDue: 298, interval: 'Jährlich', description: 'Empfohlene Grippeimpfung für Herbst/Winter-Saison', doctor: 'Dr. med. Andreas Keller', doctorPhone: '+41 44 456 78 90', doctorSpecialty: 'Allgemeinmedizin' },
      { name: 'Gesundheits-Check-up', category: 'Vorsorge', status: 'aktuell', lastDate: '2024-11-20', nextDue: '2026-11-20', daysUntilDue: 734, interval: 'Alle 2 Jahre', description: 'Allgemeine Vorsorgeuntersuchung für unter 35-Jährige', doctor: 'Dr. med. Andreas Keller', doctorPhone: '+41 44 456 78 90', doctorSpecialty: 'Allgemeinmedizin' },
      { name: 'Hautkrebs-Screening', category: 'Screening', status: 'empfohlen', lastDate: null, nextDue: '2025-06-01', daysUntilDue: 175, interval: 'Alle 2 Jahre', description: 'Hautkrebsvorsorge besonders für sportlich Aktive empfohlen', doctor: 'Dr. med. Sarah Müller', doctorPhone: '+41 44 789 23 45', doctorSpecialty: 'Dermatologie' },
      { name: 'Zahnärztliche Kontrolle', category: 'Dental', status: 'überfällig', lastDate: '2023-10-15', nextDue: '2024-10-15', daysUntilDue: -50, interval: 'Jährlich', description: 'Routinemäßige zahnärztliche Kontrolle und professionelle Zahnreinigung', doctor: 'Dr. med. dent. Peter Zahn', doctorPhone: '+41 44 888 99 00', doctorSpecialty: 'Zahnmedizin' },
      { name: 'Augenärztliche Untersuchung', category: 'Screening', status: 'empfohlen', lastDate: null, nextDue: '2025-03-01', daysUntilDue: 83, interval: 'Alle 2 Jahre', description: 'Sehtest und Augendruckmessung', doctor: 'Dr. med. Anna Blick', doctorPhone: '+41 44 777 66 55', doctorSpecialty: 'Ophthalmologie' }
    ],

    // Freigaben
    accessGrants: [
      {
        id: 'lg1',
        name: 'Dr. med. Andreas Keller',
        specialty: 'Allgemeine Medizin',
        institution: 'Hausarztpraxis Zürich',
        phone: '+41 44 456 78 90',
        isActive: true,
        grantedDate: '2022-01-15',
        expiryDate: null,
        accessLevel: 'Vollzugriff',
        cases: ['Alle Fälle'],
        documentTypes: ['Laborberichte', 'Arztbriefe', 'Rezepte', 'Bildgebung']
      },
      {
        id: 'lg2',
        name: 'Dr. med. Thomas Sport',
        specialty: 'Sportmedizin FMH',
        institution: 'Sportmedizin Zürich',
        phone: '+41 44 555 11 22',
        isActive: true,
        grantedDate: '2024-09-01',
        expiryDate: '2025-09-01',
        accessLevel: 'Eingeschränkt',
        cases: ['Meniskusverletzung links'],
        documentTypes: ['Bildgebung', 'Arztbriefe', 'Physiotherapie']
      }
    ],

    doctorsFromDocuments: [
      { name: 'Dr. med. Andreas Keller', specialty: 'Allgemeinmedizin', hasAccess: true },
      { name: 'Radiologie Zürich Nord', specialty: 'Radiologie', hasAccess: false },
      { name: 'Physio Aktiv', specialty: 'Physiotherapie', hasAccess: false }
    ]
  },

  // 2. Nina Baumann - Schwangere Frau, 30 Jahre
  'nina-baumann': {
    id: 'nina-baumann',
    name: "Nina Baumann",
    profileImage: "/profiles/nina-baumann.png",
    birthDate: "22.08.1994",
    gender: "Weiblich",
    address: {
      street: "Familienweg 12",
      city: "8001 Zürich",
      country: "Schweiz"
    },
    email: "nina.baumann@example.ch",
    phone: "+41 79 876 54 32",
    ahvNumber: "756.5678.9012.34",
    bloodType: "A+",
    height: "168 cm",
    weight: "72 kg",

    // Persona-spezifische Default-Einstellungen (30 Jahre, schwanger, braucht alle Benachrichtigungen)
    defaultSettings: {
      fontSize: 'mittel',
      highContrast: false,
      language: 'de',
      notifications: {
        email: true,
        push: true,
        appointments: true,
        labResults: true,
        medications: true
      },
      dataSharing: {
        research: true,
        quality: true,
        statistics: false
      },
      twoFactorAuth: true,
      autoLogout: '30'
    },

    insuranceData: {
      healthInsurance: "Helsana Versicherung",
      insuranceNumber: "70056781234",
      insuranceType: "Grundversicherung + Halbprivat",
      additionalInsurances: ["Mutterschaftsversicherung", "Zahnversicherung"],
      validSince: "01.06.2018"
    },

    primaryDoctor: {
      name: "Dr. med. Christine Weber",
      specialty: "Gynäkologie & Geburtshilfe FMH",
      phone: "+41 44 321 45 67",
      address: "Frauenstrasse 23, 8001 Zürich",
      email: "praxis@weber-gyn.ch"
    },

    emergencyContact: {
      name: "Thomas Baumann",
      relationship: "Ehemann",
      phone: "+41 79 123 98 76",
      alternativePhone: "+41 44 234 56 78",
      email: "thomas.baumann@example.ch"
    },

    allergies: ["Latex"],
    chronicConditions: ["Schwangerschaft (28. Woche)"],

    criticalValues: [
      { name: "Blutdruck", value: "125/80 mmHg", status: "good", reference: "< 140/90 mmHg", date: "25.11.2024" },
      { name: "Eisen", value: "11.2 mg/dl", status: "good", reference: "12-16 mg/dl", date: "20.11.2024" },
      { name: "Gewichtszunahme", value: "+12 kg", status: "good", reference: "11-16 kg", date: "25.11.2024" }
    ],

    currentMedications: [
      { name: "Elevit", dosage: "1 Tablette", frequency: "1x täglich", indication: "Schwangerschaftsvitamine" },
      { name: "Eisen", dosage: "80mg", frequency: "1x täglich", indication: "Eisenmangel-Prophylaxe" }
    ],

    upcomingAppointments: [
      { type: "Schwangerschaftskontrolle", doctor: "Dr. Weber", date: "02.12.2024", time: "10:00", source: "Termindokument von Dr. Weber" },
      { type: "Ultraschall", doctor: "Dr. Weber", date: "16.12.2024", time: "14:30", source: "Überweisungsdokument von Dr. Weber" },
      { type: "Geburtsvorbereitungskurs", doctor: "Hebamme Lisa", date: "10.12.2024", time: "18:00", source: "Anmeldungsbestätigung Hebammenpraxis" }
    ],

    healthGoals: [
      { goal: "Gesunde Schwangerschaft bis zur Geburt", status: "in_progress", progress: 70 },
      { goal: "Tägliche Bewegung 30 Min", status: "in_progress", progress: 80 },
      { goal: "Ausgewogene Ernährung", status: "in_progress", progress: 90 }
    ],

    // Dokumente & Fälle (65 Dokumente über 30 Lebensjahre verteilt)
    documents: [
      // 2024 - Schwangerschaft (30 Jahre) - VIELE Dokumente
      { id: 'nb1', title: "Ultraschall 28. SSW", category: "Bildgebung", date: "2024-11-25", type: "Ultraschall", status: "aktuell", thumbnail: "mri", tags: ["Schwangerschaft"] },
      { id: 'nb2', title: "Schwangerschaftskontrolle 28. SSW", category: "Diagnosen", date: "2024-11-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Schwangerschaft"] },
      { id: 'nb3', title: "Eisenwert-Kontrolle SSW 26", category: "Labor", date: "2024-11-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'nb4', title: "Ultraschall 24. SSW", category: "Bildgebung", date: "2024-10-22", type: "Ultraschall", status: "aktuell", thumbnail: "mri", tags: ["Schwangerschaft"] },
      { id: 'nb5', title: "Glucose-Toleranztest 24. SSW", category: "Labor", date: "2024-10-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor", "Schwangerschaft"] },
      { id: 'nb6', title: "Schwangerschaftskontrolle 24. SSW", category: "Diagnosen", date: "2024-10-15", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Schwangerschaft"] },
      { id: 'nb7', title: "Ultraschall 20. SSW (Organscreening)", category: "Bildgebung", date: "2024-09-18", type: "Ultraschall", status: "aktuell", thumbnail: "mri", tags: ["Schwangerschaft"] },
      { id: 'nb8', title: "Schwangerschaftskontrolle 20. SSW", category: "Diagnosen", date: "2024-09-10", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Schwangerschaft"] },
      { id: 'nb9', title: "Blutdruck-Monitoring SSW 18", category: "Labor", date: "2024-08-25", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'nb10', title: "Ultraschall 16. SSW", category: "Bildgebung", date: "2024-08-15", type: "Ultraschall", status: "aktuell", thumbnail: "mri", tags: ["Schwangerschaft"] },
      { id: 'nb11', title: "Ersttrimester-Screening", category: "Bildgebung", date: "2024-07-10", type: "Ultraschall", status: "aktuell", thumbnail: "mri", tags: ["Schwangerschaft"] },
      { id: 'nb12', title: "Nackentransparenzmessung", category: "Bildgebung", date: "2024-07-10", type: "Ultraschall", status: "aktuell", thumbnail: "mri", tags: ["Schwangerschaft"] },
      { id: 'nb13', title: "Triple-Test (Bluttest)", category: "Labor", date: "2024-07-05", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor", "Schwangerschaft"] },
      { id: 'nb14', title: "Toxoplasmose-Test", category: "Labor", date: "2024-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'nb15', title: "CMV-Antikörper-Test", category: "Labor", date: "2024-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'nb16', title: "Erstuntersuchung Schwangerschaft", category: "Diagnosen", date: "2024-05-15", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Schwangerschaft"] },
      { id: 'nb17', title: "Medikationsplan Schwangerschaft", category: "Medikamente", date: "2024-05-15", type: "Medikation", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },
      { id: 'nb18', title: "Mutterpass", category: "Vorsorge", date: "2024-05-01", type: "Dokument", status: "aktuell", thumbnail: "report", tags: ["Schwangerschaft"] },
      { id: 'nb19', title: "Bestätigung Schwangerschaft (HCG-Test)", category: "Labor", date: "2024-04-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2023 (29 Jahre) - Vor Schwangerschaft
      { id: 'nb20', title: "Kinderwunsch-Beratung", category: "Diagnosen", date: "2023-11-15", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Gynäkologie"] },
      { id: 'nb21', title: "Folsäure-Supplementierung Rezept", category: "Medikamente", date: "2023-11-15", type: "Rezept", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },
      { id: 'nb22', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2023-09-10", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb23', title: "PAP-Abstrich", category: "Labor", date: "2023-09-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'nb24', title: "Grippe-Impfung", category: "Impfungen", date: "2023-10-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2022 (28 Jahre)
      { id: 'nb25', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2022-08-20", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb26', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2022-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb27', title: "Schilddrüsen-Check TSH", category: "Labor", date: "2022-03-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2021 (27 Jahre)
      { id: 'nb28', title: "COVID-19 Impfung Booster", category: "Impfungen", date: "2021-12-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb29', title: "COVID-19 Impfung 2. Dosis", category: "Impfungen", date: "2021-08-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb30', title: "COVID-19 Impfung 1. Dosis", category: "Impfungen", date: "2021-07-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb31', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2021-09-10", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },

      // 2020 (26 Jahre)
      { id: 'nb32', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2020-08-15", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb33', title: "Blutbild Check-up", category: "Labor", date: "2020-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2019 (25 Jahre)
      { id: 'nb34', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2019-09-05", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb35', title: "Hautkrebs-Screening", category: "Vorsorge", date: "2019-06-20", type: "Dermatologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2018 (24 Jahre)
      { id: 'nb36', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2018-08-10", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb37', title: "Vitamin D Check", category: "Labor", date: "2018-02-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2017 (23 Jahre)
      { id: 'nb38', title: "Gynäkologische Jahresuntersuchung", category: "Vorsorge", date: "2017-09-15", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb39', title: "Antibiotika Rezept Blasenentzündung", category: "Medikamente", date: "2017-03-20", type: "Rezept", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },

      // 2016 (22 Jahre)
      { id: 'nb40', title: "Gynäkologische Erstuntersuchung", category: "Vorsorge", date: "2016-07-10", type: "Arztbrief", status: "aktuell", thumbnail: "checkup", tags: ["Gynäkologie"] },
      { id: 'nb41', title: "Verhütungsberatung", category: "Diagnosen", date: "2016-07-10", type: "Beratung", status: "aktuell", thumbnail: "report", tags: ["Gynäkologie"] },

      // 2015 (21 Jahre)
      { id: 'nb42', title: "FSME-Auffrischung", category: "Impfungen", date: "2015-05-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2012 (18 Jahre)
      { id: 'nb43', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2012-08-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb44', title: "Gesundheitszeugnis Studium", category: "Vorsorge", date: "2012-09-05", type: "Attest", status: "aktuell", thumbnail: "report", tags: ["Vorsorge"] },

      // 2010 (16 Jahre)
      { id: 'nb45', title: "FSME-Grundimmunisierung 3. Dosis", category: "Impfungen", date: "2010-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2009 (15 Jahre)
      { id: 'nb46', title: "FSME-Grundimmunisierung 2. Dosis", category: "Impfungen", date: "2009-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb47', title: "FSME-Grundimmunisierung 1. Dosis", category: "Impfungen", date: "2009-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2008 (14 Jahre)
      { id: 'nb48', title: "HPV-Impfung 3. Dosis", category: "Impfungen", date: "2008-12-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb49', title: "HPV-Impfung 2. Dosis", category: "Impfungen", date: "2008-08-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb50', title: "HPV-Impfung 1. Dosis", category: "Impfungen", date: "2008-06-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2006 (12 Jahre) - Jugenduntersuchung
      { id: 'nb51', title: "J1 Jugendgesundheitsuntersuchung", category: "Vorsorge", date: "2006-09-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["J1"] },

      // 2003 (9 Jahre)
      { id: 'nb52', title: "U9 Schuleingangsuntersuchung", category: "Vorsorge", date: "2003-09-20", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U9"] },
      { id: 'nb53', title: "MMR-Impfung 2. Dosis", category: "Impfungen", date: "2003-09-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2002 (8 Jahre)
      { id: 'nb54', title: "U8 Untersuchung", category: "Vorsorge", date: "2002-09-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U8"] },
      { id: 'nb55', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2002-08-22", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2000 (6 Jahre)
      { id: 'nb56', title: "U7 Vorschuluntersuchung", category: "Vorsorge", date: "2000-09-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U7"] },

      // 1997 (3 Jahre)
      { id: 'nb57', title: "U6 Entwicklungsuntersuchung", category: "Vorsorge", date: "1997-08-22", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U6"] },

      // 1995 (1 Jahr)
      { id: 'nb58', title: "U5 Untersuchung", category: "Vorsorge", date: "1995-08-22", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U5"] },
      { id: 'nb59', title: "MMR-Impfung 1. Dosis", category: "Impfungen", date: "1995-09-22", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb60', title: "6-fach-Impfung 4. Dosis", category: "Impfungen", date: "1995-10-22", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1994 (< 1 Jahr) - Geburt & Säugling
      { id: 'nb61', title: "U4 Untersuchung", category: "Vorsorge", date: "1994-12-22", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U4"] },
      { id: 'nb62', title: "6-fach-Impfung 3. Dosis", category: "Impfungen", date: "1994-12-22", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb63', title: "U3 Untersuchung", category: "Vorsorge", date: "1994-10-22", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U3"] },
      { id: 'nb64', title: "6-fach-Impfung 2. Dosis", category: "Impfungen", date: "1994-10-22", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb65', title: "U2 Neugeborenenuntersuchung", category: "Vorsorge", date: "1994-09-22", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U2"] },
      { id: 'nb66', title: "6-fach-Impfung 1. Dosis", category: "Impfungen", date: "1994-09-22", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'nb67', title: "U1 Erstuntersuchung Geburt", category: "Vorsorge", date: "1994-08-22", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U1", "Geburt"] }
    ],

    cases: [
      { id: 'nbc1', title: "Schwangerschaftsbegleitung", status: "laufend", startDate: "2024-05-01", category: "Gynäkologie", doctor: "Dr. med. Christine Weber" },
      { id: 'nbc2', title: "Eisenmangel-Behandlung", status: "laufend", startDate: "2024-06-15", category: "Allgemeinmedizin", doctor: "Dr. med. Christine Weber" }
    ],

    // Visualisierungen - Schwangerschaftsspezifisch
    healthData: {
      labTrends: {
        hba1c: [],
        cholesterol: [],
        bloodPressure: [
          { date: 'Mai 24', systolic: 120, diastolic: 78, refSys: 140, refDia: 90 },
          { date: 'Jun 24', systolic: 122, diastolic: 79, refSys: 140, refDia: 90 },
          { date: 'Jul 24', systolic: 123, diastolic: 80, refSys: 140, refDia: 90 },
          { date: 'Aug 24', systolic: 124, diastolic: 81, refSys: 140, refDia: 90 },
          { date: 'Sep 24', systolic: 125, diastolic: 80, refSys: 140, refDia: 90 },
          { date: 'Okt 24', systolic: 126, diastolic: 81, refSys: 140, refDia: 90 },
          { date: 'Nov 24', systolic: 125, diastolic: 80, refSys: 140, refDia: 90 }
        ],
        iron: [
          { date: 'Mai 24', value: 10.5, reference: 12 },
          { date: 'Jun 24', value: 10.8, reference: 12 },
          { date: 'Jul 24', value: 11.0, reference: 12 },
          { date: 'Aug 24', value: 11.3, reference: 12 },
          { date: 'Sep 24', value: 11.5, reference: 12 },
          { date: 'Okt 24', value: 11.7, reference: 12 },
          { date: 'Nov 24', value: 11.2, reference: 12 }
        ],
        weight: [
          { date: 'Mai 24', value: 60, reference: 60 },
          { date: 'Jun 24', value: 62, reference: 60 },
          { date: 'Jul 24', value: 64, reference: 60 },
          { date: 'Aug 24', value: 66, reference: 60 },
          { date: 'Sep 24', value: 68, reference: 60 },
          { date: 'Okt 24', value: 70, reference: 60 },
          { date: 'Nov 24', value: 72, reference: 60 }
        ]
      },
      currentVitals: [
        { name: 'Blutdruck Sys', value: 125, max: 180, reference: 140, unit: 'mmHg', status: 'good' },
        { name: 'Blutdruck Dia', value: 80, max: 120, reference: 90, unit: 'mmHg', status: 'good' },
        { name: 'Eisen', value: 11.2, max: 16, reference: 12, unit: 'mg/dl', status: 'elevated' },
        { name: 'Gewicht', value: 72, max: 100, reference: 76, unit: 'kg', status: 'good' }
      ],
      medicationTimeline: [
        {
          name: 'Elevit (Schwangerschaftsvitamine)',
          periods: [
            { start: '2024-05', end: '2024-12', dosage: '1 Tablette täglich', active: true }
          ]
        },
        {
          name: 'Eisen 80mg',
          periods: [
            { start: '2024-06', end: '2024-12', dosage: '1x täglich', active: true }
          ]
        }
      ],
      vaccinations: [
        { name: 'Tetanus', lastDate: '2022-03-10', nextDue: '2032-03-10', status: 'aktuell', daysUntilDue: 2646 },
        { name: 'Pertussis (Keuchhusten)', lastDate: '2024-07-01', nextDue: '2034-07-01', status: 'aktuell', daysUntilDue: 3498 },
        { name: 'Grippe', lastDate: '2024-10-15', nextDue: '2025-10-15', status: 'aktuell', daysUntilDue: 312 },
        { name: 'COVID-19', lastDate: '2024-02-10', nextDue: '2025-02-10', status: 'aktuell', daysUntilDue: 65 }
      ]
    },

    // Prävention & Vorsorge - Schwangerschafts-fokussiert
    preventionData: [
      { name: 'Tetanus-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2022-03-10', nextDue: '2032-03-10', daysUntilDue: 2646, interval: 'Alle 10 Jahre' },
      { name: 'Pertussis-Impfung (Keuchhusten)', category: 'Impfungen', status: 'aktuell', lastDate: '2024-07-01', nextDue: '2034-07-01', daysUntilDue: 3498, interval: 'Alle 10 Jahre', description: 'Keuchhusten-Impfung während Schwangerschaft zum Schutz des Neugeborenen' },
      { name: 'Grippe-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2024-10-15', nextDue: '2025-10-15', daysUntilDue: 312, interval: 'Jährlich', description: 'Grippeimpfung während Schwangerschaft empfohlen' },
      { name: 'COVID-19 Booster', category: 'Impfungen', status: 'aktuell', lastDate: '2024-02-10', nextDue: '2025-02-10', daysUntilDue: 65, interval: 'Jährlich' },
      { name: 'Schwangerschaftskontrolle', category: 'Vorsorge', status: 'bald_fällig', lastDate: '2024-11-25', nextDue: '2024-12-02', daysUntilDue: -3, interval: 'Alle 2 Wochen', description: 'Regelmäßige Schwangerschaftsvorsorge im 3. Trimester' },
      { name: 'Ultraschalluntersuchung', category: 'Vorsorge', status: 'bald_fällig', lastDate: '2024-11-25', nextDue: '2024-12-16', daysUntilDue: 11, interval: '2-4 Wochen', description: 'Regelmäßige Ultraschall-Kontrolle der Kindesentwicklung' },
      { name: 'Glucose-Toleranztest (Schwangerschaftsdiabetes)', category: 'Screening', status: 'aktuell', lastDate: '2024-11-10', nextDue: null, daysUntilDue: null, interval: 'Einmalig', description: 'Test auf Schwangerschaftsdiabetes - Ergebnis negativ' },
      { name: 'Toxoplasmose-Screening', category: 'Screening', status: 'aktuell', lastDate: '2024-06-10', nextDue: null, daysUntilDue: null, interval: 'Einmalig', description: 'Toxoplasmose-Antikörper-Test negativ' }
    ],

    // Freigaben
    accessGrants: [
      {
        id: 'ng1',
        name: 'Dr. med. Christine Weber',
        specialty: 'Gynäkologie & Geburtshilfe FMH',
        institution: 'Frauenpraxis Zürich',
        phone: '+41 44 321 45 67',
        isActive: true,
        grantedDate: '2024-05-01',
        expiryDate: '2025-05-01',
        accessLevel: 'Vollzugriff',
        cases: ['Alle Fälle'],
        documentTypes: ['Laborberichte', 'Arztbriefe', 'Ultraschall', 'Rezepte']
      },
      {
        id: 'ng2',
        name: 'Hebamme Lisa Müller',
        specialty: 'Hebamme',
        institution: 'Hebammenpraxis Zürich',
        phone: '+41 79 888 77 66',
        isActive: true,
        grantedDate: '2024-08-01',
        expiryDate: '2025-02-28',
        accessLevel: 'Eingeschränkt',
        cases: ['Schwangerschaftsbegleitung'],
        documentTypes: ['Arztbriefe', 'Ultraschall', 'Mutterpass']
      },
      {
        id: 'ng3',
        name: 'Spital Zürich - Geburtenabteilung',
        specialty: 'Geburtshilfe',
        institution: 'Universitätsspital Zürich',
        phone: '+41 44 255 11 11',
        isActive: true,
        grantedDate: '2024-09-15',
        expiryDate: '2025-03-31',
        accessLevel: 'Vollzugriff',
        cases: ['Schwangerschaftsbegleitung'],
        documentTypes: ['Alle']
      }
    ],

    doctorsFromDocuments: [
      { name: 'Dr. med. Christine Weber', specialty: 'Gynäkologie', hasAccess: true },
      { name: 'Hebamme Lisa Müller', specialty: 'Hebamme', hasAccess: true },
      { name: 'Labor Zürich Zentrum', specialty: 'Labormedizin', hasAccess: false }
    ]
  },

  // 3. Markus Huber - Eleganter Mann, 50 Jahre, Geschäftsmann
  'markus-huber': {
    id: 'markus-huber',
    name: "Markus Huber",
    profileImage: "/profiles/markus-huber.png",
    birthDate: "15.04.1974",
    gender: "Männlich",
    address: {
      street: "Seestrasse 88",
      city: "8002 Zürich",
      country: "Schweiz"
    },
    email: "markus.huber@example.ch",
    phone: "+41 79 555 12 34",
    ahvNumber: "756.3456.7890.12",
    bloodType: "B+",
    height: "182 cm",
    weight: "88 kg",

    // Persona-spezifische Default-Einstellungen (50 Jahre, Geschäftsmann, braucht größere Schrift)
    defaultSettings: {
      fontSize: 'gross',
      highContrast: false,
      language: 'de',
      notifications: {
        email: true,
        push: false,
        appointments: true,
        labResults: true,
        medications: true
      },
      dataSharing: {
        research: false,
        quality: true,
        statistics: false
      },
      twoFactorAuth: true,
      autoLogout: '15'
    },

    insuranceData: {
      healthInsurance: "CSS Versicherung",
      insuranceNumber: "80045678901",
      insuranceType: "Grundversicherung + Privat",
      additionalInsurances: ["Zahnversicherung", "Auslandversicherung", "Zusatzversicherung"],
      validSince: "01.01.2010"
    },

    primaryDoctor: {
      name: "Prof. Dr. med. Peter Schneider",
      specialty: "Innere Medizin & Kardiologie FMH",
      phone: "+41 44 789 01 23",
      address: "Paradeplatz 1, 8002 Zürich",
      email: "sekretariat@schneider-kardio.ch"
    },

    emergencyContact: {
      name: "Sandra Huber",
      relationship: "Ehefrau",
      phone: "+41 79 444 33 22",
      alternativePhone: "+41 44 555 66 77",
      email: "sandra.huber@example.ch"
    },

    allergies: [],
    chronicConditions: ["Arterielle Hypertonie", "Hypercholesterinämie"],

    criticalValues: [
      { name: "Blutdruck", value: "138/88 mmHg", status: "elevated", reference: "< 140/90 mmHg", date: "22.11.2024" },
      { name: "LDL-Cholesterin", value: "148 mg/dl", status: "warning", reference: "< 116 mg/dl", date: "15.11.2024" },
      { name: "Triglyceride", value: "165 mg/dl", status: "elevated", reference: "< 150 mg/dl", date: "15.11.2024" }
    ],

    currentMedications: [
      { name: "Amlodipin", dosage: "5mg", frequency: "1x täglich", indication: "Bluthochdruck" },
      { name: "Atorvastatin", dosage: "40mg", frequency: "1x abends", indication: "Cholesterinsenker" },
      { name: "Aspirin Cardio", dosage: "100mg", frequency: "1x täglich", indication: "Thromboseprophylaxe" }
    ],

    upcomingAppointments: [
      { type: "Kardiologie-Kontrolle", doctor: "Prof. Dr. Schneider", date: "12.12.2024", time: "11:00", source: "Termindokument von Prof. Dr. Schneider" },
      { type: "Belastungs-EKG", doctor: "Prof. Dr. Schneider", date: "18.12.2024", time: "09:00", source: "Überweisungsdokument Kardiologie" }
    ],

    healthGoals: [
      { goal: "Blutdruck unter 130/80 mmHg", status: "in_progress", progress: 55 },
      { goal: "LDL-Cholesterin unter 116 mg/dl", status: "in_progress", progress: 60 },
      { goal: "Gewicht reduzieren auf 82 kg", status: "in_progress", progress: 40 }
    ],

    // Dokumente & Fälle (85 Dokumente über 50 Lebensjahre verteilt)
    documents: [
      // 2024 (50 Jahre) - Aktuelle Kardiologie-Behandlung
      { id: 'mh1', title: "Belastungs-EKG Kontrolle", category: "Bildgebung", date: "2024-11-22", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh2', title: "Cholesterin-Kontrolle LDL/HDL", category: "Labor", date: "2024-11-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'mh3', title: "24h-Blutdruckmessung Auswertung", category: "Labor", date: "2024-11-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'mh4', title: "Kardiologie-Bericht Quartal 4", category: "Diagnosen", date: "2024-10-05", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Kardiologie"] },
      { id: 'mh5', title: "Grippe-Impfung", category: "Impfungen", date: "2024-10-12", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh6', title: "Medikationsplan aktualisiert", category: "Medikamente", date: "2024-09-20", type: "Medikation", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },
      { id: 'mh7', title: "Herzecho-Untersuchung", category: "Bildgebung", date: "2024-08-15", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh8', title: "Nierenfunktion-Test (Kreatinin)", category: "Labor", date: "2024-07-30", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'mh9', title: "Cholesterin-Kontrolle Q2", category: "Labor", date: "2024-06-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'mh10', title: "Blutdruck-Monitoring Auswertung", category: "Labor", date: "2024-05-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'mh11', title: "Vorsorgeuntersuchung 50+", category: "Vorsorge", date: "2024-04-10", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'mh12', title: "Darmspiegelung (Koloskopie)", category: "Bildgebung", date: "2024-03-15", type: "Endoskopie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'mh13', title: "Cholesterin-Kontrolle Q1", category: "Labor", date: "2024-02-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2023 (49 Jahre)
      { id: 'mh14', title: "Belastungs-EKG Jahres-Check", category: "Bildgebung", date: "2023-11-20", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh15', title: "Grippe-Impfung", category: "Impfungen", date: "2023-10-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh16', title: "Cholesterin-Kontrolle", category: "Labor", date: "2023-08-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'mh17', title: "24h-Blutdruckmessung", category: "Labor", date: "2023-06-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'mh18', title: "Herzecho-Kontrolle", category: "Bildgebung", date: "2023-04-10", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh19', title: "Cholesterin-Kontrolle Q1", category: "Labor", date: "2023-02-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2022 (48 Jahre)
      { id: 'mh20', title: "Belastungs-EKG", category: "Bildgebung", date: "2022-11-10", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh21', title: "Grippe-Impfung", category: "Impfungen", date: "2022-10-05", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh22', title: "Cholesterin-Kontrolle", category: "Labor", date: "2022-07-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'mh23', title: "Blutdruck-Check", category: "Labor", date: "2022-04-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'mh24', title: "COVID-19 Booster 2. Auffrischung", category: "Impfungen", date: "2022-03-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2021 (47 Jahre)
      { id: 'mh25', title: "Cholesterin-Anpassung Medikation", category: "Medikamente", date: "2021-11-15", type: "Rezept", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },
      { id: 'mh26', title: "Herzecho-Untersuchung", category: "Bildgebung", date: "2021-10-20", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh27', title: "COVID-19 Booster", category: "Impfungen", date: "2021-12-05", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh28', title: "COVID-19 Impfung 2. Dosis", category: "Impfungen", date: "2021-07-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh29', title: "COVID-19 Impfung 1. Dosis", category: "Impfungen", date: "2021-06-25", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh30', title: "Cholesterin-Diagnose Hypercholesterinämie", category: "Diagnosen", date: "2021-06-10", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Kardiologie"] },
      { id: 'mh31', title: "Cholesterin-Werte erhöht", category: "Labor", date: "2021-05-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2020 (46 Jahre)
      { id: 'mh32', title: "24h-Blutdruckmessung", category: "Labor", date: "2020-09-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'mh33', title: "Bluthochdruck-Diagnose", category: "Diagnosen", date: "2020-03-15", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Kardiologie"] },
      { id: 'mh34', title: "Ruhe-EKG Erstkontakt Kardiologie", category: "Bildgebung", date: "2020-03-10", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'mh35', title: "Blutdruck-Kontrolle erhöht", category: "Labor", date: "2020-02-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },

      // 2019 (45 Jahre)
      { id: 'mh36', title: "Gesundheits-Check-up 45+", category: "Vorsorge", date: "2019-11-10", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'mh37', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2019-08-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2018 (44 Jahre)
      { id: 'mh38', title: "Blutbild Routine-Check", category: "Labor", date: "2018-09-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },
      { id: 'mh39', title: "Hautkrebsscreening", category: "Vorsorge", date: "2018-06-15", type: "Dermatologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2017 (43 Jahre)
      { id: 'mh40', title: "Gesundheitscheck Betriebsarzt", category: "Vorsorge", date: "2017-10-10", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2016 (42 Jahre)
      { id: 'mh41', title: "Rückenschmerzen Physiotherapie-Verordnung", category: "Diagnosen", date: "2016-11-20", type: "Rezept", status: "aktuell", thumbnail: "report", tags: ["Physiotherapie"] },
      { id: 'mh42', title: "Blutbild Check", category: "Labor", date: "2016-08-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2015 (41 Jahre)
      { id: 'mh43', title: "FSME-Auffrischung", category: "Impfungen", date: "2015-07-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh44', title: "Gesundheits-Check-up 40+", category: "Vorsorge", date: "2015-05-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2014 (40 Jahre)
      { id: 'mh45', title: "Vorsorgeuntersuchung 40 Jahre", category: "Vorsorge", date: "2014-09-10", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2012 (38 Jahre)
      { id: 'mh46', title: "Grippe-Impfung", category: "Impfungen", date: "2012-10-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2010 (36 Jahre)
      { id: 'mh47', title: "FSME-Auffrischung", category: "Impfungen", date: "2010-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh48', title: "Gesundheitscheck", category: "Vorsorge", date: "2010-03-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2009 (35 Jahre)
      { id: 'mh49', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2009-08-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2008 (34 Jahre)
      { id: 'mh50', title: "Sportverletzung Knöchel Röntgen", category: "Bildgebung", date: "2008-07-15", type: "Radiologie", status: "aktuell", thumbnail: "xray", tags: ["Unfall"] },

      // 2005 (31 Jahre)
      { id: 'mh51', title: "Gesundheitscheck 30+", category: "Vorsorge", date: "2005-11-10", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'mh52', title: "FSME-Grundimmunisierung 3. Dosis", category: "Impfungen", date: "2005-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2004 (30 Jahre)
      { id: 'mh53', title: "FSME-Grundimmunisierung 2. Dosis", category: "Impfungen", date: "2004-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh54', title: "FSME-Grundimmunisierung 1. Dosis", category: "Impfungen", date: "2004-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2003 (29 Jahre)
      { id: 'mh55', title: "Hepatitis A+B Impfung (Reise)", category: "Impfungen", date: "2003-08-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung", "Reise"] },

      // 2000 (26 Jahre)
      { id: 'mh56', title: "Blinddarmentzündung OP-Bericht", category: "Diagnosen", date: "2000-11-05", type: "OP-Bericht", status: "aktuell", thumbnail: "report", tags: ["Operation"] },

      // 1999 (25 Jahre)
      { id: 'mh57', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1999-07-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1996 (22 Jahre)
      { id: 'mh58', title: "Sportverletzung Handgelenk", category: "Bildgebung", date: "1996-09-10", type: "Radiologie", status: "aktuell", thumbnail: "xray", tags: ["Unfall"] },

      // 1994 (20 Jahre)
      { id: 'mh59', title: "Gesundheitszeugnis Militärdienst", category: "Vorsorge", date: "1994-08-15", type: "Attest", status: "aktuell", thumbnail: "report", tags: ["Vorsorge"] },
      { id: 'mh60', title: "Blutbild Militärdienst", category: "Labor", date: "1994-08-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 1992 (18 Jahre)
      { id: 'mh61', title: "Gesundheitszeugnis Lehrabschluss", category: "Vorsorge", date: "1992-09-05", type: "Attest", status: "aktuell", thumbnail: "report", tags: ["Vorsorge"] },

      // 1989 (15 Jahre)
      { id: 'mh62', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1989-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1986 (12 Jahre) - Jugenduntersuchung
      { id: 'mh63', title: "J1 Jugendgesundheitsuntersuchung", category: "Vorsorge", date: "1986-09-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["J1"] },

      // 1984 (10 Jahre)
      { id: 'mh64', title: "Mumps-Impfung Nachhol", category: "Impfungen", date: "1984-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1983 (9 Jahre)
      { id: 'mh65', title: "U9 Schuleingangsuntersuchung", category: "Vorsorge", date: "1983-08-20", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U9"] },
      { id: 'mh66', title: "MMR-Impfung 2. Dosis", category: "Impfungen", date: "1983-08-20", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1982 (8 Jahre)
      { id: 'mh67', title: "U8 Untersuchung", category: "Vorsorge", date: "1982-09-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U8"] },
      { id: 'mh68', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1982-06-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1980 (6 Jahre)
      { id: 'mh69', title: "U7 Vorschuluntersuchung", category: "Vorsorge", date: "1980-09-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U7"] },

      // 1978 (4 Jahre)
      { id: 'mh70', title: "Windpocken durchgemacht", category: "Diagnosen", date: "1978-11-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Kinderkrankheit"] },

      // 1977 (3 Jahre)
      { id: 'mh71', title: "U6 Entwicklungsuntersuchung", category: "Vorsorge", date: "1977-06-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U6"] },

      // 1975 (1 Jahr)
      { id: 'mh72', title: "U5 Untersuchung", category: "Vorsorge", date: "1975-06-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U5"] },
      { id: 'mh73', title: "MMR-Impfung 1. Dosis", category: "Impfungen", date: "1975-07-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh74', title: "DPT-Impfung 4. Dosis", category: "Impfungen", date: "1975-08-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1974 (< 1 Jahr) - Geburt & Säugling
      { id: 'mh75', title: "U4 Untersuchung", category: "Vorsorge", date: "1974-12-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U4"] },
      { id: 'mh76', title: "DPT-Impfung 3. Dosis", category: "Impfungen", date: "1974-12-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh77', title: "U3 Untersuchung", category: "Vorsorge", date: "1974-10-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U3"] },
      { id: 'mh78', title: "DPT-Impfung 2. Dosis", category: "Impfungen", date: "1974-10-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh79', title: "U2 Neugeborenenuntersuchung", category: "Vorsorge", date: "1974-08-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U2"] },
      { id: 'mh80', title: "DPT-Impfung 1. Dosis", category: "Impfungen", date: "1974-08-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'mh81', title: "U1 Erstuntersuchung Geburt", category: "Vorsorge", date: "1974-06-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["U1", "Geburt"] }
    ],

    cases: [
      { id: 'mhc1', title: "Arterielle Hypertonie", status: "laufend", startDate: "2020-03-15", category: "Kardiologie", doctor: "Prof. Dr. med. Peter Schneider" },
      { id: 'mhc2', title: "Hypercholesterinämie", status: "laufend", startDate: "2021-06-10", category: "Kardiologie", doctor: "Prof. Dr. med. Peter Schneider" },
      { id: 'mhc3', title: "Vorsorgeuntersuchung 50+", status: "abgeschlossen", startDate: "2024-04-10", endDate: "2024-04-10", category: "Vorsorge", doctor: "Prof. Dr. med. Peter Schneider" }
    ],

    // Visualisierungen - Kardiovaskuläre Risikofaktoren
    healthData: {
      labTrends: {
        hba1c: [],
        cholesterol: [
          { date: 'Jan 24', ldl: 180, hdl: 45, reference: 116 },
          { date: 'Mrz 24', ldl: 175, hdl: 48, reference: 116 },
          { date: 'Mai 24', ldl: 170, hdl: 50, reference: 116 },
          { date: 'Jul 24', ldl: 168, hdl: 52, reference: 116 },
          { date: 'Sep 24', ldl: 152, hdl: 53, reference: 116 },
          { date: 'Nov 24', ldl: 148, hdl: 55, reference: 116 }
        ],
        bloodPressure: [
          { date: 'Jan 24', systolic: 152, diastolic: 95, refSys: 140, refDia: 90 },
          { date: 'Feb 24', systolic: 148, diastolic: 93, refSys: 140, refDia: 90 },
          { date: 'Mrz 24', systolic: 145, diastolic: 92, refSys: 140, refDia: 90 },
          { date: 'Apr 24', systolic: 143, diastolic: 90, refSys: 140, refDia: 90 },
          { date: 'Mai 24', systolic: 142, diastolic: 89, refSys: 140, refDia: 90 },
          { date: 'Jun 24', systolic: 140, diastolic: 88, refSys: 140, refDia: 90 },
          { date: 'Jul 24', systolic: 138, diastolic: 87, refSys: 140, refDia: 90 },
          { date: 'Aug 24', systolic: 141, diastolic: 89, refSys: 140, refDia: 90 },
          { date: 'Sep 24', systolic: 139, diastolic: 88, refSys: 140, refDia: 90 },
          { date: 'Okt 24', systolic: 140, diastolic: 89, refSys: 140, refDia: 90 },
          { date: 'Nov 24', systolic: 138, diastolic: 88, refSys: 140, refDia: 90 }
        ],
        triglycerides: [
          { date: 'Jan 24', value: 195, reference: 150 },
          { date: 'Mrz 24', value: 188, reference: 150 },
          { date: 'Mai 24', value: 180, reference: 150 },
          { date: 'Jul 24', value: 175, reference: 150 },
          { date: 'Sep 24', value: 170, reference: 150 },
          { date: 'Nov 24', value: 165, reference: 150 }
        ]
      },
      currentVitals: [
        { name: 'Blutdruck Sys', value: 138, max: 180, reference: 140, unit: 'mmHg', status: 'good' },
        { name: 'Blutdruck Dia', value: 88, max: 120, reference: 90, unit: 'mmHg', status: 'good' },
        { name: 'LDL-Cholesterin', value: 148, max: 200, reference: 116, unit: 'mg/dl', status: 'warning' },
        { name: 'HDL-Cholesterin', value: 55, max: 100, reference: 40, unit: 'mg/dl', status: 'good' },
        { name: 'Triglyceride', value: 165, max: 250, reference: 150, unit: 'mg/dl', status: 'elevated' }
      ],
      medicationTimeline: [
        {
          name: 'Amlodipin',
          periods: [
            { start: '2020-03', end: '2024-12', dosage: '5mg 1x täglich', active: true }
          ]
        },
        {
          name: 'Atorvastatin',
          periods: [
            { start: '2021-06', end: '2024-12', dosage: '40mg 1x abends', active: true }
          ]
        },
        {
          name: 'Aspirin Cardio',
          periods: [
            { start: '2021-09', end: '2024-12', dosage: '100mg 1x täglich', active: true }
          ]
        }
      ],
      vaccinations: [
        { name: 'Grippe', lastDate: '2024-10-12', nextDue: '2025-10-12', status: 'aktuell', daysUntilDue: 309 },
        { name: 'COVID-19', lastDate: '2024-03-20', nextDue: '2025-03-20', status: 'aktuell', daysUntilDue: 103 },
        { name: 'Tetanus', lastDate: '2022-05-15', nextDue: '2032-05-15', status: 'aktuell', daysUntilDue: 2696 },
        { name: 'Pneumokokken', lastDate: '2024-04-10', nextDue: '2030-04-10', status: 'aktuell', daysUntilDue: 1950 },
        { name: 'Gürtelrose (Herpes Zoster)', lastDate: null, nextDue: '2025-06-01', status: 'empfohlen', daysUntilDue: 176 }
      ]
    },

    // Prävention & Vorsorge - Kardiovaskulär-fokussiert
    preventionData: [
      { name: 'Grippe-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2024-10-12', nextDue: '2025-10-12', daysUntilDue: 309, interval: 'Jährlich', description: 'Jährliche Grippeimpfung bei kardiovaskulären Erkrankungen empfohlen' },
      { name: 'COVID-19 Booster', category: 'Impfungen', status: 'aktuell', lastDate: '2024-03-20', nextDue: '2025-03-20', daysUntilDue: 103, interval: 'Jährlich' },
      { name: 'Tetanus-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2022-05-15', nextDue: '2032-05-15', daysUntilDue: 2696, interval: 'Alle 10 Jahre' },
      { name: 'Pneumokokken-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2024-04-10', nextDue: '2030-04-10', daysUntilDue: 1950, interval: 'Alle 6 Jahre', description: 'Pneumokokken-Impfung zur Prävention von Lungenentzündungen' },
      { name: 'Gürtelrose-Impfung (Herpes Zoster)', category: 'Impfungen', status: 'empfohlen', lastDate: null, nextDue: '2025-06-01', daysUntilDue: 176, interval: 'Einmalig', description: 'Empfohlen für Personen ab 50 Jahren zur Prävention von Gürtelrose' },
      { name: 'Kardio-Check-up', category: 'Vorsorge', status: 'aktuell', lastDate: '2024-11-15', nextDue: '2025-05-15', daysUntilDue: 160, interval: 'Alle 6 Monate', description: 'Kardiologische Kontrolluntersuchung inkl. EKG und Echokardiographie' },
      { name: 'Cholesterin-Kontrolle', category: 'Check-up', status: 'bald_fällig', lastDate: '2024-10-20', nextDue: '2025-01-20', daysUntilDue: 45, interval: 'Alle 3 Monate', description: 'Regelmäßige Cholesterinkontrolle bei Statin-Therapie' },
      { name: 'Blutdruck 24h-Messung', category: 'Screening', status: 'aktuell', lastDate: '2024-09-10', nextDue: '2025-09-10', daysUntilDue: 278, interval: 'Jährlich', description: 'Langzeit-Blutdruckmessung zur Therapiekontrolle' },
      { name: 'Darmkrebs-Screening (Koloskopie)', category: 'Screening', status: 'überfällig', lastDate: '2020-03-15', nextDue: '2024-03-15', daysUntilDue: -265, interval: 'Alle 10 Jahre', description: 'Darmspiegelung zur Krebsvorsorge ab 50 Jahren' },
      { name: 'Hautkrebs-Screening', category: 'Screening', status: 'empfohlen', lastDate: null, nextDue: '2025-06-01', daysUntilDue: 175, interval: 'Alle 2 Jahre', description: 'Dermatologische Vorsorgeuntersuchung' }
    ],

    // Freigaben
    accessGrants: [
      {
        id: 'mg1',
        name: 'Prof. Dr. med. Peter Schneider',
        specialty: 'Innere Medizin & Kardiologie FMH',
        institution: 'Kardiologie Paradeplatz',
        phone: '+41 44 789 01 23',
        isActive: true,
        grantedDate: '2020-03-15',
        expiryDate: null,
        accessLevel: 'Vollzugriff',
        cases: ['Alle Fälle'],
        documentTypes: ['Alle']
      },
      {
        id: 'mg2',
        name: 'Dr. med. Andreas Müller',
        specialty: 'Allgemeine Innere Medizin',
        institution: 'Hausarztpraxis Seefeld',
        phone: '+41 44 333 22 11',
        isActive: true,
        grantedDate: '2019-01-10',
        expiryDate: null,
        accessLevel: 'Vollzugriff',
        cases: ['Alle Fälle'],
        documentTypes: ['Laborberichte', 'Arztbriefe', 'Rezepte']
      },
      {
        id: 'mg3',
        name: 'Labor Zürich Paradeplatz',
        specialty: 'Labormedizin',
        institution: 'Diagnostiklabor',
        phone: '+41 44 555 66 77',
        isActive: true,
        grantedDate: '2020-04-01',
        expiryDate: null,
        accessLevel: 'Eingeschränkt',
        cases: ['Alle Fälle'],
        documentTypes: ['Laborberichte']
      }
    ],

    doctorsFromDocuments: [
      { name: 'Prof. Dr. med. Peter Schneider', specialty: 'Kardiologie', hasAccess: true },
      { name: 'Dr. med. Andreas Müller', specialty: 'Allgemeinmedizin', hasAccess: true },
      { name: 'Labor Zürich Paradeplatz', specialty: 'Labormedizin', hasAccess: true },
      { name: 'Radiologie Seefeld', specialty: 'Radiologie', hasAccess: false }
    ]
  },

  // 4. Elisa Meier - Ältere Dame, 90 Jahre, sympathisch
  'elisa-meier': {
    id: 'elisa-meier',
    name: "Elisa Meier",
    profileImage: "/profiles/elisa-meier.png",
    birthDate: "08.12.1934",
    gender: "Weiblich",
    address: {
      street: "Altersheim Sonnenhof, Zimmer 23",
      city: "8003 Zürich",
      country: "Schweiz"
    },
    email: "elisa.meier@sonnenhof.ch",
    phone: "+41 44 888 99 00",
    ahvNumber: "756.1234.5678.90",
    bloodType: "A-",
    height: "158 cm",
    weight: "58 kg",

    // Persona-spezifische Default-Einstellungen (90 Jahre, chronisch krank, braucht maximale Barrierefreiheit)
    defaultSettings: {
      fontSize: 'sehr-gross',
      highContrast: true,
      language: 'de',
      notifications: {
        email: true,
        push: true,
        appointments: true,
        labResults: true,
        medications: true
      },
      dataSharing: {
        research: false,
        quality: true,
        statistics: false
      },
      twoFactorAuth: false,
      autoLogout: '60'
    },

    insuranceData: {
      healthInsurance: "Swica Versicherung",
      insuranceNumber: "60012345678",
      insuranceType: "Grundversicherung + Pflegeversicherung",
      additionalInsurances: ["Pflegezusatzversicherung"],
      validSince: "01.03.1960"
    },

    primaryDoctor: {
      name: "Dr. med. Julia Zimmermann",
      specialty: "Geriatrie & Innere Medizin FMH",
      phone: "+41 44 777 66 55",
      address: "Altersmedizin Zentrum, Seestrasse 45, 8003 Zürich",
      email: "praxis@zimmermann-geriatrie.ch"
    },

    emergencyContact: {
      name: "Robert Meier",
      relationship: "Sohn",
      phone: "+41 79 666 55 44",
      alternativePhone: "+41 44 333 22 11",
      email: "robert.meier@example.ch"
    },

    allergies: ["Penicillin", "Jod"],
    chronicConditions: ["Arterielle Hypertonie", "Diabetes mellitus Typ 2", "Osteoporose", "Chronische Herzinsuffizienz", "Milde Demenz"],

    criticalValues: [
      { name: "HbA1c (Langzeitzucker)", value: "7.8%", status: "warning", reference: "< 7.5%", date: "18.11.2024" },
      { name: "Blutdruck", value: "145/85 mmHg", status: "elevated", reference: "< 140/90 mmHg", date: "24.11.2024" },
      { name: "Nierenfunktion (eGFR)", value: "42 ml/min", status: "warning", reference: "> 60 ml/min", date: "18.11.2024" },
      { name: "Knochendichte T-Score", value: "-1.0", status: "good", reference: "> -2.5", date: "10.09.2024" }
    ],

    currentMedications: [
      { name: "Metformin", dosage: "500mg", frequency: "2x täglich", indication: "Diabetes Typ 2" },
      { name: "Ramipril", dosage: "5mg", frequency: "1x morgens", indication: "Bluthochdruck" },
      { name: "Furosemid", dosage: "40mg", frequency: "1x morgens", indication: "Herzinsuffizienz" },
      { name: "Calcium + Vitamin D", dosage: "1 Tablette", frequency: "1x täglich", indication: "Osteoporose" },
      { name: "Bisoprolol", dosage: "2.5mg", frequency: "1x täglich", indication: "Herzinsuffizienz" },
      { name: "Pantoprazol", dosage: "20mg", frequency: "1x morgens", indication: "Magenschutz" }
    ],

    upcomingAppointments: [
      { type: "Geriatrie-Kontrolle", doctor: "Dr. Zimmermann", date: "28.11.2024", time: "10:00", source: "Termindokument von Dr. Zimmermann" },
      { type: "Diabetes-Beratung", doctor: "Diabetesberaterin", date: "05.12.2024", time: "14:00", source: "Überweisungsdokument Diabetes" },
      { type: "Physiotherapie", doctor: "Therapeut Müller", date: "29.11.2024", time: "15:00", source: "Verordnung Physiotherapie" }
    ],

    healthGoals: [
      { goal: "HbA1c unter 7.5% halten", status: "in_progress", progress: 65 },
      { goal: "Mobilität erhalten - täglich spazieren", status: "in_progress", progress: 75 },
      { goal: "Sturzprävention", status: "in_progress", progress: 80 }
    ],

    // Dokumente & Fälle - Umfangreiche medizinische Geschichte (120 Dokumente über 90 Lebensjahre)
    documents: [
      // 2024 (90 Jahre) - Intensive geriatrische Betreuung
      { id: 'em1', title: "Geriatrie-Monatskontrolle Nov", category: "Diagnosen", date: "2024-11-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Geriatrie"] },
      { id: 'em2', title: "HbA1c-Kontrolle Diabetes", category: "Labor", date: "2024-11-18", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em3', title: "Nierenfunktion eGFR", category: "Labor", date: "2024-11-18", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Nieren"] },
      { id: 'em4', title: "Medikationsplan aktualisiert", category: "Medikamente", date: "2024-11-15", type: "Medikation", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },
      { id: 'em5', title: "Herzecho Herzinsuffizienz", category: "Bildgebung", date: "2024-10-22", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em6', title: "Grippe-Impfung", category: "Impfungen", date: "2024-10-01", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em7', title: "Blutdruck 24h-Messung", category: "Labor", date: "2024-09-25", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'em8', title: "Knochendichte-Messung DXA", category: "Bildgebung", date: "2024-09-10", type: "Radiologie", status: "aktuell", thumbnail: "checkup", tags: ["Osteoporose"] },
      { id: 'em9', title: "Diabetesberatung Quartalsbericht", category: "Diagnosen", date: "2024-08-15", type: "Bericht", status: "aktuell", thumbnail: "report", tags: ["Diabetes"] },
      { id: 'em10', title: "Sturzrisikoanalyse", category: "Vorsorge", date: "2024-07-30", type: "Geriatrie", status: "aktuell", thumbnail: "checkup", tags: ["Sturz"] },
      { id: 'em11', title: "EKG-Routine-Kontrolle", category: "Bildgebung", date: "2024-07-10", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em12', title: "Augenhintergrund-Check Diabetes", category: "Vorsorge", date: "2024-06-20", type: "Ophthalmologie", status: "aktuell", thumbnail: "checkup", tags: ["Augen"] },
      { id: 'em13', title: "Lungenfunktionstest", category: "Labor", date: "2024-05-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Lunge"] },
      { id: 'em14', title: "HbA1c-Kontrolle Q2", category: "Labor", date: "2024-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em15', title: "Herzinsuffizienz-Kontrolluntersuchung", category: "Diagnosen", date: "2024-04-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Herz"] },
      { id: 'em16', title: "Geriatrisches Assessment", category: "Vorsorge", date: "2024-03-15", type: "Geriatrie", status: "aktuell", thumbnail: "checkup", tags: ["Geriatrie"] },
      { id: 'em17', title: "HbA1c-Kontrolle Q1", category: "Labor", date: "2024-02-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em18', title: "Nierenfunktion-Check", category: "Labor", date: "2024-02-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Nieren"] },

      // 2023 (89 Jahre)
      { id: 'em19', title: "Demenztestung MMSE", category: "Diagnosen", date: "2023-11-20", type: "Neurologie", status: "aktuell", thumbnail: "report", tags: ["Demenz"] },
      { id: 'em20', title: "Grippe-Impfung", category: "Impfungen", date: "2023-10-05", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em21', title: "Pneumokokken-Impfung", category: "Impfungen", date: "2023-09-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em22', title: "HbA1c-Kontrolle", category: "Labor", date: "2023-08-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em23', title: "Herzecho-Kontrolle", category: "Bildgebung", date: "2023-06-15", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em24', title: "Nierenfunktion eGFR", category: "Labor", date: "2023-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Nieren"] },
      { id: 'em25', title: "Diabetesberatung", category: "Diagnosen", date: "2023-03-20", type: "Beratung", status: "aktuell", thumbnail: "report", tags: ["Diabetes"] },

      // 2022 (88 Jahre)
      { id: 'em26', title: "Sturzereignis Dokumentation", category: "Diagnosen", date: "2022-11-05", type: "Notfalldokumentation", status: "aktuell", thumbnail: "report", tags: ["Sturz"] },
      { id: 'em27', title: "Grippe-Impfung", category: "Impfungen", date: "2022-10-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em28', title: "HbA1c-Kontrolle", category: "Labor", date: "2022-08-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em29', title: "COVID-19 Booster 2", category: "Impfungen", date: "2022-05-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em30', title: "Blutdruckkontrolle", category: "Labor", date: "2022-04-20", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },

      // 2021 (87 Jahre)
      { id: 'em31', title: "COVID-19 Booster", category: "Impfungen", date: "2021-12-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em32', title: "Herzinsuffizienz Medikation angepasst", category: "Medikamente", date: "2021-10-20", type: "Rezept", status: "aktuell", thumbnail: "medication", tags: ["Medikamente"] },
      { id: 'em33', title: "COVID-19 Impfung 2. Dosis", category: "Impfungen", date: "2021-07-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em34', title: "COVID-19 Impfung 1. Dosis", category: "Impfungen", date: "2021-06-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em35', title: "HbA1c-Kontrolle", category: "Labor", date: "2021-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em36', title: "Nierenfunktion-Check", category: "Labor", date: "2021-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Nieren"] },

      // 2020 (86 Jahre)
      { id: 'em37', title: "Grippe-Impfung", category: "Impfungen", date: "2020-10-05", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em38', title: "Herzecho-Kontrolle", category: "Bildgebung", date: "2020-08-15", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em39', title: "HbA1c-Kontrolle", category: "Labor", date: "2020-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em40', title: "Geriatrisches Basis-Assessment", category: "Vorsorge", date: "2020-03-15", type: "Geriatrie", status: "aktuell", thumbnail: "checkup", tags: ["Geriatrie"] },

      // 2019 (85 Jahre)
      { id: 'em41', title: "Beginnende Demenz Diagnose", category: "Diagnosen", date: "2019-11-10", type: "Neurologie", status: "aktuell", thumbnail: "report", tags: ["Demenz"] },
      { id: 'em42', title: "Neuropsychologische Testung", category: "Diagnosen", date: "2019-11-05", type: "Neurologie", status: "aktuell", thumbnail: "report", tags: ["Demenz"] },
      { id: 'em43', title: "Grippe-Impfung", category: "Impfungen", date: "2019-10-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em44', title: "HbA1c-Kontrolle", category: "Labor", date: "2019-08-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2018 (84 Jahre)
      { id: 'em45', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2018-09-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em46', title: "Herzinsuffizienz-Kontrolle", category: "Diagnosen", date: "2018-07-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Herz"] },
      { id: 'em47', title: "HbA1c-Kontrolle", category: "Labor", date: "2018-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2017 (83 Jahre)
      { id: 'em48', title: "Grippe-Impfung", category: "Impfungen", date: "2017-10-05", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em49', title: "Knochendichte-Kontrolle", category: "Bildgebung", date: "2017-06-15", type: "Radiologie", status: "aktuell", thumbnail: "checkup", tags: ["Osteoporose"] },
      { id: 'em50', title: "HbA1c-Kontrolle", category: "Labor", date: "2017-04-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2016 (82 Jahre)
      { id: 'em51', title: "Herzecho-Kontrolle", category: "Bildgebung", date: "2016-08-20", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em52', title: "HbA1c-Kontrolle", category: "Labor", date: "2016-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em53', title: "Blutdruckkontrolle", category: "Labor", date: "2016-03-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },

      // 2015 (81 Jahre)
      { id: 'em54', title: "Chronische Herzinsuffizienz Diagnose", category: "Diagnosen", date: "2015-08-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Herz"] },
      { id: 'em55', title: "Herzecho pathologisch", category: "Bildgebung", date: "2015-08-15", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em56', title: "Belastungs-EKG", category: "Bildgebung", date: "2015-07-10", type: "Kardiologie", status: "aktuell", thumbnail: "heart", tags: ["Herz"] },
      { id: 'em57', title: "HbA1c-Kontrolle", category: "Labor", date: "2015-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2014 (80 Jahre)
      { id: 'em58', title: "Grippe-Impfung", category: "Impfungen", date: "2014-10-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em59', title: "HbA1c-Kontrolle", category: "Labor", date: "2014-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em60', title: "Seniorencheck 80+", category: "Vorsorge", date: "2014-03-15", type: "Geriatrie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2013 (79 Jahre)
      { id: 'em61', title: "Knochendichte-Messung", category: "Bildgebung", date: "2013-09-10", type: "Radiologie", status: "aktuell", thumbnail: "checkup", tags: ["Osteoporose"] },
      { id: 'em62', title: "HbA1c-Kontrolle", category: "Labor", date: "2013-05-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2012 (78 Jahre)
      { id: 'em63', title: "Osteoporose Diagnose", category: "Diagnosen", date: "2012-11-05", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Osteoporose"] },
      { id: 'em64', title: "Knochendichte-Messung pathologisch", category: "Bildgebung", date: "2012-10-20", type: "Radiologie", status: "aktuell", thumbnail: "checkup", tags: ["Osteoporose"] },
      { id: 'em65', title: "HbA1c-Kontrolle", category: "Labor", date: "2012-06-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2011 (77 Jahre)
      { id: 'em66', title: "Nierenfunktionsstörung erstmals", category: "Labor", date: "2011-08-15", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Nieren"] },
      { id: 'em67', title: "HbA1c-Kontrolle", category: "Labor", date: "2011-04-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2010 (76 Jahre)
      { id: 'em68', title: "Diabetes mellitus Typ 2 Diagnose", category: "Diagnosen", date: "2010-04-15", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Diabetes"] },
      { id: 'em69', title: "Nüchternblutzucker erhöht", category: "Labor", date: "2010-04-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },
      { id: 'em70', title: "Oraler Glukosetoleranztest", category: "Labor", date: "2010-04-05", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Diabetes"] },

      // 2009 (75 Jahre)
      { id: 'em71', title: "Grippe-Impfung", category: "Impfungen", date: "2009-10-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em72', title: "Seniorencheck 75+", category: "Vorsorge", date: "2009-06-15", type: "Geriatrie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2008 (74 Jahre)
      { id: 'em73', title: "Arterielle Hypertonie Diagnose", category: "Diagnosen", date: "2008-02-10", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Blutdruck"] },
      { id: 'em74', title: "24h-Blutdruckmessung erhöht", category: "Labor", date: "2008-02-05", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Blutdruck"] },
      { id: 'em75', title: "Tetanus-Auffrischung", category: "Impfungen", date: "2008-01-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 2007 (73 Jahre)
      { id: 'em76', title: "Hautkrebs-Screening", category: "Vorsorge", date: "2007-08-20", type: "Dermatologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2005 (71 Jahre)
      { id: 'em77', title: "Seniorencheck 70+", category: "Vorsorge", date: "2005-09-15", type: "Geriatrie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'em78', title: "Darmspiegelung (Koloskopie)", category: "Bildgebung", date: "2005-06-10", type: "Endoskopie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 2004 (70 Jahre)
      { id: 'em79', title: "Gesundheitscheck 70 Jahre", category: "Vorsorge", date: "2004-07-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'em80', title: "Blutbild-Kontrolle", category: "Labor", date: "2004-07-10", type: "Laborbericht", status: "aktuell", thumbnail: "lab", tags: ["Labor"] },

      // 2000 (66 Jahre)
      { id: 'em81', title: "Gesundheitscheck 65+", category: "Vorsorge", date: "2000-08-20", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'em82', title: "Mammographie", category: "Bildgebung", date: "2000-05-15", type: "Radiologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1998 (64 Jahre)
      { id: 'em83', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1998-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1995 (61 Jahre)
      { id: 'em84', title: "Gesundheitscheck 60+", category: "Vorsorge", date: "1995-09-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1990 (56 Jahre)
      { id: 'em85', title: "Mammographie-Screening", category: "Bildgebung", date: "1990-06-20", type: "Radiologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },
      { id: 'em86', title: "Gesundheitscheck", category: "Vorsorge", date: "1990-03-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1988 (54 Jahre)
      { id: 'em87', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1988-07-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1985 (51 Jahre)
      { id: 'em88', title: "Gesundheitscheck 50+", category: "Vorsorge", date: "1985-10-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1982 (48 Jahre)
      { id: 'em89', title: "Blinddarmentzündung OP", category: "Diagnosen", date: "1982-05-20", type: "OP-Bericht", status: "aktuell", thumbnail: "report", tags: ["Operation"] },

      // 1980 (46 Jahre)
      { id: 'em90', title: "Gynäkologische Vorsorge", category: "Vorsorge", date: "1980-09-10", type: "Gynäkologie", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1978 (44 Jahre)
      { id: 'em91', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1978-06-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1975 (41 Jahre)
      { id: 'em92', title: "Gesundheitscheck 40+", category: "Vorsorge", date: "1975-08-20", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1972 (38 Jahre)
      { id: 'em93', title: "Geburt 3. Kind", category: "Diagnosen", date: "1972-11-10", type: "Geburtsbericht", status: "aktuell", thumbnail: "report", tags: ["Geburt"] },

      // 1970 (36 Jahre)
      { id: 'em94', title: "Geburt 2. Kind", category: "Diagnosen", date: "1970-06-15", type: "Geburtsbericht", status: "aktuell", thumbnail: "report", tags: ["Geburt"] },

      // 1968 (34 Jahre)
      { id: 'em95', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1968-07-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },
      { id: 'em96', title: "Geburt 1. Kind", category: "Diagnosen", date: "1968-03-20", type: "Geburtsbericht", status: "aktuell", thumbnail: "report", tags: ["Geburt"] },

      // 1965 (31 Jahre)
      { id: 'em97', title: "Gesundheitscheck 30+", category: "Vorsorge", date: "1965-09-15", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1960 (26 Jahre)
      { id: 'em98', title: "Gesundheitscheck", category: "Vorsorge", date: "1960-08-10", type: "Check-up", status: "aktuell", thumbnail: "checkup", tags: ["Vorsorge"] },

      // 1958 (24 Jahre)
      { id: 'em99', title: "Tetanus-Auffrischung", category: "Impfungen", date: "1958-06-15", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1955 (21 Jahre)
      { id: 'em100', title: "Gesundheitszeugnis Arbeit", category: "Vorsorge", date: "1955-09-10", type: "Attest", status: "aktuell", thumbnail: "report", tags: ["Vorsorge"] },

      // 1952 (18 Jahre)
      { id: 'em101', title: "Gesundheitszeugnis", category: "Vorsorge", date: "1952-08-15", type: "Attest", status: "aktuell", thumbnail: "report", tags: ["Vorsorge"] },

      // 1948 (14 Jahre)
      { id: 'em102', title: "Tetanus-Impfung", category: "Impfungen", date: "1948-06-10", type: "Impfausweis", status: "aktuell", thumbnail: "vaccine", tags: ["Impfung"] },

      // 1946 (12 Jahre)
      { id: 'em103', title: "Schulgesundheitsuntersuchung", category: "Vorsorge", date: "1946-09-15", type: "Schulmedizin", status: "aktuell", thumbnail: "checkup", tags: ["Schule"] },

      // 1943 (9 Jahre)
      { id: 'em104', title: "Schuleingangsuntersuchung", category: "Vorsorge", date: "1943-08-20", type: "Schulmedizin", status: "aktuell", thumbnail: "checkup", tags: ["Schule"] },

      // 1942 (8 Jahre)
      { id: 'em105', title: "Kinderuntersuchung", category: "Vorsorge", date: "1942-06-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["Kindheit"] },

      // 1940 (6 Jahre)
      { id: 'em106', title: "Kinderuntersuchung", category: "Vorsorge", date: "1940-05-15", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["Kindheit"] },

      // 1938 (4 Jahre)
      { id: 'em107', title: "Scharlach durchgemacht", category: "Diagnosen", date: "1938-11-20", type: "Arztbrief", status: "aktuell", thumbnail: "report", tags: ["Kinderkrankheit"] },

      // 1937 (3 Jahre)
      { id: 'em108', title: "Kinderuntersuchung", category: "Vorsorge", date: "1937-06-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["Kindheit"] },

      // 1935 (1 Jahr)
      { id: 'em109', title: "Säuglingsuntersuchung", category: "Vorsorge", date: "1935-06-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["Säugling"] },

      // 1934 (< 1 Jahr) - Geburt
      { id: 'em110', title: "Säuglingsuntersuchung", category: "Vorsorge", date: "1934-12-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["Säugling"] },
      { id: 'em111', title: "Neugeborenenuntersuchung", category: "Vorsorge", date: "1934-08-10", type: "Vorsorge", status: "aktuell", thumbnail: "checkup", tags: ["Geburt"] },
      { id: 'em112', title: "Geburtsbericht", category: "Diagnosen", date: "1934-06-10", type: "Geburtsbericht", status: "aktuell", thumbnail: "report", tags: ["Geburt"] }
    ],

    cases: [
      {
        id: 'emc1',
        title: "Diabetes mellitus Typ 2",
        status: "laufend",
        startDate: "2010-04-15",
        category: "Diabetologie",
        doctor: "Dr. med. Julia Zimmermann"
      },
      {
        id: 'emc2',
        title: "Chronische Herzinsuffizienz",
        status: "laufend",
        startDate: "2015-08-20",
        category: "Kardiologie",
        doctor: "Dr. med. Julia Zimmermann"
      },
      {
        id: 'emc3',
        title: "Arterielle Hypertonie",
        status: "laufend",
        startDate: "2008-02-10",
        category: "Kardiologie",
        doctor: "Dr. med. Julia Zimmermann"
      },
      {
        id: 'emc4',
        title: "Osteoporose",
        status: "laufend",
        startDate: "2012-11-05",
        category: "Rheumatologie",
        doctor: "Dr. med. Julia Zimmermann",
        painDiary: [
          { date: "2024-11-25", time: "09:00", painLevel: 5, location: "Unterer Rücken", notes: "Chronische Rückenschmerzen, morgens verstärkt" },
          { date: "2024-11-24", time: "14:00", painLevel: 4, location: "Unterer Rücken", notes: "Nach leichter Bewegung besser" },
          { date: "2024-11-23", time: "10:30", painLevel: 6, location: "Unterer Rücken, rechte Hüfte", notes: "Wetterumschwung, Schmerzen verschlimmert" },
          { date: "2024-11-22", time: "08:00", painLevel: 5, location: "Unterer Rücken", notes: "Morgensteifigkeit" },
          { date: "2024-11-21", time: "16:00", painLevel: 3, location: "Unterer Rücken", notes: "Nach Physiotherapie Linderung" },
          { date: "2024-11-20", time: "11:00", painLevel: 5, location: "Unterer Rücken", notes: "Konstante Schmerzen" },
          { date: "2024-11-19", time: "09:30", painLevel: 6, location: "Unterer Rücken, beide Hüften", notes: "Schlechte Nacht, kaum geschlafen" },
          { date: "2024-11-18", time: "12:00", painLevel: 4, location: "Unterer Rücken", notes: "Erträglich mit Schmerzmitteln" },
          { date: "2024-11-17", time: "08:00", painLevel: 5, location: "Unterer Rücken", notes: "Wie üblich morgens steif" },
          { date: "2024-11-16", time: "15:00", painLevel: 4, location: "Unterer Rücken", notes: "Nach Ruhe etwas besser" }
        ]
      },
      {
        id: 'emc5',
        title: "Milde Demenz",
        status: "laufend",
        startDate: "2022-06-15",
        category: "Neurologie",
        doctor: "Dr. med. Julia Zimmermann"
      },
      {
        id: 'emc6',
        title: "Sturzprävention & Physiotherapie",
        status: "laufend",
        startDate: "2023-01-10",
        category: "Geriatrie",
        doctor: "Therapeut Müller"
      }
    ],

    // Visualisierungen - Komplexe Multimorbidität
    healthData: {
      labTrends: {
        hba1c: [
          { date: 'Jan 24', value: 7.8, reference: 7.5 },
          { date: 'Mrz 24', value: 7.9, reference: 7.5 },
          { date: 'Mai 24', value: 7.7, reference: 7.5 },
          { date: 'Jul 24', value: 7.8, reference: 7.5 },
          { date: 'Sep 24', value: 7.6, reference: 7.5 },
          { date: 'Nov 24', value: 7.8, reference: 7.5 }
        ],
        cholesterol: [
          { date: 'Jan 24', ldl: 130, hdl: 52, reference: 116 },
          { date: 'Mai 24', ldl: 125, hdl: 54, reference: 116 },
          { date: 'Sep 24', ldl: 120, hdl: 55, reference: 116 }
        ],
        bloodPressure: [
          { date: 'Jan 24', systolic: 150, diastolic: 88, refSys: 140, refDia: 90 },
          { date: 'Feb 24', systolic: 148, diastolic: 87, refSys: 140, refDia: 90 },
          { date: 'Mrz 24', systolic: 146, diastolic: 86, refSys: 140, refDia: 90 },
          { date: 'Apr 24', systolic: 147, diastolic: 87, refSys: 140, refDia: 90 },
          { date: 'Mai 24', systolic: 145, diastolic: 85, refSys: 140, refDia: 90 },
          { date: 'Jun 24', systolic: 144, diastolic: 86, refSys: 140, refDia: 90 },
          { date: 'Jul 24', systolic: 146, diastolic: 87, refSys: 140, refDia: 90 },
          { date: 'Aug 24', systolic: 143, diastolic: 84, refSys: 140, refDia: 90 },
          { date: 'Sep 24', systolic: 144, diastolic: 85, refSys: 140, refDia: 90 },
          { date: 'Okt 24', systolic: 145, diastolic: 86, refSys: 140, refDia: 90 },
          { date: 'Nov 24', systolic: 145, diastolic: 85, refSys: 140, refDia: 90 }
        ],
        kidneyFunction: [
          { date: 'Jan 24', value: 38, reference: 60 },
          { date: 'Mrz 24', value: 40, reference: 60 },
          { date: 'Mai 24', value: 41, reference: 60 },
          { date: 'Jul 24', value: 42, reference: 60 },
          { date: 'Sep 24', value: 43, reference: 60 },
          { date: 'Nov 24', value: 42, reference: 60 }
        ]
      },
      currentVitals: [
        { name: 'HbA1c', value: 7.8, max: 10, reference: 7.5, unit: '%', status: 'warning' },
        { name: 'Blutdruck Sys', value: 145, max: 180, reference: 140, unit: 'mmHg', status: 'elevated' },
        { name: 'Blutdruck Dia', value: 85, max: 120, reference: 90, unit: 'mmHg', status: 'good' },
        { name: 'Nierenfunktion (eGFR)', value: 42, max: 100, reference: 60, unit: 'ml/min', status: 'warning' },
        { name: 'Knochendichte T-Score', value: -1.0, max: 1, reference: -2.5, unit: '', status: 'good' }
      ],
      medicationTimeline: [
        {
          name: 'Ramipril',
          periods: [
            { start: '2008-02', end: '2025-12', dosage: '5mg 1x morgens', active: true }
          ]
        },
        {
          name: 'Metformin',
          periods: [
            { start: '2010-04', end: '2025-12', dosage: '500mg 2x täglich', active: true }
          ]
        },
        {
          name: 'Calcium + Vitamin D',
          periods: [
            { start: '2012-11', end: '2025-12', dosage: '1 Tablette täglich', active: true }
          ]
        },
        {
          name: 'Simvastatin',
          periods: [
            { start: '2013-06', end: '2020-12', dosage: '20mg abends', active: false }
          ]
        },
        {
          name: 'Furosemid',
          periods: [
            { start: '2015-08', end: '2025-12', dosage: '40mg 1x morgens', active: true }
          ]
        },
        {
          name: 'Bisoprolol',
          periods: [
            { start: '2015-08', end: '2025-12', dosage: '2.5mg 1x täglich', active: true }
          ]
        },
        {
          name: 'Pantoprazol',
          periods: [
            { start: '2016-03', end: '2025-12', dosage: '20mg 1x morgens', active: true }
          ]
        },
        {
          name: 'Ibuprofen',
          periods: [
            { start: '2019-02', end: '2020-08', dosage: '400mg bei Bedarf', active: false }
          ]
        },
        {
          name: 'Donepezil',
          periods: [
            { start: '2022-06', end: '2025-12', dosage: '5mg 1x abends', active: true }
          ]
        }
      ],
      vaccinations: [
        { name: 'Grippe', lastDate: '2024-10-01', nextDue: '2025-10-01', status: 'aktuell', daysUntilDue: 298 },
        { name: 'Pneumokokken', lastDate: '2023-09-15', nextDue: '2029-09-15', status: 'aktuell', daysUntilDue: 1744 },
        { name: 'COVID-19', lastDate: '2024-04-10', nextDue: '2025-04-10', status: 'aktuell', daysUntilDue: 124 },
        { name: 'Tetanus/Diphtherie', lastDate: '2020-06-20', nextDue: '2030-06-20', status: 'aktuell', daysUntilDue: 2020 },
        { name: 'Gürtelrose (Herpes Zoster)', lastDate: null, nextDue: '2024-12-31', status: 'empfohlen', daysUntilDue: 24 },
        { name: 'FSME', lastDate: '2018-05-10', nextDue: '2021-05-10', status: 'überfällig', daysUntilDue: -1306 }
      ]
    },

    // Prävention & Vorsorge - Geriatrisch umfangreich
    preventionData: [
      { name: 'Grippe-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2024-10-01', nextDue: '2025-10-01', daysUntilDue: 298, interval: 'Jährlich', description: 'Jährliche Grippeimpfung bei Senioren dringend empfohlen' },
      { name: 'Pneumokokken-Impfung', category: 'Impfungen', status: 'aktuell', lastDate: '2023-09-15', nextDue: '2029-09-15', daysUntilDue: 1744, interval: 'Alle 6 Jahre', description: 'Schutz vor Lungenentzündungen besonders wichtig bei Herzinsuffizienz' },
      { name: 'COVID-19 Booster', category: 'Impfungen', status: 'aktuell', lastDate: '2024-04-10', nextDue: '2025-04-10', daysUntilDue: 124, interval: 'Jährlich' },
      { name: 'Tetanus/Diphtherie', category: 'Impfungen', status: 'aktuell', lastDate: '2020-06-20', nextDue: '2030-06-20', daysUntilDue: 2020, interval: 'Alle 10 Jahre' },
      { name: 'Gürtelrose-Impfung (Herpes Zoster)', category: 'Impfungen', status: 'bald_fällig', lastDate: null, nextDue: '2024-12-31', daysUntilDue: 24, interval: 'Einmalig ab 60', description: 'Wichtige Impfung zur Prävention von Gürtelrose und Post-Zoster-Neuralgie' },
      { name: 'FSME-Auffrischung', category: 'Impfungen', status: 'überfällig', lastDate: '2018-05-10', nextDue: '2021-05-10', daysUntilDue: -1306, interval: 'Alle 3 Jahre', description: 'FSME-Auffrischimpfung überfällig' },
      { name: 'Geriatrie-Kontrolluntersuchung', category: 'Vorsorge', status: 'bald_fällig', lastDate: '2024-11-20', nextDue: '2024-12-20', daysUntilDue: 15, interval: 'Monatlich', description: 'Geriatrische Betreuung mit Vitalzeichen und Medikamentencheck' },
      { name: 'Diabetes-Kontrolle (HbA1c)', category: 'Check-up', status: 'bald_fällig', lastDate: '2024-11-18', nextDue: '2025-02-18', daysUntilDue: 73, interval: 'Alle 3 Monate', description: 'Regelmäßige Diabeteskontrolle zur Therapieanpassung' },
      { name: 'Nierenfunktion (eGFR)', category: 'Check-up', status: 'bald_fällig', lastDate: '2024-11-18', nextDue: '2025-02-18', daysUntilDue: 73, interval: 'Alle 3 Monate', description: 'Engmaschige Kontrolle bei eingeschränkter Nierenfunktion' },
      { name: 'Knochendichte-Messung (DXA)', category: 'Screening', status: 'aktuell', lastDate: '2024-09-10', nextDue: '2026-09-10', daysUntilDue: 643, interval: 'Alle 2 Jahre', description: 'Osteoporose-Screening zur Fraktur-Prävention' },
      { name: 'Augenhintergrund-Untersuchung', category: 'Screening', status: 'empfohlen', lastDate: '2024-06-20', nextDue: '2025-06-20', daysUntilDue: 195, interval: 'Jährlich', description: 'Augenärztliche Kontrolle bei Diabetes zur Früherkennung diabetischer Retinopathie' },
      { name: 'Sturzrisikoanalyse', category: 'Vorsorge', status: 'aktuell', lastDate: '2024-07-30', nextDue: '2025-07-30', daysUntilDue: 235, interval: 'Jährlich', description: 'Geriatrische Sturzpräventionsanalyse mit Physiotherapie-Empfehlungen' },
      { name: 'Herzecho (Echokardiographie)', category: 'Check-up', status: 'aktuell', lastDate: '2024-10-22', nextDue: '2025-04-22', daysUntilDue: 136, interval: 'Alle 6 Monate', description: 'Kontrolle der Herzinsuffizienz mittels Ultraschall' },
      { name: 'EKG-Kontrolle', category: 'Check-up', status: 'aktuell', lastDate: '2024-11-20', nextDue: '2025-05-20', daysUntilDue: 164, interval: 'Alle 6 Monate', description: 'Routinemäßiges EKG bei Herzinsuffizienz' },
      { name: 'Demenz-Screening (Mini-Mental)', category: 'Screening', status: 'aktuell', lastDate: '2024-08-15', nextDue: '2025-02-15', daysUntilDue: 70, interval: 'Alle 6 Monate', description: 'Verlaufskontrolle der kognitiven Fähigkeiten bei milder Demenz' }
    ],

    // Freigaben - Umfangreiches Behandlungsteam
    accessGrants: [
      {
        id: 'eg1',
        name: 'Dr. med. Julia Zimmermann',
        specialty: 'Geriatrie & Innere Medizin FMH',
        institution: 'Altersmedizin Zentrum',
        phone: '+41 44 777 66 55',
        isActive: true,
        grantedDate: '2018-06-15',
        expiryDate: null,
        accessLevel: 'Vollzugriff',
        cases: ['Alle Fälle'],
        documentTypes: ['Alle']
      },
      {
        id: 'eg2',
        name: 'Diabetesberaterin Sarah Meier',
        specialty: 'Diabetesberatung',
        institution: 'Diabeteszentrum Zürich',
        phone: '+41 44 666 55 44',
        isActive: true,
        grantedDate: '2020-03-01',
        expiryDate: null,
        accessLevel: 'Eingeschränkt',
        cases: ['Diabetes mellitus Typ 2'],
        documentTypes: ['Laborberichte', 'Arztbriefe', 'Diabetestagebuch']
      },
      {
        id: 'eg3',
        name: 'Physiotherapeut Thomas Müller',
        specialty: 'Physiotherapie',
        institution: 'Seniorenphysio Zürich',
        phone: '+41 79 555 44 33',
        isActive: true,
        grantedDate: '2023-01-10',
        expiryDate: '2025-12-31',
        accessLevel: 'Eingeschränkt',
        cases: ['Sturzprävention & Physiotherapie'],
        documentTypes: ['Arztbriefe', 'Therapieberichte']
      },
      {
        id: 'eg4',
        name: 'Spitex Zürich',
        specialty: 'Spitex / Pflege',
        institution: 'Spitex Stadt Zürich',
        phone: '+41 44 444 33 22',
        isActive: true,
        grantedDate: '2022-08-01',
        expiryDate: null,
        accessLevel: 'Eingeschränkt',
        cases: ['Alle Fälle'],
        documentTypes: ['Medikationsplan', 'Arztbriefe', 'Pflegeberichte']
      },
      {
        id: 'eg5',
        name: 'Labor Zürich Nord',
        specialty: 'Labormedizin',
        institution: 'Diagnostiklabor',
        phone: '+41 44 333 22 11',
        isActive: true,
        grantedDate: '2019-01-01',
        expiryDate: null,
        accessLevel: 'Eingeschränkt',
        cases: ['Alle Fälle'],
        documentTypes: ['Laborberichte']
      },
      {
        id: 'eg6',
        name: 'Dr. med. Hans Huber',
        specialty: 'Kardiologie',
        institution: 'Herzzentrum Zürich',
        phone: '+41 44 222 11 00',
        isActive: false,
        grantedDate: '2015-08-20',
        expiryDate: '2023-12-31',
        accessLevel: 'Eingeschränkt',
        cases: ['Chronische Herzinsuffizienz'],
        documentTypes: ['Kardiologie', 'Laborberichte']
      }
    ],

    doctorsFromDocuments: [
      { name: 'Dr. med. Julia Zimmermann', specialty: 'Geriatrie', hasAccess: true },
      { name: 'Diabetesberaterin Sarah Meier', specialty: 'Diabetologie', hasAccess: true },
      { name: 'Physiotherapeut Thomas Müller', specialty: 'Physiotherapie', hasAccess: true },
      { name: 'Spitex Zürich', specialty: 'Spitex', hasAccess: true },
      { name: 'Labor Zürich Nord', specialty: 'Labormedizin', hasAccess: true },
      { name: 'Radiologie Altstetten', specialty: 'Radiologie', hasAccess: false },
      { name: 'Apotheke Sonnenhof', specialty: 'Pharmazie', hasAccess: false }
    ]
  }
};
