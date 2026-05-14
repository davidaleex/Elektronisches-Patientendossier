import { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { FaPlus, FaFolderOpen, FaCalendarAlt, FaUserMd, FaEllipsisV, FaEdit, FaTrash, FaFileAlt, FaHeartbeat, FaChartLine, FaSearch, FaTimes } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Faelle.css';

function Faelle() {
  const { currentUser, addCase, updateCase, deleteCase, addPainDiaryEntry, deletePainDiaryEntry } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewCase, setViewCase] = useState(null);
  const [editCase, setEditCase] = useState(null);
  const [painDiaryCase, setPainDiaryCase] = useState(null);

  // Modal State für neuen Fall
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState('');
  const [newCaseDoctor, setNewCaseDoctor] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Schmerztagebuch State
  const [showAddPainEntry, setShowAddPainEntry] = useState(false);
  const [painDate, setPainDate] = useState('');
  const [painTime, setPainTime] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [painLocation, setPainLocation] = useState('');
  const [painNotes, setPainNotes] = useState('');

  const categories = [
    'Orthopädie',
    'Kardiologie',
    'Gynäkologie',
    'Allgemeinmedizin',
    'Dermatologie',
    'Neurologie',
    'Diabetologie',
    'Geriatrie',
    'Vorsorge',
    'Sonstiges'
  ];

  const handleAddCase = () => {
    setShowAddModal(true);
    setNewCaseTitle('');
    setNewCaseCategory('');
    setNewCaseDoctor(currentUser.primaryDoctor.name);
    setSelectedDocuments([]);
  };

  const handleSaveCase = () => {
    const newCase = {
      id: `case-${Date.now()}`,
      title: newCaseTitle,
      category: newCaseCategory,
      doctor: newCaseDoctor,
      status: 'laufend',
      startDate: new Date().toISOString().split('T')[0],
      painDiary: []
    };
    addCase(newCase);
    setShowAddModal(false);
  };

  const toggleMenu = (caseId) => {
    setOpenMenuId(openMenuId === caseId ? null : caseId);
  };

  const handleView = (caseItem) => {
    setViewCase(caseItem);
    setOpenMenuId(null);
  };

  const handleEdit = (caseItem) => {
    setEditCase(caseItem);
    setOpenMenuId(null);
  };

  const handleDelete = (caseId) => {
    if (window.confirm('Fall wirklich löschen?')) {
      deleteCase(caseId);
      setOpenMenuId(null);
    }
  };

  const handleOpenPainDiary = (caseItem) => {
    setPainDiaryCase(caseItem);
    setOpenMenuId(null);
  };

  const handleAddPainEntry = () => {
    setShowAddPainEntry(true);
    const today = new Date();
    setPainDate(today.toISOString().split('T')[0]);
    setPainTime(today.toTimeString().slice(0, 5));
    setPainLevel(5);
    setPainLocation(painDiaryCase?.title || '');
    setPainNotes('');
  };

  const handleSavePainEntry = () => {
    const newEntry = {
      date: painDate,
      time: painTime,
      painLevel,
      location: painLocation,
      notes: painNotes
    };
    addPainDiaryEntry(painDiaryCase.id, newEntry);

    // Update local painDiaryCase state to reflect new entry
    setPainDiaryCase({
      ...painDiaryCase,
      painDiary: [newEntry, ...(painDiaryCase.painDiary || [])]
    });

    setShowAddPainEntry(false);
  };

  const getPainLevelColor = (level) => {
    if (level <= 2) return '#27ae60';
    if (level <= 4) return '#f39c12';
    if (level <= 6) return '#e67e22';
    return '#e74c3c';
  };

  const getPainLevelLabel = (level) => {
    if (level <= 2) return 'Leicht';
    if (level <= 4) return 'Mäßig';
    if (level <= 6) return 'Stark';
    return 'Sehr stark';
  };

  const toggleDocumentSelection = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'laufend': return '#3498db';
      case 'abgeschlossen': return '#27ae60';
      case 'pausiert': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'laufend': return 'Laufend';
      case 'abgeschlossen': return 'Abgeschlossen';
      case 'pausiert': return 'Pausiert';
      default: return status;
    }
  };

  // Fälle des aktuellen Users - gefiltert nach Suchbegriff
  const cases = useMemo(() => {
    let userCases = currentUser.cases || [];

    // Filter nach Suchbegriff
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      userCases = userCases.filter(caseItem =>
        caseItem.title.toLowerCase().includes(query) ||
        caseItem.category.toLowerCase().includes(query) ||
        caseItem.doctor.toLowerCase().includes(query) ||
        caseItem.status.toLowerCase().includes(query)
      );
    }

    return userCases;
  }, [currentUser, searchQuery]);

  // Statistiken berechnen
  const stats = {
    total: cases.length,
    laufend: cases.filter(c => c.status === 'laufend').length,
    abgeschlossen: cases.filter(c => c.status === 'abgeschlossen').length,
    pausiert: cases.filter(c => c.status === 'pausiert').length,
  };

  return (
    <div className="faelle-container">
      <div className="faelle-header">
        <div>
          <h1>Fälle</h1>
          <p className="faelle-subtitle">Ihre medizinischen Fälle und Behandlungsverläufe</p>
        </div>
        <button className="add-fall-btn" onClick={handleAddCase}>
          <FaPlus /> Fall erstellen
        </button>
      </div>

      {/* Suchleiste */}
      <div className="search-bar-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Fälle durchsuchen (Titel, Kategorie, Arzt, Status)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {cases.length > 0 && (
        <div className="faelle-summary">
          <div className="summary-card">
            <div className="summary-icon total">
              <FaFolderOpen />
            </div>
            <div className="summary-content">
              <div className="summary-value">{stats.total}</div>
              <div className="summary-label">Gesamt</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon laufend">
              <FaCalendarAlt />
            </div>
            <div className="summary-content">
              <div className="summary-value">{stats.laufend}</div>
              <div className="summary-label">Laufend</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon abgeschlossen">
              <FaCalendarAlt />
            </div>
            <div className="summary-content">
              <div className="summary-value">{stats.abgeschlossen}</div>
              <div className="summary-label">Abgeschlossen</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon pausiert">
              <FaCalendarAlt />
            </div>
            <div className="summary-content">
              <div className="summary-value">{stats.pausiert}</div>
              <div className="summary-label">Pausiert</div>
            </div>
          </div>
        </div>
      )}

      {/* Fälle Grid */}
      <div className="cases-grid">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="case-card">
            <div className="case-header">
              <div className="case-icon">
                <FaFolderOpen />
              </div>
              <div className="case-menu-container">
                <button
                  className="case-menu-btn"
                  onClick={() => toggleMenu(caseItem.id)}
                >
                  <FaEllipsisV />
                </button>
                {openMenuId === caseItem.id && (
                  <div className="case-menu-dropdown">
                    <button onClick={() => handleView(caseItem)}>
                      <FaFileAlt /> Details
                    </button>
                    <button onClick={() => handleOpenPainDiary(caseItem)}>
                      <FaHeartbeat /> Schmerztagebuch
                    </button>
                    <button onClick={() => handleEdit(caseItem)}>
                      <FaEdit /> Bearbeiten
                    </button>
                    <button onClick={() => handleDelete(caseItem.id)} className="delete-btn">
                      <FaTrash /> Löschen
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="case-content">
              <h3 className="case-title">{caseItem.title}</h3>

              <div className="case-meta">
                <div className="case-meta-item">
                  <FaCalendarAlt />
                  <span>Start: {caseItem.startDate}</span>
                </div>
                {caseItem.endDate && (
                  <div className="case-meta-item">
                    <FaCalendarAlt />
                    <span>Ende: {caseItem.endDate}</span>
                  </div>
                )}
                <div className="case-meta-item">
                  <FaUserMd />
                  <span>{caseItem.doctor}</span>
                </div>
              </div>

              <div className="case-footer">
                <span className="case-category">{caseItem.category}</span>
                <span
                  className="case-status"
                  style={{
                    backgroundColor: `${getStatusColor(caseItem.status)}20`,
                    color: getStatusColor(caseItem.status),
                    borderLeft: `3px solid ${getStatusColor(caseItem.status)}`
                  }}
                >
                  {getStatusLabel(caseItem.status)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {cases.length === 0 && (
          <div className="no-cases">
            <FaFolderOpen className="no-cases-icon" />
            <p>Noch keine Fälle erstellt</p>
            <button className="add-fall-btn" onClick={handleAddCase}>
              <FaPlus /> Ersten Fall erstellen
            </button>
          </div>
        )}
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Neuen Fall erstellen</h2>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Fall-Titel *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="z.B. Meniskusverletzung links"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Kategorie *</label>
                <select
                  className="form-select"
                  value={newCaseCategory}
                  onChange={(e) => setNewCaseCategory(e.target.value)}
                >
                  <option value="">Bitte wählen...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Behandelnder Arzt</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCaseDoctor}
                  onChange={(e) => setNewCaseDoctor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Dokumente zuordnen (optional)</label>
                <div className="documents-selection">
                  {currentUser.documents && currentUser.documents.length > 0 ? (
                    currentUser.documents.slice(0, 10).map(doc => (
                      <div key={doc.id} className="document-checkbox-item">
                        <input
                          type="checkbox"
                          id={`doc-${doc.id}`}
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => toggleDocumentSelection(doc.id)}
                        />
                        <label htmlFor={`doc-${doc.id}`}>
                          <span className="doc-title">{doc.title}</span>
                          <span className="doc-date">{doc.date}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="no-documents-hint">Keine Dokumente verfügbar</p>
                  )}
                </div>
                {currentUser.documents && currentUser.documents.length > 10 && (
                  <p className="form-hint">Zeige erste 10 Dokumente. Weitere können später hinzugefügt werden.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Abbrechen
              </button>
              <button
                className="btn-submit"
                onClick={handleSaveCase}
                disabled={!newCaseTitle || !newCaseCategory}
              >
                Fall erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {editCase && (
        <div className="modal-overlay" onClick={() => setEditCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Fall bearbeiten</h2>
              <button className="modal-close-btn" onClick={() => setEditCase(null)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Fall-Titel *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="z.B. Meniskusverletzung links"
                  value={editCase.title}
                  onChange={(e) => setEditCase({...editCase, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Kategorie *</label>
                <select
                  className="form-select"
                  value={editCase.category}
                  onChange={(e) => setEditCase({...editCase, category: e.target.value})}
                >
                  <option value="">Bitte wählen...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Behandelnder Arzt</label>
                <input
                  type="text"
                  className="form-input"
                  value={editCase.doctor}
                  onChange={(e) => setEditCase({...editCase, doctor: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-select"
                  value={editCase.status}
                  onChange={(e) => setEditCase({...editCase, status: e.target.value})}
                >
                  <option value="laufend">Laufend</option>
                  <option value="abgeschlossen">Abgeschlossen</option>
                  <option value="pausiert">Pausiert</option>
                </select>
              </div>

              {editCase.status === 'abgeschlossen' && (
                <div className="form-group">
                  <label>Enddatum</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editCase.endDate || ''}
                    onChange={(e) => setEditCase({...editCase, endDate: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditCase(null)}>
                Abbrechen
              </button>
              <button
                className="btn-submit"
                onClick={() => {
                  updateCase(editCase.id, editCase);
                  setEditCase(null);
                }}
                disabled={!editCase.title || !editCase.category}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Case Modal */}
      {viewCase && (() => {
        // Finde verknüpfte Dokumente basierend auf Kategorie und Zeitraum
        const caseStartDate = new Date(viewCase.startDate);
        const caseEndDate = viewCase.endDate ? new Date(viewCase.endDate) : new Date();

        const relatedDocuments = currentUser.documents.filter(doc => {
          const docDate = new Date(doc.date);
          const isInTimeRange = docDate >= caseStartDate && docDate <= caseEndDate;

          // Prüfe ob Kategorie relevant ist
          const categoryMatch =
            doc.category === viewCase.category ||
            (viewCase.category === 'Orthopädie' && ['Bildgebung', 'Diagnosen'].includes(doc.category)) ||
            (viewCase.category === 'Kardiologie' && ['Bildgebung', 'Labor'].includes(doc.category)) ||
            (viewCase.category === 'Gynäkologie' && ['Bildgebung', 'Labor', 'Vorsorge'].includes(doc.category)) ||
            (viewCase.category === 'Diabetologie' && doc.category === 'Labor') ||
            (viewCase.category === 'Rheumatologie' && ['Bildgebung', 'Labor'].includes(doc.category));

          return isInTimeRange && categoryMatch;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        return (
          <div className="modal-overlay" onClick={() => setViewCase(null)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Fall-Details: {viewCase.title}</h2>
                <button className="modal-close-btn" onClick={() => setViewCase(null)}>×</button>
              </div>

              <div className="modal-body">
                {/* Fall-Informationen */}
                <div className="case-details-section">
                  <h3>Fallinformationen</h3>
                  <div className="view-document-details">
                    <div className="view-item">
                      <span className="view-label">Kategorie</span>
                      <span className="view-value">{viewCase.category}</span>
                    </div>
                    <div className="view-item">
                      <span className="view-label">Status</span>
                      <span className="view-value" style={{
                        color: getStatusColor(viewCase.status),
                        fontWeight: 'bold'
                      }}>{getStatusLabel(viewCase.status)}</span>
                    </div>
                    <div className="view-item">
                      <span className="view-label">Behandelnder Arzt</span>
                      <span className="view-value">{viewCase.doctor}</span>
                    </div>
                    <div className="view-item">
                      <span className="view-label">Zeitraum</span>
                      <span className="view-value">
                        {viewCase.startDate} {viewCase.endDate ? `bis ${viewCase.endDate}` : '(laufend)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Zusammenfassung */}
                <div className="case-details-section">
                  <h3>Zusammenfassung</h3>
                  <div className="case-summary">
                    <div className="summary-stats">
                      <div className="summary-stat-item">
                        <div className="stat-number">{relatedDocuments.length}</div>
                        <div className="stat-label">Verknüpfte Dokumente</div>
                      </div>
                      <div className="summary-stat-item">
                        <div className="stat-number">{relatedDocuments.filter(d => d.category === 'Labor').length}</div>
                        <div className="stat-label">Laborberichte</div>
                      </div>
                      <div className="summary-stat-item">
                        <div className="stat-number">{relatedDocuments.filter(d => d.category === 'Bildgebung').length}</div>
                        <div className="stat-label">Bildgebung</div>
                      </div>
                      <div className="summary-stat-item">
                        <div className="stat-number">{relatedDocuments.filter(d => d.category === 'Diagnosen').length}</div>
                        <div className="stat-label">Diagnosen/Berichte</div>
                      </div>
                    </div>

                    {/* AI-Generated Case Summary */}
                    {relatedDocuments.length > 0 && (() => {
                      // Generate AI summary based on case details
                      const patientName = currentUser.name.split(' ')[0];
                      const caseAge = Math.floor((new Date() - new Date(viewCase.startDate)) / (1000 * 60 * 60 * 24));
                      const labDocs = relatedDocuments.filter(d => d.category === 'Labor');
                      const imagingDocs = relatedDocuments.filter(d => d.category === 'Bildgebung');
                      const diagnosisDocs = relatedDocuments.filter(d => d.category === 'Diagnosen');

                      let aiSummary = `${patientName} ${viewCase.status === 'laufend' ? 'leidet seit' : 'litt'} dem ${new Date(viewCase.startDate).toLocaleDateString('de-DE')} an ${viewCase.title.toLowerCase()}. `;

                      if (viewCase.category === 'Orthopädie') {
                        if (imagingDocs.length > 0) {
                          aiSummary += `Eine ${imagingDocs[0].title.toLowerCase()} am ${new Date(imagingDocs[0].date).toLocaleDateString('de-DE')} zeigte Auffälligkeiten. `;
                        }
                        if (diagnosisDocs.length > 0) {
                          aiSummary += `Daraufhin ${diagnosisDocs.length > 1 ? 'wurden mehrere therapeutische Maßnahmen' : 'wurde eine therapeutische Maßnahme'} eingeleitet, dokumentiert in ${diagnosisDocs.length} ${diagnosisDocs.length > 1 ? 'Berichten' : 'Bericht'}. `;
                        }
                        aiSummary += viewCase.status === 'laufend' ? 'Die Behandlung läuft weiterhin unter ärztlicher Betreuung.' : 'Die Behandlung wurde erfolgreich abgeschlossen.';

                      } else if (viewCase.category === 'Kardiologie') {
                        if (labDocs.length > 0) {
                          aiSummary += `Laboruntersuchungen (${labDocs.length} ${labDocs.length > 1 ? 'Berichte' : 'Bericht'}) zeigten erhöhte Werte. `;
                        }
                        if (imagingDocs.length > 0) {
                          aiSummary += `${imagingDocs[0].title} bestätigte die Diagnose. `;
                        }
                        aiSummary += `Eine medikamentöse Therapie wurde eingeleitet. `;
                        aiSummary += viewCase.status === 'laufend' ? 'Regelmäßige Kontrollen werden durchgeführt.' : 'Die Werte haben sich stabilisiert.';

                      } else if (viewCase.category === 'Gynäkologie') {
                        if (imagingDocs.length > 0) {
                          aiSummary += `${imagingDocs.length} Ultraschalluntersuchung${imagingDocs.length > 1 ? 'en' : ''} ${imagingDocs.length > 1 ? 'wurden' : 'wurde'} durchgeführt. `;
                        }
                        if (labDocs.length > 0) {
                          aiSummary += `Laborwerte werden regelmäßig kontrolliert (${labDocs.length} ${labDocs.length > 1 ? 'Berichte' : 'Bericht'}). `;
                        }
                        aiSummary += viewCase.status === 'laufend' ? 'Die Betreuung erfolgt kontinuierlich.' : 'Die Behandlung wurde planmäßig abgeschlossen.';

                      } else if (viewCase.category === 'Diabetologie') {
                        if (labDocs.length > 0) {
                          aiSummary += `HbA1c- und Blutzuckerwerte werden regelmäßig kontrolliert (${labDocs.length} Labor${labDocs.length > 1 ? 'berichte' : 'bericht'}). `;
                        }
                        aiSummary += `Die medikamentöse Einstellung wird kontinuierlich angepasst. `;
                        aiSummary += viewCase.status === 'laufend' ? 'Weitere Verlaufskontrollen sind geplant.' : 'Die Blutzuckerwerte sind gut eingestellt.';

                      } else if (viewCase.category === 'Geriatrie') {
                        aiSummary += `Im Rahmen der geriatrischen Betreuung ${relatedDocuments.length > 1 ? 'wurden mehrere Untersuchungen' : 'wurde eine Untersuchung'} durchgeführt. `;
                        if (labDocs.length > 0) {
                          aiSummary += `Laborwerte werden engmaschig überwacht. `;
                        }
                        aiSummary += viewCase.status === 'laufend' ? 'Die multidisziplinäre Betreuung wird fortgesetzt.' : 'Die Behandlungsziele wurden erreicht.';

                      } else if (viewCase.category === 'Rheumatologie') {
                        if (labDocs.length > 0) {
                          aiSummary += `Entzündungswerte wurden mehrfach kontrolliert (${labDocs.length} ${labDocs.length > 1 ? 'Berichte' : 'Bericht'}). `;
                        }
                        if (imagingDocs.length > 0) {
                          aiSummary += `Bildgebende Verfahren dokumentierten den Verlauf. `;
                        }
                        aiSummary += viewCase.status === 'laufend' ? 'Die antirheumatische Therapie wird fortgeführt.' : 'Die Behandlung zeigte gute Erfolge.';

                      } else {
                        // Generic summary for other categories
                        aiSummary += `Im Verlauf ${relatedDocuments.length > 1 ? 'wurden ' + relatedDocuments.length + ' Dokumente' : 'wurde ein Dokument'} erstellt. `;
                        if (relatedDocuments[0]) {
                          aiSummary += `Das neueste Dokument ("${relatedDocuments[0].title}") datiert vom ${new Date(relatedDocuments[0].date).toLocaleDateString('de-DE')}. `;
                        }
                        aiSummary += viewCase.status === 'laufend' ? 'Die Behandlung wird fortgesetzt.' : 'Die Behandlung wurde abgeschlossen.';
                      }

                      return (
                        <div className="case-ai-summary">
                          <div className="ai-summary-header">
                            <FaHeartbeat />
                            <h4>KI-Zusammenfassung</h4>
                          </div>
                          <div className="ai-summary-content">
                            <p>{aiSummary}</p>
                            <div className="ai-summary-meta">
                              <span>🤖 Automatisch generiert basierend auf {relatedDocuments.length} verknüpften Dokumenten</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {relatedDocuments.length > 0 && (
                      <div className="case-summary-text">
                        <p>
                          Dieser Fall umfasst <strong>{relatedDocuments.length} Dokument{relatedDocuments.length > 1 ? 'e' : ''}</strong> im Zeitraum vom <strong>{viewCase.startDate}</strong> bis <strong>{viewCase.endDate || 'heute'}</strong>.
                          {relatedDocuments.length > 0 && ` Das neueste Dokument ist "${relatedDocuments[0].title}" vom ${new Date(relatedDocuments[0].date).toLocaleDateString('de-DE')}.`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verknüpfte Dokumente */}
                {relatedDocuments.length > 0 && (
                  <div className="case-details-section">
                    <h3>Verknüpfte Dokumente ({relatedDocuments.length})</h3>
                    <div className="case-documents-list">
                      {relatedDocuments.map(doc => (
                        <div key={doc.id} className="case-document-item">
                          <div className="case-doc-icon" style={{
                            backgroundColor: doc.category === 'Labor' ? '#3498db' :
                                           doc.category === 'Bildgebung' ? '#9b59b6' :
                                           doc.category === 'Diagnosen' ? '#e67e22' :
                                           doc.category === 'Vorsorge' ? '#27ae60' : '#95a5a6'
                          }}>
                            {doc.category.charAt(0)}
                          </div>
                          <div className="case-doc-info">
                            <div className="case-doc-title">{doc.title}</div>
                            <div className="case-doc-meta">
                              <span className="case-doc-category">{doc.category}</span>
                              <span className="case-doc-date">{new Date(doc.date).toLocaleDateString('de-DE')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {relatedDocuments.length === 0 && (
                  <div className="case-details-section">
                    <div className="no-related-documents">
                      <FaFileAlt className="no-docs-icon" />
                      <p>Keine verknüpften Dokumente im Zeitraum dieses Falls gefunden.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setViewCase(null)}>
                  Schließen
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Pain Diary Modal */}
      {painDiaryCase && (
        <div className="modal-overlay" onClick={() => setPainDiaryCase(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaHeartbeat /> Schmerztagebuch: {painDiaryCase.title}
              </h2>
              <button className="modal-close-btn" onClick={() => setPainDiaryCase(null)}>×</button>
            </div>

            <div className="modal-body">
              {!showAddPainEntry ? (
                <>
                  <div className="pain-diary-header">
                    <p className="pain-diary-subtitle">
                      Dokumentieren Sie Ihre Schmerzen, um den Verlauf zu verfolgen und Ihrem Arzt detaillierte Informationen zu geben.
                    </p>
                    <button className="btn-add-pain" onClick={handleAddPainEntry}>
                      <FaPlus /> Eintrag hinzufügen
                    </button>
                  </div>

                  {/* Schmerzverlauf Chart & AI-Analyse */}
                  {painDiaryCase.painDiary && painDiaryCase.painDiary.length > 0 && (() => {
                    // Prepare chart data (reverse to show oldest first)
                    const chartData = [...painDiaryCase.painDiary]
                      .reverse()
                      .map(entry => ({
                        date: new Date(entry.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
                        painLevel: entry.painLevel,
                        fullDate: entry.date
                      }));

                    // Calculate statistics
                    const avgPain = (painDiaryCase.painDiary.reduce((sum, e) => sum + e.painLevel, 0) / painDiaryCase.painDiary.length).toFixed(1);
                    const maxPain = Math.max(...painDiaryCase.painDiary.map(e => e.painLevel));
                    const minPain = Math.min(...painDiaryCase.painDiary.map(e => e.painLevel));
                    const latestPain = painDiaryCase.painDiary[0].painLevel;

                    // Trend analysis
                    const recentEntries = painDiaryCase.painDiary.slice(0, 3);
                    const olderEntries = painDiaryCase.painDiary.slice(3, 6);
                    const recentAvg = recentEntries.length > 0 ? recentEntries.reduce((sum, e) => sum + e.painLevel, 0) / recentEntries.length : 0;
                    const olderAvg = olderEntries.length > 0 ? olderEntries.reduce((sum, e) => sum + e.painLevel, 0) / olderEntries.length : recentAvg;
                    const trend = recentAvg < olderAvg - 0.5 ? 'verbessert' : recentAvg > olderAvg + 0.5 ? 'verschlechtert' : 'stabil';
                    const trendIcon = trend === 'verbessert' ? '📉' : trend === 'verschlechtert' ? '📈' : '➡️';

                    return (
                      <>
                        {/* AI Analysis Box */}
                        <div className="pain-ai-analysis">
                          <div className="ai-analysis-header">
                            <FaChartLine />
                            <h4>Schmerzanalyse</h4>
                          </div>
                          <div className="ai-analysis-content">
                            <p>
                              <strong>Aktueller Status:</strong> Ihr letzter Schmerz-Eintrag zeigt einen Wert von <span className="highlight-pain" style={{ color: getPainLevelColor(latestPain) }}>{latestPain}/10</span> ({getPainLevelLabel(latestPain)}).
                            </p>
                            <p>
                              <strong>Verlauf {trendIcon}:</strong> Ihre Schmerzen haben sich in den letzten Messungen <span className="highlight-trend">{trend}</span>.
                              Der Durchschnittswert liegt bei <strong>{avgPain}/10</strong>, mit Schwankungen zwischen {minPain} und {maxPain}.
                            </p>
                            <p>
                              <strong>Empfehlung:</strong> {
                                latestPain >= 7 ? "Bei anhaltend starken Schmerzen sollten Sie Ihren Arzt kontaktieren." :
                                latestPain >= 5 ? "Dokumentieren Sie weiterhin regelmäßig und achten Sie auf Auslöser." :
                                "Ihre Schmerzen sind im kontrollierbaren Bereich. Setzen Sie Ihre Therapie fort."
                              }
                            </p>
                          </div>
                        </div>

                        {/* Pain Chart */}
                        <div className="pain-chart-container">
                          <h4><FaChartLine /> Schmerzverlauf</h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                              <XAxis dataKey="date" stroke="#666" style={{ fontSize: '0.85rem' }} />
                              <YAxis domain={[0, 10]} stroke="#666" style={{ fontSize: '0.85rem' }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#fff',
                                  border: '1px solid #ddd',
                                  borderRadius: '8px',
                                  padding: '8px 12px'
                                }}
                                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                              />
                              <Area
                                type="monotone"
                                dataKey="painLevel"
                                stroke="#e74c3c"
                                strokeWidth={3}
                                fill="url(#painGradient)"
                                name="Schmerzstärke"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    );
                  })()}

                  <div className="pain-entries">
                    {painDiaryCase.painDiary && painDiaryCase.painDiary.length > 0 ? (
                      painDiaryCase.painDiary.map((entry, index) => (
                        <div key={index} className="pain-entry">
                          <div className="pain-entry-header">
                            <div className="pain-entry-date">
                              <FaCalendarAlt />
                              <span>{entry.date} um {entry.time}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <div
                                className="pain-level-badge"
                                style={{
                                  backgroundColor: `${getPainLevelColor(entry.painLevel)}20`,
                                  color: getPainLevelColor(entry.painLevel),
                                  borderLeft: `4px solid ${getPainLevelColor(entry.painLevel)}`
                                }}
                              >
                                <span className="pain-level-number">{entry.painLevel}/10</span>
                                <span className="pain-level-label">{getPainLevelLabel(entry.painLevel)}</span>
                              </div>
                              <button
                                className="pain-entry-delete-btn"
                                onClick={() => {
                                  if (window.confirm('Eintrag wirklich löschen?')) {
                                    deletePainDiaryEntry(painDiaryCase.id, index);
                                    setPainDiaryCase({
                                      ...painDiaryCase,
                                      painDiary: painDiaryCase.painDiary.filter((_, i) => i !== index)
                                    });
                                  }
                                }}
                                title="Eintrag löschen"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                          <div className="pain-entry-body">
                            <div className="pain-location">
                              <strong>Stelle:</strong> {entry.location}
                            </div>
                            {entry.notes && (
                              <div className="pain-notes">
                                <strong>Notizen:</strong> {entry.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-pain-entries">
                        <FaHeartbeat className="no-pain-icon" />
                        <p>Noch keine Schmerzeinträge vorhanden</p>
                        <button className="btn-submit" onClick={handleAddPainEntry}>
                          <FaPlus /> Ersten Eintrag erstellen
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="add-pain-entry-form">
                  <h3>Neuer Schmerz-Eintrag</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Datum *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={painDate}
                        onChange={(e) => setPainDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Uhrzeit *</label>
                      <input
                        type="time"
                        className="form-input"
                        value={painTime}
                        onChange={(e) => setPainTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Schmerzstärke: {painLevel}/10 ({getPainLevelLabel(painLevel)})</label>
                    <div className="pain-level-slider">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={painLevel}
                        onChange={(e) => setPainLevel(Number(e.target.value))}
                        className="slider"
                        style={{
                          background: `linear-gradient(to right, ${getPainLevelColor(painLevel)} 0%, ${getPainLevelColor(painLevel)} ${painLevel * 10}%, #e0e0e0 ${painLevel * 10}%, #e0e0e0 100%)`
                        }}
                      />
                      <div className="pain-level-labels">
                        <span>0 - Kein Schmerz</span>
                        <span>10 - Unerträglich</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Stelle *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="z.B. Knie links, Unterer Rücken"
                      value={painLocation}
                      onChange={(e) => setPainLocation(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Notizen (optional)</label>
                    <textarea
                      className="form-textarea"
                      rows="4"
                      placeholder="Beschreiben Sie den Schmerz, Auslöser, begleitende Symptome..."
                      value={painNotes}
                      onChange={(e) => setPainNotes(e.target.value)}
                    />
                  </div>

                  <div className="form-actions">
                    <button className="btn-cancel" onClick={() => setShowAddPainEntry(false)}>
                      Abbrechen
                    </button>
                    <button
                      className="btn-submit"
                      onClick={handleSavePainEntry}
                      disabled={!painDate || !painTime || !painLocation}
                    >
                      Eintrag speichern
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!showAddPainEntry && (
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setPainDiaryCase(null)}>
                  Schließen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Faelle;
