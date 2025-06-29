import { db, auth } from "../firebase/index.ts";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import type { StoredCard } from "../assets/types/card.ts";

export async function addCard(card: StoredCard, tcg: string) {
  const user = auth.currentUser?.displayName ?? "Guest";
  console.log(user);
  if (user === "Guest") {
    return;
  }

  const cardRef = collection(db, "users", user, tcg);
  const q = query(
    cardRef,
    where("name", "==", card.name),
    where("sets", "==", card.set)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log("card already exists");
    return;
  }

  //todo add a check to see if the doc is already there
  const docRef = await addDoc(collection(db, "users", user, tcg), {
    id: card.id,
    name: card.name,
    image_url: card.imageUrl,
    sets: card.set, //make sure that only one set is here
    amount: card.amount,
  }); //maybe make a catch here to show that there is an error that occurs when uploading to the database
  console.log(card); //get rid of later
  console.log(docRef.id);
}

export async function addEmptyTCG() {
  const user = auth.currentUser?.uid ?? "Guest";
  console.log(user);
  if (user === "Guest") {
    return;
  }
  const docRef1 = await addDoc(collection(db, "users", user, "Pokémon"), {});
  const docRef2 = await addDoc(collection(db, "users", user, "Yu-Gi-Oh"), {});
  const docRef3 = await addDoc(collection(db, "users", user, "Magic"), {});
  console.log(docRef1.id); //get rid of later
  console.log(docRef2.id); //get rid of later
  console.log(docRef3.id); //get rid of later
}
