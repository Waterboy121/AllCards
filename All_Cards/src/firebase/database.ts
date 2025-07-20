import { db, auth } from "../firebase/index.ts";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import type { StoredCard } from "../assets/types/card.ts";
import type { Franchise } from "../assets/types/franchise.ts";
import { getUser } from "./auth.ts";

export async function addCard(card: StoredCard, tcg: string) {
  const user = auth.currentUser?.displayName ?? "Guest"; //change this later
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

  const docRef = await addDoc(collection(db, "users", user, tcg), {
    id: card.id,
    name: card.name,
    image_url: card.imageUrl,
    sets: card.set, //make sure that only one set is here
    amount: card.amount,
    franchise: card.franchise ?? tcg,
    rarity: card.rarity ?? null,
    artist: card.artist ?? null,
    evolvesFrom: card.evolvesFrom ?? null,
    evolvesTo: card.evolvesTo ?? [],
    addedAt: serverTimestamp(),
    lastViewedAt: serverTimestamp(),

  }); //maybe make a catch here to show that there is an error that occurs when uploading to the database
  console.log(card); //get rid of later
  console.log(docRef.id);
}

export async function updateCard(card: StoredCard, tcg: string) {
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
    const existingAmount = docToUpdate.data().amount;
    await updateDoc(docToUpdate.ref, {
      amount: existingAmount + card.amount,
    });
    console.log("Card quantity updated.");
  } else console.log("Card doesn't exist");
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
        set: doc.data().sets,
        amount: doc.data().amount,
        rarity: doc.data().rarity ?? null,
        artist: doc.data().artist ?? null,
        evolvesFrom: doc.data().evolvesFrom ?? null,
        evolvesTo: doc.data().evolvesTo ?? [],
        addedAt: "", //change theses both later
        lastViewedAt: "",
        franchise: fran.name
      };
      console.log(doc.id, " => ", card);
      allCards.push(card);
    });
  }
  return allCards;
}

export async function updateCardAmount(card: StoredCard) { //this function updates the card being clicked on
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  console.log("[DEBUG] updateCardAmount ->", {
  user,
  card: { name: card.name, set: card.set, fran: card.franchise}
});
  const cardRef = collection(db, "users", user, card.franchise);
  const q = query(
    cardRef,
    where("name", "==", card.name),
    where("sets", "==", card.set)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docToUpdate = querySnapshot.docs[0];
    await updateDoc(docToUpdate.ref, {
      amount: card.amount
    });
    console.log("Card quantity updated.");
  } else {
    console.warn(" Card not found for update.");
  }
}

export async function deleteCard(card: StoredCard) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardRef = collection(db, "users", user, card.franchise); // franchise must be known
  const q = query(
    cardRef,
    where("name", "==", card.name),
    where("sets", "==", card.set)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docToDelete = querySnapshot.docs[0];
    await deleteDoc(docToDelete.ref);
    console.log("Card deleted");
  } else {
    console.warn("Card not found to delete");
  }
}