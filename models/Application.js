const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhoto: String,
  universityName: String,
  scholarshipName: String,
  scholarshipCategory: String,
  degree: String,
  applicationFees: Number,
  serviceCharge: Number,
  applicationStatus: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'unpaid' },
  transactionId: String,
  applicationDate: { type: Date, default: Date.now },
  feedback: { type: String, default: '' },
});

module.exports = mongoose.model('Application', applicationSchema);