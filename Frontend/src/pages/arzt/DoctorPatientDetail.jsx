import '../Pages.css';
import { useParams } from 'react-router-dom';

// Stub — Inhalt kommt mit Issue #12 (Patient-Detail-View für Arzt).
function DoctorPatientDetail() {
  const { id } = useParams();
  return (
    <div className="page-container">
      <h1>Patientenakte: {id}</h1>
      <p>Inhalt folgt in Issue #12.</p>
    </div>
  );
}

export default DoctorPatientDetail;
