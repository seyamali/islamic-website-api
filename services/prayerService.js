const axios = require('axios');
const PrayerTimes = require('../models/PrayerTimes');

const getPrayerTimes = async (city, country, date, latitude, longitude, school, method, tune) => {
  try {
    // Convert string 'undefined' or empty values to null/undefined
    const lat = (latitude === 'undefined' || !latitude) ? null : parseFloat(latitude);
    const lon = (longitude === 'undefined' || !longitude) ? null : parseFloat(longitude);
    const s = (school === 'undefined' || !school) ? 0 : parseInt(school);
    const m = (method === 'undefined' || !method) ? 2 : parseInt(method);

    const query = (lat && lon) 
      ? { latitude: lat, longitude: lon, date, school: s, method: m, tune: tune || '' }
      : { city: city?.toLowerCase(), date, school: s, method: m, tune: tune || '' };

    // 1. Check MongoDB first
    const cachedData = await PrayerTimes.findOne(query);

    if (cachedData) {
      console.log(`Returning cached data for ${city || lat} on ${date}`);
      return cachedData;
    }

    // 2. If not found, fetch from external API
    console.log(`Fetching from external API for ${city || lat} on ${date}`);
    
    let url;
    if (lat && lon) {
      url = `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&school=${s}&method=${m}&tune=${tune || ''}`;
    } else {
      // Ensure city and country are provided for city-based search
      if (!city) throw new Error('City is required for manual search');
      url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country || 'Bangladesh')}&school=${s}&method=${m}&tune=${tune || ''}`;
    }

    const response = await axios.get(url);

    if (!response.data || response.data.code !== 200) {
      console.error('Aladhan API Error:', response.data);
      throw new Error(`Failed to fetch from external API: ${response.data?.data || 'Unknown error'}`);
    }

    const { timings, date: apiDate } = response.data.data;

    // 3. Save to MongoDB
    const newPrayerTimes = new PrayerTimes({
      city: city?.toLowerCase() || 'detected location',
      country: country?.toLowerCase() || (lat && lon ? 'detected country' : 'bangladesh'),
      latitude: lat,
      longitude: lon,
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
