const axios = require('axios');

// Simple In-memory cache
const cache = {
  countries: { data: null, timestamp: 0 },
  cities: {} // { countryName: { data: null, timestamp: 0 } }
};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getCountries = async (req, res) => {
  try {
    const now = Date.now();
    if (cache.countries.data && (now - cache.countries.timestamp < CACHE_DURATION)) {
      return res.json(cache.countries.data);
    }

    console.log('Fetching countries from external API...');
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/iso');
    const countries = response.data.data.map(c => c.name).sort();
    
    // Update cache
    cache.countries.data = countries;
    cache.countries.timestamp = now;

    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

const getCities = async (req, res) => {
  try {
    const { country } = req.query;
    if (!country) return res.status(400).json({ error: 'Country is required' });

    const now = Date.now();
    if (cache.cities[country] && (now - cache.cities[country].timestamp < CACHE_DURATION)) {
      return res.json(cache.cities[country].data);
    }

    console.log(`Fetching cities for ${country} from external API...`);
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
      country: country
    });
    
    const cities = response.data.data.sort();
    
    // Update cache
    cache.cities[country] = {
      data: cities,
      timestamp: now
    };

    res.json(cities);
  } catch (error) {
    console.error(`Error fetching cities for ${country}:`, error.message);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

module.exports = {
  getCountries,
  getCities
};
