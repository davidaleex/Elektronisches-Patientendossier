// Probe-Dokumente für jede User-Persona zum simulierten Upload
// Jeder User hat 3 spezifische Probe-Dokumente

export const sampleDocuments = {
  'luca-frei': [
    {
      title: "Trainingsplan Wettkampfvorbereitung",
      category: "Vorsorge",
      date: "2024-12-07",
      type: "Therapiebericht",
      status: "aktuell",
      thumbnail: "report",
      tags: ["Sport", "Training"],
      description: "Personalisierter Trainingsplan für Marathon"
    },
    {
      title: "Ernährungsberatung Sportler",
      category: "Diagnosen",
      date: "2024-12-05",
      type: "Arztbrief",
      status: "aktuell",
      thumbnail: "report",
      tags: ["Ernährung", "Sport"],
      description: "Ernährungsempfehlungen für Ausdauersportler"
    },
    {
      title: "Laktat-Test Ergebnisse",
      category: "Labor",
      date: "2024-12-03",
      type: "Laborbericht",
      status: "aktuell",
      thumbnail: "lab",
      tags: ["Labor", "Sport", "Leistungsdiagnostik"],
      description: "Laktat-Stufentest zur Trainingssteuerung"
    }
  ],

  'nina-baumann': [
    {
      title: "Ultraschall 32. SSW",
      category: "Bildgebung",
      date: "2024-12-06",
      type: "Ultraschall",
      status: "aktuell",
      thumbnail: "mri",
      tags: ["Schwangerschaft", "Ultraschall"],
      description: "Ultraschalluntersuchung 32. Schwangerschaftswoche"
    },
    {
      title: "Geburtsvorbereitungskurs Zertifikat",
      category: "Vorsorge",
      date: "2024-12-04",
      type: "Zertifikat",
      status: "aktuell",
      thumbnail: "checkup",
      tags: ["Schwangerschaft", "Geburtsvorbereitung"],
      description: "Teilnahmebestätigung Geburtsvorbereitungskurs"
    },
    {
      title: "Glukosetoleranztest (oGTT)",
      category: "Labor",
      date: "2024-12-01",
      type: "Laborbericht",
      status: "aktuell",
      thumbnail: "lab",
      tags: ["Labor", "Schwangerschaft", "Diabetes"],
      description: "Oraler Glukosetoleranztest - Schwangerschaftsdiabetes-Screening"
    }
  ],

  'markus-huber': [
    {
      title: "Belastungs-EKG Kontrolle",
      category: "Bildgebung",
      date: "2024-12-06",
      type: "Kardiologie",
      status: "aktuell",
      thumbnail: "heart",
      tags: ["Herz", "EKG", "Kardiologie"],
      description: "Belastungs-Elektrokardiogramm zur Herz-Kreislauf-Diagnostik"
    },
    {
      title: "Lipidprofil Verlaufskontrolle",
      category: "Labor",
      date: "2024-12-04",
      type: "Laborbericht",
      status: "aktuell",
      thumbnail: "lab",
      tags: ["Labor", "Cholesterin", "Herz"],
      description: "Cholesterin- und Lipidwerte Kontrolle unter Statin-Therapie"
    },
    {
      title: "Ernährungsberatung Herzgesundheit",
      category: "Diagnosen",
      date: "2024-12-02",
      type: "Therapiebericht",
      status: "aktuell",
      thumbnail: "report",
      tags: ["Ernährung", "Herz", "Prävention"],
      description: "Individuelle Ernährungsberatung zur Cholesterinsenkung"
    }
  ],

  'elisa-meier': [
    {
      title: "Medikationsplan aktualisiert Dezember",
      category: "Medikamente",
      date: "2024-12-07",
      type: "Medikation",
      status: "aktuell",
      thumbnail: "medication",
      tags: ["Medikamente", "Geriatrie"],
      description: "Aktualisierter Medikationsplan mit Dosisanpassungen"
    },
    {
      title: "Sturzrisikoanalyse Follow-up",
      category: "Vorsorge",
      date: "2024-12-05",
      type: "Geriatrie",
      status: "aktuell",
      thumbnail: "checkup",
      tags: ["Sturzprävention", "Geriatrie"],
      description: "Verlaufskontrolle Sturzrisiko und Präventionsmaßnahmen"
    },
    {
      title: "HbA1c Langzeitkontrolle",
      category: "Labor",
      date: "2024-12-03",
      type: "Laborbericht",
      status: "aktuell",
      thumbnail: "lab",
      tags: ["Labor", "Diabetes", "HbA1c"],
      description: "Langzeitzuckerwert-Kontrolle bei Diabetes mellitus Typ 2"
    }
  ]
};

// Hilfsfunktion: Automatische Kategoriezuweisung basierend auf Schlüsselwörtern
export const detectDocumentCategory = (title) => {
  const lowercaseTitle = title.toLowerCase();

  if (lowercaseTitle.includes('labor') || lowercaseTitle.includes('blut') || lowercaseTitle.includes('hba1c')) {
    return 'Labor';
  }
  if (lowercaseTitle.includes('ultraschall') || lowercaseTitle.includes('mrt') || lowercaseTitle.includes('röntgen') || lowercaseTitle.includes('ekg')) {
    return 'Bildgebung';
  }
  if (lowercaseTitle.includes('medikament') || lowercaseTitle.includes('rezept')) {
    return 'Medikamente';
  }
  if (lowercaseTitle.includes('impf')) {
    return 'Impfungen';
  }
  if (lowercaseTitle.includes('bericht') || lowercaseTitle.includes('diagnose') || lowercaseTitle.includes('arztbrief')) {
    return 'Diagnosen';
  }

  return 'Vorsorge'; // Default
};

// Hilfsfunktion: Automatisches Datum (heute)
export const getDefaultDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
