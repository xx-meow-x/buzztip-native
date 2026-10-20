// Makes an account an admin (can post announcements). Run from your computer, not the app:
//   1. Firebase console > Project settings > Service accounts > Generate new private key
//   2. Save it as scripts/service-account.json  (it is secret: never commit it)
//   3. cd functions && npm install && cd .. && node scripts/set-admin.js someone@tip.edu.ph
// The person has to sign out and back in for the new claim to apply.
const admin = require('../functions/node_modules/firebase-admin')
admin.initializeApp({ credential: admin.credential.cert(require('./service-account.json')) })

const email = process.argv[2]
if (!email) { console.error('Usage: node scripts/set-admin.js <email>'); process.exit(1) }

admin.auth().getUserByEmail(email)
  .then((u) => admin.auth().setCustomUserClaims(u.uid, { admin: true }).then(() => console.log(`${email} is now an admin.`)))
  .catch((e) => { console.error(e.message); process.exit(1) })
