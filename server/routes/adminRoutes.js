const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

// Get system stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalStudents, totalEnrollments] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Student.countDocuments(),
      Enrollment.countDocuments()
    ]);

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .sort('-createdAt')
      .limit(5);

    // Get popular courses
    const popularCourses = await Course.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      {
        $addFields: {
          enrollmentCount: { $size: '$enrollments' }
        }
      },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 5 },
      { $project: { title: 1, enrollmentCount: 1 } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalCourses,
        totalStudents,
        totalEnrollments
      },
      recentEnrollments: recentEnrollments || [],
      popularCourses: popularCourses || []
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!['user', 'admin', 'instructor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Role update error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Toggle user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get system logs (NEW FIXED ENDPOINT)
router.get('/logs', async (req, res) => {
  try {
    // Mock logs for now - you can replace with actual log collection later
    const logs = [
      { 
        action: 'User login', 
        user: 'admin@example.com', 
        timestamp: new Date(), 
        ip: '192.168.1.1',
        details: 'Successful login'
      },
      { 
        action: 'Course created', 
        user: 'instructor@example.com', 
        timestamp: new Date(Date.now() - 3600000), 
        details: 'React Advanced course created',
        ip: '192.168.1.2'
      },
      { 
        action: 'Payment received', 
        user: 'student@example.com', 
        timestamp: new Date(Date.now() - 7200000), 
        amount: '$49.99',
        details: 'Payment for MongoDB course',
        ip: '192.168.1.3'
      },
      { 
        action: 'Enrollment completed', 
        user: 'student2@example.com', 
        timestamp: new Date(Date.now() - 86400000), 
        details: 'Enrolled in JavaScript Basics',
        ip: '192.168.1.4'
      }
    ];
    
    res.json(logs);
  } catch (err) {
    console.error('Logs error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
