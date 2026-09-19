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

const { supabase } = require('../config/supabase');

// POST /api/upload (Admin only)
router.post('/', requireAdmin, async (req, res) => {
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

    // 1. Primary: Upload to Supabase Storage for permanent global CDN hosting
    if (supabase && supabase.storage) {
      try {
        const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('product-images')
          .upload(newFilename, buffer, {
            contentType,
            upsert: true
          });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(newFilename);

          if (urlData && urlData.publicUrl) {
            console.log(`[Upload] Image uploaded to Supabase Storage: ${urlData.publicUrl}`);

            // Also keep local copy if running on local server
            if (!isVercel) {
              try {
                ensureUploadDir();
                fs.writeFileSync(path.join(uploadDir, newFilename), buffer);
              } catch (_) {}
            }

            return res.json({
              success: true,
              url: urlData.publicUrl,
              size: buffer.length
            });
          }
        } else {
          console.warn('[Upload] Supabase Storage warning:', uploadErr.message);
        }
      } catch (storageErr) {
        console.warn('[Upload] Storage exception, falling back:', storageErr.message);
      }
    }

    // 2. Localhost fallback
    if (!isVercel) {
      ensureUploadDir();
      const filePath = path.join(uploadDir, newFilename);
      fs.writeFileSync(filePath, buffer);
      const relativeUrl = `/images/uploads/${newFilename}`;
      console.log(`[Upload] Image saved locally: ${relativeUrl}`);
      return res.json({
        success: true,
        url: relativeUrl,
        size: buffer.length
      });
    }

    // 3. Fallback for serverless if storage is not reachable: return full base64 data URL
    return res.json({
      success: true,
      url: image,
      fallback: true
    });
  } catch (err) {
    console.warn('Upload error, returning original image data URL:', err.message);
    return res.json({
      success: true,
      url: req.body.image,
      fallback: true
    });
  }
});

module.exports = router;
