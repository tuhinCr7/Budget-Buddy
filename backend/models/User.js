const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please add a password'],
    },
    monthlyBudget: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Pre-save middleware to hash password if it's modified (mostly useful if we don't hash before creating)
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  // In our auth controller, we'll probably hash it before creating, 
  // but if we do it here, we just check if it's modified.
});

const User = mongoose.model('User', userSchema);

module.exports = User;

