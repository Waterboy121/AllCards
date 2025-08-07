// src/assets/apis/magic.ts

import type { StoredCard } from "../types/card";

// Layouts that indicate double-sided cards
const DOUBLE_FACED_LAYOUTS = ["transform", "modal_dfc", "reversible_card"];

interface MagicCardFace {
  name: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
  };
  toughness: string;
  power: string;
  oracle_text: string;
  mana_cost: string;
}

interface MagicCard {
  id: string;
  name: string;
  layout: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
  };
  card_faces: MagicCardFace[];
  set_name: string;
  rarity: string;
  artist: string;
  toughness: string;
  power: string;
  oracle_text: string;
  mana_cost: string;
}

interface MagicApiResponse {
  data: MagicCard[];
}

interface MagicApiUniqueSetsResponse {
  prints_search_uri: string;
}

function getBestImageUrl(imageUris?: {
  small?: string;
  normal?: string;
  large?: string;
}): string | null {
  if (!imageUris) return null;
  return imageUris.large || imageUris.normal || imageUris.small || null;
}

function combineTwoStrings(str1: string, str2: string) {
  return str1 + "($)" + str2 || null;
}

export async function searchCardsByName(
  name: string
): Promise<
  Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]
> {
  const url = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
    name
  )}`;
  //using fuzzy will give return one card back
  const response = await fetch(url);
  const json: MagicApiUniqueSetsResponse = await response.json();
  console.log(json);
  console.log(json.prints_search_uri);

  //using the prints_search_uri will give all unique sets back
  const uniquePrintsResponse = await fetch(json.prints_search_uri);
  const uniquePrintsJson: MagicApiResponse = await uniquePrintsResponse.json();
  console.log(uniquePrintsJson.data);

  //if its a special card
  if (DOUBLE_FACED_LAYOUTS.includes(uniquePrintsJson.data[0].layout)) {
    return uniquePrintsJson.data.map((card) => {
      return {
        id: card.id,
        name: card.name,
        imageUrl: getBestImageUrl(card.card_faces[0].image_uris) ?? "",
        doubleFaceImg: getBestImageUrl(card.card_faces[1].image_uris) ?? "",
        set: card.set_name || "-",
        amount: -1,
        rarity: card.rarity,
        artist: card.artist,
        manaCost:
          combineTwoStrings(
            card.card_faces[0].mana_cost,
            card.card_faces[1].mana_cost
          ) ?? "",
        text:
          combineTwoStrings(
            card.card_faces[0].oracle_text,
            card.card_faces[1].oracle_text
          ) ?? "",
        power:
          combineTwoStrings(
            card.card_faces[0].power,
            card.card_faces[1].power
          ) ?? "",
        toughness:
          combineTwoStrings(
            card.card_faces[0].toughness,
            card.card_faces[1].toughness
          ) ?? "",
        tcg: "magic",
        collection: "",
      };
    });
  }

  return uniquePrintsJson.data.map((card) => {
    return {
      id: card.id,
      name: card.name,
      imageUrl: getBestImageUrl(card.image_uris) ?? "",
      set: card.set_name || "-",
      amount: -1,
      rarity: card.rarity,
      artist: card.artist,
      manaCost: card.mana_cost ?? null,
      text: card.oracle_text ?? null,
      power: card.power ?? null,
      toughness: card.toughness ?? null,
      tcg: "magic",
      collection: "",
    };
  });
}

export async function getCardDetailsById(id: string): Promise<MagicCard> {
  const response = await fetch(`https://api.scryfall.com/cards/${id}`);
  const json: MagicCard = await response.json();
  return json;
}
