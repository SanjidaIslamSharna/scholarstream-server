const router = require('express').Router();
const verifyModerator = require('../middleware/verifyModerator');
const Application = require('../models/Application');
const Review = require('../models/Review');

// Get all applications
router.get('/applications', verifyModerator, async (req,res)=>{
  const applications = await Application.find();
  res.json(applications);
});

// Update application feedback/status
router.put('/applications/:id', verifyModerator, async (req,res)=>{
  const application = await Application.findByIdAndUpdate(req.params.id, req.body, {new:true});
  res.json(application);
});

// Get all reviews
router.get('/reviews', verifyModerator, async (req,res)=>{
  const reviews = await Review.find();
  res.json(reviews);
});

// Delete review
router.delete('/reviews/:id', verifyModerator, async (req,res)=>{
  await Review.findByIdAndDelete(req.params.id);
  res.json({message:'Deleted'});
});

module.exports = router;
