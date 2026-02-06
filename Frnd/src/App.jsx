import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

// Components
import Sidebar from './components/Sidebar';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './components/ProfilePage'; // Ensure this path matches your folder structure
import DatasetPage from './pages/DatasetPage';
import PreprocessingPage from './pages/PreprocessingPage';
import ProcessingPage from './pages/ProcessingPage';
import MLPage from './pages/MLPage';
import VisualizationPage from './pages/VisualizationPage';

function App() {
  // 1. User State Management
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 2. Login Handler - UPDATED
  // Now accepts 'userData' as an argument. 
  // This makes it dynamic: it works with Mock data NOW and Real Backend data LATER.
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 3. Logout Handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Good practice to clear auth tokens too
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0B0F19] text-slate-200">
        
        {/* Only show Sidebar if User is Logged In */}
        {user && (
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            setIsCollapsed={setIsSidebarCollapsed} 
            onLogout={handleLogout} 
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-x-hidden transition-all duration-300 ${user ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'}`}>
          <AnimatePresence mode="wait">
            <Routes>
              
              {/* Public/Auth Route */}
              <Route path="/auth" element={
                !user ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" replace />
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <HomePage user={user} onLogout={handleLogout} /> 
              } />

              <Route path="/profile" element={
                user ? <ProfilePage user={user} setUser={setUser} onLogout={handleLogout} /> : <Navigate to="/auth" replace />
              } />
              
              <Route path="/dataset" element={user ? <DatasetPage /> : <Navigate to="/auth" />} />
              <Route path="/preprocessing" element={user ? <PreprocessingPage /> : <Navigate to="/auth" />} />
              <Route path="/processing" element={user ? <ProcessingPage /> : <Navigate to="/auth" />} />
              <Route path="/ml" element={user ? <MLPage /> : <Navigate to="/auth" />} />
              <Route path="/visualization" element={user ? <VisualizationPage /> : <Navigate to="/auth" />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;