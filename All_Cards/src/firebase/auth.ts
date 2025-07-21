import { auth } from "./index.ts";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";

export async function LoginWithEP(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    //console.log(userCredential.user.email);
  } catch (error: any) {
    throw new Error(
      "ErrorCode: " + error.code + "\nError Message: " + error.message
    );
  }
}

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
  } catch (error: any) {
    throw new Error(`${error.code}`);
  }
}

export function SignOut() {
  signOut(auth).then(() => {
    console.log("Signed Out!");
  });
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to " + email);
  } catch (error: any) {
    throw new Error(`${error.code}`);
  }
}

export function getUser() {
  return auth.currentUser?.displayName;
}

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
  } else console.log("No user");
});
