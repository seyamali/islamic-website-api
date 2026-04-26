const axios = require('axios');

const getCountries = async (req, res) => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/iso');
    const countries = response.data.data.map(c => c.name).sort();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

const getCities = async (req, res) => {
  try {
    const { country } = req.query;
    if (!country) return res.status(400).json({ error: 'Country is required' });

    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
      country: country
    });
    
    res.json(response.data.data.sort());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

module.exports = {
  getCountries,
  getCities
};
