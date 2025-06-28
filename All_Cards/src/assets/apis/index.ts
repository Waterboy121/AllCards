// src/assets/apis/index.ts

import { searchCardsByName as searchPokemonCardsByName } from "./pokemon";
import { searchCardsByName as searchYuGiOhCardsByName } from "./yu-gi-oh";
import { searchCardsByName as searchMagicCardsByName } from "./magic";
import type { StoredCard } from "../types/card";

export async function searchCards(
	franchise: string,
	name: string
): Promise<StoredCard[]> {
	const key = franchise.toLowerCase();

	if (key === "pokemon") return await searchPokemonCardsByName(name);
	if (key === "yu-gi-oh") return await searchYuGiOhCardsByName(name);
	if (key === "magic") return await searchMagicCardsByName(name);

	return [];
}
