import React from 'react';
import './ResultsViewer.css';

const formatCurrency = (value) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  return !isNaN(value) ? `$${value.toFixed(2)}` : '$0.00';
};

const ResultsViewer = ({ results, darkMode }) => {
  if (!results) return null;

  return (
    <div className={`results-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="results-section">
        <h2>Transaction Analysis</h2>
        <div className="results-grid">
          <div className="result-card">
            <h3>Total Transactions</h3>
            <p className="result-value">{results.length || 0}</p>
          </div>
          <div className="result-card">
            <h3>Total Amount</h3>
            <p className="result-value">{formatCurrency(results.reduce((sum, t) => sum + t.amount, 0))}</p>
          </div>
          <div className="result-card">
            <h3>Average Transaction</h3>
            <p className="result-value">{formatCurrency(results.length > 0 ? 
              results.reduce((sum, t) => sum + t.amount, 0) / results.length : 0)}</p>
          </div>
        </div>
      </div>

      <div className="results-section">
        <h2>Transaction Details</h2>
        <div className="transactions-list">
          {results.map((transaction, index) => (
            <div key={index} className="transaction-card">
              <div className="transaction-header">
                <h3>{transaction.description}</h3>
                <span className={`category-badge ${transaction.category.toLowerCase().replace(/\s+/g, '-')}`}>
                  {transaction.category}
                </span>
              </div>
              <div className="transaction-details">
                <p className="transaction-date">{transaction.date}</p>
                <p className={`transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
              {transaction.suggestion && (
                <p className="transaction-suggestion">
                  <span className="suggestion-icon">💡</span>
                  {transaction.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsViewer; 