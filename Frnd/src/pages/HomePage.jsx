import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const HomePage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200">
      <Header 
        title="Social Intelligence Hub" 
        subtitle="AI-Powered Social Media Analytics Platform"
        user={user}
        onLogout={onLogout}
      />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl text-center">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Zap size={12} fill="currentColor" /> System Operational v2.4
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            Unlock the power of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Social Data</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Process millions of interactions in seconds. 
            Transform raw social media metrics into actionable business strategies using our advanced ML pipeline.
          </p>

          <div className="flex items-center justify-center gap-4">
            {user ? (
              <button 
                onClick={() => navigate('/dataset')}
                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition flex items-center gap-2 shadow-lg shadow-white/10"
              >
                <Database size={20} /> Start New Analysis
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-blue-500 transition flex items-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                Join the Network <ArrowRight size={20} />
              </button>
            )}
            
            <button 
              onClick={() => navigate(user ? '/profile' : '/auth')}
              className="px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl border border-slate-700 hover:bg-slate-800 transition"
            >
              View Dashboard
            </button>
          </div>
        </motion.div>

        {/* Simple Feature Icons (No Data/Stats here) */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 border-t border-slate-800/50 pt-12">
          {[
            { title: 'Data Ingestion', desc: 'Upload CSV/JSON with auto-schema detection.' },
            { title: 'ML Prediction', desc: 'Forecast engagement trends with 94% accuracy.' },
            { title: 'Real-time Viz', desc: 'Interactive dashboards and exportable reports.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HomePage;