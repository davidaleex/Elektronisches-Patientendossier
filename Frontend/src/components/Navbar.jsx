import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaQuestion, FaCog, FaSearch, FaUser, FaChevronDown, FaUserMd } from 'react-icons/fa';
import HelpSidebar from './HelpSidebar';
import { useUser } from '../context/UserContext';
import './Navbar.css';

function Navbar() {
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { currentUser, switchUser, getAllUsers } = useUser();
  const navigate = useNavigate();
  const allUsers = getAllUsers();

  const handleUserSwitch = (userId) => {
    switchUser(userId);
    setShowProfileDropdown(false);
  };

  const handleProfileView = () => {
    navigate('/profile');
    setShowProfileDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo / EPD Text */}
        <div className="navbar-logo">
          <h1>EPD</h1>
        </div>

        {/* Suchfeld */}
        <div className="navbar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="KI-Suche in der gesamten App..."
            className="search-input"
          />
        </div>

        {/* Rechte Icons */}
        <div className="navbar-actions">
          <button
            className="navbar-icon-btn"
            title="Einstellungen"
          >
            <Link to="/einstellungen">
              <FaCog />
            </Link>
          </button>

          <button
            className="navbar-icon-btn"
            title="Hilfe"
            onClick={() => setShowHelp(!showHelp)}
          >
            <FaQuestion />
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container">
            <button
              className="profile-btn-dropdown"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              title="Profil & Account wechseln"
            >
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="profile-avatar"
              />
              <span className="profile-name">{currentUser.name}</span>
              <FaChevronDown className="dropdown-arrow" />
            </button>

            {showProfileDropdown && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <div className="current-user-info">
                    <img src={currentUser.profileImage} alt={currentUser.name} className="dropdown-avatar" />
                    <div>
                      <div className="dropdown-user-name">{currentUser.name}</div>
                      <div className="dropdown-user-email">{currentUser.email}</div>
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item profile-view" onClick={handleProfileView}>
                  <FaUser />
                  <span>Profil anzeigen</span>
                </button>

                <div className="dropdown-divider"></div>

                <div className="dropdown-section-title">Account wechseln</div>

                {allUsers.map(user => {
                  const isDoctor = user.role === 'doctor';
                  // Patient zeigt Geschlecht + Alter, Arzt zeigt Fachgebiet — beides aus role abgeleitet.
                  const subtitle = isDoctor
                    ? user.specialty
                    : `${user.gender}, ${new Date().getFullYear() - parseInt(user.birthDate.split('.')[2])} Jahre`;
                  return (
                    <button
                      key={user.id}
                      className={`dropdown-item user-switch ${user.id === currentUser.id ? 'active' : ''}`}
                      onClick={() => handleUserSwitch(user.id)}
                    >
                      <img src={user.profileImage} alt={user.name} className="user-switch-avatar" />
                      <div className="user-switch-info">
                        <div className="user-switch-name">
                          {user.name}
                          {isDoctor && <FaUserMd className="role-badge" title="Arzt" />}
                        </div>
                        <div className="user-switch-age">{subtitle}</div>
                      </div>
                      {user.id === currentUser.id && <span className="active-badge">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Sidebar */}
      {showHelp && <HelpSidebar onClose={() => setShowHelp(false)} />}

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="dropdown-backdrop"
          onClick={() => setShowProfileDropdown(false)}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;
