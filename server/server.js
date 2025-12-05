const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Define the absolute path to the uploads directory robustly
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');

// 1. Setup Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure directory exists using the absolute path
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR);
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// CRITICAL FIX: Serve Uploaded Files Statically using the absolute path
app.use('/uploads', express.static(UPLOADS_DIR)); 

// 2. Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  let type = 'pictures';
  if (req.file.mimetype.startsWith('video/')) {
    type = req.file.size < 10 * 1024 * 1024 ? 'shorts' : 'videos';
  }

  const fileData = {
    id: req.file.filename,
    name: req.file.originalname,
    type: type,
    size: req.file.size 
  };

  console.log(`✅ File Received: ${fileData.name}`);
  res.json({ message: 'File uploaded successfully!', data: fileData });
});

// 3. Get All Files Route
app.get('/api/files', (req, res) => {
  if (!fs.existsSync(UPLOADS_DIR)) return res.json([]);

  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return res.status(500).send({ message: "Unable to scan files!" });

    // Determine the base URL dynamically (handles localhost:5000 or ngrok address)
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const fileInfos = files.map((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      let type = 'pictures';
      if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
        type = stats.size < 10 * 1024 * 1024 ? 'shorts' : 'videos';
      }

      return {
        id: file,
        name: file.substring(file.indexOf('-') + 1),
        url: `${baseUrl}/uploads/${file}`, 
        type: type,
        size: stats.size,
        date: new Date(stats.mtime)
      };
    });

    fileInfos.sort((a, b) => b.date - a.date);
    res.status(200).send(fileInfos);
  });
});

// 4. Stats Route
app.get('/api/stats', (req, res) => {
  const directoryPath = UPLOADS_DIR;
  
  if (!fs.existsSync(directoryPath)) {
    return res.json({ totalMedia: 0, totalSize: '0 MB', activePosts: 0 });
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.json({ totalMedia: 0, totalSize: '0 MB' });

    let totalSizeBytes = 0;
    files.forEach(file => {
      const stats = fs.statSync(path.join(directoryPath, file));
      totalSizeBytes += stats.size;
    });

    const totalSizeMB = (totalSizeBytes / 1024 / 1024).toFixed(2);

    res.json({
      totalMedia: files.length,
      totalSize: totalSizeMB + ' MB',
      activePosts: Math.floor(files.length * 0.2), 
      engagement: '12.5k'
    });
  });
});

// 5. Delete Files Route
app.post('/api/files/delete', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) { return res.status(400).json({ message: "Invalid file list" }); }
  const directoryPath = UPLOADS_DIR;
  let deletedCount = 0;
  ids.forEach(filename => {
    const safeName = path.basename(filename);
    const filePath = path.join(directoryPath, safeName);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); deletedCount++; console.log(`Deleted: ${safeName}`); } catch (err) { console.error(`Failed to delete ${safeName}:`, err); }
    }
  });
  res.json({ message: `Deleted ${deletedCount} files successfully.` });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});