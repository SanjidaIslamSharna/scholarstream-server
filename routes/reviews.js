const router = require('express').Router();
const Review = require('../models/Review');
const verifyStudent = require('../middleware/verifyStudent');
const verifyModerator = require('../middleware/verifyModerator');

// Student - Post Review
router.post('/', verifyStudent, async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json(review);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Student - Get My Reviews
router.get('/my', verifyStudent, async (req, res) => {
  try {
    const reviews = await Review.find({ userEmail: req.decoded.email });
    res.json(reviews);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Moderator - Delete Review
router.delete('/:id', verifyModerator, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});



// Public - Get Reviews for Scholarship
router.get('/', async (req, res) => {
  try {
    const { scholarshipId } = req.query;
    const reviews = await Review.find({ scholarshipId });
    res.json(reviews);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
