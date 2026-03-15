const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Get the User model
      const User = require('./models/User');
      
      // Update the admin user
      const result = await User.updateOne(
        { email: "admin@example.com" },
        { $set: { role: "admin" } }
      );
      
      if (result.modifiedCount > 0) {
        console.log('✅ User updated to admin successfully!');
      } else if (result.matchedCount > 0) {
        console.log('User found but already had admin role');
      } else {
        console.log('❌ User not found with email: admin@example.com');
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
