const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');
const { Parser } = require('json2csv');

// Get enrollment reports
router.get('/enrollments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate || endDate) {
      query.enrollmentDate = {};
      if (startDate) query.enrollmentDate.$gte = new Date(startDate);
      if (endDate) query.enrollmentDate.$lte = new Date(endDate);
    }
    
    const enrollments = await Enrollment.find(query)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title price')
      .sort('-enrollmentDate');
    
    // Calculate trends
    const trends = {};
    const byCourse = {};
    
    enrollments.forEach(enrollment => {
      const date = enrollment.enrollmentDate.toISOString().split('T')[0];
      trends[date] = (trends[date] || 0) + 1;
      
      const courseTitle = enrollment.course?.title || 'Unknown';
      byCourse[courseTitle] = (byCourse[courseTitle] || 0) + 1;
    });
    
    res.json({
      total: enrollments.length,
      trends: {
        labels: Object.keys(trends),
        datasets: [{
          label: 'Enrollments',
          data: Object.values(trends),
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.5)'
        }]
      },
      byCourse: {
        labels: Object.keys(byCourse),
        datasets: [{
          label: 'Enrollments by Course',
          data: Object.values(byCourse),
          backgroundColor: [
            'rgba(79, 70, 229, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      },
      recent: enrollments.slice(0, 10).map(e => ({
        studentName: e.student ? `${e.student.firstName} ${e.student.lastName}` : 'Unknown',
        courseTitle: e.course?.title || 'Unknown',
        date: e.enrollmentDate,
        status: e.status
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get completion rates
router.get('/completion-rates', async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'enrolledStudents',
      model: 'Student'
    });
    
    const byCourse = {
      labels: [],
      datasets: [{
        label: 'Completion Rate (%)',
        data: [],
        backgroundColor: 'rgba(79, 70, 229, 0.8)'
      }]
    };
    
    const avgTime = {
      labels: ['< 1 week', '1-2 weeks', '2-4 weeks', '> 4 weeks'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }]
    };
    
    courses.forEach(course => {
      byCourse.labels.push(course.title);
      // Mock completion rate (in real app, calculate from enrollments)
      const rate = Math.floor(Math.random() * 40) + 60;
      byCourse.datasets[0].data.push(rate);
    });
    
    res.json({
      byCourse,
      avgTime
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student progress
router.get('/student-progress', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const students = await Student.find().limit(20);
    
    const progress = students.map(student => ({
      name: `${student.firstName} ${student.lastName}`,
      course: 'Sample Course',
      progress: Math.floor(Math.random() * 100),
      lastActive: new Date(Date.now() - Math.random() * 86400000 * 7)
    }));
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get revenue reports
router.get('/revenue', async (req, res) => {
  try {
    const { period } = req.query;
    
    const trends = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [1200, 1900, 3000, 5000, 4200, 5800],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)'
      }]
    };
    
    const byCourse = {
      labels: ['Course A', 'Course B', 'Course C', 'Course D'],
      datasets: [{
        data: [4500, 3200, 2800, 1900],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }]
    };
    
    res.json({
      trends,
      byCourse,
      total: 12400
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Export data to CSV
router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let data = [];
    let fields = [];
    
    switch(type) {
      case 'enrollments':
        const enrollments = await Enrollment.find()
          .populate('student', 'firstName lastName email')
          .populate('course', 'title');
        
        data = enrollments.map(e => ({
          'Student Name': e.student ? `${e.student.firstName} ${e.student.lastName}` : 'Unknown',
          'Student Email': e.student?.email || 'Unknown',
          'Course': e.course?.title || 'Unknown',
          'Enrollment Date': e.enrollmentDate.toISOString().split('T')[0],
          'Status': e.status,
          'Progress': `${e.progress || 0}%`
        }));
        
        fields = ['Student Name', 'Student Email', 'Course', 'Enrollment Date', 'Status', 'Progress'];
        break;
        
      case 'students':
        const students = await Student.find();
        data = students.map(s => ({
          'Name': `${s.firstName} ${s.lastName}`,
          'Email': s.email,
          'Phone': s.phone || '',
          'Status': s.status,
          'Joined': s.createdAt.toISOString().split('T')[0]
        }));
        fields = ['Name', 'Email', 'Phone', 'Status', 'Joined'];
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard analytics
router.get('/dashboard-analytics', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    
    const completionRate = activeEnrollments + completedEnrollments > 0
      ? Math.round((completedEnrollments / (activeEnrollments + completedEnrollments)) * 100)
      : 0;
    
    res.json({
      totalStudents,
      activeEnrollments,
      completionRate,
      studentGrowth: 12,
      enrollmentGrowth: 8,
      revenue: 12400,
      revenueGrowth: 15
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;