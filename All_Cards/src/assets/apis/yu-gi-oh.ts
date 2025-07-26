// src/assets/apis/yu-gi-oh.ts

import type { CardImgs, StoredCard } from "../types/card";

interface YuGiOhCardImage {
  image_url: string;
}

interface YuGiOhCardSet {
  set_rarity: string;
  set_code: string;
  set_name: string;
}

export interface YuGiOhCard {
  id: number;
  name: string;
  card_images: YuGiOhCardImage[];
  card_sets: YuGiOhCardSet[];
}

interface YuGiOhApiResponse {
  data: YuGiOhCard[];
}

export async function searchCardsByName(
  name: string
): Promise<
  Omit<StoredCard, "amount" | "addedAt" | "lastViewedAt" | "viewCount">[]
> {
  const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(
    name
  )}`;

  const response = await fetch(url);
  const json: YuGiOhApiResponse = await response.json();
  const id = String(json.data[0].id);
  const card_name = json.data[0].name;
  const card_image_length = json.data[0].card_images.length;
  const sets = json.data[0].card_sets;
  const unique = [...new Set(sets)];
  const multipleSets: CardImgs = {
    imgs: json.data[0].card_images.map((img) => img.image_url),
    multiSets: card_image_length > 1,
  };

  return unique.map((card) => ({
    id: id + "_" + card.set_code + "_" + card.set_rarity,
    name: card_name,
    imageUrl:
      json.data[0].card_images[getRandomInt(0, card_image_length - 1)]
        .image_url,
    set: card.set_name + " [" + card.set_code + "/" + card.set_rarity + "]",
    multipleSets: multipleSets,
    tcg: "yu-gi-oh",
    collection: "",
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

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
