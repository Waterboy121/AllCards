import { useEffect, useState } from "react";
import { deleteCard, updateCardQuantity } from "../../../firebase/database";
import type { StoredCard } from "../../../assets/types/card";
import "../../../assets/css/popups/AddCardForm.css";

type Props = {
  card: StoredCard;
  onClose: (shouldRefresh?: boolean) => void;
};

export default function MTGCardDetails({ card, onClose }: Props) {
  const [amount, setAmount] = useState(card.amount);
  const [amountError, setAmountError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showBackFace, setShowBackFace] = useState(false);

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

  const formatOracleTextWithMana = (text?: string) => {
    if (!text) return "";

    // Replace all mana symbols like {G}, {2/W}, etc.
    return text.replace(/\{([^}]+)\}/g, (_match, symbol) => {
      const clean = encodeURIComponent(symbol.toUpperCase());
      const imgUrl = `https://svgs.scryfall.io/card-symbols/${clean}.svg`;

      return `<img src="${imgUrl}" alt="{${symbol}}" title="{${symbol}}" style="width:1.2em; height:1.2em; vertical-align:middle; margin-right:0.15em;" />`;
    });
  };

  const renderManaCost = (manaCost?: string) => {
    if (!manaCost) return "N/A";
    const symbols = manaCost.match(/\{([^}]+)\}/g) || [];

    return symbols.map((symbol, index) => {
      const clean = symbol.replace(/[{}]/g, "").toUpperCase(); // use uppercase

      const encoded = encodeURIComponent(clean); // handles hybrid like 2/W
      const url = `https://svgs.scryfall.io/card-symbols/${encoded}.svg`;

      return `<img
        key="${index}"
        src="${url}"
        alt="${symbol}"
        title="${symbol}"
        style="width:1.5em; height:1.5em; marginRight:0.2em;"
      />`;
    });
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-window add-card-form">
        {/* Header */}
        <div className="modal-header d-flex justify-content-between align-items-center">
          <h2 className="m-0">
            {card.name.includes("//")
              ? card.name.split("//")[showBackFace ? 1 : 0]
              : card.name}
          </h2>
          <button className="btn-close" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="row gx-4">
            {/* Left: Card Art */}
            <div className="col-12 col-md-4 d-flex flex-column align-items-center mb-3 mb-md-0">
              <img
                src={showBackFace ? card.doubleFaceImg : card.imageUrl}
                alt={card.name}
                className="img-fluid"
                style={{ maxHeight: 300 }}
              />
              {card.doubleFaceImg && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => setShowBackFace(!showBackFace)}
                >
                  Flip card
                </button>
              )}
            </div>

            {/* Right: Details */}
            <div className="col-12 col-md-8">
              <p>
                <strong>Set:</strong> {card.set}
              </p>
              <p>
                <strong>Rarity:</strong>{" "}
                {card.rarity
                  ? card.rarity?.charAt(0).toUpperCase() + card.rarity?.slice(1)
                  : "Unknown"}
              </p>
              <p>
                <strong>Artist:</strong> {card.artist ?? "Unknown"}
              </p>

              {card.manaCost && (
                <div className="mb-2">
                  <strong>Mana Cost:</strong>{" "}
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                    dangerouslySetInnerHTML={{
                      __html: renderManaCost(
                        card.manaCost.includes("($)")
                          ? card.manaCost.split("($)")[showBackFace ? 1 : 0]
                          : card.manaCost
                      ),
                    }}
                  ></span>
                </div>
              )}

              {card.power != null && card.toughness != null && (
                <p>
                  <strong>Power/Toughness:</strong>{" "}
                  {card.power.includes("($)")
                    ? card.power
                        .split("($)")
                        [showBackFace ? 1 : 0].includes("undefined")
                      ? "?"
                      : card.power.split("($)")[showBackFace ? 1 : 0]
                    : card.power.includes("undefined")
                    ? "?"
                    : card.power}{" "}
                  /{" "}
                  {card.toughness.includes("($)")
                    ? card.toughness
                        .split("($)")
                        [showBackFace ? 1 : 0].includes("undefined")
                      ? "?"
                      : card.toughness.split("($)")[showBackFace ? 1 : 0]
                    : card.toughness.includes("undefined")
                    ? "?"
                    : card.toughness}
                </p>
              )}

              <p>
                <strong>Description:</strong>
              </p>
              <div
                className="card-description"
                dangerouslySetInnerHTML={{
                  __html: formatOracleTextWithMana(
                    card.text?.includes("($)")
                      ? card.text.split("($)")[showBackFace ? 1 : 0]
                      : card.text
                  ),
                }}
              />
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
                  onClick={() => setAmount((prev) => Math.max(1, prev - 1))}
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
                  onClick={() => setAmount((prev) => Math.max(1, prev + 1))}
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

        {/* Footer Buttons */}
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
