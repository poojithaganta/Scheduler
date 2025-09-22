import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// File upload storage
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  },
});
const upload = multer({ storage });

async function getDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tardus',
  });
  return connection;
}

app.post('/api/employees', upload.single('resume'), async (req, res) => {
  const { name, email, phone, address, officeLocation } = req.body;
  const resumeFile = req.file ? req.file.filename : null;

  if (!name || !email || !phone || !address || !officeLocation) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = await getDb();
    const [result] = await db.execute(
      `INSERT INTO employees (name, email, phone, address, officeLocation, resumeFile)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, officeLocation, resumeFile]
    );
    await db.end();
    return res.status(201).json({ success: true, id: result.insertId, officeLocation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


