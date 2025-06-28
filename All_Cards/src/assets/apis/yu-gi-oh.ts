// src/assets/apis/yu-gi-oh.ts

import type { StoredCard } from "../types/card";

interface YuGiOhCardImage {
  image_url: string;
}

interface YuGiOhCardSet {
  set_name: string;
}

export interface YuGiOhCard {
  id: number;
  name: string;
  card_images: YuGiOhCardImage[];
  card_sets?: YuGiOhCardSet[];
}

interface YuGiOhApiResponse {
  data: YuGiOhCard[];
}

export async function searchCardsByName(name: string): Promise<StoredCard[]> {
  const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(
    name
  )}`;

  const response = await fetch(url);
  const json: YuGiOhApiResponse = await response.json();

  return json.data.map((card) => ({
    id: String(card.id),
    name: card.name,
    imageUrl: card.card_images[0]?.image_url || "",
    set: card.card_sets?.[0]?.set_name || "-",
    tcg: "Yu-Gi-Oh",
  }));
}

export async function getCardDetailsById(id: string): Promise<YuGiOhCard> {
  const response = await fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`
  );
  const json: YuGiOhApiResponse = await response.json();
  return json.data[0];
}

export async function getCardDetailsByName(name: string): Promise<YuGiOhCard> {
  const response = await fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(
      name
    )}`
  );
  const json: YuGiOhApiResponse = await response.json();
  return json.data[0];
}
