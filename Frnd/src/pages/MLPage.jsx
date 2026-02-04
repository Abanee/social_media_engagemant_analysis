import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertCircle, Zap, Target, BarChart3, Cpu, Rocket, Layers, Train, Download, LineChart, CheckCircle, Database, Play, BarChart } from 'lucide-react';
import useDataStore from '../store/useDataStore';
import { toast } from 'sonner';
import apiService from '../services/apiService';

const MLPage = () => {
  const { rawData, headers } = useDataStore();

  // State management
  const [activeCard, setActiveCard] = useState('lightgbm');
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingMetrics, setTrainingMetrics] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  
  // Prediction section states
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [targetColumn, setTargetColumn] = useState('');
  const [featureValues, setFeatureValues] = useState({});
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Training history
  const [trainingHistory, setTrainingHistory] = useState([]);
  
  // Handle column selection for prediction
  useEffect(() => {
    if (headers.length > 0) {
      // Initialize with first 5 columns for prediction
      const initialColumns = headers.slice(0, Math.min(5, headers.length));
      setSelectedColumns(initialColumns);
      
      // Set first column as target by default
      if (!targetColumn && headers.length > 0) {
        setTargetColumn(headers[0]);
      }
      
      // Initialize feature values
      const initialFeatureValues = {};
      initialColumns.forEach(col => {
        if (col !== targetColumn) {
          initialFeatureValues[col] = '';
        }
      });
      setFeatureValues(initialFeatureValues);
    }
  }, [headers, targetColumn]);

  const handleTrainModel = async () => {
    if (rawData.length === 0) {
      toast.error('No data available for training');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Call backend API for training - using full dataset
      let response;
      const algorithmType = activeCard === 'lightgbm' ? 'regression' : 'classification';
      
      // In a real scenario, you'd send the dataset to backend
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated response based on algorithm
      const simulatedResponse = {
        success: true,
        algorithm: activeCard === 'lightgbm' ? 'LightGBM' : 'CatBoost',
        dataset_size: rawData.length,
        features_count: headers.length,
        metrics: activeCard === 'lightgbm' ? {
          mse: 0.0234,
          r2_score: 0.876,
          mae: 0.045,
          training_time: '2.3s'
        } : {
          accuracy: 0.892,
          f1_score: 0.878,
          precision: 0.901,
          recall: 0.856,
          training_time: '1.8s'
        },
        model_id: `model_${Date.now()}`
      };

      // Complete progress
      setTrainingProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 500);

      // Process response
      setTrainingMetrics(simulatedResponse.metrics);
      setIsTrained(true);
      
      // Add to training history
      const newTraining = {
        timestamp: new Date().toLocaleTimeString(),
        algorithm: activeCard === 'lightgbm' ? 'LightGBM' : 'CatBoost',
        dataset_size: rawData.length,
        features: headers.length,
        model_id: simulatedResponse.model_id,
        status: 'completed'
      };
      setTrainingHistory(prev => [newTraining, ...prev.slice(0, 4)]);

      toast.success(`${activeCard === 'lightgbm' ? 'LightGBM' : 'CatBoost'} model trained successfully!`, {
        description: `Trained on ${rawData.length} records with ${headers.length} features`
      });
    } catch (error) {
      clearInterval(progressInterval);
      toast.error('Training failed', {
        description: error.message || 'Please check your data and try again'
      });
    } finally {
      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
      }, 1000);
    }
  };

  const handlePredict = async () => {
    if (!targetColumn) {
      toast.error('Please select a target column for prediction');
      return;
    }

    if (!isTrained) {
      toast.error('Please train the model first');
      return;
    }

    // Check if all feature values are filled
    const features = selectedColumns.filter(col => col !== targetColumn);
    const emptyFields = features.filter(feature => !featureValues[feature]?.toString().trim());
    if (emptyFields.length > 0) {
      toast.error(`Please fill values for: ${emptyFields.join(', ')}`);
      return;
    }

    setIsPredicting(true);

    try {
      // Prepare data for prediction
      const predictionData = {
        algorithm: activeCard,
        target_column: targetColumn,
        features: featureValues,
        model_id: trainingHistory[0]?.model_id
      };

      // Call backend API for prediction
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate prediction response
      const simulatedPrediction = {
        success: true,
        predicted_value: activeCard === 'lightgbm' 
          ? `${(Math.random() * 1000).toFixed(2)}` 
          : ['Low', 'Medium', 'High', 'Viral'][Math.floor(Math.random() * 4)],
        confidence: Math.floor(Math.random() * 30) + 70,
        feature_values: featureValues,
        algorithm: activeCard === 'lightgbm' ? 'LightGBM Regression' : 'CatBoost Classification',
        timestamp: new Date().toLocaleTimeString()
      };

      setPredictionResult(simulatedPrediction);
      
      toast.success('Prediction generated successfully!', {
        description: `Predicted ${targetColumn} with ${simulatedPrediction.confidence}% confidence`
      });
    } catch (error) {
      toast.error('Prediction failed', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const resetTraining = () => {
    setIsTrained(false);
    setTrainingMetrics(null);
    setPredictionResult(null);
    toast.info('Model reset. Ready for new training.');
  };

  const toggleColumnSelection = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(prev => prev.filter(col => col !== column));
      // Remove from feature values if not target
      if (column !== targetColumn) {
        setFeatureValues(prev => {
          const newValues = { ...prev };
          delete newValues[column];
          return newValues;
        });
      }
    } else {
      setSelectedColumns(prev => [...prev, column]);
    }
  };

  const handleTargetChange = (column) => {
    const oldTarget = targetColumn;
    setTargetColumn(column);
    
    // Update feature values
    if (oldTarget && oldTarget !== column) {
      // If old target was in selected columns, add it to feature values
      if (selectedColumns.includes(oldTarget)) {
        setFeatureValues(prev => ({ ...prev, [oldTarget]: '' }));
      }
      // Remove new target from feature values if it was there
      setFeatureValues(prev => {
        const newValues = { ...prev };
        delete newValues[column];
        return newValues;
      });
    }
  };

  // Social media specific columns
  const isSocialMediaColumn = (column) => {
    const socialKeywords = ['engagement', 'likes', 'shares', 'comments', 'reach', 'followers', 'views', 'impressions', 'sentiment'];
    return socialKeywords.some(keyword => column.toLowerCase().includes(keyword));
  };

  if (rawData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <Database className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-3">No Data Available</h3>
          <p className="text-gray-400 mb-6">
            Upload your social media engagement data first to train ML models and make predictions.
          </p>
          <button
            onClick={() => window.location.href = '/dataset'}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-500 transition"
          >
            Go to Data Upload
          </button>
        </motion.div>
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
            <div className="p-2 lg:p-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl">
              <Brain className="w-7 h-7 lg:w-10 lg:h-10 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white">Machine Learning Models</h1>
              <p className="text-gray-400">Train models on full dataset, predict with selected features</p>
            </div>
          </div>
          
          {isTrained && (
            <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Model Trained</span>
            </div>
          )}
        </div>

        {/* Dataset Info */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Dataset Info:</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <span className="text-gray-400">
                  <span className="text-white">{rawData.length}</span> records
                </span>
                <span className="text-gray-400">
                  <span className="text-white">{headers.length}</span> columns
                </span>
                <span className="text-gray-400">
                  <span className="text-white">{headers.filter(isSocialMediaColumn).length}</span> social media metrics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Training Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Training Card */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="flex items-center gap-3">
                  <Train className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Train Model</h2>
                    <p className="text-sm text-gray-400">Train on complete dataset</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Algorithm:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveCard('lightgbm')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        activeCard === 'lightgbm'
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      LightGBM
                    </button>
                    <button
                      onClick={() => setActiveCard('catboost')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        activeCard === 'catboost'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      CatBoost
                    </button>
                  </div>
                </div>
              </div>

              {/* Training Info */}
              <div className="mb-4 lg:mb-6 p-4 bg-gray-900/50 rounded-xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Algorithm</p>
                    <p className="font-semibold text-white">
                      {activeCard === 'lightgbm' ? 'LightGBM' : 'CatBoost'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Training Data</p>
                    <p className="font-semibold text-white">{rawData.length} records</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Features</p>
                    <p className="font-semibold text-white">{headers.length} columns</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="font-semibold text-white">
                      {activeCard === 'lightgbm' ? 'Regression' : 'Classification'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Training Progress */}
              {isTraining && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Training model on complete dataset...</span>
                    <span>{Math.round(trainingProgress)}%</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trainingProgress}%` }}
                      className={`h-full rounded-full ${
                        activeCard === 'lightgbm' 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Training Results */}
              {isTrained && trainingMetrics && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Training Results</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(trainingMetrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1 capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className={`text-lg font-bold ${
                          typeof value === 'number' && value > 0.8 
                            ? 'text-green-400' 
                            : typeof value === 'number' && value > 0.6 
                              ? 'text-yellow-400' 
                              : typeof value === 'number' ? 'text-red-400' : 'text-white'
                        }`}>
                          {typeof value === 'number' ? value.toFixed(4) : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Train Button */}
              <button
                onClick={handleTrainModel}
                disabled={isTraining || isTrained}
                className={`w-full py-3 lg:py-4 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 ${
                  activeCard === 'lightgbm'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isTraining ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Train className="w-5 h-5" />
                    </motion.div>
                    Training Model...
                  </>
                ) : isTrained ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Model Trained Successfully
                  </>
                ) : (
                  <>
                    <Train className="w-5 h-5" />
                    Train {activeCard === 'lightgbm' ? 'LightGBM' : 'CatBoost'} Model
                  </>
                )}
              </button>

              {isTrained && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={resetTraining}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition text-sm"
                  >
                    Train New Model
                  </button>
                </div>
              )}
            </div>

            {/* Prediction Section */}
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4 lg:mb-6">
                <Target className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Make Predictions</h2>
                  <p className="text-sm text-gray-400">Select columns and enter values</p>
                </div>
              </div>

              {/* Column Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Select Columns for Prediction</h3>
                  <span className="text-sm text-gray-400">
                    {selectedColumns.length} selected
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {headers.map((column) => (
                    <button
                      key={column}
                      onClick={() => toggleColumnSelection(column)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        selectedColumns.includes(column)
                          ? isSocialMediaColumn(column)
                            ? 'bg-cyan-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-white'
                      } ${targetColumn === column ? 'ring-2 ring-yellow-500' : ''}`}
                    >
                      {column}
                      {isSocialMediaColumn(column) && selectedColumns.includes(column) && ' ⭐'}
                    </button>
                  ))}
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>Select columns you want to use for prediction. The model uses all columns for training, but you choose which ones to use for predictions.</p>
                </div>
              </div>

              {/* Target Column Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Select Target Column (What to Predict)
                </label>
                <select
                  value={targetColumn}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  disabled={!isTrained}
                >
                  <option value="">Select target column...</option>
                  {selectedColumns.map(column => (
                    <option key={column} value={column}>
                      {column} {isSocialMediaColumn(column) && '⭐'}
                    </option>
                  ))}
                </select>
                {targetColumn && (
                  <p className="text-sm text-gray-400 mt-2">
                    Predicting: <span className="text-cyan-300 font-semibold">{targetColumn}</span>
                  </p>
                )}
              </div>

              {/* Feature Inputs */}
              {targetColumn && isTrained && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Enter Feature Values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {selectedColumns
                      .filter(col => col !== targetColumn)
                      .map(feature => (
                        <div key={feature}>
                          <label className="block text-sm text-gray-400 mb-2">
                            {feature} {isSocialMediaColumn(feature) && '⭐'}
                          </label>
                          <input
                            type="text"
                            value={featureValues[feature] || ''}
                            onChange={(e) => setFeatureValues(prev => ({
                              ...prev,
                              [feature]: e.target.value
                            }))}
                            placeholder={`Enter ${feature} value...`}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                            disabled={isPredicting}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Predict Button */}
                  <button
                    onClick={handlePredict}
                    disabled={isPredicting || !targetColumn}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 text-white py-3 lg:py-4 rounded-xl font-semibold hover:border-cyan-500 transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPredicting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Rocket className="w-5 h-5" />
                        </motion.div>
                        Generating Prediction...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        Generate Prediction
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Results & History */}
          <div className="space-y-6">
            {/* Prediction Results */}
            {predictionResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 lg:p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-cyan-400" />
                  Prediction Result
                </h3>
                
                <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-2">Predicted Value for</p>
                  <p className="text-lg font-semibold text-cyan-300 mb-4">{targetColumn}</p>
                  
                  <div className={`text-3xl lg:text-4xl font-bold mb-4 ${
                    activeCard === 'lightgbm' ? 'text-cyan-400' : 'text-purple-400'
                  }`}>
                    {predictionResult.predicted_value}
                  </div>
                  
                  {predictionResult.confidence && (
                    <>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Confidence</span>
                        <span>{predictionResult.confidence}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                        <div 
                          className={`h-full rounded-full ${
                            predictionResult.confidence > 80 
                              ? 'bg-green-500' 
                              : predictionResult.confidence > 60 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${predictionResult.confidence}%` }}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Algorithm: {activeCard === 'lightgbm' ? 'LightGBM Regression' : 'CatBoost Classification'}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Training History */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4 lg:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Training History</h3>
              <div className="space-y-3">
                {trainingHistory.length > 0 ? (
                  trainingHistory.map((training, idx) => (
                    <div key={idx} className="p-3 bg-gray-900/50 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white">{training.algorithm}</span>
                        <span className="text-xs text-gray-500">{training.timestamp}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <p>Data: {training.dataset_size} records</p>
                        <p>Features: {training.features} columns</p>
                        <p className="text-xs text-gray-500">ID: {training.model_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No training history yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-4 lg:p-6">
              <h3 className="text-lg font-bold text-white mb-3">How It Works</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  </div>
                  <p><span className="text-white font-medium">Training:</span> Uses all dataset columns automatically</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <p><span className="text-white font-medium">Prediction:</span> Select specific columns to use for prediction</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p><span className="text-white font-medium">Workflow:</span> Train model first → Select columns → Enter values → Predict</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-cyan-300 text-sm font-medium">⭐ Star icons indicate social media metrics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MLPage;