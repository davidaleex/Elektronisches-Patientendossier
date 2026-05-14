import { useState } from 'react';
import { FaEllipsisV, FaFileAlt, FaSyringe, FaXRay, FaFileMedical, FaPills, FaHeartbeat, FaTint, FaStethoscope, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import './DocumentViews.css';

const getThumbnailIcon = (thumbnail) => {
  const icons = {
    lab: <FaTint />,
    vaccine: <FaSyringe />,
    mri: <FaXRay />,
    report: <FaFileMedical />,
    medication: <FaPills />,
    heart: <FaHeartbeat />,
    bp: <FaHeartbeat />,
    checkup: <FaStethoscope />
  };
  return icons[thumbnail] || <FaFileAlt />;
};

const getThumbnailColor = (category) => {
  const colors = {
    'Labor': '#4285f4',
    'Impfungen': '#34a853',
    'Bildgebung': '#fbbc04',
    'Diagnosen': '#ea4335',
    'Medikamente': '#ff6600',
    'Vorsorge': '#9c27b0'
  };
  return colors[category] || '#666';
};

export default function DocumentListView({ documents }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (doc, e) => {
    e.stopPropagation();
    console.log('Anschauen:', doc);
    setOpenMenuId(null);
  };

  const handleEdit = (doc, e) => {
    e.stopPropagation();
    console.log('Bearbeiten:', doc);
    setOpenMenuId(null);
  };

  const handleDelete = (doc, e) => {
    e.stopPropagation();
    console.log('Löschen:', doc);
    setOpenMenuId(null);
  };

  return (
    <div className="document-list-view">
      {documents.map(doc => (
        <div key={doc.id} className="document-list-item">
          <div
            className="document-thumbnail"
            style={{ backgroundColor: getThumbnailColor(doc.category) }}
          >
            {getThumbnailIcon(doc.thumbnail)}
          </div>
          <div className="document-info">
            <h3 className="document-title">{doc.title}</h3>
            <p className="document-meta">{doc.category}</p>
            {doc.date && <p className="document-date">{new Date(doc.date).toLocaleDateString('de-DE')}</p>}
          </div>
          <div className="document-menu-wrapper">
            <button
              className="document-menu-btn"
              onClick={(e) => toggleMenu(doc.id, e)}
            >
              <FaEllipsisV />
            </button>
            {openMenuId === doc.id && (
              <div className="document-dropdown-menu">
                <button onClick={(e) => handleView(doc, e)}>
                  <FaEye /> Anschauen
                </button>
                <button onClick={(e) => handleEdit(doc, e)}>
                  <FaEdit /> Bearbeiten
                </button>
                <button onClick={(e) => handleDelete(doc, e)} className="delete-option">
                  <FaTrash /> Löschen
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
