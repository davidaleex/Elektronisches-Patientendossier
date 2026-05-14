import { FaTimes, FaComments, FaPhone, FaRobot } from 'react-icons/fa';
import './HelpSidebar.css';

function HelpSidebar({ onClose }) {
  return (
    <>
      <div className="help-overlay" onClick={onClose}></div>
      <div className="help-sidebar">
        <div className="help-header">
          <h2>Hilfe & Support</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="help-content">
          <div className="help-option">
            <FaComments className="help-icon" />
            <div>
              <h3>Chat Support</h3>
              <p>Chatten Sie mit unserem Support-Team</p>
              <button className="help-action-btn">Chat starten</button>
            </div>
          </div>

          <div className="help-option">
            <FaPhone className="help-icon" />
            <div>
              <h3>Telefon Support</h3>
              <p>Rufen Sie uns direkt an</p>
              <button className="help-action-btn">+41 XX XXX XX XX</button>
            </div>
          </div>

          <div className="help-option">
            <FaRobot className="help-icon" />
            <div>
              <h3>KI-Assistent</h3>
              <p>Schnelle Hilfe durch unseren Chatbot</p>
              <button className="help-action-btn">KI-Chat öffnen</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HelpSidebar;
