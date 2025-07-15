// Import the shared Firebase `auth` object from your app's configuration
import { auth } from "./index.ts";

// Import Firebase Auth functions for login, user creation, sign-out, etc.
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

// Import type definition for Firebase error handling
import { FirebaseError } from "firebase/app";

// ===============================
// Login with Email & Password
// ===============================
/**
  Attempts to log in an existing user using email and password.
  If login fails, throws a detailed FirebaseError with code and message.
*/
export async function LoginWithEP(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    //console.log(userCredential.user.email);
  } catch (error) {
    const err = error as FirebaseError;
    throw new Error(
      "ErrorCode: " + err.code + "\nError Message: " + err.message
    );
  }
}


// ===============================
// Create New User
// ===============================
/**
  Creates a new user account with email and password.
  After account creation:
  - Sends a verification email
  - Sets the user's display name
  Any error thrown includes the Firebase error code for clarity.
*/
export async function MakeUser(
  email: string,
  password: string,
  display_name: string
): Promise<void> {
  try {
    const madeUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(madeUser.user);
    console.log("Email sent to " + madeUser.user.email);

    await updateProfile(madeUser.user, {
      displayName: display_name,
    });

    console.log("Updated display name! " + madeUser.user.displayName);
  } catch (error) {
    const err = error as FirebaseError;
    throw new Error(`${err.code}`);
  }
}

// ===============================
// Sign Out
// ===============================
/**
  Signs the current user out of Firebase Auth.
  Logs a confirmation message on success.
*/
export function SignOut() {
  signOut(auth).then(() => {
    console.log("Signed Out!");
  });
}

// ===============================
// Get Current User's Display Name
// ===============================
/**
  Returns the currently authenticated user's display name, if logged in.
  Returns undefined if no user is signed in.
*/
export function getUser() {
  return auth.currentUser?.displayName;
}

// ===============================
// Auth State Listener (Debug Only)
// ===============================
/**
  Sets a listener that runs whenever the user's auth state changes.
  Logs the user's email if signed in, or "No user" otherwise.
  This is useful for debugging login/logout flows.
*/
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
  } else console.log("No user");
});