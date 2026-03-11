
const mongoose = require('mongoose');

const responseBlueprint = new mongoose.Schema(
  {

    formRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
      index: true,
    },

    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    metadata: {
      ipAddress: { type: String, default: 'unknown' },
      userAgent: { type: String, default: 'unknown' },
      referrer: { type: String, default: '' },
    },
    /* Explicit timestamp for submissions (separate from Mongoose timestamps) */
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Response', responseBlueprint);
