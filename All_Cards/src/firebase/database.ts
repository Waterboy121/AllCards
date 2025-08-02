// src/firebase/database.ts

import { db, auth } from "../firebase/index.ts";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  Timestamp,
  increment,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import type { StoredCard } from "../assets/types/card.ts";
import type { UserCollection } from "../assets/types/collection.ts";
import { getUser } from "./auth.ts";

/* ==================================================================
Add a Collection
  - Adds a new collection tab for the user under a given franchise.
  - Prevents duplicates and supports drag-and-drop ordering.
================================================================= */
export async function addCollectionTab(
  collectionObj: UserCollection,
  order: number
) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  await setDoc(doc(db, "users", user, "collections", collectionObj.name), {
    name: collectionObj.name,
    franchiseKey: collectionObj.franchiseKey,
    createdAt: Timestamp.now(),
    order,
  });
}

/* ==================================================================
Retrieve Collections
  - Retrieves all user collection tabs, sorted by custom order.
================================================================= */
export async function getCollectionTabs(): Promise<UserCollection[]> {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return [];

  const snapshot = await getDocs(collection(db, "users", user, "collections"));
  const result: UserCollection[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    result.push({
      name: data.name,
      franchiseKey: data.franchiseKey,
      createdAt: data.createdAt,
      order: data.order ?? 0,
    });
  });

  result.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return result;
}

/* ================================================================================
Add a Card
  - Adds a card to the specified collection tab.
  - Skips if a duplicate by name & set already exists.
  - Sets addedAt, lastViewedAt, and initializes viewCount.
================================================================================ */
export async function addCardToCollection(
  card: StoredCard,
  collectionName: string
) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardRef = collection(
    db,
    "users",
    user,
    "collections",
    collectionName,
    "cards"
  );

  // check for existing card
  const q = query(
    cardRef,
    where("name", "==", card.name),
    where("set", "==", card.set)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    console.log("card already exists");
    return;
  }

  await setDoc(doc(cardRef, card.id), {
    ...card,
    addedAt: Timestamp.now(),
    lastViewedAt: Timestamp.fromDate(new Date(2000, 0, 1, 1)), // fallback date
    viewCount: 0,
    tcg:          card.tcg,
    collection:   collectionName,

    // POKEMON FIELDS
    rarity:      card.rarity      ?? null,
    artist:      card.artist      ?? null,
    evolvesFrom: card.evolvesFrom ?? null,
    evolvesTo:   card.evolvesTo   ?? [],

    // YU-GI-OH FIELDS
    type: card.type ?? null,
    race: card.race ?? null,
    desc: card.desc ?? null,

    // MTG FIELDS
    power:         card.power         ?? null,
    toughness:     card.toughness     ?? null,
    text:          card.text          ?? null,
    manaCost:      card.manaCost      ?? null,
    doubleFaceImg: card.doubleFaceImg ?? null,

    // MULTI-IMAGE INFO
    multipleSets: card.multipleSets ?? null,
  });
}

/* ========================================================================
Update Card Quantity
======================================================================= */
export async function updateCardQuantity(
  card: StoredCard,
  collectionName: string,
  newAmount: number
) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest" || newAmount <= 0) return;

  const cardRef = collection(
    db,
    "users",
    user,
    "collections",
    collectionName,
    "cards"
  );
  const q = query(
    cardRef,
    where("name", "==", card.name),
    where("set", "==", card.set)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docToUpdate = querySnapshot.docs[0];
    await updateDoc(docToUpdate.ref, { amount: newAmount });
  }
}

/* ========================================================================
Update Card lastViewedAt
======================================================================= */
export async function markCardAsViewed(
  cardId: string,
  collectionName: string
) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardDoc = doc(
    db,
    "users",
    user,
    "collections",
    collectionName,
    "cards",
    cardId
  );
  await updateDoc(cardDoc, {
    lastViewedAt: Timestamp.now(),
    viewCount: increment(1),
  });
}

