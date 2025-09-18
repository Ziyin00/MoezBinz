require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// PostgreSQL-compatible routes
const authRoutes = require('./routes/auth-pg');
const adminRoutes = require('./routes/admin-pg');
const productRoutes = require('./routes/products-pg');
// const bidRoutes = require('./routes/bids');
// const passwordResetRoutes = require('./routes/passwordReset');

const app = express();

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Make pool available to routes
app.locals.pool = pool;

app.use(express.json());
app.use(cookieParser());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ CORS configuration for deployment
const allowedOrigins = [
  'https://moez-binz-sepia.vercel.app',
  'https://moez-binz-sepia.vercel.app/',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Explicitly handle OPTIONS requests
// app.options('*', cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// PostgreSQL-compatible routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/bids', bidRoutes);
// app.use('/api/password-reset', passwordResetRoutes);

// Example protected route
// const { verifyAccessToken } = require('./middleware/auth');
// app.get('/api/protected', verifyAccessToken, (req, res) => {
//   res.json({ message: 'Protected data', user: req.user });
// });

// Temporary test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'PostgreSQL server is running!', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Test PostgreSQL connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('✅ PostgreSQL connected successfully');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 PostgreSQL database connected`);
});
