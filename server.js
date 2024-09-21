const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-palette', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(`
      Generate a color palette based on the following description: "${prompt}".
      Provide the result as a JSON array of 5 hex color codes.
      Example response format: ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF3"]
    `);

    console.log('Received response from Gemini API');
    const response = result.response;
    const text = response.text();
    console.log('Raw response:', text);

    const colors = JSON.parse(text);
    console.log('Parsed colors:', colors);

    // Create an array of objects with color and hex code
    const colorData = colors.map(color => ({ color, hexCode: color }));

    res.json(colorData);
  } catch (error) {
    console.error('Error generating palette:', error);
    res.status(500).json({ error: 'Failed to generate palette', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});