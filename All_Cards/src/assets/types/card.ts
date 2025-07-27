export type StoredCard = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
  addedAt: string;
  lastViewedAt: string;
  franchise: string;
  //Pokemon
  rarity?: string;
  artist?: string;
  evolvesFrom?: string;
  evolvesTo?: string[];
  //Yu-gi-oh
  type?: string
  race?: string
  desc?: string
  //MTG
  power?: string;
  toughness?: string;
  text?: string;
  manaCost?: string,
};
