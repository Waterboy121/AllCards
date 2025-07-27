// src/assets/apis/index.ts

// -------
// Imports
// -------

// Generic card search handlers (one function per franchise)
import { searchCardsByName as searchPokemonCardsByName } from "./pokemon";
import { searchCardsByName as searchMagicCardsByName } from "./magic";

// Yu-Gi-Oh uses multi-phase API logic
import { searchCardsByName as searchYuGiOhCardsByName } from "./yu-gi-oh";

import type { StoredCard } from "../types/card";
import type { AllCards } from "../types/all-cards";

// ------------------------------
// Shared Yu-Gi-Oh type for sets
// ------------------------------

export type SetSelectionEntry = {
  setCode: string;
  setName: string;
  setRarity: string;
};

// -------------------------------
// Primary AddCardForm entry point
// -------------------------------
/**
	Handles initial name-based card lookup for all franchises.
	
	Returns:
	- Pokémon / Magic: Omit<StoredCard>[] (one or more matches)
	- Yu-Gi-Oh: conditional result:
		- { requiresSetSelection: true, setCodes: { setCode, setName }[] }
		- { requiresSetSelection: false, card: Partial<StoredCard> }

	AddCardForm must check for `requiresSetSelection` key to branch behavior.
*/
export async function searchCards(
  franchise: string,
  name: string
): Promise<
  Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]
> {
  const key = franchise.toLowerCase();

  if (key === "pokemon") return await searchPokemonCardsByName(name);
  if (key === "magic") return await searchMagicCardsByName(name);
  if (key === "yu-gi-oh") return await searchYuGiOhCardsByName(name);

  return [];
}

export async function getAllCardsFromJson(): Promise<AllCards[]> {
  try {
    const [pokemon, yugioh, magic] = await Promise.all([
      fetch("/AllPokemonCards.json"),
      fetch("/AllYuGiOhCards.json"),
      fetch("/AllMagicCards.json"),
    ]);

    if (!pokemon.ok || !yugioh.ok || !magic.ok) {
      throw new Error("One or more files failed to load.");
    }

    const [pokemonCards, yugiohCards, magicCards]: AllCards[][] =
      await Promise.all([pokemon.json(), yugioh.json(), magic.json()]);

    return [...pokemonCards, ...yugiohCards, ...magicCards];
  } catch (error) {
    console.log("Error Loading Cards: " + error);
  }
  return [];
}
