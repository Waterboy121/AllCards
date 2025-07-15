// src/assets/components/popups/AddCardForm.tsx

// -------
// Imports
// -------

import { useEffect, useState, type ChangeEvent } from "react";
import { Timestamp } from "firebase/firestore";
import "../../assets/css/popups/AddCardForm.css";

// Centralized API entry points from index.ts
import { searchCards, getCardImageOptions } from "../../assets/apis";
import type { StoredCard } from "../../assets/types/card.ts";

import Card from "../Card";

// -----
// Props
// -----

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
  // -----
  // State
  // -----

  const [cardName, setCardName] = useState("");
  const [results, setResults] = useState<StoredCard[] | null>(null);
  const [error, setError] = useState("");
  const [amountError, setAmountError] = useState(false);

  // Yu-Gi-Oh specific state
  const [setCodes, setSetCodes] = useState<string[]>([]);
  const [selectedSetCode, setSelectedSetCode] = useState("");
  const [cardNameFromAPI, setCardNameFromAPI] = useState("");

  // --------
  // Handlers
  // --------

  // Handles amount input field
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= 0) {
      setAmountError(true);
    } else {
      setAmountError(false);
      changeAmount(value);
    }
  };

  // Main search logic triggered on submit (name + amount entered)
  const handleSearch = async () => {
    setError("");
    setResults(null);
    setSetCodes([]);
    setSelectedSetCode("");

    try {
      const response = await searchCards(franchise, cardName.trim());

      // Yu-Gi-Oh: set selection phase
      if ("requiresSetSelection" in response) {
        if (response.requiresSetSelection) {
          // Show dropdown
          setSetCodes(response.setCodes);
          setCardNameFromAPI(cardName.trim());
        } else {
          // Single image result (no sets)
          const fullCard: StoredCard = {
            ...response.card,
            amount,
            addedAt: Timestamp.now(),
            lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")),
          };
          setResults([fullCard]);
        }
      } else {
        // All other franchises (Magic, Pokemon, etc.)
        const fullResults = response.map((card) => ({
          ...card,
          amount,
          addedAt: Timestamp.now(),
          lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")),
        }));
        setResults(fullResults);
      }
    } catch {
      setError("An error occurred while searching.");
    }
  };

  // Handles final form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if Yu-Gi-Oh requires a set but none selected
    if (
      franchise.toLowerCase() === "yu-gi-oh" &&
      setCodes.length > 0 &&
      !selectedSetCode
    ) {
      setError("Please select a set code to continue.");
      return;
    }

    // Yu-Gi-Oh: user selected a set_code → fetch image options
    if (
      franchise.toLowerCase() === "yu-gi-oh" &&
      cardNameFromAPI &&
      selectedSetCode
    ) {
      try {
        const imageResults = await getCardImageOptions(
          franchise,
          cardNameFromAPI,
          {
            setCode: selectedSetCode,
          }
        );
        const fullCards = imageResults.map((card) => ({
          ...card,
          amount,
          addedAt: Timestamp.now(),
          lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")),
        }));
        setResults(fullCards);
      } catch {
        setError("Failed to load card images.");
      }
      return;
    }

    // All other cases: run search
    handleSearch();
  };

  // Reset state when popup opens
  useEffect(() => {
    setAmountError(false);
    changeAmount(1);
  }, [changeAmount]);

  return (
    <div className="add-card-form">
      <h2>Add a Card</h2>

      <form onSubmit={handleSubmit}>
        {/* ----- Card Name Input ----- */}
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

        {/* ----- Amount Input ----- */}
        <div className="input-group mb-3">
          <label className="input-group-text anta-regular text-dark fs-5">
            Amount:
          </label>
          <input
            type="number"
            className="form-control anta-regular text-dark fs-5"
            value={amount}
            onChange={handleAmountChange}
          />
          {amountError && (
            <div className="invalid-feedback d-block anta-regular">
              Quantity must be at least 1
            </div>
          )}
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => changeAmount(Math.max(1, amount + 1))}
          >
            <i className="bi bi-plus" />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => changeAmount(Math.max(1, amount - 1))}
          >
            <i className="bi bi-dash" />
          </button>
        </div>

        {/* ----- Yu-Gi-Oh Set Code Dropdown ----- */}
        {franchise.toLowerCase() === "yu-gi-oh" && setCodes.length > 0 && (
          <div className="form-row">
            <label htmlFor="set-select">Select a Set Code:</label>
            <select
              id="set-select"
              value={selectedSetCode}
              onChange={(e) => setSelectedSetCode(e.target.value)}
            >
              <option value="">-- Select --</option>
              {setCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>

      {/* ----- Magic Hint ----- */}
      {franchise.toLowerCase() === "magic" && (
        <p className="magic-hint">
          For double-sided cards, include <code>//</code> in the name (e.g.
          <code> Arlinn Kord // Arlinn, Embraced by the Moon</code>)
        </p>
      )}

      {/* ----- Error Message ----- */}
      {error && <div className="error-message">{error}</div>}

      {/* ----- Card Grid Results ----- */}
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

      {/* ----- Cancel Button ----- */}
      <div className="form-buttons">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddCardForm;
