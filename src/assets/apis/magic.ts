// src/assets/apis/magic.ts

/*
  This file handles name-based card lookup for the Magic: The Gathering API (Scryfall).
  Called via index.ts → searchCards("magic", name)
*/

import type { StoredCard } from "../types/card";

// ---------------------
// Interface Definitions
// ---------------------

interface ScryfallImageUris {
	small?: string;
	normal?: string;
	large?: string;
}

interface ScryfallCardFace {
	name: string;
	image_uris?: ScryfallImageUris;
}

interface ScryfallCard {
	id: string;
	name: string;
	layout: string;
	image_uris?: ScryfallImageUris;
	card_faces?: ScryfallCardFace[];
	set_name: string;
}

interface ScryfallResponse {
	data: ScryfallCard[];
}

// ---------------------------
// Main API function
// ---------------------------
/**
  Looks up a Magic: The Gathering card by exact name.

  Returns a list of usable images with the official card name and set.

  Only called by index.ts (searchCards) and returns complete StoredCard[] minus
  amount, addedAt, lastViewedAt, and viewCount — which are added later in AddCardForm.
*/
export async function searchCardsByName(
	name: string): Promise<Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]> {
	const res = await fetch(`https://api.scryfall.com/cards/search?q=!${encodeURIComponent(name)}`);
	if (!res.ok) throw new Error("Failed to fetch Magic card data");

	const json: ScryfallResponse = await res.json();

	return json.data
		.filter((card) => {
			const isDoubleFaced =
				card.layout === "transform" ||
				card.layout === "modal_dfc" ||
				card.layout === "meld" ||
				card.layout === "reversible_card";

			if (isDoubleFaced) {
				const face = card.card_faces?.[0];
				return (
					face?.image_uris?.large ||
					face?.image_uris?.normal ||
					face?.image_uris?.small
				);
			} else {
				return (
					card.image_uris?.large ||
					card.image_uris?.normal ||
					card.image_uris?.small
				);
			}
		})
		.map((card) => {
			const isDoubleFaced =
				card.layout === "transform" ||
				card.layout === "modal_dfc" ||
				card.layout === "meld" ||
				card.layout === "reversible_card";

			let imageUrl = "";

			if (isDoubleFaced) {
				const frontName = card.name.split(" // ")[0];
        const face = card.card_faces?.find(f => f.name === frontName) ?? card.card_faces?.[0];

				imageUrl =
					face?.image_uris?.large ||
					face?.image_uris?.normal ||
					face?.image_uris?.small ||
					"";
			} else {
				imageUrl =
					card.image_uris?.large ||
					card.image_uris?.normal ||
					card.image_uris?.small ||
					"";
			}

			const frontName = card.name.split(" // ")[0];

			return {
				id: card.id,
				name: frontName,
				imageUrl,
				set: card.set_name || "-",
			};
		});
}