export type StoredCard = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
  collection?: string;
  addedAt?: string;
  lastViewedAt?: string;
};
