// src/assets/components/Card.tsx
import "../assets/css/Card.css";

/* ============================================================================
CardProps Type
  - Defines the props expected by the <Card> component.
  - Accepts a single StoredCard object via the 'card' prop.
============================================================================ */
type CardProps = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
  onClick?: () => void;
};

/* ============================================================================
Card Component
  - Displays a card's image, name, set, and quantity.
  - Used in both the Home view and individual Collection views.
============================================================================ */
function Card({ id, name, imageUrl, set, amount, onClick }: CardProps) {
  return (
    <div className="card-tile" key={id} onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={name} className="card-image" />
      </div>
      <div className="card-info">
        <div className="card-name">{name}</div>
        <div className="card-set">{set}</div>
        {amount !== undefined && amount > 0 && (
          <div className="card-set">Quantity: {amount}</div>
        )}
      </div>
    </div>
  );
}

export default Card;
