// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, bio, location, website } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, bio, location, website },
      { new: true }
    ).select('-password');

    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    // This would come from an ActivityLog model
    // For now, return mock data
    res.json({
      activities: [
        { action: 'Logged in', timestamp: new Date() },
        { action: 'Viewed dashboard', timestamp: new Date(Date.now() - 3600000) },
        { action: 'Updated profile', timestamp: new Date(Date.now() - 86400000) }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});