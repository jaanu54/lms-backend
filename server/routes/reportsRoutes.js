const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');

// ALL REPORTS ROUTES WITH PROPER ERROR HANDLING

// Get enrollment reports
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title price');
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', 'https://sprightly-heliotrope-f68d9f.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.json({
      success: true,
      data: enrollments,
      total: enrollments.length
    });
  } catch (error) {
    console.error('Error fetching enrollment reports:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get revenue reports
router.get('/revenue', async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('course');
    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.course?.price || 0), 0);
    
    res.header('Access-Control-Allow-Origin', 'https://sprightly-heliotrope-f68d9f.netlify.app');
    
    res.json({
      success: true,
      totalRevenue,
      enrollmentCount: enrollments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get course completion rates
router.get('/completion-rates', async (req, res) => {
  try {
    const courses = await Course.find();
    const completionRates = await Promise.all(courses.map(async (course) => {
      const totalEnrollments = await Enrollment.countDocuments({ course: course._id });
      const completedEnrollments = await Enrollment.countDocuments({ 
        course: course._id, 
        status: 'completed' 
      });
      
      return {
        courseId: course._id,
        courseTitle: course.title,
        totalEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 
          ? (completedEnrollments / totalEnrollments) * 100 
          : 0
      };
    }));
    
    res.header('Access-Control-Allow-Origin', 'https://sprightly-heliotrope-f68d9f.netlify.app');
    
    res.json({
      success: true,
      data: completionRates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// OPTIONS handler for preflight requests
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://sprightly-heliotrope-f68d9f.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

module.exports = router;
