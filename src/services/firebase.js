import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

/**
 * Google Firebase Configuration
 * 
 * Used for real-time crowd data syncing and persistent
 * fan feedback.
 * 
 * Replace with your actual project config:
 * Settings -> Project Settings -> General -> Your apps -> Firebase SDK snippet -> Config
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey",
  authDomain: "fanflow-smart-venue.firebaseapp.com",
  projectId: "fanflow-smart-venue",
  storageBucket: "fanflow-smart-venue.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Simulated Real-time Crowd Data
 * 
 * In a production app, this would listener to a 'venue_status' 
 * collection updated by IoT sensors in the stadium.
 */
export const subscribeToCrowdData = (callback) => {
  // Return a mock unsubscriber for testing/dev
  if (firebaseConfig.apiKey === "AIzaSyDummyKey") {
    const interval = setInterval(() => {
      callback({
        capacity: 87 + Math.floor(Math.random() * 3),
        congestedZones: ['South Gate'],
        updatedAt: new Date().toLocaleTimeString()
      });
    }, 5000);
    return () => clearInterval(interval);
  }

  const q = query(collection(db, 'venue_status'), orderBy('timestamp', 'desc'), limit(1));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs[0]?.data();
    if (data) callback(data);
  });
};

/**
 * Submit Fan Feedback to Firestore
 * 
 * Demonstrates Google Service integration for data collection.
 */
export const submitFeedback = async (rating, comment) => {
  try {
    await addDoc(collection(db, 'feedback'), {
      rating,
      comment,
      timestamp: new Date(),
      platform: 'web'
    });
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
};

export { db };
