// src/assets/components/popups/CardDetailsModel.tsx
import { useState } from "react";
import { updateCardAmount } from "../../firebase/database";
import { deleteCard } from "../../firebase/database";
import type { StoredCard } from "../../assets/types/card";
import "../../assets/css/popups/AddCardForm.css"; // reuse same styles

type Props = {
  card: StoredCard;
  onClose: (shouldRefresh?: boolean) => void;
};

export default function CardDetailsModal({ card, onClose}: Props) {
  const [amount, setAmount] = useState(card.amount);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
  setSaving(true);
  const updatedCard = { ...card, amount }; // apply updated quantity
  await updateCardAmount(updatedCard);
  setSaving(false);
  onClose(true);
};

  const handleDelete = async () => {
  setSaving(true);
  await deleteCard(card);
  setSaving(false);
  onClose(true); // refresh homepage
};


  return (
    <div className="popup-backdrop">
      <div className="popup-window add-card-form">
        <div className="modal-header">
          <h2>{card.name}</h2>
          <button className="btn-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <img
            src={card.imageUrl}
            alt={card.name}
            style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
          />
          <p><strong>Set:</strong> {card.set}</p>

          <div className="input-group mb-3">
            <label className="input-group-text anta-regular text-dark fs-5">Amount:</label>
            <input
              type="number"
              className="form-control anta-regular text-dark fs-5"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
            />
            <button
              className="btn btn-outline-secondary rounded-circle"
              type="button"
              onClick={() => setAmount((prev) => Math.max(1, prev + 1))}
            >
              <i className="bi bi-plus" />
            </button>
            <button
              className="btn btn-outline-secondary rounded-circle"
              type="button"
              onClick={() => setAmount((prev) => Math.max(1, prev - 1))}
            >
              <i className="bi bi-dash" />
            </button>
          </div>
        </div>

        <div className="form-buttons">
          <button className="cancel-btn" onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={saving} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}