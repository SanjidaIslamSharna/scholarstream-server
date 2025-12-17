const admin = require("firebase-admin");
const path = require("path");


const serviceAccountPath = process.env.FIREBASE_CERT_PATH;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(path.resolve(__dirname, serviceAccountPath))),
  });
}

module.exports = admin;