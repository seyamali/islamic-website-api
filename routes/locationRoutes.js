const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/countries', locationController.getCountries);
router.get('/cities', locationController.getCities);

module.exports = router;
