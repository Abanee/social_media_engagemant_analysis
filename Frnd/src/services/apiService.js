import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiService = {
  async uploadDataset(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async preprocessDataset(datasetId) {
    const response = await axios.post(`${API_BASE_URL}/preprocess/${datasetId}/`);
    return response.data;
  },

  async fetchEDA(datasetId) {
    const response = await axios.get(`${API_BASE_URL}/eda/${datasetId}/`);
    return response.data;
  },

  async trainModel(datasetId, targetColumn, problemType) {
    const response = await axios.post(`${API_BASE_URL}/train/`, {
      dataset_id: datasetId,
      target_column: targetColumn,
      problem_type: problemType,
    });
    return response.data;
  },

  async makePrediction(modelId, features) {
    const response = await axios.post(`${API_BASE_URL}/predict/`, {
      model_id: modelId,
      features: features,
    });
    return response.data;
  },
};

export default apiService;
