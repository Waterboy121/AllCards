import { Timestamp } from "firebase/firestore";

/**
  @type StoredCard
  @description Represents a single card stored in a user's collection tab.
  Includes metadata like quantity, timestamps, and view tracking.
*/
export type StoredCard = {
/* Unique card identifier (typically includes card ID + set code for uniqueness). */
  id: string;

/* Display name of the card. */
  name: string;

/* URL to the primary image of the card. */
  imageUrl: string;

/* The set name or set code the card belongs to. */
  set: string;

/* Number of copies of this card in the user's collection. */
  amount: number;

/* When the card was first added to the collection. */
  addedAt: Timestamp;

/* When the card was last viewed by the user (e.g. in detail popup). */
  lastViewedAt: Timestamp;

/* Number of times the card has been viewed (clicked/opened).
  Used for tracking popularity or "most viewed" sorting. */
  viewCount: number;
};
