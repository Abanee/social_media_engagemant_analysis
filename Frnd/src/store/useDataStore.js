import { create } from 'zustand';

const useDataStore = create((set) => ({
  // Data State
  rawData: [],
  headers: [],
  processedData: [],
  
  // ML State
  targetColumn: '',
  modelType: 'regression', // 'regression' or 'classification'
  modelResults: null,
  predictionResult: null,
  isLoading: false,
  
  // Analysis Results
  edaResults: null,
  preprocessingResults: null,
  visualizationData: null,

  // Actions
  setRawData: (data) => set({ rawData: data }),
  setHeaders: (headers) => set({ headers }),
  
  updateHeader: (oldHeader, newHeader) => set((state) => {
    const newHeaders = state.headers.map(h => h === oldHeader ? newHeader : h);
    const newRawData = state.rawData.map(row => {
      const newRow = { ...row };
      if (row.hasOwnProperty(oldHeader)) {
        newRow[newHeader] = row[oldHeader];
        delete newRow[oldHeader];
      }
      return newRow;
    });
    return { headers: newHeaders, rawData: newRawData };
  }),

  setProcessedData: (data) => set({ processedData: data }),
  setTargetColumn: (column) => set({ targetColumn: column }),
  setModelType: (type) => set({ modelType: type }),
  setModelResults: (results) => set({ modelResults: results }),
  setPredictionResult: (result) => set({ predictionResult: result }),
  setEDAResults: (results) => set({ edaResults: results }),
  setPreprocessingResults: (results) => set({ preprocessingResults: results }),
  setVisualizationData: (data) => set({ visualizationData: data }),
  setLoading: (loading) => set({ isLoading: loading }),

  resetData: () => set({
    rawData: [],
    headers: [],
    processedData: [],
    targetColumn: '',
    modelType: 'regression',
    modelResults: null,
    predictionResult: null,
    edaResults: null,
    preprocessingResults: null,
    visualizationData: null
  })
}));

export default useDataStore;