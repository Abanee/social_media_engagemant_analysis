import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Shield, Save, Camera, Key, AlertTriangle,
  TrendingUp, Users, Share2, Zap, Brain, History, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/Header';

const ProfilePage = ({ user, setUser, onLogout }) => {
  // --- Profile Form State ---
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Analyst',
    bio: 'Data scientist passionate about social metrics and machine learning models.'
  });

  // --- KPI / Stats State (Moved from Home) ---
  const [stats, setStats] = useState({
    totalEngagement: '1.2M',
    growthRate: '+24%',
    avgEngagement: '4.2%',
    modelsTrained: 12
  });

  const [history, setHistory] = useState([
    { action: 'Dataset Uploaded', detail: 'twitter_campaign_2024.csv', time: '2h ago' },
    { action: 'Model Retrained', detail: 'Sentiment Analysis v3', time: '5h ago' },
    { action: 'Security Alert', detail: 'New login from IP 192.168.1.1', time: '1d ago' },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setUser({ ...user, ...formData });
      setIsLoading(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Header 
          title="User Profile & Stats" 
          subtitle="Manage your account and view your performance history"
          user={user}
          onLogout={onLogout}
        />

        {/* --- SECTION 1: KPI CARDS (Moved from Home) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Engagement', value: stats.totalEngagement, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Growth Rate', value: stats.growthRate, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Avg Engagement', value: stats.avgEngagement, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Models Trained', value: stats.modelsTrained, icon: Brain, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Profile & Settings --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Edit Profile Card */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Account Details</h3>
                  <p className="text-sm text-slate-500">Update your personal information</p>
                </div>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-semibold text-slate-400 uppercase">Bio</label>
                   <textarea 
                     rows="3"
                     value={formData.bio}
                     onChange={(e) => setFormData({...formData, bio: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-indigo-500 outline-none resize-none"
                   />
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t border-slate-800">
                  <button type="button" className="text-slate-400 hover:text-white text-sm">Cancel</button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition"
                  >
                    {isLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl border border-rose-900/30 bg-rose-900/5 flex items-center justify-between">
              <div>
                <h3 className="text-rose-400 font-semibold flex items-center gap-2">
                  <AlertTriangle size={18} /> Delete Account
                </h3>
                <p className="text-sm text-slate-400 mt-1">Permanently remove your data and access.</p>
              </div>
              <button className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium hover:bg-rose-500 hover:text-white transition">
                Delete
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Activity & Avatar --- */}
          <div className="space-y-6">
            
            {/* Avatar Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center text-2xl font-bold text-white">
                  {formData.name.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700">
                  <Camera size={14} className="text-slate-300" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">{formData.name}</h2>
              <p className="text-indigo-400 text-sm mb-4">{formData.role}</p>
            </div>

            {/* History Feed (Moved from Home) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <History size={18} className="text-indigo-400"/> Recent Activity
              </h3>
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start pb-3 border-b border-slate-800/50 last:border-0">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-300 font-medium">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Options */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Shield size={18} className="text-emerald-400"/> Security
              </h3>
              <button className="w-full flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-indigo-500/50 mb-2 transition">
                 <span className="text-sm text-slate-400">2FA Authentication</span>
                 <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
                    <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                 </div>
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition">
                 <span className="text-sm text-slate-400">Change Password</span>
                 <Key size={14} className="text-slate-500" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;