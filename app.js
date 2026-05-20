const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { parseSRT } = require('./srt_decoder');
const config = require('./config');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const dbPool = mysql.createPool({
  host: config.DB.host,
  user: config.DB.user,
  password: config.DB.password,
  database: config.DB.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function saveSRTtoDB(subtitles, fileId) {
  const conn = await dbPool.getConnection();
  try {
    for (const sub of subtitles) {
      await conn.execute(
        'INSERT INTO marks (file_id, time_msec, start_time, recognition0) VALUES (?, ?, ?, ?)',
        [fileId, sub.time_msec, sub.start_time, sub.recognition0]
      );
    }
  } finally {
    conn.release();
  }
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', upload.single('srtFile'), async (req, res) => {
  const timestamp = new Date().toISOString();

  try {
    if (!req.file) {
      console.log(`[${timestamp}] no file uploaded`);
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = parseInt(req.body.fileId);
    if (!fileId || isNaN(fileId)) {
      console.log(`[${timestamp}] invalid fileId: ${req.body.fileId}`);
      return res.status(400).json({ error: 'Invalid fileId' });
    }

    const content = req.file.buffer.toString('utf-8');
    const subtitles = parseSRT(content);

    if (subtitles.length === 0) {
      console.log(`[${timestamp}] empty SRT fileId:${fileId}`);
      return res.status(400).json({ error: 'No subtitles found in SRT' });
    }

    await saveSRTtoDB(subtitles, fileId);
    console.log(`[${timestamp}] saved ${subtitles.length} subtitles fileId:${fileId}`);

    res.json({
      success: true,
      count: subtitles.length
    });

  } catch (error) {
    console.log(`[${timestamp}] error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.listen(config.PORT, () => {
  console.log(`[${new Date().toISOString()}] running on port ${config.PORT}`);
});
