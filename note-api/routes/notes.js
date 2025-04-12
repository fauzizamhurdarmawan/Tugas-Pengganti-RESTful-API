const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all notes
router.get('/', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }
    res.json(rows);
  });
});

// GET single note by ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch note' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(row);
  });
});

// POST new note
router.post('/', (req, res) => {
  const { judul, isi, tanggal } = req.body;
  
  // Validation
  if (!judul || !isi || !tanggal) {
    return res.status(400).json({ 
      error: 'Missing required fields: judul, isi, tanggal' 
    });
  }

  db.run(
    'INSERT INTO notes (judul, isi, tanggal) VALUES (?, ?, ?)',
    [judul, isi, tanggal],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create note' });
      }
      res.status(201).json({
        id: this.lastID,
        judul,
        isi,
        tanggal
      });
    }
  );
});

// UPDATE note
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { judul, isi, tanggal } = req.body;

  if (!judul || !isi || !tanggal) {
    return res.status(400).json({ 
      error: 'Missing required fields: judul, isi, tanggal' 
    });
  }

  db.run(
    'UPDATE notes SET judul = ?, isi = ?, tanggal = ? WHERE id = ?',
    [judul, isi, tanggal, id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update note' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.json({
        id: Number(id),
        judul,
        isi,
        tanggal,
        message: 'Note updated successfully'
      });
    }
  );
});

// DELETE note
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete note' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ 
      message: 'Note deleted successfully',
      id: Number(id)
    });
  });
});

module.exports = router;