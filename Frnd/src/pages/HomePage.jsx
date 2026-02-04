import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MessageCircle, Share2, Zap, BarChart, Target } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '../services/apiService';
import useDataStore from '../store/useDataStore';

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const { rawData } = useDataStore();

  useEffect(() => {
    // Mock stats - In production, fetch from Django backend
    setStats({
      totalEngagement: '1.2M',
      growthRate: '+24%',
      topPlatform: 'Instagram',
      avgEngagementRate: '4.2%',
      activeCampaigns: 12,
      sentimentScore: 78
    });

    setRecentActivity([
      { platform: 'Twitter', action: 'Post Engagement', change: '+42%', time: '2h ago' },
      { platform: 'Instagram', action: 'Story Views', change: '+18%', time: '4h ago' },
      { platform: 'Facebook', action: 'Page Likes', change: '+8%', time: '6h ago' },
      { platform: 'LinkedIn', action: 'Post Shares', change: '+31%', time: '1d ago' },
    ]);
  }, []);

  const statCards = [
    { icon: TrendingUp, label: 'Total Engagement', value: stats?.totalEngagement, color: 'from-cyan-500 to-blue-500' },
    { icon: Users, label: 'Growth Rate', value: stats?.growthRate, color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, label: 'Avg. Engagement Rate', value: stats?.avgEngagementRate, color: 'from-green-500 to-emerald-500' },
    { icon: Share2, label: 'Active Campaigns', value: stats?.activeCampaigns, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Social Media Engagement Analytics</h1>
            <p className="text-gray-400">Real-time insights across all social platforms</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Connected to</p>
              <p className="text-lg font-semibold text-white">Django Backend</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} bg-opacity-20`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-400">Today</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{card.value}</h3>
              <p className="text-gray-400">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Upload Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Start New Analysis
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h3 className="text-white font-semibold mb-2">Upload Social Media Data</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload CSV/Excel files with engagement metrics (likes, shares, comments, impressions)
                  </p>
                  <button
                    onClick={() => window.location.href = '/dataset'}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition"
                  >
                    Go to Dataset Manager
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.platform === 'Twitter' ? 'bg-blue-500' :
                          activity.platform === 'Instagram' ? 'bg-pink-500' :
                          activity.platform === 'Facebook' ? 'bg-blue-600' : 'bg-blue-700'
                        }`}></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.platform}</p>
                        <p className="text-sm text-gray-400">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${activity.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {activity.change}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Analysis Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Analysis Pipeline</h2>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: 'Data Upload', description: 'Import social media datasets', path: '/dataset' },
                  { step: 2, title: 'Preprocessing', description: 'Clean & normalize data', path: '/preprocessing' },
                  { step: 3, title: 'EDA Processing', description: 'Generate insights', path: '/processing' },
                  { step: 4, title: 'ML Modeling', description: 'Predict engagement', path: '/ml' },
                  { step: 5, title: 'Visualization', description: 'Interactive charts', path: '/visualization' },
                ].map((item) => (
                  <a
                    key={item.step}
                    href={item.path}
                    className="block p-4 bg-gray-900/30 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-cyan-400 transition">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <div className="text-cyan-400 opacity-0 group-hover:opacity-100 transition">
                        →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Data Status */}
            {rawData.length > 0 && (
              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold">Data Loaded</h3>
                </div>
                <p className="text-cyan-300 mb-2">{rawData.length} records ready for analysis</p>
                <p className="text-sm text-cyan-400/70">
                  Proceed to preprocessing to clean your social media data
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;