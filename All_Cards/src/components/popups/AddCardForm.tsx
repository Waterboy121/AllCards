// src/assets/components/popups/AddCardForm.tsx

import { useEffect, useState, type ChangeEvent } from "react";
import "../../assets/css/popups/AddCardForm.css";
import { searchCards } from "../../assets/apis";
import type { StoredCard } from "../../assets/types/card.ts";
import Card from "../Card";

type AddCardFormProps = {
  franchise: string;
  amount: number;
  onConfirm: (card: StoredCard) => void;
  onCancel: () => void;
  changeAmount: (amount: number) => void;
};

function AddCardForm({
  franchise,
  amount,
  onConfirm,
  onCancel,
  changeAmount,
}: AddCardFormProps) {
  const [cardName, setCardName] = useState("");
  const [results, setResults] = useState<StoredCard[] | null>(null);
  const [error, setError] = useState("");
  const [amountError, setAmountError] = useState(false);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let currentNumber = Number(e.target.value);
    if (currentNumber <= 0) {
      setAmountError(true);
    } else setAmountError(false);
    changeAmount(currentNumber);
  };

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

  //when clicking on the plus sign to open up the popup, it will turn off the error and change the amount back to zero, reseting it
  useEffect(() => {
    setAmountError(false);
    changeAmount(1);
  }, []);

  return (
    <>
      <div className="add-card-form">
        <h2>Add a Card</h2>

        <form onSubmit={handleSubmit}>
          {/*"Card Search"*/}
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
          {/*"Amount"*/}
          <div className="input-group mb-3">
            <label className="input-group-text anta-regular text-dark fs-5">
              Amount:{" "}
            </label>
            <input
              type="number"
              className="form-control anta-regular text-dark fs-5"
              aria-label="Amount"
              value={amount}
              onChange={handleAmountChange}
            />
            {amountError && (
              <div className="invalid-feedback d-block anta-regular">
                Quantity has to be at least 1
              </div>
            )}
            <button
              className="btn btn-outline-secondary rounded-circle"
              type="button"
              onClick={() => {
                setAmountError(false);
                if (amount <= 0) {
                  changeAmount(1);
                } else changeAmount(amount + 1);
              }}
            >
              <i className="bi bi-plus"></i>
            </button>
            <button
              className="btn btn-outline-secondary rounded-circle"
              type="button"
              onClick={() => {
                setAmountError(false);
                let currentNumber = amount - 1;
                if (currentNumber <= 0) {
                  currentNumber = 1;
                }
                changeAmount(currentNumber);
              }}
            >
              <i className="bi bi-dash"></i>
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
    </>
  );
}

export default AddCardForm;
