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
// CRITICAL CORS FIX - YOUR NETLIFY URL
// ====================================
const allowedOrigins = [
  'https://sprightly-heliotrope-f68d9f.netlify.app', // Your Netlify frontend
  'http://localhost:3000' // Local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// IMPORTANT: Handle preflight OPTIONS requests
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
// ROUTES
// ====================================
// Import routes
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/auth', authRoutes);

// ====================================
// DASHBOARD & DATA ROUTES - ADDED NOW
// ====================================

// COURSES ROUTES
app.get('/api/courses', async (req, res) => {
  try {
    // Try to get from database if model exists
    let Course;
    try {
      Course = require('./models/Course');
      const courses = await Course.find();
      return res.json(courses);
    } catch (err) {
      // If model doesn't exist, return empty array
      return res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/courses/:id', (req, res) => {
  res.json({ 
    _id: req.params.id,
    title: 'Sample Course',
    description: 'Course description',
    duration: '8 weeks',
    price: 99.99
  });
});

// STUDENTS ROUTES
app.get('/api/students', async (req, res) => {
  try {
    let Student;
    try {
      Student = require('./models/Student');
      const students = await Student.find();
      return res.json(students);
    } catch (err) {
      return res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/students/:id', (req, res) => {
  res.json({
    _id: req.params.id,
    name: 'Sample Student',
    email: 'student@example.com',
    status: 'active'
  });
});

// ENROLLMENTS ROUTES
app.get('/api/enrollments', async (req, res) => {
  try {
    let Enrollment;
    try {
      Enrollment = require('./models/Enrollment');
      const enrollments = await Enrollment.find();
      return res.json(enrollments);
    } catch (err) {
      return res.json([]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/enrollments/stats/overview', (req, res) => {
  res.json({
    totalStudents: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    completionRate: 0,
    revenue: 0
  });
});

app.get('/api/enrollments/trends/monthly', (req, res) => {
  res.json({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [0, 0, 0, 0, 0, 0]
  });
});

// COURSE POPULARITY
app.get('/api/courses/popularity', (req, res) => {
  res.json({
    labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
    data: [0, 0, 0, 0, 0]
  });
});

// STUDENT STATUS DISTRIBUTION
app.get('/api/students/status-distribution', (req, res) => {
  res.json({
    labels: ['Active', 'Inactive', 'Graduated', 'Dropped'],
    data: [0, 0, 0, 0]
  });
});

// DASHBOARD STATS
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    monthlyRevenue: 0,
    recentEnrollments: [],
    popularCourses: [],
    studentStatus: {
      active: 0,
      inactive: 0,
      graduated: 0
    }
  });
});

// ====================================
// DEBUG & FIX ENDPOINTS
// ====================================

// Check users
app.get('/api/debug/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find().select('email name role');
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fix admin user
app.post('/api/debug/fix-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    
    const testPassword = await bcrypt.compare('password123', user.password);
    
    res.json({
      success: true,
      message: 'Admin user fixed!',
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      },
      passwordWorks: testPassword,
      loginWith: {
        email: 'admin@example.com',
        password: 'password123'
      }
    });
  } catch (err) {
    console.error('Fix admin error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Database info
app.get('/api/debug/db-info', async (req, res) => {
  try {
    const User = require('./models/User');
    
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    const userCount = await User.countDocuments();
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.json({
      database: {
        status: states[dbState],
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        readyState: dbState
      },
      users: {
        count: userCount
      },
      collections: collectionNames
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
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
      dashboard: '/api/dashboard/stats'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'LMS API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      students: '/api/students',
      enrollments: '/api/enrollments',
      dashboard: '/api/dashboard/stats',
      debug: '/api/debug/users'
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
  console.log(`✅ Dashboard routes added: /api/courses, /api/students, /api/enrollments`);
  console.log(`✅ Debug endpoints: /api/debug/users, /api/debug/fix-admin`);
});
