import { Timestamp } from "firebase/firestore";

export type UserCollection = {
  name: string;
  franchiseKey: string;
  createdAt?: Timestamp;
  order?: number;
};
