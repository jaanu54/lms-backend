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
// MIDDLEWARE
// ====================================

// Security headers
app.use(helmet());

// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// ====================================
// CORS FIX - APPLIES TO ALL ROUTES
// ====================================
const allowedOrigins = [
  'https://sprightly-heliotrope-f68d9f.netlify.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy does not allow access from this origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight for ALL routes
app.options('*', cors());

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
// IMPORT ALL ROUTES
// ====================================
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const reportsRoutes = require('./routes/reportsRoutes');  // ← ADD THIS LINE

// ====================================
// USE ALL ROUTES
// ====================================
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reports', reportsRoutes);  // ← ADD THIS LINE

// ====================================
// HEALTH CHECK
// ====================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      students: '/api/students',
      enrollments: '/api/enrollments',
      reports: '/api/reports'  // ← ADD THIS
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'LMS API',
    version: '1.0.0',
    status: 'running'
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
  console.log(`✅ Routes loaded: auth, courses, students, enrollments, reports`);
});
