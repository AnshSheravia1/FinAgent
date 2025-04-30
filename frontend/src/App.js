import React, { useState } from 'react';
import './App.css';
import ResultsViewer from './components/ResultsViewer';
import ErrorBoundary from './components/ErrorBoundary';
import { FaMoon, FaSun } from 'react-icons/fa';

// API endpoint configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/api/analyze`);
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze file');
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      
      <header className="App-header">
        <h1>Transaction Analyzer</h1>
        <p>Upload your transaction file to analyze patterns and anomalies</p>
      </header>

      <main>
        <ErrorBoundary>
          <div className="file-upload-container">
            <label htmlFor="file-upload" className="file-upload-label">
              <div className="upload-icon">📁</div>
              <span>Choose a file or drag it here</span>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="file-upload-input"
              />
            </label>
          </div>

          {loading && (
            <div className="loading">
              Analyzing your transactions...
            </div>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {results && (
            <ErrorBoundary>
              <ResultsViewer results={results} darkMode={darkMode} />
            </ErrorBoundary>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App; 