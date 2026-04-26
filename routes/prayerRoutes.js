const express = require('express');
const router = express.Router();
const prayerController = require('../controllers/prayerController');

// GET /api/prayer-times
router.get('/prayer-times', prayerController.getPrayerTimes);

module.exports = router;
