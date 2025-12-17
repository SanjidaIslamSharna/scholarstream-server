const admin = require('firebase-admin');
const path = require('path');

// resolve absolute path from env variable
const serviceAccountPath = path.resolve(process.env.FIREBASE_CERT_PATH);
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = async function(req, res, next){
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch(err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}








// const admin = require('../firebaseAdmin');
// async function verifyFirebaseToken(req,res,next){
//   const authHeader = req.headers.authorization;
//   if(!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({message:'Unauthorized'});
//   const idToken = authHeader.split('Bearer ')[1];
//   try{
//     const decoded = await admin.auth().verifyIdToken(idToken);
//     req.decoded = decoded;
//     next();
//   }catch(err){
//     return res.status(401).json({message:'Invalid token'});
//   }
// }
// module.exports = verifyFirebaseToken;
