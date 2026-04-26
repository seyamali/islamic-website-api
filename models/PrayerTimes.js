const mongoose = require('mongoose');

const prayerTimesSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    default: 'bangladesh'
  },
  date: {
    type: String, // DD-MM-YYYY
    required: true
  },
  hijriDate: {
    type: String,
    required: true
  },
  readableDate: {
    type: String,
    required: true
  },
  timings: {
    Fajr: String,
    Sunrise: String,
    Dhuhr: String,
    Asr: String,
    Sunset: String,
    Maghrib: String,
    Isha: String,
    Imsak: String,
    Midnight: String,
    Firstthird: String,
    Lastthird: String
  },
  latitude: Number,
  longitude: Number,
  school: { type: Number, default: 0 },
  method: { type: Number, default: 2 },
  tune: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 30 // Optional: data expires after 30 days
  }
});

// Compound index for faster searches and to prevent redundant data
prayerTimesSchema.index({ city: 1, country: 1, date: 1, school: 1, method: 1, tune: 1 }, { unique: true });
prayerTimesSchema.index({ latitude: 1, longitude: 1, date: 1, school: 1, method: 1, tune: 1 }, { unique: true });

const PrayerTimes = mongoose.model('PrayerTimes', prayerTimesSchema);

module.exports = PrayerTimes;
