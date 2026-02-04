import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Upload, FileText, Edit2, Check, X, Trash2 } from 'lucide-react';
import useDataStore from '../store/useDataStore';
import { toast } from 'sonner';

const DatasetPage = () => {
  const { rawData, headers, setRawData, setHeaders, updateHeader, resetData } = useDataStore();
  const [editingHeader, setEditingHeader] = useState(null);
  const [editValue, setEditValue] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setRawData(results.data);
          setHeaders(Object.keys(results.data[0]));
          toast.success(`Loaded ${results.data.length} rows successfully!`);
        }
      },
      error: (error) => {
        toast.error('Failed to parse CSV: ' + error.message);
      }
    });
  }, [setRawData, setHeaders]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const startEditing = (header) => {
    setEditingHeader(header);
    setEditValue(header);
  };

  const saveHeader = () => {
    if (editValue.trim() && editValue !== editingHeader) {
      updateHeader(editingHeader, editValue.trim());
      toast.success('Column renamed successfully!');
    }
    setEditingHeader(null);
  };

  const cancelEditing = () => {
    setEditingHeader(null);
    setEditValue('');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dataset Manager</h1>
            <p className="text-gray-400">Upload and manage your data</p>
          </div>
          {rawData.length > 0 && (
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-600/30 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear Data
            </button>
          )}
        </div>

        {/* Upload Area */}
        {rawData.length === 0 ? (
          <motion.div
            {...getRootProps()}
            whileHover={{ scale: 1.02 }}
            className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              {isDragActive ? 'Drop your CSV here!' : 'Drag & Drop CSV File'}
            </h3>
            <p className="text-gray-400">or click to browse</p>
          </motion.div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-b border-gray-700 p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">
                  {rawData.length} rows × {headers.length} columns
                </span>
                <span className="ml-auto text-sm text-gray-400">
                  Click column headers to rename
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    {headers.map((header, idx) => (
                      <th key={idx} className="px-4 py-3 text-left border-b border-gray-700">
                        {editingHeader === header ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveHeader()}
                              className="bg-gray-800 border border-cyan-500 rounded px-2 py-1 text-white text-sm focus:outline-none"
                              autoFocus
                            />
                            <button onClick={saveHeader} className="text-green-400 hover:text-green-300">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={cancelEditing} className="text-red-400 hover:text-red-300">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(header)}
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition group"
                          >
                            <span className="font-semibold">{header}</span>
                            <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rawData.slice(0, 20).map((row, rowIdx) => (
                    <motion.tr
                      key={rowIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIdx * 0.02 }}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition"
                    >
                      {headers.map((header, colIdx) => (
                        <td key={colIdx} className="px-4 py-3 text-gray-300 text-sm">
                          {row[header] || '-'}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rawData.length > 20 && (
              <div className="bg-gray-900/50 p-4 text-center text-gray-400 text-sm">
                Showing 20 of {rawData.length} rows
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DatasetPage;