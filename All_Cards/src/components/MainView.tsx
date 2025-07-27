// src/components/MainView.tsx

import "../assets/css/MainView.css";
import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card";
import { getUser } from "../firebase/auth.ts";
import Card from "./Card";
import Popup from "./Popup.tsx";
import PokemonCardDetails from "./popups/tcgdetails/PokemonCardDetails.tsx";
import YuGiOhCardDetails from "./popups/tcgdetails/YuGiOhCardDetails.tsx";
import MTGCardDetails from "./popups/tcgdetails/MTGCardDetails.tsx";

/* ============================================================================
MainView Component
  - Displays a grid of cards depending on the currently selected tab.
  - If "Home" is selected, shows all cards across all collections, sorted by
    most recently added.
  - If a collection tab is selected, shows only that tab's cards, also sorted
    by most recently added.
============================================================================ */
type Props = {
  currentTab: string;
  allCollections: Record<string, StoredCard[]>;
  handleDeleteCard: (card: StoredCard) => void;
};

function MainView({ currentTab, allCollections, handleDeleteCard }: Props) {
  /* ============================================================================
  Local State: cardsToDisplay
    - Stores the array of cards to render in the grid.
    - Updates whenever the currentTab or allCollections change.
  ============================================================================ */
  const [cardsToDisplay, setCardsToDisplay] = useState<StoredCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);

  /* ============================================================================
  useEffect Hook
    - Runs whenever currentTab or allCollections changes.
    - Sorts cards by addedAt timestamp (most recent first).
    - Filters based on Home vs specific collection tab.
  ============================================================================ */
  useEffect(() => {
    if (currentTab === "Home") {
      const allCards = Object.values(allCollections).flat();
      const sorted = [...allCards].sort(
        (a, b) => b.addedAt.toMillis() - a.addedAt.toMillis()
      );
      setCardsToDisplay(sorted);
      console.log(sorted);
    } else {
      const collectionCards = allCollections[currentTab] || [];
      const sorted = [...collectionCards].sort(
        (a, b) => b.addedAt.toMillis() - a.addedAt.toMillis()
      );
      setCardsToDisplay(sorted);
    }
  }, [currentTab, allCollections]);

  useEffect(() => {
    console.log(allCollections);
  }, [allCollections]);

  /* ============================================================================
  Render Card Grid
    - Displays all cards in the cardsToDisplay state.
    - Uses the shared <Card> component for each card entry.
  ============================================================================ */
  return (
    <>
      <div className="main-view">
        {currentTab === "Home" ? (
          <h2>
            ※ Welcome <span className="highlighted-user">{getUser()}</span>! ※
          </h2>
        ) : (
          <h2>
            Archive Catalogue ⋄ Entry⦂{" "}
            <span className="highlighted-tab">{currentTab}</span>
          </h2>
        )}

        <div className="card-grid">
          {cardsToDisplay.map((card, index) => (
            <Card
              key={index}
              {...card}
              onClick={() => {
                console.log("Clicked card:", card);
                setSelectedCard(card);
              }}
            />
          ))}
        </div>
      </div>
      {selectedCard && (
        <Popup onClose={() => setSelectedCard(null)}>
          {{
            pokemon: (
              <PokemonCardDetails
                card={selectedCard}
                onClose={(shouldRefresh?: boolean) => {
                  if (shouldRefresh) {
                    handleDeleteCard(selectedCard);
                    setSelectedCard(null);
                  } else setSelectedCard(null);
                }}
              />
            ),
            "yu-gi-oh": (
              <YuGiOhCardDetails
                card={selectedCard}
                onClose={(shouldRefresh?: boolean) => {
                  if (shouldRefresh) {
                    handleDeleteCard(selectedCard);
                    setSelectedCard(null);
                  } else setSelectedCard(null);
                }}
              />
            ),
            magic: (
              <MTGCardDetails
                card={selectedCard}
                onClose={(shouldRefresh?: boolean) => {
                  if (shouldRefresh) {
                    handleDeleteCard(selectedCard);
                    setSelectedCard(null);
                  } else setSelectedCard(null);
                }}
              />
            ),
          }[selectedCard.tcg] ?? null}
        </Popup>
      )}
    </>
  );
}

export default MainView;
