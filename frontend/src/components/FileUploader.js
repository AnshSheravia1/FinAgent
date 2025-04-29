import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUploader.css';

function FileUploader({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="file-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here...</p>
        ) : (
          <div>
            <p>Drag and drop a CSV file here, or click to select</p>
            <p className="file-type">Only CSV files are accepted</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploader; 