import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import DatasetPage from './pages/DatasetPage';
import PreprocessingPage from './pages/PreprocessingPage';
import ProcessingPage from './pages/ProcessingPage';
import MLPage from './pages/MLPage';
import VisualizationPage from './pages/VisualizationPage';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dataset" element={<DatasetPage />} />
              <Route path="/preprocessing" element={<PreprocessingPage />} />
              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/ml" element={<MLPage />} />
              <Route path="/visualization" element={<VisualizationPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1F2937',
              color: '#F3F4F6',
              border: '1px solid #374151',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;