import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import ResultsViewer from './components/ResultsViewer';
import './App.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    console.log('Uploading file:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze file');
      }

      const data = await response.json();
      console.log('Received response from backend:', data);
      setResults(data);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FinAgent</h1>
        <p>AI-Powered Financial Analysis</p>
      </header>
      
      <main>
        <FileUploader onFileUpload={handleFileUpload} />
        
        {loading && <div className="loading">Analyzing your transactions...</div>}
        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <p>Please make sure the backend server is running on port 3001</p>
          </div>
        )}
        {results && <ResultsViewer results={results} />}
      </main>
    </div>
  );
}

export default App; 