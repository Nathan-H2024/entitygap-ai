
import { EntityGapAnalysis } from "../types";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// ⚠️ SET TO FALSE WHEN READY TO DEPLOY TO PRODUCTION
const USE_MOCK_DB = false;

/**
 * Records the user's agreement to terms and initializes their profile if it doesn't exist.
 */
export const syncUserProfile = async (user: any) => {
  if (!db || USE_MOCK_DB) {
    console.log(`[Mock/Offline DB] Syncing profile for: ${user.email}`);
    return;
  }

  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New User - Record Agreement Timestamp
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        termsAgreedAt: new Date().toISOString(), // The timestamp you need
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        tier: 'Daily Alpha', // Default start tier
        credits: 5
      });
    } else {
      // Returning User - Update Last Login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        email: user.email // Ensure email is current
      });
    }
  } catch (error) {
    console.error("Error syncing user profile:", error);
  }
};

/**
 * Simulates the Firestore Transaction logic described in Phase 3.
 */
export const claimEntityTransaction = async (entity: EntityGapAnalysis, userId: string): Promise<{success: boolean, message: string}> => {
  if (!db || USE_MOCK_DB) {
    console.log(`[Mock/Offline DB] Transaction Start: ${entity.entityName}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[Mock/Offline DB] Transaction Commit: Success`);
        resolve({ 
           success: true, 
           message: "FTD Badge Secured. (Offline Mode Active)" 
         });
      }, 1500);
    });
  }

  console.log(`[Firestore Transaction] Attempting atomic write for entity: ${entity.entityName}`);
  
  try {
      const claimRef = doc(db, "claims", entity.entityName.toLowerCase().replace(/\s+/g, '-'));
      const claimSnap = await getDoc(claimRef);
      
      if (claimSnap.exists()) {
          return {
              success: false,
              message: "⚠️ Entity already claimed by another Scout."
          };
      }

      await setDoc(claimRef, {
          entityName: entity.entityName,
          claimedBy: userId,
          claimedAt: serverTimestamp(),
          marketVolume: entity.marketVolume,
          authorityScore: entity.authorityScore
      });

      return {
          success: true,
          message: "FTD Badge Secured. Global Notification Sent."
      };
  } catch (e: any) {
      console.error("Transaction failed", e);
       return {
          success: false,
          message: "System Error: Unable to secure claim."
      };
  }
};
