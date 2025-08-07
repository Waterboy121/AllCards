import { useEffect, useState } from "react";
import { deleteCard, updateCardQuantity } from "../../../firebase/database";
import type { StoredCard } from "../../../assets/types/card";
import "../../../assets/css/popups/AddCardForm.css"; // make sure this pulls in Bootstrap

type Props = {
  card: StoredCard;
  onClose: (shouldRefresh?: boolean) => void;
};

export default function PokemonCardDetailsModal({ card, onClose }: Props) {
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
    onClose();
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
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h2 className="m-0">{card.name}</h2>
          <button className="btn-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="row gx-4">
            {/* Image column */}
            <div className="col-12 col-md-4 d-flex justify-content-center mb-3 mb-md-0">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="img-fluid"
                style={{ maxHeight: 300 }}
              />
            </div>

            {/* Info column */}
            <div className="col-12 col-md-8">
              <p>
                <strong>Set:</strong> {card.set}
              </p>
              <p>
                <strong>Rarity:</strong> {card.rarity ?? "Unknown"}
              </p>
              <p>
                <strong>Artist:</strong> {card.artist ?? "Unknown"}
              </p>
              <p>
                <strong>Evolves From:</strong> {card.evolvesFrom ?? "N/A"}
              </p>
              <p>
                <strong>Evolves To:</strong>{" "}
                {card.evolvesTo?.length ? card.evolvesTo.join(", ") : "N/A"}
              </p>
            </div>
          </div>

          {/* Amount Control */}
          <div className="row mt-4">
            <div className="col-12 col-md-4 mx-auto">
              <label htmlFor="amount" className="form-label">
                <strong>Amount:</strong>
              </label>
              <div className="input-group w-auto mx-auto">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setAmount((p) => Math.max(1, p - 1))}
                >
                  <i className="bi bi-dash" />
                </button>
                <input
                  id="amount"
                  type="number"
                  className="form-control text-center"
                  style={{ width: "4rem" }}
                  value={amount}
                  onChange={(e) =>
                    setAmount(Math.max(1, Number(e.target.value)))
                  }
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setAmount((p) => Math.max(1, p + 1))}
                >
                  <i className="bi bi-plus" />
                </button>
              </div>
              {amountError && (
                <div className="text-danger mt-2">
                  Quantity must be at least 1
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-buttons d-flex justify-content-end gap-2">
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
