import { db, auth } from "../firebase/index.ts";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import type { StoredCard } from "../assets/types/card.ts";
import type { Franchise } from "../assets/types/franchise.ts";
import { getUser } from "./auth.ts";

// ===============================
// Add Card to Firestore
// ===============================
/**
  Adds a card to the user's collection for a given TCG.
  - Prevents duplicates by checking for an exact name/set match.
  - Stores relevant info and timestamps if card is new.
*/
export async function addCard(card: StoredCard, tcg: string) {
  const user = auth.currentUser?.displayName ?? "Guest"; //change this later
  console.log(user);

  if (user === "Guest") {
    return;     // Do not allow guest users to write data
  }

  // Create reference to user's collection for the given franchise
  const cardRef = collection(db, "users", user, tcg);
  
  // Query to check if card with same name & set already exists
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

  // If not found, add the new card document
  const docRef = await addDoc(cardRef, {
    id: card.id,
    name: card.name,
    image_url: card.imageUrl,
    sets: card.set,             // make sure that only one set is here
    amount: card.amount,
    addedAt: card.addedAt,
    lastViewedAt: card.lastViewedAt,
  });

  console.log(card);           // TEMP: For debugging
  console.log(docRef.id);
}

// ===============================
// Update Card Quantity
// ===============================
/**
  Updates the quantity of an existing card in the user's collection.
  - Finds the card by name and set
  - Adds to the existing amount
*/
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

// ===============================
// Get All Stored Cards
// ===============================
/**
  Retrieves all stored cards for the user, across multiple franchises.
  - Builds a full array of StoredCard objects from Firestore
  - Only works if user is signed in (uses displayName)
*/
export async function getData(franchise: Franchise[]): Promise<StoredCard[]> {
  const user = getUser() ?? "";

  if (user === "") {
    console.log("Error getting displayName");
    return []; // Exit early if no user
  }

  const allCards: StoredCard[] = [];

  for (const fran of franchise) {
    const querySnapshot = await getDocs(
      collection(db, "users", user, fran.name)
    );

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const card: StoredCard = {
        id: data.id,
        name: data.name,
        imageUrl: data.image_url,
        set: data.sets,
        amount: data.amount,
        addedAt: data.addedAt as Timestamp,
        lastViewedAt: data.lastViewedAt as Timestamp,
      };

      console.log(doc.id, " => ", card);
      allCards.push(card);
    });
  }
  return allCards;
}