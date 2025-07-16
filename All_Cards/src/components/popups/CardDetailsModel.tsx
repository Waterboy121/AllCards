import type { StoredCard } from "../../assets/types/card";

type Props = {
  card: StoredCard;
  onClose: () => void;
};

export default function CardDetailsModal({ card, onClose }: Props) {
  return (
    <div className="add-card-form">
      <h2>{card.name}</h2>
      <div className="modal-body">
        <img
          src={card.imageUrl}
          alt={card.name}
          style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
        />
        <p><strong>Set:</strong> {card.set}</p>
        <p><strong>Amount:</strong> {card.amount}</p>
      </div>
      <div className="form-buttons">
        <button className="cancel-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}