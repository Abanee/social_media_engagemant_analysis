import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Twitter, Chrome } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     if (onLogin) onLogin(); // Trigger login success
  //   }, 1500);

    const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- TEMPORARY MOCK (Use this until Backend is ready) ---
    setTimeout(() => {
      setIsLoading(false);
      // Pass the mock object HERE instead of in App.js
      const mockUser = { name: 'Alex Morgan', role: 'Lead Analyst', email: 'alex@demo.com' };
      if (onLogin) onLogin(mockUser); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Social Intelligence <span className="text-indigo-400">Hub</span>
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Welcome back, analyst.' : 'Join the intelligence network.'}
          </p>
        </div>

        <motion.div 
          layout
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl"
        >
          {/* Form Header */}
          <div className="flex gap-4 mb-8 p-1 bg-slate-800/50 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode='wait'>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-center text-slate-500 mb-4">Or continue with</p>
            <div className="grid grid-cols-3 gap-3">
              {[Github, Twitter, Chrome].map((Icon, idx) => (
                <button key={idx} className="flex items-center justify-center py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-slate-600 transition text-slate-400 hover:text-white">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        <p className="text-center text-slate-500 text-xs mt-8">
          Protected by Enterprise Grade Security. <br/> By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;