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
} from "firebase/firestore";
import type { StoredCard } from "../assets/types/card.ts";
import type { UserCollection } from "../assets/types/collection.ts";
import { getUser } from "./auth.ts";

/* ==================================================================
Add a Collection
  - Adds a new collection tab for the user under a given franchise.
  - Prevents duplicates and supports drag-and-drop ordering.
================================================================= */
export async function addCollectionTab(collectionObj: UserCollection, order: number) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  await setDoc(doc(db, "users", user, "collections", collectionObj.name), {
    name: collectionObj.name,
    franchiseKey: collectionObj.franchiseKey,
    createdAt: Timestamp.now(),
    order: order,
  });
}

/* ==================================================================
Retrieve Collections
  - Retrieves all user collection tabs, sorted by custom order.
  - Used to restore tabs on login.
================================================================= */
export async function getCollectionTabs(): Promise<UserCollection[]> {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return [];

  const snapshot = await getDocs(collection(db, "users", user, "collections"));
  const result: UserCollection[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
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
  - Skips addition if a duplicate (by name + set) already exists.
  - Sets addedAt to current time and lastViewedAt to a default old timestamp.
=============================================================================== */
export async function addCardToCollection(card: StoredCard, collectionName: string) {
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
  
  // Query to check if card with same name & set already exists
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
    lastViewedAt: Timestamp.fromDate(new Date(2000, 0, 1, 1)), // Jan 1, 2000, 1:00am
    viewCount: 0,
  });
}

/* ================================================================================
Delete a Card
  - Deletes a card from a specified collection tab.
=============================================================================== */
export async function deleteCard(card: StoredCard, collectionName: string) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardRef = doc(
    db,
    "users",
    user,
    "collections",
    collectionName,
    "cards",
    card.id
  );

  try {
    await deleteDoc(cardRef);
    console.log("Card deleted");
  } catch (error) {
    console.warn("Failed to delete card: " + error);
  }
}

/* ========================================================================
Update Card Quantity
  - Increments or decrements the quantity of a stored card.
  - Identifies the card by name and set within the specified collection.
======================================================================= */
export async function updateCardQuantity(
  card: StoredCard,
  collectionName: string,
  delta: number
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
      amount: existingAmount + delta,
    });
  }
}


/* ========================================================================
Update Card lastViewedAt
  - Updates the lastViewedAt timestamp of a specific card.
  - Called when the user clicks on a card to view its details.
======================================================================= */
export async function markCardAsViewed(cardId: string, collectionName: string) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardDoc = doc(db, "users", user, "collections", collectionName, "cards", cardId);

  await updateDoc(cardDoc, {
    lastViewedAt: Timestamp.now(),
    viewCount: increment(1),
  });
}

/* ==================================================================
Fetch All Stored Cards Across All Collections
  - Returns a map: collection name → array of StoredCards.
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
        //pokemon only
        rarity: data.rarity,
        artist: data.artist,
        evolvesFrom: data.evolvesFrom,
        evolvesTo: data.evolvesTo,
        //mtg only
        doubleFaced: data.doubleFaced,
        layout: data.layout,
        backName: data.backName,
        backImageUrl: data.backImageUrl,
      });
    });

    result[col.name] = cardList;
  }

  return result;
}

/* ==================================================================
Fetch All Stored Cards Across a Specified Collection
  - Fetches all cards from a single collection tab.
  - Used to populate the selected collection's tab view.
================================================================= */
export async function getCardsFromCollection(collectionName: string): Promise<StoredCard[]> {
  const user = getUser() ?? "";
  if (!user) return [];

  const cardsRef = collection(db, "users", user, "collections", collectionName, "cards");
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
      //pokemon only
      rarity: data.rarity,
      artist: data.artist,
      evolvesFrom: data.evolvesFrom,
      evolvesTo: data.evolvesTo,
      //mtg only
      doubleFaced: data.doubleFaced,
      layout: data.layout,
      backName: data.backName,
      backImageUrl: data.backImageUrl,
    });
  });

  return cards;
}

/* ==============================================================================
Fetch All Stored Cards Across a Specified Franchise
  - Fetches all cards across all collections with the specified franchiseKey.
  - Used to populate franchise-based card views or filters.
============================================================================= */
export async function getCardsByFranchise(franchiseKey: string): Promise<StoredCard[]> {
  const user = getUser() ?? "";
  if (!user) return [];

  const collectionsRef = collection(db, "users", user, "collections");
  const snapshot = await getDocs(collectionsRef);

  const matchingCollections: string[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.franchiseKey === franchiseKey) {
      matchingCollections.push(data.name); // collectionName
    }
  });

  const allCards: StoredCard[] = [];

  for (const name of matchingCollections) {
    const cardsRef = collection(db, "users", user, "collections", name, "cards");
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
        //pokemon only
        rarity: data.rarity,
        artist: data.artist,
        evolvesFrom: data.evolvesFrom,
        evolvesTo: data.evolvesTo,
        //mtg only
        doubleFaced: data.doubleFaced,
        layout: data.layout,
        backName: data.backName,
        backImageUrl: data.backImageUrl,
      });
    });
  }

  return allCards;
}

/* ================================================================================
Delete a Collection
  - Deletes a collection tab and all cards within it for the current user.
  - First deletes all documents, 'cards', in the sub-collection.
  - Then deletes the parent collection document itself.
=============================================================================== */
export async function deleteCollection(collectionName: string) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const cardsQuerySnapshot = await getDocs(
		collection(db, "users", user, "collections", collectionName, "cards")
	);


  // Delete all cards in the sub-collection
	try {
		const deleteCardPromises = cardsQuerySnapshot.docs.map((docSnap) =>
			deleteDoc(docSnap.ref)
		);
		await Promise.all(deleteCardPromises);
		console.log(`All cards from "${collectionName}" deleted`);
	} catch (error) {
		console.warn("Some cards failed to delete: " + error);
	}

	// Delete the collection itself
	try {
		const collectionDocRef = doc(db, "users", user, "collections", collectionName);
		await deleteDoc(collectionDocRef);
		console.log(`Collection "${collectionName}" deleted`);
	} catch (error) {
		console.warn("Failed to delete collection: " + error);
	}
}

/* ================================================================================
Reorder Collections
  - Accepts an array of UserCollection objects with updated `order` fields.
  - Updates each collection's Firestore doc with its new order.
================================================================================ */
export async function reorderCollections(updatedTabs: UserCollection[]) {
  const user = auth.currentUser?.displayName ?? "Guest";
  if (user === "Guest") return;

  const updates = updatedTabs.map((tab) => {
    const tabRef = doc(db, "users", user, "collections", tab.name);
    return updateDoc(tabRef, { order: tab.order });
  });

  try {
    await Promise.all(updates);
    console.log("✅ Tab order saved to Firestore");
  } catch (error) {
    console.error("❌ Failed to update tab order:", error);
  }
}
