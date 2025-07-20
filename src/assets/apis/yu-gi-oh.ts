// src/assets/apis/yu-gi-oh.ts

/*
  This file handles Yu-Gi-Oh API logic in isolated functions for specific use cases.
  - Function 1: Used by index.ts to get set codes or a single image
  - Function 2: Used by AddCardForm to retrieve images after set_code selection
*/

import type { StoredCard } from "../types/card";

// --------------
// Internal types
// --------------

type YuGiOhAPIResponse = {
  data: {
    name: string;
    id: number;
    card_images: { id: number; image_url: string }[];
    card_sets?: { set_name: string; set_code: string }[];
    set_name?: string; // used in fallback case
  }[];
};

type SetSelectionEntry = {
  setCode: string;
  setName: string;
};

// --------------------------------------------------------
// Function 1: searchCardsByName (called by index.ts)
// --------------------------------------------------------

/**
  Looks up a Yu-Gi-Oh card by name and returns either:
  - A list of set_codes if multiple sets exist
  - A single card result with image and set info if no sets exist

  This function is exclusively called by `index.ts` as part of AddCardForm name-based lookup.
*/
export async function searchCardsByName(name: string): Promise<
  | { requiresSetSelection: true; setCodes: SetSelectionEntry[] }
  | { requiresSetSelection: false; card: Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount"> }
> {
  const res = await fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error("Failed to fetch Yu-Gi-Oh card data");

  const json: YuGiOhAPIResponse = await res.json();
  const card = json.data[0];

  // If card_sets exist, return set_codes to AddCardForm
  if (card.card_sets && card.card_sets.length > 0) {
    const setCodes = card.card_sets.map((s) => ({
      setCode: s.set_code,
      setName: s.set_name,
    }));
    return {
      requiresSetSelection: true,
      setCodes,
    };
  }

  // Fallback: no card_sets
  if (!card.card_images || card.card_images.length !== 1) {
    throw new Error("Expected one image but found multiple or none");
  }

  const img = card.card_images[0];

  return {
    requiresSetSelection: false,
    card: {
      id: String(img.id), // no set_code, use image id only
      name: card.name,
      imageUrl: img.image_url,
      set: card.set_name ?? "-", // fallback to top-level set_name
    },
  };
}

// ----------------------------------------------------------------------------------
// Function 2: getYuGiOhImagesForSet (called by AddCardForm AFTER set_code selection)
// ----------------------------------------------------------------------------------

/**
  Retrieves all image variants for a given card name and set_code.
  Returns the array of possible cards (one per image).

  This function is called only within AddCardForm.tsx after the user selects a set_code.
  Each returned item is almost a complete StoredCard, missing only `amount` and `addedAt`.
*/
export async function getYuGiOhImagesForSet(
  name: string,
  setCode: string
): Promise<Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]> {
  const res = await fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(name)}`
  );
  if (!res.ok) throw new Error("Failed to fetch Yu-Gi-Oh images");

  const json: YuGiOhAPIResponse = await res.json();
  const card = json.data[0];

  if (!card.card_images || !card.card_sets) {
    throw new Error("Missing card images or sets");
  }

  const matchingSets = card.card_sets.filter((s) => s.set_code === setCode);
  if (matchingSets.length === 0) throw new Error("Invalid set code selected");

  const setName = matchingSets[0].set_name;

  return card.card_images.map((img, i) => ({
    id: `${img.id}_${setCode}_${i}`,
    name: card.name,
    imageUrl: img.image_url,
    set: setName,
  }));
}