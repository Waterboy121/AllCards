// src/assets/components/popups/AddCardForm.tsx

// -------
// Imports
// -------

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Timestamp } from "firebase/firestore";
import "../../assets/css/popups/AddCardForm.css";

import { searchCards } from "../../assets/apis/card-api-router.ts";
import type { StoredCard } from "../../assets/types/card.ts";

import Card from "../Card";
import type { AllCards } from "../../assets/types/all-cards.ts";
import Fuse from "fuse.js";

// -----
// Props
// -----

type AddCardFormProps = {
  franchise: string;
  amount: number;
  filteredCards: AllCards[];
  onConfirm: (card: StoredCard) => void;
  onCancel: () => void;
  changeAmount: (amount: number) => void;
};

function AddCardForm({
  franchise,
  amount,
  filteredCards,
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
  const [amountError, setAmountError] = useState({ error: false, message: "" });
  const [amountText, setAmountText] = useState("1");

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
      setAmountError({ error: false, message: "" });
    }
  };

  //Fuse Search
  const fuse = useMemo(() => {
    return new Fuse(filteredCards, {
      keys: ["name"],
      threshold: 0.5,
      ignoreLocation: true,
    });
    console.log(filteredCards);
  }, [filteredCards]);

  //this shows the error message when amount is less than or equal to 0
  useEffect(() => {
    const num: number = Number(amountText) ?? null;
    if (amountText === "") {
      setAmountError({
        error: true,
        message: "Don't leave the amount input blank",
      });
      return;
    }
    if (num <= 0) {
      setAmountError({ error: true, message: "Quantity must be at least 1" });
      return;
    }
  }, [amountText]);

  // Reset state when popup opens
  useEffect(() => {
    setAmountError({ error: false, message: "" });
    setAmountText("1");
    changeAmount(1);
  }, []);

  // Main search logic triggered on submit (name + amount entered)
  const handleSearch = async () => {
    setError("");
    setResults(null);
    //checks
    const results = fuse.search(cardName.trim());
    const bestMatch = results.length > 0 ? results[0].item : null;
    if (bestMatch !== null) setCardName(bestMatch.name);
    setTimeout(() => {}, 500);
    console.log("🔍 handleSearch triggered with:", {
      franchise,
      cardName,
      amount,
    });

    try {
      const response = await searchCards(
        franchise,
        bestMatch?.name ?? cardName.trim()
      );

      console.log("📦 API response from searchCards:", response);

      const fullResults = response.map((card) => ({
        ...card,
        amount: -1, //it gets updated later so it doesn't matter, plus the searches won't have a quanity on them now
        addedAt: Timestamp.now(), // placeholder --> replaced on form submit
        lastViewedAt: Timestamp.fromDate(new Date("2000-01-01T00:00:00Z")), // placeholder --> replaced on form submit
        viewCount: 0, // placeholder --> replaced on form submit
      }));
      setResults(fullResults);
    } catch {
      setError("An error occurred while searching.");
    }
  };

  // Handles final form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

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
        </div>

        {/* ----- Amount Input ----- */}
        <div className="form-row">
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            className="form-control"
            value={amountText}
            onChange={handleAmountChange}
          />
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => {
              if (amountText === "") {
                setAmountError({ error: false, message: "" });
                setAmountText("1");
                changeAmount(1);
                return;
              }
              const num = Math.max(1, Number(amountText) + 1);
              changeAmount(num);
              setAmountText(String(num));
              setAmountError({ error: false, message: "" });
            }}
          >
            <i className="bi bi-plus" />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => {
              changeAmount(Math.max(1, amount - 1));
              if (amountText === "") {
                setAmountError({ error: false, message: "" });
                setAmountText("1");
                changeAmount(1);
                return;
              }
              const num = Math.max(1, Number(amountText) - 1);
              changeAmount(num);
              setAmountText(String(num));
              setAmountError({ error: false, message: "" });
            }}
          >
            <i className="bi bi-dash" />
          </button>
        </div>
        {amountError.error && (
          <div className="d-flex justify-content-start pb-2  text-danger">
            {amountError.message}
          </div>
        )}

        {/* 🔻 Submit is moved down here to cover entire form 🔻 */}
        <div className="form-row">
          <button type="submit" className="confirm-btn">
            Search
          </button>
        </div>
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
      {results && results.length > 0 ? (
        <>
          {console.log("Rendering card results:", results)}
          <div className="card-results-grid">
            {results.map((card, index) => (
              <div
                key={index}
                className="card-search-wrapper"
                onClick={() => {
                  if (card.multipleSets?.multiSets) {
                    setResults(null);
                    const cards: StoredCard[] = [];
                    card.multipleSets.imgs.forEach((img) => {
                      cards.push({
                        ...card,
                        imageUrl: img,
                        multipleSets: { imgs: [], multiSets: false },
                      });
                    });
                    setResults(cards);
                  } else {
                    onConfirm(card);
                  }
                }}
              >
                <Card {...card} />
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
