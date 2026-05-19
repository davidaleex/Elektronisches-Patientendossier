import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import './SecondaryNav.css';

const documentCategories = [
  { label: 'Alle', path: '/dokumente' },
  { label: 'Impfungen', path: '/dokumente?kategorie=impfungen' },
  { label: 'Medikamente', path: '/dokumente?kategorie=medikamente' },
  { label: 'Labor', path: '/dokumente?kategorie=labor' },
  { label: 'Bildgebung', path: '/dokumente?kategorie=bildgebung' },
  { label: 'Diagnosen', path: '/dokumente?kategorie=diagnosen' },
  { label: 'Vorsorge', path: '/dokumente?kategorie=vorsorge' }
];

// Arzt-Sicht hat ein bewusst schlankes Menü: Dashboard (Patientenliste,
// Anfragen) und Upload. Der Drill-Down auf einzelne Patienten passiert
// vom Dashboard aus, ist daher kein Top-Level-Nav-Item.
function DoctorNav() {
  return (
    <nav className="secondary-nav secondary-nav--doctor">
      <div className="secondary-nav-content">
        <NavLink
          to="/arzt"
          end
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/arzt/upload"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Befund hochladen
        </NavLink>
      </div>
    </nav>
  );
}

function PatientNav() {
  const [showDokumenteDropdown, setShowDokumenteDropdown] = useState(false);

  return (
    <nav className="secondary-nav">
      <div className="secondary-nav-content">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Home
        </NavLink>
        <NavLink
          to="/faelle"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Fälle
        </NavLink>
        <div
          className="nav-item-wrapper"
          onMouseEnter={() => setShowDokumenteDropdown(true)}
          onMouseLeave={() => setShowDokumenteDropdown(false)}
        >
          <NavLink
            to="/dokumente"
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            Dokumente
          </NavLink>
          {showDokumenteDropdown && (
            <div className="dokumente-dropdown">
              {documentCategories.map((cat) => (
                <NavLink
                  key={cat.label}
                  to={cat.path}
                  className="dropdown-item"
                >
                  {cat.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <NavLink
          to="/labor"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Labor
        </NavLink>
        <NavLink
          to="/praevention"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Prävention
        </NavLink>
        <NavLink
          to="/freigaben"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          Freigaben
        </NavLink>
      </div>
    </nav>
  );
}

// Switch nach Rolle — Arzt und Patient teilen sich das gleiche
// Layout, aber unterschiedliche Top-Level-Items.
function SecondaryNav() {
  const { currentRole } = useUser();
  return currentRole === 'doctor' ? <DoctorNav /> : <PatientNav />;
}

export default SecondaryNav;
