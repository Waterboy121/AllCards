import { db, auth } from "../firebase/index.ts";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import type { StoredCard } from "../assets/types/card.ts";
import type { Franchise } from "../assets/types/franchise.ts";
import { getUser } from "./auth.ts";

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
    where("set", "==", card.set)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docToUpdate = querySnapshot.docs[0];
    const existingAmount = docToUpdate.data().amount ?? 1;
    await updateDoc(docToUpdate.ref, {
      amount: existingAmount + card.amount,
    });
    console.log("Card quantity updated.");
  } else {
    await addDoc(cardRef, {
      id: card.id,
      name: card.name,
      image_url: card.imageUrl,
      set: card.set,
      amount: card.amount,
    });
    console.log("New card added.");
  }

//   const docRef = await addDoc(collection(db, "users", user, tcg), {
//     id: card.id,
//     name: card.name,
//     image_url: card.imageUrl,
//     sets: card.set, //make sure that only one set is here
//     amount: card.amount,
//   }); //maybe make a catch here to show that there is an error that occurs when uploading to the database
//   console.log(card); //get rid of later
//   console.log(docRef.id);
  }

//get rid of later, if not needed. Most likely not needed
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

export async function getData(franchise: Franchise[]): Promise<StoredCard[]> {
  const user = getUser() ?? "";
  if (user === "") {
    console.log("Error getting displayName"); //if user is not logged in or not found, it can't get Data
  }

  let allCards: StoredCard[] = [];

  for (const fran of franchise) {
    const querySnapshot = await getDocs(
      collection(db, "users", user, fran.name) //first gets the collection
    );

    querySnapshot.forEach((doc) => {
      //adds each collection data into a card format and then adds it to allCards
      let card: StoredCard = {
        id: doc.data().id,
        name: doc.data().name,
        imageUrl: doc.data().image_url,
        set: doc.data().set,
        amount: doc.data().amount,
      };
      console.log(doc.id, " => ", card);
      allCards.push(card);
    });
  }
  return allCards;
}
