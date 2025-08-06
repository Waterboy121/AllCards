import { useEffect, useState } from "react";
import { deleteCard, updateCardQuantity } from "../../../firebase/database";
import type { StoredCard } from "../../../assets/types/card";
import "../../../assets/css/popups/AddCardForm.css";

// this shit crazy gang - Richard Vilcinsh

type Props = {
  card: StoredCard;
  onClose: (shouldRefresh?: boolean) => void;
};

export default function MTGCardDetails({ card, onClose }: Props) {
  const [amount, setAmount] = useState(card.amount);
  const [amountError, setAmountError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (amount <= 0) {
      setAmountError(true);
    } else setAmountError(false);
  }, [amount]);

  const handleSave = async () => {
    if (amount <= 0) return;
    setSaving(true);
    await updateCardQuantity(card, card.collection, amount);
    card.amount = amount;
    setSaving(false);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Delete "${card.name}" from your collection?`
    );
    if (!confirm) return;

    setDeleting(true);
    await deleteCard(card);
    setDeleting(false);
    onClose(true);
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

          <p>
            <strong>Set:</strong> {card.set}
          </p>
          <p>
            <strong>Rarity:</strong> {card.rarity ?? "Unknown"}
          </p>
          <p>
            <strong>Artist:</strong> {card.artist ?? "Unknown"}
          </p>

          <div className="form-row">
            <label htmlFor="amount">Amount:</label>
            <input
              id="amount"
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary rounded-circle"
              onClick={() => setAmount(Math.max(1, amount + 1))}
            >
              <i className="bi bi-plus" />
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-circle"
              onClick={() => setAmount(Math.max(1, amount - 1))}
            >
              <i className="bi bi-dash" />
            </button>
          </div>
          {amountError && (
            <div className="d-flex justify-content-start pt-3 text-danger">
              Quantity must be at least 1
            </div>
          )}
          <div className="form-buttons">
            <button className="cancel-btn" onClick={() => onClose()}>
              Cancel
            </button>
            <button
              className="cancel-btn"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Updating..." : "Update"}
            </button>
            <button
              className="confirm-btn"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
