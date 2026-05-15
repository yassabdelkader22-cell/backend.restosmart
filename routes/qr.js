const express = require('express');
const router = express.Router();
const { generateQRCode } = require('../utils/qrGenerator');

router.post('/generate', async (req, res) => {
  try {
    const { format, size, margin, errorCorrectionLevel } = req.body;
    const result = await generateQRCode(req.body, {
      format,
      size,
      margin,
      errorCorrectionLevel,
    });

    res.type(result.mimeType);
    res.send(result.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
