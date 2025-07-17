// src/assets/components/Card.tsx
import "../assets/css/Card.css";

type CardProps = {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  amount: number;
};

function Card({ id, name, imageUrl, set, amount }: CardProps) {
  return (
    <div className="card-tile" key={id + "_" + set}>
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
