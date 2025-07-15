import { Timestamp } from "firebase/firestore";

export type StoredCard = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
  addedAt: Timestamp;
  lastViewedAt: Timestamp;
};