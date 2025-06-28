// src/assets/components/popups/AddCardForm.tsx

import { useState } from "react";
import "../../assets/css/popups/AddCardForm.css";
import { searchCards } from "../../assets/apis";
import type { StoredCard } from "../../assets/types/card.ts";
import Card from "../Card";

type AddCardFormProps = {
  franchise: string;
  onConfirm: (card: StoredCard) => void;
  onCancel: () => void;
};

function AddCardForm({ franchise, onConfirm, onCancel }: AddCardFormProps) {
  const [cardName, setCardName] = useState("");
  const [results, setResults] = useState<StoredCard[] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResults(null);
    try {
      const cards = await searchCards(franchise, cardName.trim());
      if (cards.length === 0) {
        setError("No cards found. Please check the spelling and try again.");
      } else {
        setResults(cards);
      }
    } catch {
      setError("An error occurred while searching.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="add-card-form">
      <h2>Add a Card</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="card-name">Card Name:</label>
          <input
            id="card-name"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Enter exact card name"
          />
          <button type="submit" className="confirm-btn">
            Search
          </button>
        </div>
      </form>

      {franchise.toLowerCase() === "magic" && (
        <p className="magic-hint">
          For double-sided cards, include <code>//</code> in the name (e.g.
          <code> Arlinn Kord // Arlinn, Embraced by the Moon</code>)
        </p>
      )}

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="card-results-grid">
          {results.map((card) => (
            <div
              key={card.id}
              className="card-search-wrapper"
              onClick={() => onConfirm(card)}
            >
              <Card {...card} />
            </div>
          ))}
        </div>
      )}

      <div className="form-buttons">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddCardForm;
