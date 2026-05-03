const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/hadith-of-the-day', contentController.getHadithOfTheDay);
router.get('/dua-of-the-day', contentController.getDuaOfTheDay);

module.exports = router;
