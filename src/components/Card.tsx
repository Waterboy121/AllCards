// src/assets/components/Card.tsx
import { useState } from "react";
import type { StoredCard } from "../assets/types/card.ts";

/* ============================================================================
CardProps Type
  - Defines the props expected by the <Card> component.
  - Accepts a single StoredCard object via the 'card' prop.
============================================================================ */
export type CardProps = {
  card: StoredCard;
};

/* ============================================================================
Card Component
  - Displays a card's image, name, set, and quantity.
  - Used in both the Home view and individual Collection views.
============================================================================ */
function Card({ card }: CardProps) {
  const {
    id,
    name,
    imageUrl,
    set,
    amount,
    // addedAt,
    // lastViewedAt,
    // viewCount,
    ...franchiseFields
  } = card;

  // const pokemonInfo = {
  // rarity: franchiseFields.rarity,
  // artist: franchiseFields.artist,
  // evolvesFrom: franchiseFields.evolvesFrom,
  // evolvesTo: franchiseFields.evolvesTo,
  // };

  const magicInfo = {
    doubleFaced: franchiseFields.doubleFaced,
    layout: franchiseFields.layout,
    backName: franchiseFields.backName,
    backImageUrl: franchiseFields.backImageUrl,
  };

  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (magicInfo.doubleFaced) setFlipped((prev) => !prev);
  };

  const currentImage =
    flipped && magicInfo.backImageUrl ? magicInfo.backImageUrl : imageUrl;
  const currentName = flipped && magicInfo.backName ? magicInfo.backName : name;

  return (
    <div className="tile-card" key={id}>
      <div className="wrapper-card-image" style={{ position: "relative" }}>
        <img src={currentImage} alt={currentName} className="card-image" />
        {magicInfo.doubleFaced && (
          <button className="button-flip-card" onClick={handleFlip}>
            Flip
          </button>
        )}
      </div>
      <div className="card-info">
        <div className="anta-card-name">{currentName}</div>
        <div className="anta-card-set">{set}</div>
        {(amount !== undefined || amount <= 0) && (
          <div className="anta-card-amount">Quantity: {amount}</div>
        )}
      </div>
    </div>
  );
}

export default Card;
