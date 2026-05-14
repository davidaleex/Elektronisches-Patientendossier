# EPD Frontend

Ein modernes **Elektronisches Patienten-Dossier (EPD)** Frontend, entwickelt mit React und Vite. Diese Anwendung demonstriert ein vollständiges Patient:innen-Portal mit Multi-User-Unterstützung, Dokumentenverwaltung, Gesundheitsdaten-Visualisierung und Barrierefreiheit.

## Features

### Kernfunktionalität
- **Multi-User-System** mit 4 verschiedenen Patienten-Personas
- **Dokumentenverwaltung** mit Such-, Filter- und Sortierfunktionen
- **Fallverwaltung** mit Timeline-Ansicht und Statusverfolgung
- **Gesundheitsdaten-Visualisierung** mit interaktiven Charts (Recharts)
- **Prävention-Dashboard** mit personalisierten Gesundheitsempfehlungen
- **Notfall-QR-Code** für schnellen Zugriff auf wichtige Gesundheitsinformationen
- **Freigabenverwaltung** für Gesundheitsfachpersonen
- **Barrierefreiheit** mit Schriftgrössen- und Farbschema-Anpassungen

### Patienten-Personas

Das System verfügt über 4 vordefinierte Benutzerprofile:

1. **Luca Frei** (20 Jahre, sportlich)
   - Fokus: Sportmedizin, Physiotherapie
   - Wenige Dokumente, gesunde Vitaldaten

2. **Nina Baumann** (30 Jahre, schwanger)
   - Fokus: Schwangerschaftsbegleitung
   - Tracking von Eisen, Gewicht, Blutdruck

3. **Markus Huber** (50 Jahre, Geschäftsmann)
   - Fokus: Kardiologie, Prävention
   - Cholesterin-, Blutdruck- und Triglyceride-Monitoring

4. **Elisa Meier** (90 Jahre, chronisch krank)
   - Fokus: Geriatrie, Multimorbidität
   - Umfangreiche Dokumentation und Medikation

## Voraussetzungen

Bevor du startest, stelle sicher, dass folgende Software installiert ist:

- **Node.js** (Version 18 oder höher)
- **npm** (wird mit Node.js mitgeliefert)

Du kannst die Installation überprüfen mit:
```bash
node --version
npm --version
```

## Installation

1. **Repository klonen** (falls noch nicht geschehen):
   ```bash
   git clone <repository-url>
   cd epd-frontend
   ```

2. **Dependencies installieren**:
   ```bash
   npm install
   ```

   Dies installiert alle benötigten Pakete:
   - React 19.2.0
   - React Router DOM
   - Recharts (für Charts)
   - QRCode.react (für QR-Codes)
   - React Icons
   - Vite (Build-Tool)

## Development Server starten

Um den Vite Development Server zu starten:

```bash
npm run dev
```

Die Anwendung ist dann verfügbar unter:
```
http://localhost:5173
```

Der Dev-Server bietet:
- Hot Module Replacement (HMR) für sofortiges Feedback bei Code-Änderungen
- Schnelle Kompilierung
- Detaillierte Fehlermeldungen

## Verfügbare Scripts

```bash
# Development Server starten
npm run dev

# Production Build erstellen
npm run build

# Production Build lokal testen
npm run preview

# Code mit ESLint überprüfen
npm run lint
```

## Projektstruktur

```
epd-frontend/
├── src/
│   ├── components/          # Wiederverwendbare Komponenten
│   │   ├── Documents/       # Dokumenten-spezifische Komponenten
│   │   ├── Navbar.jsx       # Hauptnavigation
│   │   ├── SecondaryNav.jsx # Sekundäre Navigation
│   │   └── HelpSidebar.jsx  # Hilfe-Sidebar
│   ├── pages/               # Seiten-Komponenten
│   │   ├── Home.jsx         # Dashboard
│   │   ├── Dokumente.jsx    # Dokumentenverwaltung
│   │   ├── Faelle.jsx       # Fallverwaltung
│   │   ├── Labor.jsx        # Laborwerte
│   │   ├── Praevention.jsx  # Prävention & Gesundheitsempfehlungen
│   │   ├── Notfall.jsx      # Notfall-QR-Code
│   │   ├── Freigaben.jsx    # Freigabenverwaltung
│   │   ├── Profile.jsx      # Benutzerprofil
│   │   └── Einstellungen.jsx # Einstellungen & Barrierefreiheit
│   ├── context/             # React Context
│   │   └── UserContext.jsx  # User State Management
│   ├── data/                # Mock-Daten
│   │   └── usersData.js     # Persona-Daten
│   ├── App.jsx              # Haupt-App-Komponente
│   ├── main.jsx             # Entry Point
│   └── index.css            # Globale Styles
├── public/                  # Statische Assets
├── package.json
├── vite.config.js           # Vite Konfiguration
└── README.md
```

## Technologie-Stack

- **React 19.2.0** - UI Framework
- **Vite 7.2.4** - Build Tool & Dev Server
- **React Router DOM 7.9.6** - Client-Side Routing
- **Recharts 3.5.1** - Datenvisualisierung
- **QRCode.react 4.2.0** - QR-Code Generierung
- **React Icons 5.5.0** - Icon-Library

## Features im Detail

### Dokumentenverwaltung
- Grid- und Listen-Ansicht
- Such- und Filterfunktion nach Typ, Datum und Autor
- Sortierung nach verschiedenen Kriterien
- Direkter Download von Dokumenten

### Visualisierungen
- Persona-spezifische Gesundheitstrends
- Interaktive Line- und Bar-Charts
- HbA1c-Tracking für Diabetes-Patient:innen
- Cholesterin-, Blutdruck- und weitere Vitalwerte

### Barrierefreiheit
- Anpassbare Schriftgrösse (Klein, Normal, Gross, Sehr Gross)
- Farbschema-Optionen (Standard, Hoher Kontrast, Dunkel)
- Responsive Design für alle Bildschirmgrössen
- Rem-basierte Einheiten für bessere Skalierung

### Prävention
- Personalisierte Gesundheitsempfehlungen
- Automatische Status-Berechnung (Offen, In Bearbeitung, Erledigt)
- Eingabeformulare für Präventionsmassnahmen
- Visualisierung des Präventionsstatus

## Browser-Unterstützung

Die Anwendung unterstützt alle modernen Browser:
- Chrome/Edge (neueste 2 Versionen)
- Firefox (neueste 2 Versionen)
- Safari (neueste 2 Versionen)

## Lizenz

Dieses Projekt ist ein Prototyp/Demo-Projekt.

## Kontakt

Bei Fragen oder Problemen, bitte ein Issue im Repository erstellen.
