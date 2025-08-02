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
  card_faces?: MagicCardFace[];
  set_name: string;
  mana_cost?: string;
  rarity?: string;
  power?: string;
  toughness?: string;
  oracle_text?: string;
  artist?: string;
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

function getFrontFace(card: MagicCard): MagicCardFace | null {
  if (!card.card_faces || card.card_faces.length === 0) return null;

  const splitName = card.name.split(" // ")[0].trim();
  const match = card.card_faces.find((face) => face.name === splitName);
  return match || card.card_faces[0];
}

export async function searchCardsByName(name: string): Promise<StoredCard[]> {
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

  return uniquePrintsJson.data
    .map((card) => {
      let imageUrl: string | null = null;
      let displayName = card.name;
      let manaCost = card.mana_cost ?? null;
      let text = card.oracle_text ?? null;
      if (DOUBLE_FACED_LAYOUTS.includes(card.layout)) {
        const face = getFrontFace(card);
        imageUrl = getBestImageUrl(face?.image_uris);
        displayName = face?.name || card.name;
      } else {
        imageUrl = getBestImageUrl(card.image_uris);
      }

      if (!imageUrl) return null;

      return {
        id: card.id,
        name: displayName,
        imageUrl,
        set: card.set_name || "-",
        amount: -1,
        tcg: "magic",
        manaCost: manaCost,
        rarity: card.rarity ?? null,
        power: card.power ?? null,
        toughness: card.toughness ?? null,
        text: text,
        artist: card.artist ?? null,
      };
    })
    .filter((card): card is StoredCard => card !== null);
}

export async function getCardDetailsById(id: string): Promise<MagicCard> {
  const response = await fetch(`https://api.scryfall.com/cards/${id}`);
  const json: MagicCard = await response.json();
  return json;
}
