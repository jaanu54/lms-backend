const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    let enrollments;
    try {
      enrollments = await Enrollment.find()
        .populate('student', 'name email')
        .populate('course', 'title');
    } catch (err) {
      enrollments = await Enrollment.find();
    }
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get enrollment stats overview
router.get('/stats/overview', async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    
    res.json({
      totalStudents: await require('../models/Student').countDocuments(),
      totalCourses: await require('../models/Course').countDocuments(),
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      completionRate: totalEnrollments ? (completedEnrollments / totalEnrollments) * 100 : 0,
      revenue: 0
    });
  } catch (err) {
    // Return default zeros if models don't exist
    res.json({
      totalStudents: 0,
      totalCourses: 0,
      totalEnrollments: 0,
      activeEnrollments: 0,
      completedEnrollments: 0,
      completionRate: 0,
      revenue: 0
    });
  }
});

// Get enrollment trends
router.get('/trends/monthly', async (req, res) => {
  res.json({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [0, 0, 0, 0, 0, 0]
  });
});

// Create enrollment
router.post('/', async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    const newEnrollment = await enrollment.save();
    res.status(201).json(newEnrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update enrollment
router.put('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(enrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrollment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
