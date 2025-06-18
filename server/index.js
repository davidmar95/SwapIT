import express from 'express';
import multer from 'multer';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// default server port
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SQLite setup
let db;
const initDB = async () => {
  db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      type TEXT,
      name TEXT,
      contact TEXT,
      location TEXT,
      condition TEXT,
      price TEXT,
      mode TEXT,
      image TEXT,
      createdAt TEXT
    )
  `);
};
initDB();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // must exist
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

// Routes
app.get('/items', async (req, res) => {
  try {
    const items = await db.all('SELECT * FROM items ORDER BY createdAt DESC');
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/items', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is missing' });
    }

    const {
      title, description, type,
      name, contact, location,
      condition, price, mode, createdAt
    } = req.body;

    const imagePath = `/uploads/${req.file.filename}`;

    await db.run(
      `INSERT INTO items 
       (title, description, type, name, contact, location, condition, price, mode, image, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, type, name, contact, location, condition, price, mode, imagePath, createdAt]
    );

    res.status(201).json({ message: 'Item uploaded successfully' });
  } catch (err) {
    console.error('Error uploading item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.run('DELETE FROM items WHERE id = ?', id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
