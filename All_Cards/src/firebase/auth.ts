import { auth } from "./index.ts";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

export async function LoginWithEP(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      //console.log(userCredential.user.email);
    })
    .catch((error) => {
      throw new Error(
        "ErrorCode: " + error.code + "\nError Message: " + error.message
      );
    });
}

export async function MakeUser(
  email: string,
  password: string,
  display_name: string
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      //console.log(user);
      sendEmailVerification(userCredential.user).then(() => {
        console.log("Email sent to " + userCredential.user.email);
      });
      updateProfile(user, {
        displayName: display_name,
      })
        .then(() => {
          console.log("Updated display name! " + user.displayName);
        })
        .catch((error) => {
          throw new Error(
            "Display Name: ErrorCode: " +
              error.code +
              "\nError Message: " +
              error.message
          );
        });
    })
    .catch((error) => {
      throw new Error(
        "Make User: ErrorCode: " +
          error.code +
          "\nError Message: " +
          error.message
      );
    });
}

export function SignOut() {
  signOut(auth).then(() => {
    console.log("Signed Out!");
  });
}

export function getUser() {
  return auth.currentUser?.displayName;
}

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
  } else console.log("No user");
});
