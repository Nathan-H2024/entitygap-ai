const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 1. Automated Tier Logic
exports.updateUserTierOnSubscription = functions.firestore
    .document('customers/{uid}/subscriptions/{subscriptionId}')
    .onWrite(async (change, context) => {
      const data = change.after.data();
      if (!data) return null;

      const uid = context.params.uid;
      const status = data.status;
      const priceId = data.items[0].price.product;

      let tier = 'FREE';
      if (status === 'active' || status === 'trialing') {
        if (priceId === 'prod_TjoTkmKsxNcfHj') tier = 'SCOUT';
        if (priceId === 'prod_TjoXE5MeTgr7ZX') tier = 'ARCHITECT';
        if (priceId === 'prod_TjoVVSD29IesGY') tier = 'AUTHORITY';
      }

      return admin.firestore().collection('users').doc(uid).set({
        subscriptionTier: tier,
      }, {merge: true});
    });

// 2. Existing Notification Logic
exports.onNarrativeClaimed = functions.firestore
    .document('claims/{entityId}')
    .onCreate(async (snapshot, context) => {
      const claimData = snapshot.data();
      const payload = {
        notification: {
          title: '🏆 New Narrative Defined!',
          body: `${claimData.username} just earned the 'First-to-Define' badge!`,
        },
        topic: 'all_users',
      };
      return admin.messaging().send(payload);
    });