// src/assets/apis/pokemon.ts

import type { StoredCard } from "../types/card";

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
  rarity?: string;
  artist?: string;
  evolvesFrom?: string;
  evolvesTo?: string[];
}

interface PokemonApiResponse {
  data: PokemonCard[];
}

export async function searchCardsByName(name: string): Promise<StoredCard[]> {
  const url = `https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(
    name
  )}"`;

  const response = await fetch(url);
  const json: PokemonApiResponse = await response.json();

  return json.data
    .filter((card) => card.images?.large || card.images?.small)
    .map((card) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.images.large || card.images.small,
      set: card.set.name || "-",
      franchise: "Pokemon",
      rarity: card.rarity ?? null,
      artist: card.artist ?? null,
      evolvesFrom: card.evolvesFrom ?? null,
      evolvesTo: card.evolvesTo ?? [],
    }));
}

export async function getCardDetailsById(id: string): Promise<PokemonCard> {
  const response = await fetch(`https://api.pokemontcg.io/v2/cards/${id}`);
  const json: { data: PokemonCard } = await response.json();
  return json.data;
}
