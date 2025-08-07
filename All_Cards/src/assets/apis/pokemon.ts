// src/assets/apis/pokemon.ts

/*
  This file handles name-based card lookup for the Pokémon TCG API.
  Called via card-api-router.ts → searchCards("pokemon", name)
*/

import type { StoredCard } from "../types/card";

// ---------------------
// Interface Definitions
// ---------------------

interface PokemonImageUris {
  small: string;
  large: string;
}

interface PokemonSet {
  name: string;
}

interface PokemonCard {
  id: string;
  name: string;
  images: PokemonImageUris;
  set: PokemonSet;
  rarity: string;
  artist: string;
  evolvesFrom: string;
  evolvesTo: string[];
  set_name: string;
  imageUrl: string;
}

interface PokemonApiResponse {
  data: PokemonCard[];
}

// -----------------
// Main API function
// -----------------

/**
  Looks up a Pokémon card by exact name.
  Returns all matching card variants with usable images.

  Only called by card-api-router.ts (searchCards) and returns complete StoredCard[].
*/
export async function searchCardsByName(
  name: string
): Promise<
  Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]
> {
  const res = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(name)}"`
  );
  if (!res.ok) throw new Error("Failed to fetch Pokémon card data");

  const json: PokemonApiResponse = await res.json();

  return json.data
    .filter((card) => card.images?.large || card.images?.small)
    .map((card) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.images.large || card.images.small,
      set: card.set?.name || "-",
      rarity: card.rarity ?? null,
      artist: card.artist ?? null,
      evolvesFrom: card.evolvesFrom ?? null,
      evolvesTo: card.evolvesTo ?? [],
      tcg: "pokemon",
      collection: "",
    }));
}

/**
 * Same Function as the one above but uses a JSON file with all the cards info available instead
  Looks up a Pokémon card by exact name.
  Returns all matching card variants with usable images.

  Only called by card-api-router.ts (searchCards) and returns complete StoredCard[].
*/
export async function searchCardsByNameFromJson(
  name: string
): Promise<
  Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]
> {
  const res = await fetch("/pokemon-slimmed.json");
  if (!res.ok) throw new Error("Failed to fetch Pokémon card data");
  const json: PokemonCard[] = await res.json();

  //console.log(json.filter((card) => card.name === name));

  return json
    .filter((card) => card.name.toLowerCase() === name.toLowerCase())
    .map((card) => {
      return {
        id: card.id,
        name: card.name,
        imageUrl: card.imageUrl,
        set: card.set_name,
        rarity: card.rarity ?? null,
        artist: card.artist ?? null,
        evolvesFrom: card.evolvesFrom ?? null,
        evolvesTo: card.evolvesTo ?? [],
        tcg: "pokemon",
        collection: "",
      };
    });
}
