const express = require('express');
const app = express();
const notesRouter = require('./routes/notes');
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/notes', notesRouter);

// Endpoint root
app.get('/', (req, res) => {
  res.json({
    message: "Note API is running!",
    endpoints: {
      getAllNotes: "GET /notes",
      addNote: "POST /notes",
      getNote: "GET /notes/:id"
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});