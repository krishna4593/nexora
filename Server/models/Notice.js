const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Notice content is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Content cannot be empty whitespace'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['GENERAL', 'ACADEMIC', 'EXAM', 'EVENT', 'ADMINISTRATIVE'],
      message: '{VALUE} is not a valid category'
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['NORMAL', 'IMPORTANT', 'URGENT'],
      message: '{VALUE} is not a valid priority'
    },
    default: 'NORMAL'
  },
  audience: {
    type: String,
    required: [true, 'Audience is required'],
    enum: {
      values: ['ALL', 'STUDENTS', 'FACULTY', 'DEPARTMENT'],
      message: '{VALUE} is not a valid audience'
    }
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: function() {
      return this.audience === 'DEPARTMENT';
    }
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin', // Assuming authenticated user is Admin for now, as it's an admin dashboard
    required: [true, 'Author is required']
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!v) return true; // expiresAt is optional
        return v > this.publishAt;
      },
      message: 'Expiry date must be after publish date'
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization is required']
  }
}, {
  timestamps: true
});

// Indexes for common queries
NoticeSchema.index({ organization: 1, isPublished: 1 });
NoticeSchema.index({ organization: 1, category: 1 });
NoticeSchema.index({ organization: 1, audience: 1 });
NoticeSchema.index({ organization: 1, publishAt: -1 });
NoticeSchema.index({ organization: 1, expiresAt: 1 });
NoticeSchema.index({ organization: 1, isActive: 1 });

module.exports = mongoose.model('Notice', NoticeSchema);
