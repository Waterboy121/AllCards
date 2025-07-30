// src/assets/apis/pokemon.ts

/*
  This file handles name-based card lookup for the Pokémon TCG API.
  Called via index.ts → searchCards("pokemon", name)
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

  Only called by index.ts (searchCards) and returns complete StoredCard[].
*/
export async function searchCardsByName(
	name: string): Promise<Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]>{
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
		}));
}