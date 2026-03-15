// test.js
console.log('Testing imports...');

try {
    const authController = require('./controllers/authController');
    console.log('Auth Controller:', authController);
    
    const authRoutes = require('./routes/authRoutes');
    console.log('Auth Routes loaded successfully');
} catch(error) {
    console.error('Error:', error.message);
}