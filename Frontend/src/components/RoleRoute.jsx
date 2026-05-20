import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Route-Guard nach Rolle: Patienten dürfen nur die Patient-Pages sehen,
// Ärzte nur /arzt/*. Bei falscher Rolle wird auf das jeweilige Landing
// umgeleitet ('/' für Patient, '/arzt' für Arzt).
// Verwendung in App.jsx: <RoleRoute allow="patient"><Home /></RoleRoute>
function RoleRoute({ allow, children }) {
  const { currentRole } = useUser();
  if (currentRole !== allow) {
    return <Navigate to={currentRole === 'doctor' ? '/arzt' : '/'} replace />;
  }
  return children;
}

export default RoleRoute;
