// middleware/verifyAdmin.js
const User = require('../models/User');
const verifyFirebaseToken = require('./verifyFirebaseToken');

module.exports = async function(req, res, next) {
  await verifyFirebaseToken(req, res, async () => {
    const user = await User.findOne({ email: req.decoded.email });
    if(!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden - Admin only' });
    }
    next();
  });
};
