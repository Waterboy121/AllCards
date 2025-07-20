// src/assets/components/Card.tsx
import "../assets/css/Card.css";

type CardProps = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
  onClick?: () => void;
};

function Card({ id, name, imageUrl, set, amount, onClick }: CardProps) {
  return (
    <div className="card-tile" key={id} onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={name} className="card-image" />
      </div>
      <div className="card-info">
        <div className="card-name">{name}</div>
        <div className="card-set">{set}</div>
        {amount > 0 && <div className="card-set">Quantity: {amount}</div>}
      </div>
    </div>
  );
}

export default Card;