/* ==================================================================
Fetch All Stored Cards Across All Collections
================================================================= */
export async function getAllCardsFromCollections(
  collections: UserCollection[]
): Promise<Record<string, StoredCard[]>> {
  const user = getUser() ?? "";
  if (!user) return {};

  const result: Record<string, StoredCard[]> = {};

  for (const col of collections) {
    const cardsRef = collection(
      db,
      "users",
      user,
      "collections",
      col.name,
      "cards"
    );
    const querySnapshot = await getDocs(cardsRef);
    const cardList: StoredCard[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      cardList.push({
        id: data.id,
        name: data.name,
        imageUrl: data.imageUrl,
        set: data.set,
        amount: data.amount,
        addedAt: data.addedAt,
        lastViewedAt: data.lastViewedAt,
        viewCount: data.viewCount ?? 0,
        tcg: data.tcg,
        collection: data.collection,
        rarity: data.rarity,
        artist: data.artist,
        evolvesFrom: data.evolvesFrom,
        evolvesTo: data.evolvesTo,
        doubleFaceImg: data.doubleFaceImg,
        
        // YU-GI-OH
        type: data.type ?? undefined,
        race: data.race ?? undefined,
        desc: data.desc ?? undefined,

        // MTG
        power:         data.power         ?? undefined,
        toughness:     data.toughness     ?? undefined,
        text:          data.text          ?? undefined,
        manaCost:      data.manaCost      ?? undefined,

        // MULTI-IMAGE
        multipleSets: data.multipleSets ?? undefined,
      });
    });

    result[col.name] = cardList;
  }

  return result;
}

/* ==================================================================
Fetch All Stored Cards Across a Specified Collection
================================================================= */
export async function getCardsFromCollection(
  collectionName: string
): Promise<StoredCard[]> {
  const user = getUser() ?? "";
  if (!user) return [];

  const cardsRef = collection(
    db,
    "users",
    user,
    "collections",
    collectionName,
    "cards"
  );
  const querySnapshot = await getDocs(cardsRef);
  const cards: StoredCard[] = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    cards.push({
      id: data.id,
      name: data.name,
      imageUrl: data.imageUrl,
      set: data.set,
      amount: data.amount,
      addedAt: data.addedAt,
      lastViewedAt: data.lastViewedAt,
      viewCount: data.viewCount ?? 0,
      tcg: data.tcg,
      collection: data.collection,
      rarity: data.rarity,
      artist: data.artist,
      evolvesFrom: data.evolvesFrom,
      evolvesTo: data.evolvesTo,
      doubleFaceImg: data.doubleFaceImg,
    });
  });

  return cards;
}

/* ==================================================================
Fetch All Stored Cards Across a Specified Franchise
================================================================= */
export async function getCardsByFranchise(
  franchiseKey: string
): Promise<StoredCard[]> {
  const user = getUser() ?? "";
  if (!user) return [];

  const collectionsRef = collection(db, "users", user, "collections");
  const snapshot = await getDocs(collectionsRef);
  const matching: string[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.franchiseKey === franchiseKey) {
      matching.push(data.name);
    }
  });

  const allCards: StoredCard[] = [];
  for (const name of matching) {
    const cardsRef = collection(
      db,
      "users",
      user,
      "collections",
      name,
      "cards"
    );
    const querySnapshot = await getDocs(cardsRef);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      allCards.push({
        id: data.id,
        name: data.name,
        imageUrl: data.imageUrl,
        set: data.set,
        amount: data.amount,
        addedAt: data.addedAt,
        lastViewedAt: data.lastViewedAt,
        viewCount: data.viewCount ?? 0,
        tcg: data.tcg,
        collection: data.collection,
        rarity: data.rarity,
        artist: data.artist,
        evolvesFrom: data.evolvesFrom,
        evolvesTo: data.evolvesTo,
        doubleFaceImg: data.doubleFaceImg,
      });
    });
  }

  return allCards;
}

/* ==================================================================
Delete a Card
================================================================= */
export async function deleteCard(card: StoredCard) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardRef = doc(
    db,
    "users",
    user,
    "collections",
    card.collection,
    "cards",
    card.id
  );
  try {
    const snap = await getDoc(cardRef);
    await deleteDoc(snap.ref);
  } catch (err) {
    console.warn("Card not found to delete:", err);
  }
}

/* ==================================================================
Delete a Collection (and all its cards)
================================================================= */
export async function deleteCollection(collectionName: string) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const collDoc = await getDoc(
    doc(db, "users", user, "collections", collectionName)
  );
  const cardsSnap = await getDocs(
    collection(db, "users", user, "collections", collectionName, "cards")
  );

  try {
    await deleteDoc(collDoc.ref);
    cardsSnap.forEach(async (docSnap) => {
      await deleteDoc(docSnap.ref);
    });
  } catch (err) {
    console.warn("Error deleting collection or cards:", err);
  }
}
