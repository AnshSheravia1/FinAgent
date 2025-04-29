# FinAgent - AI-Powered Financial Analysis

FinAgent is a modern web application that uses AI to analyze financial transactions and provide insights. It processes CSV files containing transaction data and uses Groq's Mixtral model to categorize transactions, detect anomalies, and provide personalized suggestions.

## Features

- CSV file upload with drag-and-drop support
- AI-powered transaction analysis
- Categorization of expenses
- Fraud and anomaly detection
- Budget improvement suggestions
- Modern, responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Groq API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finagent.git
cd finagent
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## CSV File Format

The application expects CSV files with the following columns:
- Date (YYYY-MM-DD)
- Description
- Amount (positive for income, negative for expenses)

Example:
```csv
Date,Description,Amount
2024-12-01,Starbucks,-5.60
2024-12-03,Salary,2500.00
2024-12-04,Uber Ride,-15.00
2024-12-05,Amazon,-120.00
```

## Technologies Used

- Frontend:
  - React
  - react-dropzone
  - CSS3

- Backend:
  - Node.js
  - Express
  - Groq API (llama-3.3-70b-versatile)
  - csv-parse
  - multer

## License

MIT 
