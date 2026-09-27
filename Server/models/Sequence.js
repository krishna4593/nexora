const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  counterName: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    default: 0
  }
});

// Compound unique index for counterName per organization
sequenceSchema.index({ organization: 1, counterName: 1 }, { unique: true });

module.exports = mongoose.model('Sequence', sequenceSchema);
