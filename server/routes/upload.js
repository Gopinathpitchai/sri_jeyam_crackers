const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAdmin } = require('../middleware/auth');

// Upload directory: client/public/images/uploads (with safe serverless fallback)
const isVercel = !!process.env.VERCEL;
const uploadDir = isVercel
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '../../client/public/images/uploads');

function ensureUploadDir() {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn('[Upload] Read-only filesystem, skipping local mkdir:', err.message);
    return false;
  }
}

// POST /api/upload (Admin only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Check if image is base64 data URL
    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If already a valid URL or path, just return it
      if (image.startsWith('http') || image.startsWith('/')) {
        return res.json({ url: image });
      }
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanBaseName = (filename || 'product')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const newFilename = `${cleanBaseName}_${Date.now()}.${ext}`;
    
    ensureUploadDir();
    const filePath = path.join(uploadDir, newFilename);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/images/uploads/${newFilename}`;
    console.log(`[Upload] Image saved: ${relativeUrl} (${Math.round(buffer.length / 1024)} KB)`);

    return res.json({
      success: true,
      url: relativeUrl,
      size: buffer.length
    });
  } catch (err) {
    console.warn('Filesystem write failed (likely serverless environment), returning data URL:', err.message);
    return res.json({
      success: true,
      url: req.body.image,
      fallback: true
    });
  }
});

module.exports = router;
