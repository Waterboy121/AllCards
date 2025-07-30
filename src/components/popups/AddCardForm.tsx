// src/assets/components/popups/AddCardForm.tsx

// -------
// Imports
// -------

import { useEffect, useState, type ChangeEvent } from "react";
import { Timestamp } from "firebase/firestore";

import {
  searchCards,
  getCardImageOptions,
  type SetSelectionEntry,
} from "../../assets/apis/card-api-router.ts";
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

  const [amountText, setAmountText] = useState("1");

  // Yu-Gi-Oh specific state
  const [setCodes, setSetCodes] = useState<SetSelectionEntry[]>([]);
  const [selectedSetCode, setSelectedSetCode] = useState("");
  const [cardNameFromAPI, setCardNameFromAPI] = useState("");

  // --------
  // Handlers
  // --------

  // Handles amount input field
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setAmountText(rawValue); // ← keep what's typed

    const parsed = parseInt(rawValue, 10);

    if (!isNaN(parsed) && parsed > 0) {
      changeAmount(parsed);
    }
  };

  // Main search logic triggered on submit (name + amount entered)
  const handleSearch = async () => {
    setError("");
    setResults(null);
    setSetCodes([]);
    setSelectedSetCode("");
    console.log("🔍 handleSearch triggered with:", {
      franchise,
      cardName,
      amount,
    });

    try {
      const response = await searchCards(franchise, cardName.trim());

      console.log("📦 API response from searchCards:", response);

      // Yu-Gi-Oh: set selection phase
      if ("requiresSetSelection" in response) {
        if (response.requiresSetSelection) {
          setSetCodes(response.setCodes);
          setCardNameFromAPI(cardName.trim());
        } else {
          const fullCard: StoredCard = {
            ...response.card,
            amount,
            addedAt: Timestamp.now(), // placeholder --> replaced on form submit
            lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")), // placeholder --> replaced on form submit
            viewCount: 0, // placeholder --> replaced on form submit
          };
          setResults([fullCard]);
        }
      } else {
        const fullResults = response.map((card) => ({
          ...card,
          amount,
          addedAt: Timestamp.now(), // placeholder --> replaced on form submit
          lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")), // placeholder --> replaced on form submit
          viewCount: 0, // placeholder --> replaced on form submit
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
          addedAt: Timestamp.now(), // placeholder --> replaced on form submit
          lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")), // placeholder --> replaced on form submit
          viewCount: 0, // placeholder --> replaced on form submit
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

  // handles amount buttons
  useEffect(() => {
    setAmountText(amount.toString());
  }, [amount]);

  return (
    <div className="popup-add-card anta-popups">
      <h2>Add Card</h2>

      <form onSubmit={handleSubmit}>
        {/* ----- Card Name Input ----- */}
        <div className="form-row mb-2">
          <label htmlFor="card-name">Card Name:</label>
          <input
            id="card-name"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Enter exact card name"
          />
        </div>

        {/* ----- Amount Input ----- */}
        <div className="form-row mb-2">
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            value={amountText}
            onChange={handleAmountChange}
          />
          <div className="d-flex gap-2 ms-2">
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
        </div>

        {/* ----- Yu-Gi-Oh Set Code Dropdown ----- */}
        {franchise.toLowerCase() === "yu-gi-oh" && setCodes.length > 0 && (
          <div className="form-row mb-3">
            <label htmlFor="set-select">Select a Set Code:</label>
            <select
              id="set-select"
              value={selectedSetCode}
              onChange={(e) => setSelectedSetCode(e.target.value)}
            >
              <option value="">-- Select --</option>
              {setCodes.map((entry) => (
                <option
                  key={`${entry.setCode}_${entry.setName}`}
                  value={entry.setCode}
                >
                  {entry.setCode} "{entry.setName}"
                </option>
              ))}
            </select>
          </div>
        )}
        {/* ----- Magic Hint ----- */}
        {franchise.toLowerCase() === "magic" && (
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}>
            For double-sided cards, include <code>//</code> in the name (e.g.
            <code> Arlinn Kord // Arlinn, Embraced by the Moon</code>)
          </p>
        )}

        {/* ----- Error Message ----- */}
        {error && (
          <div
            className="error-message"
            style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "red" }}
          >
            {error}
          </div>
        )}

        <div className="form-buttons">
          {/* ----- Submit Button ----- */}
          <button type="submit" className="button-confirm">
            Search
          </button>
          {/* ----- Cancel Button ----- */}
          <button className="button-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>

      {/* ----- Card Grid Results ----- */}
      {results && results.length > 0 ? (
        <>
          {console.log("Rendering card results:", results)}
          <div className="grid-card">
            {results.map((card) => (
              <div
                key={card.id}
                className="card-search-wrapper"
                onClick={() => onConfirm(card)}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        </>
      ) : results && results.length === 0 ? (
        <>
          {console.log("Search returned no matches")}
          <div className="error-message">No matching cards found.</div>
        </>
      ) : null}
    </div>
  );
}

export default AddCardForm;
