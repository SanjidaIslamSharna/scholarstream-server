const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  scholarshipName: { type: String, required: true },
  universityName: { type: String, required: true },
  universityImage: String,
  universityCountry: String,
  universityCity: String,
  universityWorldRank: Number,
  subjectCategory: String,
  scholarshipCategory: String,
  degree: String,
  tuitionFees: Number,
  applicationFees: Number,
  serviceCharge: Number,
  applicationDeadline: Date,
  scholarshipPostDate: { type: Date, default: Date.now },
  postedUserEmail: String,
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
