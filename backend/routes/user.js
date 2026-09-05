const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// All user routes should be protected
router.use(protect);

// @desc    Update user budget
// @route   PUT /api/user/budget
// @access  Private
router.put('/budget', async (req, res) => {
  try {
    const { monthlyBudget } = req.body;

    if (monthlyBudget === undefined || monthlyBudget < 0) {
      return res.status(400).json({ message: 'Please provide a valid budget amount' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { monthlyBudget },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

