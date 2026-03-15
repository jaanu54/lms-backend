const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses (with error handling)
router.get('/', async (req, res) => {
  try {
    // Try to populate, but don't crash if it fails
    let courses;
    try {
      courses = await Course.find()
        .populate('instructor', 'name email')
        .populate('modules');
    } catch (populateErr) {
      console.log('Populate error, fetching without population:', populateErr.message);
      courses = await Course.find();
    }
    
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ 
      message: 'Failed to fetch courses',
      error: err.message 
    });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    let course;
    try {
      course = await Course.findById(req.params.id)
        .populate('instructor', 'name email')
        .populate({
          path: 'modules',
          populate: {
            path: 'lessons',
            model: 'Lesson'
          }
        });
    } catch (populateErr) {
      console.log('Populate error, fetching without population:', populateErr.message);
      course = await Course.findById(req.params.id);
    }
      
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
