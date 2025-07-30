// src/assets/apis/magic.ts

/*
  This file handles fuzzy name-based card lookup for Magic: The Gathering using Scryfall.
  Combines fuzzy searching with proper double-faced card support.
*/

import type { StoredCard } from "../types/card";

/* =====================================================================
  Interface Definitions
===================================================================== */

interface MagicImageUris {
	small?: string;
	normal?: string;
	large?: string;
}

interface MagicCardFace {
	name: string;
	image_uris?: MagicImageUris;
}

interface MagicCard {
	id: string;
	name: string;
	image_uris?: MagicImageUris;
	card_faces?: MagicCardFace[];
	set_name: string;
  doubleFaced?: boolean;
  layout?: string;
  backName?: string;
  backImageUrl?: string;
}

interface MagicApiResponse {
	data: MagicCard[];
}

interface MagicFuzzyLookup {
	prints_search_uri: string;
}

/* =====================================================================
  Helper Functions
===================================================================== */

const DOUBLE_FACED_LAYOUTS = ["transform", "modal_dfc", "reversible_card"];

function getBestImageUrl(imageUris?: MagicImageUris): string {
	return (
		imageUris?.large ||
		imageUris?.normal ||
		imageUris?.small ||
		""
	);
}

function getFrontAndBackFaces(card: MagicCard): [MagicCardFace | undefined, MagicCardFace | undefined] {
	const frontName = card.name.split(" // ")[0].trim();
	const front = card.card_faces?.find((f) => f.name === frontName) ?? card.card_faces?.[0];
	const back = card.card_faces?.find((f) => f.name !== frontName) ?? card.card_faces?.[1];
	return [front, back];
}

/* =====================================================================
Main API function
  - Searches for a Magic card by fuzzy name and returns all printings
  - with double-faced support and high-quality images.
===================================================================== */
export async function searchCardsByName(
	name: string): Promise<Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]> {
	
  // Fuzzy Search
  const fuzzyRes = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`);
	if (!fuzzyRes.ok) throw new Error("Failed to fetch Magic card data");

	const fuzzyJson: MagicFuzzyLookup = await fuzzyRes.json();

  // Search all printings using prints_search_uri
	const printsRes = await fetch(fuzzyJson.prints_search_uri);
	if (!printsRes.ok) throw new Error("Failed to fetch Magic printings");

  const printsJson: MagicApiResponse = await printsRes.json();

  // Filter and map cards
	return printsJson.data
		.filter((card) => {
			const isDoubleFaced = DOUBLE_FACED_LAYOUTS.includes(card.layout ?? "");
			if (isDoubleFaced && card.card_faces) {
				const [front, back] = getFrontAndBackFaces(card);
				return !!(front?.image_uris || back?.image_uris);
			}
			return !!card.image_uris;
		})
    .map((card) => {
			const isDoubleFaced = DOUBLE_FACED_LAYOUTS.includes(card.layout ?? "");
			const frontName = card.name.split(" // ")[0];

			if (isDoubleFaced && card.card_faces) {
				const [frontFace, backFace] = getFrontAndBackFaces(card);

				return {
					id: card.id,
					name: frontFace?.name || frontName,
					imageUrl: getBestImageUrl(frontFace?.image_uris),
					set: card.set_name || "-",
					doubleFaced: true,
					layout: card.layout,
					backName: backFace?.name ?? "",
					backImageUrl: getBestImageUrl(backFace?.image_uris),
				};
			}

			// Single-faced fallback
			return {
				id: card.id,
				name: frontName,
				imageUrl: getBestImageUrl(card.image_uris),
				set: card.set_name || "-",
				doubleFaced: false,
			};
		});
}