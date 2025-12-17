const router = require('express').Router();
const Application = require('../models/Application');
const verifyStudent = require('../middleware/verifyStudent');
const verifyModerator = require('../middleware/verifyModerator');

// Student - Apply for Scholarship
router.post('/', verifyStudent, async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.json(application);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Student - Get My Applications
router.get('/my', verifyStudent, async (req, res) => {
  try {
    const applications = await Application.find({ userEmail: req.decoded.email });
    res.json(applications);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Student - Delete Application
router.delete('/:id', verifyStudent, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Not found' });
    if (application.applicationStatus !== 'pending') return res.status(400).json({ message: 'Application status must be "pending"' });
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Moderator - Update Application (feedback/status)
router.patch('/:id', verifyModerator, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!application) return res.status(404).json({ message: 'Not found' });
    res.json(application);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Moderator - Get All Applications
router.get('/', verifyModerator, async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
