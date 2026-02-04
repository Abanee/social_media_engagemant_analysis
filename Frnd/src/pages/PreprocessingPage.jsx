import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Play, CheckCircle, AlertCircle } from 'lucide-react';
import useDataStore from '../store/useDataStore';
import { toast } from 'sonner';

const PreprocessingPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const { rawData, handleNulls } = useDataStore();

  const runPreprocessing = async (operation) => {
    if (rawData.length === 0) {
      toast.error('Please upload data first!');
      return;
    }

    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (operation === 'nulls') {
      handleNulls();
    }

    setCompletedSteps(prev => [...prev, operation]);
    toast.success('Preprocessing complete!');
    setIsProcessing(false);
  };

  const steps = [
    {
      id: 'nulls',
      title: 'Handle Missing Values',
      description: 'Replace null/empty values with N/A',
      icon: AlertCircle,
    },
    {
      id: 'duplicates',
      title: 'Remove Duplicates',
      description: 'Identify and remove duplicate rows',
      icon: GitBranch,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Data Preprocessing</h1>
        <p className="text-gray-400 mb-12">Clean and prepare your data for analysis</p>

        {/* Pipeline Visualization */}
        <div className="mb-12 flex items-center justify-center gap-4">
          {['Raw Data', 'Cleaned', 'Ready'].map((stage, idx) => (
            <React.Fragment key={stage}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                className={`px-6 py-3 rounded-xl border-2 ${
                  completedSteps.length >= idx
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-gray-700 bg-gray-800 text-gray-500'
                }`}
              >
                <span className="font-semibold">{stage}</span>
              </motion.div>
              {idx < 2 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ delay: idx * 0.2 + 0.1 }}
                  className={`h-1 ${completedSteps.length > idx ? 'bg-cyan-500' : 'bg-gray-700'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Processing Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id);

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gray-800/50 backdrop-blur-xl border rounded-2xl p-6 transition-all ${
                  isCompleted ? 'border-green-500/50' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                </div>

                <button
                  onClick={() => runPreprocessing(step.id)}
                  disabled={isProcessing || isCompleted}
                  className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 ${
                    isCompleted
                      ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Play className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </>
                  ) : isCompleted ? (
                    'Completed'
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Run Step
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PreprocessingPage;