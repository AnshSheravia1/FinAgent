const express = require('express');
const multer = require('multer');
const csv = require('csv-parse');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Format date from DD/MM/YYYY to YYYY-MM-DD
const formatDate = (dateStr) => {
  try {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (error) {
    console.error('Date parsing error:', error);
    return dateStr;
  }
};

// Parse CSV to JSON
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    console.log('Starting CSV parsing...');
    
    require('fs')
      .createReadStream(filePath)
      .pipe(csv.parse({ 
        columns: true, 
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          console.log(`Parsing column ${context.column} with value:`, value);
          
          // Convert amount to number (remove any currency symbols and commas)
          if (context.column === 'Amount') {
            const cleanValue = value.replace(/[^0-9.-]/g, '');
            const num = parseFloat(cleanValue);
            console.log(`Converted amount ${value} to number:`, num);
            return isNaN(num) ? 0 : num;
          }
          
          // Format date
          if (context.column === 'Date') {
            const formatted = formatDate(value.trim());
            console.log(`Formatted date ${value} to:`, formatted);
            return formatted;
          }
          
          return value.trim();
        }
      }))
      .on('data', (data) => {
        console.log('Raw CSV row:', data);
        // Ensure all required fields are present and properly formatted
        const processed = {
          date: data.Date || '',
          description: data.Description || '',
          amount: typeof data.Amount === 'number' ? data.Amount : 0
        };
        console.log('Processed row:', processed);
        results.push(processed);
      })
      .on('end', () => {
        console.log('CSV parsing complete. Results:', results);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
};

// Process transactions with Groq
const processTransactions = async (transactions) => {
  console.log('Starting transaction processing with Groq...');
  console.log('Input transactions:', transactions);

  const prompt = `You are a financial analysis AI. Analyze these transactions and return ONLY a JSON array. Each object in the array must have these exact fields:
- date: string (YYYY-MM-DD format)
- description: string
- amount: number (positive for income, negative for expenses)
- category: string (e.g., "Food & Dining", "Transportation", "Income", "Shopping", "Entertainment", "Bills & Utilities")
- flag: string (must be exactly one of: "Normal", "Suspicious", "Anomaly")
- suggestion(optional): string (optional financial advice), give the suggestion only if the expense seems to be more than what is expected from the particular category.

Rules for categorization:
1. Salary/Income -> "Income"
2. Food/Restaurant/Coffee -> "Food & Dining"
3. Transportation/Gas/Uber -> "Transportation"
4. Shopping/Amazon/Apple -> "Shopping"
5. Netflix/Entertainment -> "Entertainment"
6. Utilities/Bills/Credit Card -> "Bills & Utilities"

Example format:
[
  {
    "date": "2024-12-01",
    "description": "Starbucks",
    "amount": -5.60,
    "category": "Food & Dining",
    "flag": "Normal",
    "suggestion": "Consider reducing daily coffee expenses"
  }
]

Here are the transactions to analyze:
${JSON.stringify(transactions, null, 2)}

Return ONLY the JSON array, no other text or explanation. Every transaction must have all required fields.`;

  try {
    console.log('Sending request to Groq...');
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Received response from Groq:', response.data);
    const content = response.data.choices[0].message.content;
    console.log('Groq response content:', content);

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(content);
      console.log('Parsed Groq response:', parsedResponse);
      
      const transactions = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
      console.log('Normalized transactions array:', transactions);
      
      // Validate and ensure all required fields are present
      const validatedTransactions = transactions.map(transaction => {
        const validated = {
          date: transaction.date || '',
          description: transaction.description || '',
          amount: typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount) || 0,
          category: transaction.category || 'Uncategorized',
          flag: transaction.flag || 'Normal',
          suggestion: transaction.suggestion || ''
        };
        console.log('Validated transaction:', validated);
        return validated;
      });

      console.log('Final validated transactions:', validatedTransactions);
      return validatedTransactions;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', content);
      throw new Error('Invalid JSON response from Groq');
    }
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('Failed to process transactions with Groq');
  }
};

app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    console.log('Received file upload request');
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('File details:', {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });

    const transactions = await parseCSV(req.file.path);
    console.log('Parsed transactions:', JSON.stringify(transactions, null, 2));
    
    if (!transactions || transactions.length === 0) {
      console.error('No transactions found in file');
      return res.status(400).json({ error: 'No valid transactions found in file' });
    }

    const analyzedTransactions = await processTransactions(transactions);
    console.log('Analyzed transactions:', JSON.stringify(analyzedTransactions, null, 2));
    
    res.json(analyzedTransactions);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
