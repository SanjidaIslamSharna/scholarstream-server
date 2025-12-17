const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  universityName: String,
  userName: String,
  userEmail: String,
  userImage: String,
  ratingPoint: { type: Number, required: true },
  reviewComment: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
