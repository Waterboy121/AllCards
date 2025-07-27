// src/assets/components/Card.tsx
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
  const { id, name, imageUrl, set, amount } = card;
  return (
    <div className="tile-card" key={id}>
      <div className="wrapper-card-image">
        <img src={imageUrl} alt={name} className="card-image" />
      </div>
      <div className="card-info">
        <div className="anta-card-name">{name}</div>
        <div className="anta-card-set">{set}</div>
        {(amount !== undefined || amount <= 0) && (
          <div className="anta-card-amount">Quantity: {amount}</div>
        )}
      </div>
    </div>
  );
}

export default Card;
