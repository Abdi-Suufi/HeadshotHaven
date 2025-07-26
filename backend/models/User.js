const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }, // Password not required if using Google OAuth
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  googleEmail: {
    type: String,
    sparse: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Game scores
  aimScore: {
    type: Number,
    default: 0
  },
  cpsScore: {
    type: Number,
    default: 0
  },
  reactionScore: {
    type: Number,
    default: 0
  },
  // Profile information
  profilePicture: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile (without password)
userSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    isAdmin: this.isAdmin,
    aimScore: this.aimScore,
    cpsScore: this.cpsScore,
    reactionScore: this.reactionScore,
    profilePicture: this.profilePicture,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

module.exports = mongoose.model('User', userSchema); 