// controllers/courseController.js
const Course = require('../models/Course');

// Create course
const createCourse = async (req, res) => {
    try {
        const { title, description, category, level, price } = req.body;
        
        const course = await Course.create({
            title,
            description,
            category,
            level,
            price,
            instructor: req.user._id
        });
        
        res.status(201).json(course);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate('instructor', 'name email')
            .sort('-createdAt');
        res.json(courses);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single course
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email')
            .populate('enrolledStudents', 'name email');
        
        if(course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Update course
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if(!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        // Check if user is instructor or admin
        if(course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        res.json(updatedCourse);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if(!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        if(course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Enroll in course
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        
        if(!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        // Check if already enrolled
        if(course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }
        
        course.enrolledStudents.push(req.user._id);
        await course.save();
        
        res.json({ message: 'Enrolled successfully' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollCourse
};