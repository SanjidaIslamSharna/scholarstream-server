const router = require('express').Router();
const Scholarship = require('../models/Scholarship');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// Admin - Add Scholarship
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.json(scholarship);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - Update Scholarship
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!scholarship) return res.status(404).json({ message: 'Not found' });
    res.json(scholarship);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - Delete Scholarship
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Public - Get All Scholarships (with optional search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, category, degree, country } = req.query;
    const query = {};
    if(search) query.scholarshipName = { $regex: search, $options: 'i' };
    if(category) query.scholarshipCategory = category;
    if(degree) query.degree = degree;
    if(country) query.universityCountry = country;

    const scholarships = await Scholarship.find(query).sort({ scholarshipPostDate: -1 });
    res.json(scholarships);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Public - Get Single Scholarship
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if(!scholarship) return res.status(404).json({ message: 'Not found' });
    res.json(scholarship);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
