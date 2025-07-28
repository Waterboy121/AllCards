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
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
 EmailAuthProvider
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
// Get Current User's uid
// ===============================
/**
  Returns the currently authenticated user's display name, if logged in.
  Returns undefined if no user is signed in.
*/
export function getUser() {
   //return auth.currentUser?.displayName;
  return auth.currentUser?.uid;
}

// ===============================
// Get Current User's Display Name
// ===============================
/**
  Returns the currently authenticated user's display name, if logged in.
  Returns undefined if no user is signed in.
*/
export function getUserDisplayName() {
   return auth.currentUser?.displayName;
}



// ===============================
// Reset Password
// ===============================
/**
  Sends a password reset email to the specified address.
  If the email is valid and associated with an account, the user will receive a reset link.
*/

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to " + email);
  } catch (error: any) {
    throw new Error(`${error.code}`);
  }
}
// ===============================
// Update Current User's Profile
// ===============================
/**
 * Updates the currently authenticated user's:
 * - Display name
 * - Email
 * - Password
 *
 * Only the fields passed in will be updated.
 * Throws detailed Firebase errors if any step fails.
 */
export async function UpdateUserProfile(options: {
  displayName?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
}): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user to update.");
  }

  try {
    const { displayName, email, newPassword, currentPassword } = options;

    if (displayName && displayName !== user.displayName) {
      if (!user || !user.email) {
        throw new Error("No user is logged in or user has no email.");
      }

      if (!currentPassword) {
        throw new Error("Password is required to reauthenticate.");
      }

      await reauthenticateUser(currentPassword);
      console.log("Reauthentication successful.");

      try {
        await updateProfile(user, { displayName });
        console.log("Display name updated to:", displayName);
      } catch (error) {
        throw new Error("Display name update failed: " + (error as Error).message);
      }
      
    }

    if (email && email !== user.email) {
      if (!user || !user.email) {
        throw new Error("No user is logged in or user has no email.");
      }

      if (!currentPassword) {
        throw new Error("Password is required to reauthenticate.");
      }

      await reauthenticateUser(currentPassword);
      console.log("Reauthentication successful.");


  // Step 2: Update the email
  try {
    await updateEmail(user, email);
    console.log("Email updated successfully.");
  } catch (error) {
    throw new Error("Email update failed: " + (error as Error).message);
  }
    }

    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword) {
        throw new Error("Current password is required to update the password.");
      }

      await reauthenticateUser(currentPassword);
      console.log("Reauthentication successful.");

      await updatePassword(user, newPassword);
      console.log("Password updated");
    }
  } catch (error) {
    const err = error as FirebaseError;
    throw new Error(`ErrorCode: ${err.code}\nError Message: ${err.message}`);
  }
}
// ===============================
// Reauthenticate User
// ===============================
/**
 * Reauthenticates the currently authenticated user with their email and password.
 * This is required for sensitive operations like updating email/password.
 */


export async function reauthenticateUser(password: string): Promise<void> {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("User is not signed in or missing an email.");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    console.log("Reauthentication successful.");
  } catch (error: any) {
    console.error("Reauthentication failed:", error);
    throw new Error(error.message);
  }
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
