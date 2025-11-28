const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Setup Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  let type = 'image';
  if (req.file.mimetype.startsWith('video/')) {
    type = 'video';
  }

  const fileData = {
    id: req.file.filename,
    name: req.file.originalname,
    path: req.file.path,
    type: type,
    size: req.file.size
  };

  console.log(`✅ File Received: ${fileData.name}`);
  res.json({ message: 'File uploaded successfully!', data: fileData });
});

// 3. Get All Files Route
app.get('/api/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  if (!fs.existsSync(directoryPath)) return res.json([]);

  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.status(500).send({ message: "Unable to scan files!" });

    const fileInfos = files.map((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      let type = 'pictures';
      if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
        type = stats.size < 10 * 1024 * 1024 ? 'shorts' : 'videos';
      }

      return {
        id: file,
        name: file.substring(file.indexOf('-') + 1),
        url: `http://localhost:5000/uploads/${file}`,
        type: type,
        size: stats.size,
        date: new Date(stats.mtime)
      };
    });

    // Sort by newest first
    fileInfos.sort((a, b) => b.date - a.date);
    res.status(200).send(fileInfos);
  });
});

// 4. Stats Route
app.get('/api/stats', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  
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

// 5. NEW: Delete Files Route
app.post('/api/files/delete', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "Invalid file list" });
  }

  const directoryPath = path.join(__dirname, 'uploads');
  let deletedCount = 0;

  ids.forEach(filename => {
    // Security check to ensure filename is just a basename
    const safeName = path.basename(filename);
    const filePath = path.join(directoryPath, safeName);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`Deleted: ${safeName}`);
      } catch (err) {
        console.error(`Failed to delete ${safeName}:`, err);
      }
    }
  });

  res.json({ message: `Deleted ${deletedCount} files successfully.` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});