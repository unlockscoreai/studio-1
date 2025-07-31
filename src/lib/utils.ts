import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Assuming you are using Firebase Authentication on the frontend
// You will need to import your Firebase auth instance
// import { auth } from '@/lib/firebase'; 
// Assuming you have a way to get the current user's document from Firestore
// import { firestore } from '@/lib/firebase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Placeholder for the isAdmin function
// You will need to replace this with your actual logic
export function isAdmin(): boolean {
  // Get the current authenticated user
  // const user = auth.currentUser;

  // If no user is logged in, they are not an admin
  // if (!user) {
  //   return false;
  // }

  // Fetch the user's document from Firestore
  // const userDoc = await firestore.collection('users').doc(user.uid).get();

  // Check the isAdmin field
  // return userDoc.exists && userDoc.data()?.isAdmin === true;

  // Placeholder: Currently returns false. Replace with actual logic.
  return false;
}
