const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

// Serve your React app from the 'dist' folder
app.use(express.static('dist'));

// API routes
app.get('/api', (req, res) => {
  // Fetch and return your data here
  res.json({ message: 'Hello from the API!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});