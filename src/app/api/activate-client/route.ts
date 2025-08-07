// src/app/api/activate-client/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin'; // Alias to avoid conflict with client db
import { getAuth } from 'firebase-admin/auth';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
    }

    const auth = getAuth();

    // 1. Find client by activation token
    const clientsRef = adminDb.collection('clients');
    const snapshot = await clientsRef.where('activationToken', '==', token).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const clientDoc = snapshot.docs[0];
    const clientData = clientDoc.data();

    // 2. Check token expiration
    const now = new Date();
    if (clientData.activationTokenExpiresAt && clientData.activationTokenExpiresAt.toDate() < now) {
      // Optionally, clean up expired token here
      await clientDoc.ref.update({
        activationToken: null,
        activationTokenExpiresAt: null,
      });
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    // 3. Create user in Firebase Auth
    let firebaseAuthUid = clientData.firebaseAuthUid;

    // Only create auth user if one doesn't already exist for this client doc
    if (!firebaseAuthUid) {
        try {
            const userRecord = await auth.createUser({
                email: clientData.email,
                password: password,
            });
            firebaseAuthUid = userRecord.uid;
        } catch (error: any) {
            // Handle specific auth errors like email-already-exists
             if (error.code === 'auth/email-already-exists') {
                 // If email exists, try to find the user by email
                 try {
                     const existingUser = await auth.getUserByEmail(clientData.email);
                     firebaseAuthUid = existingUser.uid;
                      // If a user already exists with this email but wasn't linked, link them now
                     if (!clientData.firebaseAuthUid) {
                         await clientDoc.ref.update({
                             firebaseAuthUid: firebaseAuthUid,
                             // Keep token for now, let the client-side handle the redirect
                             // Remove token once user is confirmed to have logged in?
                         });
                          return NextResponse.json({ message: 'Account already exists. Please log in.', action: 'login' }, { status: 409 });
                     }
                 } catch (getUserError) {
                      console.error('Error fetching existing user by email:', getUserError);
                       return NextResponse.json({ message: 'Error processing account. Email already exists.' }, { status: 500 });
                 }

             } else if (error.code === 'auth/weak-password') {
                 return NextResponse.json({ message: 'Password is too weak. Please choose a stronger one.' }, { status: 400 });
             }
            console.error('Error creating user in Firebase Auth:', error);
            return NextResponse.json({ message: 'Error creating user account.' }, { status: 500 });
        }
    }


    // 4. Update client document with Auth UID and remove token
    await clientDoc.ref.update({
      firebaseAuthUid: firebaseAuthUid,
      activationToken: null,
      activationTokenExpiresAt: null,
      updatedAt: new Date(), // Update timestamp
    });

    return NextResponse.json({ message: 'Account activated successfully', clientId: clientDoc.id, firebaseAuthUid: firebaseAuthUid }, { status: 200 });

  } catch (error) {
    console.error('Error in activate-client API route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}