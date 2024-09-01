const admin = require("firebase-admin");
const serviceAccount = require("../patshala-c5084-firebase-adminsdk-3mjf7-9408ee6c23.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
