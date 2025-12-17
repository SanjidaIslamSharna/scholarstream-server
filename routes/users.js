const router = require('express').Router();
const User = require('../models/User');

// Upsert user
router.post("/", async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing uid or email" });
    }

    // 🔒 Always find by UID
    let user = await User.findOne({ uid });

    if (!user) {
      // 🧠 Role ALWAYS default (cannot be set from frontend)
      user = await User.create({
        uid,
        name,
        email,
        photoURL,
        role: "Student",
      });
    } else {
      // Update safe fields only
      user.name = name || user.name;
      user.photoURL = photoURL || user.photoURL;
      user.email = email || user.email;

      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("User save error:", err);
    res.status(500).json({ message: "Failed to save user" });
  }
});


// Get user by email
router.get('/:email', async (req,res)=>{
  try {
    const user = await User.findOne({ email: req.params.email });
    if(!user) return res.status(404).json({message:'Not found'});
    res.json(user);
  } catch(err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
