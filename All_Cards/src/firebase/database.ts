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
    collection: tcg,
    addedAt: Timestamp.now(),
    lastViewedAt: Timestamp.fromDate(new Date(2020, 0, 1, 13)),
  }); //maybe make a catch here to show that there is an error that occurs when uploading to the database
  console.log(card); //get rid of later
  console.log(docRef.id);
}

export async function addFranchise(franchise: string, logoKey: string) {
  const user = auth.currentUser?.displayName ?? "Guest";
  console.log(user);
  if (user === "Guest") {
    return;
  }

  const cardRef = collection(db, "users", user, "franchise");
  const q = query(cardRef, where("name", "==", franchise));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    console.log("franchise already exists");
    return;
  }
  const docRef = await addDoc(collection(db, "users", user, "Franchise"), {
    name: franchise,
    logoKey: logoKey,
  });
  console.log(franchise); //get rid of later
  console.log(docRef.id);
}

export async function updateCard(
  card: StoredCard,
  tcg: string,
  amount?: number
) {
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
      amount: existingAmount + amount, //change this later
      lastViewedAt: Timestamp.now(),
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

  //make it so it doesn't look at franchise
  for (const fran of franchise) {
    if (fran.name !== "Franchise") {
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
          collection: doc.data().collection,
          addedAt: doc.data().addedAt,
          lastViewedAt: doc.data().lastViewedAt,
        };
        console.log(doc.id, " => ", card);
        allCards.push(card);
      });
    }
  }

  return allCards;
}

export async function getFranchise(): Promise<Franchise[]> {
  const user = auth.currentUser?.displayName ?? "Guest"; //change this later
  console.log(user);

  if (user === "Guest") {
    console.log("User is not logged in....Franchise");
  }
  const querySnapshot = await getDocs(
    collection(db, "users", user, "Franchise")
  );
  let franchise: Franchise[] = [];

  querySnapshot.forEach((doc) => {
    let fran: Franchise = {
      name: doc.data().name,
      logoKey: doc.data().logoKey,
    };
    franchise.push(fran);
    //console.log(doc.id, " => ", doc.data());
  });
  //console.log(franchise);
  return franchise;
}
