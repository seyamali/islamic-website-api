const axios = require('axios');
const PrayerTimes = require('../models/PrayerTimes');

const getPrayerTimes = async (city, country, date, latitude, longitude, school, method, tune) => {
  try {
    const query = latitude && longitude 
      ? { latitude, longitude, date, school, method, tune }
      : { city: city?.toLowerCase(), date, school, method, tune };

    // 1. Check MongoDB first (Simplified for this example)
    const cachedData = await PrayerTimes.findOne(query);

    if (cachedData) {
      console.log(`Returning cached data for ${city || latitude} on ${date}`);
      return cachedData;
    }

    // 2. If not found, fetch from external API
    console.log(`Fetching from external API for ${city || latitude} on ${date}`);
    
    const s = (school === 'undefined' || !school) ? 0 : parseInt(school);
    const m = (method === 'undefined' || !method) ? 2 : parseInt(method);

    let url;
    if (latitude && longitude) {
      url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&school=${s}&method=${m}&tune=${tune || ''}`;
    } else {
      url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city}&country=${country}&school=${s}&method=${m}&tune=${tune || ''}`;
    }

    const response = await axios.get(url);

    if (!response.data || response.data.code !== 200) {
      throw new Error('Failed to fetch from external API');
    }

    const { timings, date: apiDate, meta } = response.data.data;

    // 3. Save to MongoDB
    const newPrayerTimes = new PrayerTimes({
      city: city?.toLowerCase() || 'detected location',
      country: country?.toLowerCase() || 'detected country',
      latitude,
      longitude,
      date,
      school: s,
      method: m,
      tune: tune || '',
      hijriDate: `${apiDate.hijri.day} ${apiDate.hijri.month.en} ${apiDate.hijri.year}`,
      readableDate: apiDate.readable,
      timings: timings
    });

    await newPrayerTimes.save();

    return newPrayerTimes;
  } catch (error) {
    console.error('Error in prayerService:', error.message);
    throw error;
  }
};

module.exports = {
  getPrayerTimes
};
