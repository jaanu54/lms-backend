const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');

// Get enrollment reports
router.get('/enrollments', async (req, res) => {
  try {
    // Get counts
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const droppedEnrollments = await Enrollment.countDocuments({ status: 'dropped' });
    
    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .sort({ enrollmentDate: -1 })
      .limit(10);
    
    // Calculate monthly trends
    const last6Months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = monthNames[date.getMonth()];
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = await Enrollment.countDocuments({
        enrollmentDate: { $gte: startOfMonth, $lte: endOfMonth }
      });
      
      last6Months.push({ month, count });
    }
    
    res.json({
      success: true,
      data: {
        overview: {
          total: totalEnrollments,
          completed: completedEnrollments,
          active: activeEnrollments,
          dropped: droppedEnrollments,
          completionRate: totalEnrollments ? (completedEnrollments / totalEnrollments) * 100 : 0
        },
        recentEnrollments,
        trends: {
          labels: last6Months.map(m => m.month),
          data: last6Months.map(m => m.count)
        }
      }
    });
  } catch (err) {
    console.error('Enrollment reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get revenue reports
router.get('/revenue', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: 'completed' })
      .populate('course');
    
    let totalRevenue = 0;
    const courseRevenue = {};
    const monthlyRevenue = {};
    
    enrollments.forEach(enrollment => {
      if (enrollment.course && enrollment.course.price) {
        const price = enrollment.course.price;
        totalRevenue += price;
        
        // Course wise revenue
        const courseTitle = enrollment.course.title;
        courseRevenue[courseTitle] = (courseRevenue[courseTitle] || 0) + price;
        
        // Monthly revenue
        const month = enrollment.enrollmentDate.toLocaleString('default', { month: 'short' });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + price;
      }
    });
    
    res.json({
      success: true,
      data: {
        totalRevenue,
        courseRevenue: Object.entries(courseRevenue).map(([course, revenue]) => ({
          course,
          revenue
        })),
        monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
          month,
          revenue
        }))
      }
    });
  } catch (err) {
    console.error('Revenue reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get completion reports
router.get('/completion', async (req, res) => {
  try {
    const courses = await Course.find();
    const completionData = [];
    
    for (const course of courses) {
      const totalEnrollments = await Enrollment.countDocuments({ course: course._id });
      const completedEnrollments = await Enrollment.countDocuments({ 
        course: course._id, 
        status: 'completed' 
      });
      const activeEnrollments = await Enrollment.countDocuments({ 
        course: course._id, 
        status: 'active' 
      });
      
      completionData.push({
        courseId: course._id,
        courseTitle: course.title,
        totalEnrollments,
        completedEnrollments,
        activeEnrollments,
        completionRate: totalEnrollments ? (completedEnrollments / totalEnrollments) * 100 : 0
      });
    }
    
    res.json({
      success: true,
      data: completionData
    });
  } catch (err) {
    console.error('Completion reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get student reports
router.get('/students', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const inactiveStudents = await Student.countDocuments({ status: 'inactive' });
    
    // Get students with enrollment counts
    const students = await Student.find().limit(10);
    const studentData = [];
    
    for (const student of students) {
      const enrollmentCount = await Enrollment.countDocuments({ student: student._id });
      const completedCount = await Enrollment.countDocuments({ 
        student: student._id, 
        status: 'completed' 
      });
      
      studentData.push({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        enrollmentCount,
        completedCount,
        completionRate: enrollmentCount ? (completedCount / enrollmentCount) * 100 : 0
      });
    }
    
    res.json({
      success: true,
      data: {
        overview: {
          total: totalStudents,
          active: activeStudents,
          inactive: inactiveStudents
        },
        students: studentData
      }
    });
  } catch (err) {
    console.error('Student reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
