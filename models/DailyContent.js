const mongoose = require('mongoose');

const dailyContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['hadith', 'dua'],
    required: true
  },
  title: String,
  collection: String,
  book: String,
  narrator: String,
  arabic: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  explanation: String,
  reference: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast lookups by type
dailyContentSchema.index({ type: 1, isActive: 1 });

const DailyContent = mongoose.model('DailyContent', dailyContentSchema);

module.exports = DailyContent;
