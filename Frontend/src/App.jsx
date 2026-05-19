import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import RoleRoute from './components/RoleRoute';
import Home from './pages/Home';
import Faelle from './pages/Faelle';
import Dokumente from './pages/Dokumente';
import Labor from './pages/Labor';
import Praevention from './pages/Praevention';
import Freigaben from './pages/Freigaben';
import Profile from './pages/Profile';
import Einstellungen from './pages/Einstellungen';
import Notfall from './pages/Notfall';
import DoctorDashboard from './pages/arzt/DoctorDashboard';
import DoctorPatientDetail from './pages/arzt/DoctorPatientDetail';
import DoctorUpload from './pages/arzt/DoctorUpload';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isNotfallPage = location.pathname.startsWith('/notfall');

  return (
    <div className="app">
      {!isNotfallPage && <Navbar />}
      {!isNotfallPage && <SecondaryNav />}
      <main className={isNotfallPage ? 'notfall-content' : 'main-content'}>
        <Routes>
          {/* Patient-Routen — durch RoleRoute auf role='patient' beschränkt.
              Bei aktiver Doctor-Persona wird automatisch auf /arzt umgeleitet. */}
          <Route path="/" element={<RoleRoute allow="patient"><Home /></RoleRoute>} />
          <Route path="/faelle" element={<RoleRoute allow="patient"><Faelle /></RoleRoute>} />
          <Route path="/dokumente" element={<RoleRoute allow="patient"><Dokumente /></RoleRoute>} />
          <Route path="/labor" element={<RoleRoute allow="patient"><Labor /></RoleRoute>} />
          <Route path="/praevention" element={<RoleRoute allow="patient"><Praevention /></RoleRoute>} />
          <Route path="/freigaben" element={<RoleRoute allow="patient"><Freigaben /></RoleRoute>} />

          {/* Doctor-Routen — nur bei role='doctor' erreichbar, sonst Redirect auf /. */}
          <Route path="/arzt" element={<RoleRoute allow="doctor"><DoctorDashboard /></RoleRoute>} />
          <Route path="/arzt/patient/:id" element={<RoleRoute allow="doctor"><DoctorPatientDetail /></RoleRoute>} />
          <Route path="/arzt/upload" element={<RoleRoute allow="doctor"><DoctorUpload /></RoleRoute>} />

          {/* Geteilte / öffentliche Routen (kein Role-Guard nötig). */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/einstellungen" element={<Einstellungen />} />
          <Route path="/notfall/:userId" element={<Notfall />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
