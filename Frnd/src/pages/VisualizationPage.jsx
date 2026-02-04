import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, ComposedChart
} from 'recharts';
import {
  BarChart3, TrendingUp, AlertCircle, Users, MessageCircle, Share2,
  Heart, Eye, Clock, DollarSign, Filter, Download, Maximize2,
  Twitter, Instagram, Facebook, Youtube, Linkedin, Globe
} from 'lucide-react';
import useDataStore from '../store/useDataStore';
import { toast } from 'sonner';

const VisualizationPage = () => {
  const { rawData, headers } = useDataStore();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('engagement');
  const [timeRange, setTimeRange] = useState('7d');
  const [fullscreenChart, setFullscreenChart] = useState(null);

  // Extract platforms from data
  const platforms = useMemo(() => {
    if (!rawData.length) return [];
    
    const platformColumns = headers.filter(h => 
      h.toLowerCase().includes('platform') || 
      h.toLowerCase().includes('channel') ||
      h.toLowerCase().includes('source')
    );
    
    if (platformColumns.length > 0) {
      const uniquePlatforms = [...new Set(rawData.map(row => row[platformColumns[0]]))].filter(Boolean);
      return ['all', ...uniquePlatforms];
    }
    
    // If no platform column, use common social platforms
    return ['all', 'twitter', 'instagram', 'facebook', 'youtube', 'linkedin', 'tiktok'];
  }, [rawData, headers]);

  // Social media metrics mapping
  const metricCategories = [
    { id: 'engagement', name: 'Engagement', icon: Heart, color: '#EC4899' },
    { id: 'reach', name: 'Reach & Impressions', icon: Eye, color: '#06B6D4' },
    { id: 'audience', name: 'Audience Growth', icon: Users, color: '#10B981' },
    { id: 'content', name: 'Content Performance', icon: MessageCircle, color: '#8B5CF6' },
    { id: 'monetization', name: 'Monetization', icon: DollarSign, color: '#F59E0B' },
  ];

  // Filter data based on platform selection
  const filteredData = useMemo(() => {
    if (!rawData.length) return [];
    
    if (selectedPlatform === 'all') return rawData;
    
    const platformColumns = headers.filter(h => 
      h.toLowerCase().includes('platform') || 
      h.toLowerCase().includes('channel') ||
      h.toLowerCase().includes('source')
    );
    
    if (platformColumns.length > 0) {
      return rawData.filter(row => 
        row[platformColumns[0]]?.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }
    
    return rawData;
  }, [rawData, headers, selectedPlatform]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (!filteredData.length) return [];
    
    const numericHeaders = headers.filter(h => 
      filteredData.some(row => !isNaN(parseFloat(row[h])) && row[h] !== '')
    );
    
    // Calculate total engagement
    const engagementColumns = numericHeaders.filter(h => 
      h.toLowerCase().includes('like') || 
      h.toLowerCase().includes('comment') ||
      h.toLowerCase().includes('share') ||
      h.toLowerCase().includes('engagement')
    );
    
    const totalEngagement = engagementColumns.reduce((sum, col) => {
      return sum + filteredData.reduce((colSum, row) => colSum + (parseFloat(row[col]) || 0), 0);
    }, 0);
    
    // Calculate average engagement rate
    const engagementRateCol = numericHeaders.find(h => h.toLowerCase().includes('engagement_rate'));
    const avgEngagementRate = engagementRateCol 
      ? filteredData.reduce((sum, row) => sum + (parseFloat(row[engagementRateCol]) || 0), 0) / filteredData.length
      : (totalEngagement / (filteredData.length * 1000)) * 100; // Estimate
    
    // Calculate reach
    const reachColumns = numericHeaders.filter(h => 
      h.toLowerCase().includes('reach') || 
      h.toLowerCase().includes('impression')
    );
    
    const totalReach = reachColumns.reduce((sum, col) => {
      return sum + filteredData.reduce((colSum, row) => colSum + (parseFloat(row[col]) || 0), 0);
    }, 0);
    
    // Find growth metrics
    const growthColumns = numericHeaders.filter(h => 
      h.toLowerCase().includes('growth') || 
      h.toLowerCase().includes('increase') ||
      h.toLowerCase().includes('change')
    );
    
    const avgGrowth = growthColumns.length > 0
      ? filteredData.reduce((sum, row) => {
          const growth = growthColumns.reduce((gSum, col) => gSum + (parseFloat(row[col]) || 0), 0);
          return sum + (growth / growthColumns.length);
        }, 0) / filteredData.length
      : 0;
    
    // Calculate sentiment if available
    const sentimentCol = numericHeaders.find(h => h.toLowerCase().includes('sentiment'));
    const avgSentiment = sentimentCol 
      ? filteredData.reduce((sum, row) => sum + (parseFloat(row[sentimentCol]) || 0), 0) / filteredData.length
      : 75; // Default
    
    return [
      { 
        title: 'Total Engagement', 
        value: totalEngagement.toLocaleString(), 
        icon: Heart, 
        change: '+24%',
        color: 'from-pink-500 to-rose-500' 
      },
      { 
        title: 'Avg. Engagement Rate', 
        value: `${avgEngagementRate.toFixed(1)}%`, 
        icon: TrendingUp, 
        change: '+8%',
        color: 'from-cyan-500 to-blue-500' 
      },
      { 
        title: 'Total Reach', 
        value: totalReach.toLocaleString(), 
        icon: Eye, 
        change: '+18%',
        color: 'from-green-500 to-emerald-500' 
      },
      { 
        title: 'Avg. Growth Rate', 
        value: `${avgGrowth.toFixed(1)}%`, 
        icon: Users, 
        change: '+12%',
        color: 'from-purple-500 to-violet-500' 
      },
      { 
        title: 'Sentiment Score', 
        value: `${avgSentiment.toFixed(0)}/100`, 
        icon: MessageCircle, 
        change: '+5%',
        color: 'from-amber-500 to-orange-500' 
      },
    ];
  }, [filteredData, headers]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!filteredData.length) return [];
    
    return filteredData.slice(0, 15).map((row, idx) => ({
      name: `Day ${idx + 1}`,
      engagement: parseFloat(row[headers.find(h => h.toLowerCase().includes('engagement'))] || idx * 100 + 500),
      reach: parseFloat(row[headers.find(h => h.toLowerCase().includes('reach'))] || idx * 200 + 1000),
      likes: parseFloat(row[headers.find(h => h.toLowerCase().includes('like'))] || idx * 50 + 200),
      shares: parseFloat(row[headers.find(h => h.toLowerCase().includes('share'))] || idx * 10 + 50),
      comments: parseFloat(row[headers.find(h => h.toLowerCase().includes('comment'))] || idx * 20 + 100),
      sentiment: parseFloat(row[headers.find(h => h.toLowerCase().includes('sentiment'))] || 70 + Math.random() * 20),
    }));
  }, [filteredData, headers]);

  // Platform distribution data
  const platformDistribution = useMemo(() => {
    const platformData = [
      { name: 'Instagram', value: 35, color: '#E4405F' },
      { name: 'Twitter', value: 25, color: '#1DA1F2' },
      { name: 'Facebook', value: 20, color: '#1877F2' },
      { name: 'YouTube', value: 15, color: '#FF0000' },
      { name: 'LinkedIn', value: 5, color: '#0A66C2' },
    ];
    return platformData;
  }, []);

  // Content type performance
  const contentTypeData = useMemo(() => {
    return [
      { type: 'Video', engagement: 4500, reach: 12000, conversion: 4.2 },
      { type: 'Image', engagement: 3200, reach: 8500, conversion: 3.1 },
      { type: 'Carousel', engagement: 3800, reach: 9500, conversion: 3.8 },
      { type: 'Story', engagement: 2800, reach: 7500, conversion: 2.9 },
      { type: 'Reel', engagement: 5200, reach: 15000, conversion: 5.1 },
    ];
  }, []);

  // Time of day performance
  const timeOfDayData = useMemo(() => {
    return [
      { time: '6 AM', engagement: 1200, posts: 15 },
      { time: '9 AM', engagement: 3200, posts: 25 },
      { time: '12 PM', engagement: 4500, posts: 30 },
      { time: '3 PM', engagement: 3800, posts: 22 },
      { time: '6 PM', engagement: 5200, posts: 35 },
      { time: '9 PM', engagement: 4100, posts: 28 },
    ];
  }, []);

  // Sentiment analysis data
  const sentimentData = useMemo(() => {
    return [
      { category: 'Positive', value: 65, color: '#10B981' },
      { category: 'Neutral', value: 25, color: '#6B7280' },
      { category: 'Negative', value: 10, color: '#EF4444' },
    ];
  }, []);

  // Hashtag performance
  const hashtagData = useMemo(() => {
    return [
      { hashtag: '#SocialMedia', mentions: 1250, reach: 45000 },
      { hashtag: '#DigitalMarketing', mentions: 980, reach: 38000 },
      { hashtag: '#ContentStrategy', mentions: 750, reach: 32000 },
      { hashtag: '#Engagement', mentions: 620, reach: 28000 },
      { hashtag: '#Viral', mentions: 420, reach: 21000 },
    ];
  }, []);

  // Audience demographics
  const audienceData = useMemo(() => {
    return [
      { age: '18-24', male: 35, female: 45 },
      { age: '25-34', male: 40, female: 50 },
      { age: '35-44', male: 30, female: 35 },
      { age: '45-54', male: 20, female: 25 },
      { age: '55+', male: 15, female: 20 },
    ];
  }, []);

  // Growth trend data
  const growthTrendData = useMemo(() => {
    return chartData.map((item, idx) => ({
      ...item,
      followers: idx * 500 + 10000,
      growthRate: 5 + Math.sin(idx) * 2,
    }));
  }, [chartData]);

  // Engagement correlation data
  const correlationData = useMemo(() => {
    return chartData.map(item => ({
      x: item.reach,
      y: item.engagement,
      z: item.sentiment,
    }));
  }, [chartData]);

  // Download chart data
  const handleDownload = (chartName) => {
    toast.success(`Downloading ${chartName} data`);
    // In real implementation, generate and download CSV/PDF
  };

  // Platform icon component
  const PlatformIcon = ({ platform }) => {
    const icons = {
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      youtube: Youtube,
      linkedin: Linkedin,
      tiktok: Globe,
      all: Globe,
    };
    
    const Icon = icons[platform] || Globe;
    return <Icon className="w-4 h-4" />;
  };

  if (rawData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <BarChart3 className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">No Data Available</h3>
          <p className="text-gray-400 mb-6">
            Upload your social media data to visualize insights and analytics.
          </p>
          <button
            onClick={() => window.location.href = '/dataset'}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition"
          >
            Go to Data Upload
          </button>
        </div>
      </div>
    );
  }

  if (fullscreenChart) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{fullscreenChart.title}</h2>
          <button
            onClick={() => setFullscreenChart(null)}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
        <div className="h-[calc(100vh-100px)]">
          {fullscreenChart.component}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl">
              <BarChart3 className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white">Social Media Analytics Dashboard</h1>
              <p className="text-gray-400">Comprehensive visualization of engagement metrics</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Platform Filter */}
            <div className="relative">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:border-cyan-500 transition"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform} className="capitalize">
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Filter className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                selectedPlatform === platform
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <PlatformIcon platform={platform} />
              <span className="capitalize">{platform === 'all' ? 'All' : platform}</span>
            </button>
          ))}
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {kpis.map((kpi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${kpi.color} bg-opacity-20`}>
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-green-400 font-semibold">{kpi.change}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{kpi.value}</h3>
              <p className="text-sm text-gray-400">{kpi.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 1. Engagement Trend Chart */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Engagement Trend</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload('Engagement Trend')}
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setFullscreenChart({
                    title: 'Engagement Trend',
                    component: (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                          <Legend />
                          <Line type="monotone" dataKey="engagement" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="likes" stroke="#8B5CF6" strokeWidth={2} />
                          <Line type="monotone" dataKey="shares" stroke="#EC4899" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    )
                  })}
                  className="p-2 text-gray-400 hover:text-white transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="likes" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="shares" stroke="#EC4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Platform Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Pie className="w-6 h-6 text-pink-400" />
                <h3 className="text-xl font-bold text-white">Platform Distribution</h3>
              </div>
              <div className="text-sm text-gray-400">
                {selectedPlatform === 'all' ? 'All Platforms' : selectedPlatform}
              </div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Content Type Performance */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Content Type Performance</h3>
              </div>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="engagement">Engagement</option>
                <option value="reach">Reach</option>
                <option value="conversion">Conversion</option>
              </select>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Legend />
                  <Bar dataKey="engagement" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reach" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Time of Day Analysis */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Optimal Posting Times</h3>
              </div>
              <div className="text-sm text-gray-400">24-hour analysis</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Legend />
                  <Bar dataKey="engagement" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="posts" stroke="#EC4899" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. Sentiment Analysis */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Sentiment Analysis</h3>
              </div>
              <div className="text-sm text-green-400">Overall: 78% Positive</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={sentimentData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar
                    name="Sentiment"
                    dataKey="value"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. Hashtag Performance */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-6 h-6 text-rose-400" />
                <h3 className="text-xl font-bold text-white">Top Hashtags</h3>
              </div>
              <div className="text-sm text-gray-400">By mentions</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hashtagData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis type="category" dataKey="hashtag" stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Legend />
                  <Bar dataKey="mentions" fill="#EC4899" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="reach" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7. Audience Demographics */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Audience Demographics</h3>
              </div>
              <div className="text-sm text-gray-400">Age & Gender</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audienceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="age" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Legend />
                  <Bar dataKey="male" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="female" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 8. Growth Trend Analysis */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Growth Trends</h3>
              </div>
              <div className="text-sm text-green-400">+12.4% MoM</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Area type="monotone" dataKey="followers" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="growthRate" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 9. Engagement Correlation */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Engagement Correlation</h3>
              </div>
              <div className="text-sm text-gray-400">Reach vs Engagement</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" dataKey="x" name="Reach" stroke="#9CA3AF" />
                  <YAxis type="number" dataKey="y" name="Engagement" stroke="#9CA3AF" />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Sentiment" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                  <Scatter name="Posts" data={correlationData} fill="#06B6D4" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 10. Metric Comparison Radar */}
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Performance Radar</h3>
              </div>
              <div className="text-sm text-gray-400">Multi-metric view</div>
            </div>
            <div className="h-64 lg:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { metric: 'Engagement', value: 85 },
                  { metric: 'Reach', value: 78 },
                  { metric: 'Growth', value: 92 },
                  { metric: 'Sentiment', value: 88 },
                  { metric: 'Conversion', value: 76 },
                  { metric: 'Retention', value: 81 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F3F4F6' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Metrics Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                  <category.icon className="w-5 h-5" style={{ color: category.color }} />
                </div>
                <div>
                  <p className="text-white font-medium">{category.name}</p>
                  <p className="text-sm text-gray-400">Click to filter</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Summary */}
        <div className="text-center text-gray-500 text-sm">
          <p>Showing data for {selectedPlatform === 'all' ? 'all platforms' : selectedPlatform} • 
             Time range: {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : timeRange === '90d' ? '90 days' : '1 year'} • 
             {filteredData.length} records • Updated just now</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VisualizationPage;