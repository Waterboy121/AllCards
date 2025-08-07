// src/components/MainView.tsx

import "../assets/css/MainView.css";
import { useEffect, useMemo, useState } from "react";
import type { StoredCard } from "../assets/types/card";
import { getUser } from "../firebase/auth.ts";
import Card from "./Card";
import Popup from "./Popup.tsx";
import PokemonCardDetails from "./popups/tcgdetails/PokemonCardDetails.tsx";
import YuGiOhCardDetails from "./popups/tcgdetails/YuGiOhCardDetails.tsx";
import MTGCardDetails from "./popups/tcgdetails/MTGCardDetails.tsx";
import Fuse from "fuse.js";

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
  searchBar: string;
  allCollections: Record<string, StoredCard[]>;
  handleDeleteCard: (card: StoredCard) => void;
};

function MainView({
  currentTab,
  searchBar,
  allCollections,
  handleDeleteCard,
}: Props) {
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

  // const filteredCards = useMemo(() => {
  //   return allCards.filter((card) => card.tcg === franchise);
  // }, [allCards, franchise]);

  const filteredCards = useMemo(() => {
    if (currentTab === "Home") return Object.values(allCollections).flat();
    return allCollections[currentTab];
  }, [currentTab, allCollections]); //when a card gets added or when the tab changes, update the filteredCards

  const fuse = useMemo(() => {
    return new Fuse(filteredCards, {
      keys: ["name"],
      threshold: 0.4, //smaller equals stricter searches
      ignoreLocation: true, //searches all cards from the franchise
    });
  }, [filteredCards]);

  useEffect(() => {
    if (searchBar !== "" && filteredCards !== undefined) {
      const results = fuse.search(searchBar) ?? [];
      const cards = results.map((card) => card.item);
      const sorted = [...cards].sort(
        (a, b) => b.addedAt.toMillis() - a.addedAt.toMillis()
      );
      setCardsToDisplay(sorted);
      console.log(sorted);
      return;
    }

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
  }, [currentTab, searchBar, allCollections]);

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
