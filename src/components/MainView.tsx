// src/components/MainView.tsx

import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card";
import { getUser } from "../firebase/auth.ts";
import Card from "./Card";

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
};

function MainView({ currentTab, allCollections }: Props) {
  /* ============================================================================
  Local State: cardsToDisplay
    - Stores the array of cards to render in the grid.
    - Updates whenever the currentTab or allCollections change.
  ============================================================================ */
  const [cardsToDisplay, setCardsToDisplay] = useState<StoredCard[]>([]);

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
    } else {
      const collectionCards = allCollections[currentTab] || [];
      const sorted = [...collectionCards].sort(
        (a, b) => b.addedAt.toMillis() - a.addedAt.toMillis()
      );
      setCardsToDisplay(sorted);
    }
  }, [currentTab, allCollections]);

  /* ============================================================================
  Render Card Grid
    - Displays all cards in the cardsToDisplay state.
    - Uses the shared <Card> component for each card entry.
  ============================================================================ */
  return (
    <div className="container-mainview">
      {currentTab === "Home" ? (
        <h2 className="cinzel-mainview">
          ※ Welcome <span className="highlight-user">{getUser()}</span>! ※
        </h2>
      ) : (
        <h2 className="cinzel-mainview">
          Archive Catalogue ⋄ Entry⦂{" "}
          <span className="highlight-collection">{currentTab}</span>
        </h2>
      )}

      <div className="grid-card">
        {cardsToDisplay.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default MainView;
