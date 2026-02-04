import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Update with your Django backend URL

const apiService = {
  // Upload and process CSV
  async uploadCSV(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get data preview
  async getDataPreview() {
    const response = await axios.get(`${API_BASE_URL}/preview/`);
    return response.data;
  },

  // Preprocessing
  async preprocessData(options) {
    const response = await axios.post(`${API_BASE_URL}/preprocess/`, options);
    return response.data;
  },

  // EDA Processing
  async performEDA() {
    const response = await axios.get(`${API_BASE_URL}/eda/`);
    return response.data;
  },

  // Train Regression Model (LightGBM)
  async trainRegression(targetColumn, features) {
    const response = await axios.post(`${API_BASE_URL}/train/regression/`, {
      target: targetColumn,
      features: features,
      model_type: 'lightgbm'
    });
    return response.data;
  },

  // Train Classification Model (CatBoost)
  async trainClassification(targetColumn, features) {
    const response = await axios.post(`${API_BASE_URL}/train/classification/`, {
      target: targetColumn,
      features: features,
      model_type: 'catboost'
    });
    return response.data;
  },

  // Make Predictions
  async makePrediction(modelType, features) {
    const response = await axios.post(`${API_BASE_URL}/predict/`, {
      model_type: modelType,
      features: features
    });
    return response.data;
  },

  // Get Visualizations
  async getVisualizations() {
    const response = await axios.get(`${API_BASE_URL}/visualizations/`);
    return response.data;
  }
};

export default apiService;