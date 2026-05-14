import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import Home from './pages/Home';
import Faelle from './pages/Faelle';
import Dokumente from './pages/Dokumente';
import Labor from './pages/Labor';
import Praevention from './pages/Praevention';
import Freigaben from './pages/Freigaben';
import Profile from './pages/Profile';
import Einstellungen from './pages/Einstellungen';
import Notfall from './pages/Notfall';
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
          <Route path="/" element={<Home />} />
          <Route path="/faelle" element={<Faelle />} />
          <Route path="/dokumente" element={<Dokumente />} />
          <Route path="/labor" element={<Labor />} />
          <Route path="/praevention" element={<Praevention />} />
          <Route path="/freigaben" element={<Freigaben />} />
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
