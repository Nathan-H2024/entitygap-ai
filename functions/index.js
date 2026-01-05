const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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