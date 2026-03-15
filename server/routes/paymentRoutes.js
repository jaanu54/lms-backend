
const express = require('express');
const router = express.Router();

// Mock payment routes - no Stripe required
router.post('/create-payment-intent', (req, res) => {
  res.json({ 
    clientSecret: 'mock_client_secret',
    message: 'Payment service is currently in test mode'
  });
});

router.post('/confirm-payment', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Payment confirmed (mock mode)' 
  });
});

module.exports = router;
