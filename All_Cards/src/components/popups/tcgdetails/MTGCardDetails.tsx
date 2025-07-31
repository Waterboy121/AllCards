
import { useEffect, useState } from "react";
import { deleteCard, updateCardQuantity } from "../../../firebase/database";
import type { StoredCard } from "../../../assets/types/card";
import "../../../assets/css/popups/AddCardForm.css";
import { renderManaCost } from "../../../components/renderManaCost";
import { formatOracleTextWithMana } from "../../../components/formatOracleTextWithMana";

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
    setAmountError(amount <= 0);
  }, [amount]);

  const handleSave = async () => {
    if (amount <= 0) return;
    setSaving(true);
    await updateCardQuantity(card, card.collection, amount);
    card.amount = amount;
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${card.name}" from your collection?`)) return;
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

          <p><strong>Set:</strong> {card.set}</p>
          <p><strong>Rarity:</strong> {card.rarity ?? "Unknown"}</p>
          <p><strong>Artist:</strong> {card.artist ?? "Unknown"}</p>

          {card.manaCost && (
            <div className="mb-2">
              <strong>Mana Cost:</strong>{" "}
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                {renderManaCost(card.manaCost)}
              </span>
            </div>
          )}

          {(card.power != null && card.toughness != null) && (
            <p>
              <strong>Power/Toughness:</strong> {card.power} / {card.toughness}
            </p>
          )}

          <p><strong>Description:</strong></p>
          <div
            className="card-description"
            dangerouslySetInnerHTML={{
              __html: formatOracleTextWithMana(card.text),
            }}
          />

          <div className="input-group mb-3">
            <label className="input-group-text anta-regular text-dark fs-5">
              Amount:
            </label>
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

          {amountError && (
            <div className="text-danger mb-3">
              Quantity must be at least 1
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button className="cancel-btn" onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            className="cancel-btn"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}