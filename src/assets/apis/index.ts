// src/assets/apis/index.ts

// -------
// Imports
// -------

// Generic card search handlers (one function per franchise)
import { searchCardsByName as searchPokemonCardsByName } from "./pokemon";
import { searchCardsByName as searchMagicCardsByName } from "./magic";

// Yu-Gi-Oh uses multi-phase API logic
import { searchCardsByName as searchYuGiOhCardsByName, getYuGiOhImagesForSet, } from "./yu-gi-oh";

import type { StoredCard } from "../types/card";

// -------------------------------
// Primary AddCardForm entry point
// -------------------------------

/**
	Handles initial name-based card lookup for all franchises.
	
	For:
	- Pokemon / Magic: returns StoredCard[]
	- Yu-Gi-Oh:
		- If set_codes are required, returns: { requiresSetSelection: true, setCodes: string[] }
		- If not, returns: { requiresSetSelection: false, card: Partial<StoredCard> }
	
	AddCardForm must check for `requiresSetSelection` key to branch behavior.
*/
export async function searchCards(
	franchise: string,
	name: string
): Promise<
	| Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt">[]
	| { requiresSetSelection: true; setCodes: string[] }
	| { requiresSetSelection: false; card: Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt"> }
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
	- Other franchises (not implemented yet): fallback to []

	Returned cards are nearly complete StoredCards, missing only `amount` and `addedAt`.
 */
export async function getCardImageOptions(
	franchise: string,
	name: string,
	options?: { setCode?: string }
): Promise<Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt">[]> {
	const key = franchise.toLowerCase();

	if (key === "yu-gi-oh" && options?.setCode) {
		return await getYuGiOhImagesForSet(name, options.setCode);
	}

	// Image handling for other franchises to be added here
	return [];
}
