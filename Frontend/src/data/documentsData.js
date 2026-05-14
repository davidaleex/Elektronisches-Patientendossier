// Mock-Daten für EPD-Dokumente

export const documents = [
  {
    id: 1,
    title: "Blutbild vom 15.11.2024",
    category: "Labor",
    date: "2024-11-15",
    type: "Laborbericht",
    status: "aktuell",
    thumbnail: "lab",
    tags: ["Labor", "Blut"]
  },
  {
    id: 2,
    title: "Grippe-Impfung 2024",
    category: "Impfungen",
    date: "2024-10-20",
    type: "Impfausweis",
    status: "aktuell",
    thumbnail: "vaccine",
    tags: ["Impfung", "Prävention"]
  },
  {
    id: 3,
    title: "MRT Kopf - Befundbericht",
    category: "Bildgebung",
    date: "2024-09-05",
    type: "Radiologie",
    status: "aktuell",
    thumbnail: "mri",
    tags: ["Bildgebung", "MRT"]
  },
  {
    id: 4,
    title: "Diabetes Verlaufskontrolle",
    category: "Diagnosen",
    date: "2024-08-12",
    type: "Arztbrief",
    status: "aktuell",
    thumbnail: "report",
    tags: ["Diagnose", "Diabetes"]
  },
  {
    id: 5,
    title: "Medikationsplan",
    category: "Medikamente",
    date: "2024-07-30",
    type: "Medikation",
    status: "aktuell",
    thumbnail: "medication",
    tags: ["Medikamente"]
  },
  {
    id: 6,
    title: "Herzecho-Untersuchung",
    category: "Bildgebung",
    date: "2024-06-18",
    type: "Kardiologie",
    status: "vergangen",
    thumbnail: "heart",
    tags: ["Bildgebung", "Herz"]
  },
  {
    id: 7,
    title: "Blutdruckmessung 24h",
    category: "Labor",
    date: "2024-05-22",
    type: "Laborbericht",
    status: "vergangen",
    thumbnail: "bp",
    tags: ["Labor", "Blutdruck"]
  },
  {
    id: 8,
    title: "COVID-19 Impfung Booster",
    category: "Impfungen",
    date: "2024-03-10",
    type: "Impfausweis",
    status: "vergangen",
    thumbnail: "vaccine",
    tags: ["Impfung"]
  },
  {
    id: 9,
    title: "Vorsorgeuntersuchung Check-up 45+",
    category: "Vorsorge",
    date: "2025-01-15",
    type: "Termin",
    status: "geplant",
    thumbnail: "checkup",
    tags: ["Vorsorge", "Termin"]
  }
];

export const statusOptions = [
  { value: "alle", label: "Alle" },
  { value: "aktuell", label: "Aktuell" },
  { value: "geplant", label: "Geplant" },
  { value: "vergangen", label: "Vergangen" },
  { value: "favoriten", label: "Favoriten" }
];

export const sortOptions = [
  { value: "date-desc", label: "Sortiert nach Datum (neueste zuerst)" },
  { value: "date-asc", label: "Sortiert nach Datum (älteste zuerst)" },
  { value: "title", label: "Sortiert nach Titel" },
  { value: "category", label: "Sortiert nach Kategorie" }
];
