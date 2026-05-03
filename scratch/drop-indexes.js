const mongoose = require('mongoose');
require('dotenv').config();

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Drop the PrayerTimes collection indexes
    await mongoose.connection.collection('prayertimes').dropIndexes();
    console.log('Indexes dropped successfully');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error dropping indexes:', error);
    process.exit(1);
  }
};

dropIndexes();
