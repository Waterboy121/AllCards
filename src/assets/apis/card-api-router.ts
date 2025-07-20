// src/assets/apis/index.ts

// -------
// Imports
// -------

// Generic card search handlers (one function per franchise)
import { searchCardsByName as searchPokemonCardsByName } from "./pokemon";
import { searchCardsByName as searchMagicCardsByName } from "./magic";

// Yu-Gi-Oh uses multi-phase API logic
import {
	searchCardsByName as searchYuGiOhCardsByName,
	getYuGiOhImagesForSet,
} from "./yu-gi-oh";

import type { StoredCard } from "../types/card";

// ------------------------------
// Shared Yu-Gi-Oh type for sets
// ------------------------------

export type SetSelectionEntry = {
	setCode: string;
	setName: string;
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
	| Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]
	| { requiresSetSelection: true; setCodes: SetSelectionEntry[] }
	| { requiresSetSelection: false; card: Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount"> }
> {
	const key = franchise.toLowerCase();

	if (key === "pokemon") return await searchPokemonCardsByName(name);
	if (key === "magic") return await searchMagicCardsByName(name);
	if (key === "yu-gi-oh") return await searchYuGiOhCardsByName(name);

	return [];
}

// ------------------------------------------------------------
// Secondary image retrieval handler (after set_code selection)
// ------------------------------------------------------------
/**
	Retrieves image options for a selected card.

	For:
	- Yu-Gi-Oh: requires both name and selected set_code
	- Other franchises: fallback to []

	Returned cards are nearly complete StoredCards, missing only
	`amount`, `addedAt`, `lastViewedAt`, and `viewCount`.
 */
export async function getCardImageOptions(
	franchise: string,
	name: string,
	options?: { setCode?: string }
): Promise<Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]> {
	const key = franchise.toLowerCase();

	if (key === "yu-gi-oh" && options?.setCode) {
		return await getYuGiOhImagesForSet(name, options.setCode);
	}

	// Image handling for other franchises to be added here if needed
	return [];
}
