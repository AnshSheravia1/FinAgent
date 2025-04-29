import React from 'react';
import './ResultsViewer.css';

function ResultsViewer({ results }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFlagColor = (flag) => {
    if (!flag) return 'gray';
    
    switch (flag.toLowerCase()) {
      case 'normal':
        return 'green';
      case 'suspicious':
        return 'orange';
      case 'anomaly':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (!results || !Array.isArray(results)) {
    return <div className="error">No results to display</div>;
  }

  return (
    <div className="results-viewer">
      <h2>Transaction Analysis</h2>
      <div className="transactions-list">
        {results.map((transaction, index) => (
          <div key={index} className="transaction-card">
            <div className="transaction-header">
              <span className="date">{transaction.date}</span>
              <span className={`flag ${getFlagColor(transaction.flag)}`}>
                {transaction.flag || 'Unknown'}
              </span>
            </div>
            <div className="transaction-details">
              <h3>{transaction.description}</h3>
              <p className="amount">{formatAmount(transaction.amount)}</p>
              <p className="category">Category: {transaction.category || 'Uncategorized'}</p>
              {transaction.suggestion && (
                <p className="suggestion">Suggestion: {transaction.suggestion}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsViewer; 