const router = require("express").Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const admin = require("../firebaseAdmin");
const User = require("../models/User");
const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');
const Review = require('../models/Review');


/* GET ALL USERS */
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

/* CREATE USER */
router.post("/create-user", verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, role, photoURL } = req.body;

    // 1. Firebase Admin Auth creation
    const fbUser = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      photoURL,
    });

    // 2. Set Custom Claims (Role)
    await admin.auth().setCustomUserClaims(fbUser.uid, { role });

    // 3. Save to MongoDB
    const newUser = await User.create({
      uid: fbUser.uid,
      name,
      email,
      photoURL,
      role,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message || "Failed to create user" });
  }
});

/* UPDATE USER (PATCH) */
router.patch("/users/update-user/:id", verifyAdmin, async (req, res) => {
  try {
    const { role, name, photoURL } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update DB
    user.role = role || user.role;
    user.name = name || user.name;
    user.photoURL = photoURL || user.photoURL;
    await user.save();

    // Update Firebase Claims & Profile
    await admin.auth().setCustomUserClaims(user.uid, { role });
    await admin.auth().updateUser(user.uid, {
        displayName: name,
        photoURL: photoURL
    });

    res.json(user);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* DELETE USER */
router.delete("/users/delete-user/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Delete from Firebase
    await admin.auth().deleteUser(user.uid);

    // 2. Delete from MongoDB
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

router.get('/analytics-stats', verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalScholarships = await Scholarship.countDocuments();
        

        const applications = await Application.find({ paymentStatus: 'paid' });
        const totalFees = applications.reduce((sum, app) => sum + (app.applicationFees || 0), 0);

        const chartStats = await Application.aggregate([
            {
                $group: {
                    _id: "$scholarshipCategory",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            totalUsers,
            totalScholarships,
            totalFees,
            chartData: chartStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;