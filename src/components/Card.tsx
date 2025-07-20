// src/assets/components/Card.tsx
import "../assets/css/Card.css";
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
    <div className="card-tile" key={id}>
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={name} className="card-image" />
      </div>
      <div className="card-info">
        <div className="card-name">{name}</div>
        <div className="card-set">{set}</div>
        {(amount !== undefined || amount <= 0) && (
          <div className="card-set">Quantity: {amount}</div>
        )}
      </div>
    </div>
  );
}

export default Card;
