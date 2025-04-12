const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Perbaikan: Hilangkan tanda kurung berlebih dan gunakan callback
const db = new sqlite3.Database(
  path.join(__dirname, 'db', 'notes.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to SQLite database');
      
      // Buat tabel
      db.run(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          judul TEXT NOT NULL,
          isi TEXT NOT NULL,
          tanggal TEXT NOT NULL
        )`, (err) => {
          if (err) {
            console.error('Error creating table:', err);
          } else {
            console.log('Notes table ready');
          }
      });
    }
  }
);

module.exports = db;