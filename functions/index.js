const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Existing function for narrative claimed notifications
exports.onNarrativeClaimed = functions.firestore
    .document('claims/{entityId}')
    .onCreate(async (snapshot, context) => {
        const claimData = snapshot.data();
        const username = claimData.username;
        const nicheName = claimData.nicheName;

        // The Notification Payload
        const payload = {
            notification: {
                title: '🏆 New Narrative Defined!',
                body: `${username} just earned the 'First-to-Define' badge for: ${nicheName}!`,
                icon: 'https://entitygap.ai/badge-icon.png'
            },
            topic: 'all_users' // Sends to everyone subscribed to this topic
        };

        // Send the message via Firebase Cloud Messaging
        try {
            await admin.messaging().send(payload);
            console.log('Global notification sent successfully.');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    });

// New callable Cloud Function to set admin custom claims
exports.makeAdmin = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check: Ensure the caller is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated users can set claims.'
    );
  }

  // 2. Authorization Check: Ensure the caller has permission (e.g., is an existing admin).
  // This example checks if the caller themselves have the 'admin: true' claim.
  // In a real application, you might also want to check a list of pre-defined admin UIDs,
  // or a different custom claim, to prevent any authenticated user from making others admin.
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Must be an admin to make other users admin.'
    );
  }

  // 3. Input Validation: Get the UID of the user to modify.
  const uid = data.uid;
  if (!uid || typeof uid !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The "uid" argument must be a non-empty string.'
    );
  }

  try {
    // 4. Set the Custom Claim using the Admin SDK.
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    console.log(`Successfully set admin claim for user: ${uid}`);
    return { message: `User ${uid} is now an admin.` };
  } catch (error) {
    console.error("Error setting custom user claim:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to set custom claim.',
      error
    );
  }
});
