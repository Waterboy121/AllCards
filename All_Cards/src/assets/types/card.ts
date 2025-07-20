export type StoredCard = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
  addedAt: string;
  lastViewedAt: string;
  franchise: string;
  rarity?: string;
  artist?: string;
  evolvesFrom?: string;
  evolvesTo?: string[];
};
