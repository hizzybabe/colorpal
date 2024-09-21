app.post('/generate-palette', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    if (!prompt) {
      throw new Error('No prompt provided');
    }

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

    // Try to parse the response as JSON, if it fails, attempt to extract color codes
    let colors;
    try {
      colors = JSON.parse(text);
    } catch (parseError) {
      console.log('Failed to parse response as JSON, attempting to extract color codes');
      colors = text.match(/#[0-9A-Fa-f]{6}/g);
    }

    if (!Array.isArray(colors) || colors.length !== 5) {
      throw new Error('Invalid color data received from AI');
    }

    console.log('Parsed colors:', colors);

    res.json(colors);
  } catch (error) {
    console.error('Error generating palette:', error);
    res.status(500).json({ error: 'Failed to generate palette', details: error.message });
  }
});