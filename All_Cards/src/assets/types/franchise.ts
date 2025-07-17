import type { StoredCard } from "./card";

export type Franchise = {
  name: string;
  logoKey: string;
  cards?: StoredCard[];
};
