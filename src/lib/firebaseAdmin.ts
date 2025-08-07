import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp;

if (!getApps().length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!serviceAccountKey) {
      throw new Error('FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
    }

    // Firebase Admin SDK expects the credentials in a specific format.
    // If your environment variable is the JSON content as a string, you might need to parse it.
    // If it's a base64 encoded string of the JSON, you'll need to decode it.
    // Assuming it's the direct JSON content as a string for this example:
    const credentials = JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString());


    adminApp = initializeApp({
      credential: cert(credentials),
    });

  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    // Depending on your needs, you might want to exit the process or handle this error differently
  }
} else {
  adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);

export { adminDb };