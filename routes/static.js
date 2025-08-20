const express = require('express');
const path = require('path');
const router = express.Router();

// Serve JavaScript scripts from routes/scripts
router.use('/js', express.static(path.join(__dirname, 'scripts')));

module.exports = router;