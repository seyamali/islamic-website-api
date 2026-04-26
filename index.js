const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const prayerRoutes = require('./routes/prayerRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', prayerRoutes);
app.use('/api/locations', locationRoutes);

// Hadith of the Day Endpoint
app.get('/api/hadith-of-the-day', (req, res) => {
  res.json({
    collection: 'Sahih Bukhari',
    book: 'Book 1, Hadith 1',
    narrator: 'Umar ibn Al-Khattab (RA)',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    translation: 'Actions are judged by intentions, and every person will have what they intended.',
    explanation: 'This foundational hadith teaches that the validity and reward of any action depends entirely upon the sincerity of one\'s intention.'
  });
});

// Dua of the Day Endpoint
app.get('/api/dua-of-the-day', (req, res) => {
  res.json({
    title: 'Dua for Good Health',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
    translation: 'O Allah, I ask You for good health.',
    reference: 'Sunan Abu Dawood'
  });
});

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('Islamic Website API is running...');
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27000/islamic-website';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });
