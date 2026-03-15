
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title instructor');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get enrollments by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course', 'title instructor duration');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get enrollments by course
router.get('/course/:courseId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'firstName lastName email');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new enrollment
router.post('/', async (req, res) => {
  try {
    // Check if student exists
    const student = await Student.findById(req.body.student);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if course exists
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.body.student,
      course: req.body.course
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      student: req.body.student,
      course: req.body.course,
      status: req.body.status || 'active',
      progress: req.body.progress || 0
    });

    const newEnrollment = await enrollment.save();
    
    // Populate the response
    const populatedEnrollment = await Enrollment.findById(newEnrollment._id)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title instructor');

    res.status(201).json(populatedEnrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update enrollment (status, progress, grade)
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If status is being set to 'completed', set completedAt
    if (req.body.status === 'completed' && !req.body.completedAt) {
      updateData.completedAt = Date.now();
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate('student', 'firstName lastName email')
    .populate('course', 'title instructor');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete enrollment (drop course)
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get enrollment statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const droppedEnrollments = await Enrollment.countDocuments({ status: 'dropped' });

    res.json({
      total: totalEnrollments,
      active: activeEnrollments,
      completed: completedEnrollments,
      dropped: droppedEnrollments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;