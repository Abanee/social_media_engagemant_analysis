import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import useDataStore from '../store/useDataStore';
import { toast } from 'sonner';

const ProcessingPage = () => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { rawData, normalizeData } = useDataStore();

  const runNormalization = async () => {
    if (rawData.length === 0) {
      toast.error('Please upload data first!');
      return;
    }

    setIsRunning(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));

    normalizeData();
    setIsRunning(false);
    toast.success('Data normalized successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Data Processing</h1>
        <p className="text-gray-400 mb-12">Transform and normalize your dataset</p>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Normalize Data</h2>
              <p className="text-gray-400">Scale numerical values to 0-1 range</p>
            </div>
          </div>

          {isRunning && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Processing...</span>
                <span className="text-sm text-cyan-400 font-semibold">{progress}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={runNormalization}
            disabled={isRunning || rawData.length === 0}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {isRunning ? 'Processing...' : 'Start Normalization'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessingPage;