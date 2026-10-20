// OPTIONAL hardening. The security rules already keep non-TIP accounts out of your data.
// This also stops them from being CREATED, so your Auth user list stays clean and nobody
// can even start the verification flow with a non-TIP address.
//
// Needs: Firebase Authentication upgraded to "Identity Platform" (Console > Authentication)
// and the Blaze plan (Cloud Functions). Deploy with: firebase deploy --only functions
const { beforeUserCreated, HttpsError } = require('firebase-functions/v2/identity')

const DOMAIN = 'tip.edu.ph' // keep in sync with firestore.rules and src/config.js

exports.onlyTipEmails = beforeUserCreated((event) => {
  const email = (event.data.email || '').toLowerCase()
  if (!email.endsWith('@' + DOMAIN) || email.split('@').length !== 2) {
    throw new HttpsError('invalid-argument', `Only @${DOMAIN} emails can register.`)
  }
})
