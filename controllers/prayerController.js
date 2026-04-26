const prayerService = require('../services/prayerService');

const getPrayerTimes = async (req, res) => {
  try {
    const { city, country = 'Bangladesh', date, latitude, longitude, school, method, tune } = req.query;

    if (!city && !(latitude && longitude)) {
      return res.status(400).json({ error: 'City or Latitude/Longitude are required' });
    }

    // Default date to today if not provided (format: DD-MM-YYYY)
    let searchDate = date;
    if (!searchDate) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      searchDate = `${day}-${month}-${year}`;
    }

    const data = await prayerService.getPrayerTimes(city, country, searchDate, latitude, longitude, school, method, tune);
    
    res.json({
      city: data.city.charAt(0).toUpperCase() + data.city.slice(1),
      date: data.date,
      readableDate: data.readableDate,
      hijriDate: data.hijriDate,
      timings: {
        Fajr: data.timings.Fajr,
        Sunrise: data.timings.Sunrise,
        Dhuhr: data.timings.Dhuhr,
        Asr: data.timings.Asr,
        Sunset: data.timings.Sunset,
        Maghrib: data.timings.Maghrib,
        Isha: data.timings.Isha
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
};

module.exports = {
  getPrayerTimes
};
