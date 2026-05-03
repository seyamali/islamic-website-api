const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const contentRoutes = require('./routes/contentRoutes');
const prayerRoutes = require('./routes/prayerRoutes');
const locationRoutes = require('./routes/locationRoutes');
const seedDailyContent = require('./utils/seeder');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); 
app.use(compression()); 
app.use(morgan('dev')); 
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api/', limiter);

// Routes
app.use('/api', contentRoutes);
app.use('/api', prayerRoutes);
app.use('/api/locations', locationRoutes);

// Detailed Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Islamic Website API is running...',
    uptime: process.uptime(),
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
    status: status
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    
    // Run seeder
    await seedDailyContent();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => shutdown(server));
    process.on('SIGINT', () => shutdown(server));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

function shutdown(server) {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
}
