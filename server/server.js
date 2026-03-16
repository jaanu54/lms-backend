const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

dotenv.config();

const app = express();

// ====================================
// SECURITY & LOGGING MIDDLEWARE
// ====================================
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// ====================================
// FIXED CORS CONFIGURATION - THIS WILL WORK
// ====================================
const allowedOrigins = [
  'https://sprightly-heliotrope-f68d9f.netlify.app',
  'http://localhost:3000'
];

// Manual CORS middleware (most reliable)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log incoming requests for debugging
  console.log(`${req.method} request from origin:`, origin);
  
  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    console.log('✅ Allowed origin:', origin);
  } else if (!origin) {
    // Allow requests with no origin (like Postman)
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Set other CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours cache for preflight
  
  // Handle preflight OPTIONS requests IMMEDIATELY
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  next();
});

// Backup CORS using the package
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ====================================
// DATABASE CONNECTION
// ====================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ====================================
// ROUTES
// ====================================
// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reports', reportsRoutes);

// ====================================
// HEALTH CHECK
// ====================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins,
      currentOrigin: req.headers.origin || 'none'
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'LMS API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      students: '/api/students',
      enrollments: '/api/enrollments',
      reports: '/api/reports'
    }
  });
});

// ====================================
// 404 HANDLER
// ====================================
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// ====================================
// ERROR HANDLER
// ====================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      status: 'error',
      message: 'CORS error: Domain not allowed',
      allowedDomains: allowedOrigins
    });
  }
  
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// ====================================
// START SERVER
// ====================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Allowed origins:`, allowedOrigins);
  console.log(`✅ CORS middleware active for all routes`);
});
