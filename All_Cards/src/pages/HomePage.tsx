// src/assets/pages/HomePage.tsx

import "../assets/css/Homepage.css";
import "../assets/css/NavBar.css";
import "../assets/css/Sidebar.css";
import pikachuGif from "../assets/images/gifs/pikachu.webp";

import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Popup from "../components/Popup";
import AddCollectionForm from "../components/popups/AddCollectionForm";
import AddCardForm from "../components/popups/AddCardForm";
import MainView from "../components/MainView";                                        // ← your old view
import Card from "../components/Card";                                                // ← new grid cards
import PokemonCardDetails from "../components/popups/tcgdetails/PokemonCardDetails";
import YuGiOhCardDetails from "../components/popups/tcgdetails/YuGiOhCardDetails";
import MTGCardDetails from "../components/popups/tcgdetails/MTGCardDetails";

import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card";
import type { UserCollection } from "../assets/types/collection";
import type { AllCards } from "../assets/types/all-cards";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/index";
import {
  addCardToCollection,
  getAllCardsFromCollections,
  addCollectionTab,
  getCollectionTabs,
  deleteCollection,
} from "../firebase/database";
import { getAllCardsFromJson } from "../assets/apis/card-api-router";

type Franchise = { name: string; logoKey: string };

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [addedCard, setAddedCard] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("Home");

  // for collections
  const [collectionTabs, setCollectionTabs] = useState<UserCollection[]>([]);
  const [allCollections, setAllCollections] = useState<Record<string, StoredCard[]>>({});

  // for “browse all” grid
  const [homeCards, setHomeCards] = useState<StoredCard[]>([]);
  const franchiseTabs: Franchise[] = [
    { name: "Pokemon",  logoKey: "pokemon" },
    { name: "Yu-Gi-Oh", logoKey: "yu-gi-oh" },
    { name: "Magic",    logoKey: "magic" },
  ];

  // popups & card‐detail state
  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);
  const [showAddPopup,   setShowAddPopup]   = useState(false);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // amount for AddCardForm
  const [amount, setAmount] = useState(1);
  const changeAmount = (qty: number) => setAmount(qty);

  // ── COLLECTION MANAGEMENT ────────────────────────────────────────────────
  const handleAddCollection = () => setShowAddPopup(true);
  const handleCreateCollection = (name: string, franchiseKey: string) => {
    const order = collectionTabs.length;
    const newTab: UserCollection = { name, franchiseKey, createdAt: undefined, order };
    addCollectionTab(newTab, order);
    setCollectionTabs((prev) => [...prev, newTab]);
    setCurrentTab(name);
    setShowAddPopup(false);
  };
  const handleDeleteCollection = (collectionName: string) => {
    if (!window.confirm(`Delete "${collectionName}"?`)) return;
    deleteCollection(collectionName);
    setCollectionTabs((prev) => prev.filter((c) => c.name !== collectionName));
    setCurrentTab("Home");
  };

  // ── ADD A CARD ───────────────────────────────────────────────────────────
  const handleAddCard = (collectionName: string) => {
    setSelectedCollection(collectionName);
    setShowAddCardPopup(true);
  };
  const handleCardConfirm = (card: StoredCard) => {
    if (!selectedCollection || amount <= 0) return;
    card.amount = amount;
    card.collection = selectedCollection;
    addCardToCollection(card, selectedCollection);
    setShowAddCardPopup(false);
    setAddedCard(true);
    setAmount(1);
  };

  // ── FETCH COLLECTION TABS & CARDS ───────────────────────────────────────
  useEffect(() => {
    onAuthStateChanged(auth, async () => {
      const tabs = await getCollectionTabs();
      setCollectionTabs(tabs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    getAllCardsFromCollections(collectionTabs).then(setAllCollections);
  }, [loading, collectionTabs]);

  useEffect(() => {
    if (!addedCard) return;
    // re-fetch after you add a card
    getAllCardsFromCollections(collectionTabs).then(setAllCollections);
    setAddedCard(false);
  }, [addedCard, collectionTabs]);

  // ── FETCH HOME GRID CARDS ────────────────────────────────────────────────
  useEffect(() => {
    getAllCardsFromJson()
      .then((raw) => {
        // raw is AllCards[], map to StoredCard shape if needed
        // here we just cast for the grid demo
        setHomeCards(raw as unknown as StoredCard[]);
      })
      .catch(console.error);
  }, []);

  // ── RENDER ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <img
          src={pikachuGif}
          alt="Loading Pikachu"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <NavBar />
      <div className="homepage-layout">
        <Sidebar
          collections={collectionTabs}
          currentTab={currentTab}
          onTabClick={setCurrentTab}
          onAddCollection={handleAddCollection}
          onAddCard={handleAddCard}
          onDeleteCollection={handleDeleteCollection}
        />

        <div className="main-view">
          {currentTab === "Home" ? (
            <div className="mock-card-grid">
              {homeCards.map((card, i) => (
                <Card
                  key={i}
                  {...card}
                  onClick={() => setSelectedCard(card)}
                />
              ))}
            </div>
          ) : (
            <MainView
              currentTab={currentTab}
              allCollections={allCollections}
              handleDeleteCard={(card) => {
                setAllCollections((prev) => {
                  const clone = { ...prev };
                  clone[card.collection] = clone[card.collection].filter(
                    (c) => !(c.id === card.id && c.set === card.set)
                  );
                  return clone;
                });
              }}
            />
          )}
        </div>
      </div>

      {/*
        On any card click from either grid or main view,
        show the appropriate detail popup based on
        card.tcg (Pokemon | Yu-Gi-Oh | Magic)
      */}
      {selectedCard && (
        <Popup onClose={() => setSelectedCard(null)}>
          {{
            Pokemon: (
              <PokemonCardDetails
                card={selectedCard}
                onClose={(refresh) => {
                  if (refresh) {
                    getAllCardsFromCollections(collectionTabs).then(setAllCollections);
                  }
                  setSelectedCard(null);
                }}
              />
            ),
            "Yu-Gi-Oh": (
              <YuGiOhCardDetails
                card={selectedCard}
                onClose={(refresh) => {
                  if (refresh) {
                    getAllCardsFromCollections(collectionTabs).then(setAllCollections);
                  }
                  setSelectedCard(null);
                }}
              />
            ),
            Magic: (
              <MTGCardDetails
                card={selectedCard}
                onClose={(refresh) => {
                  if (refresh) {
                    getAllCardsFromCollections(collectionTabs).then(setAllCollections);
                  }
                  setSelectedCard(null);
                }}
              />
            ),
          }[selectedCard.tcg] ?? null}
        </Popup>
      )}

      {showAddPopup && (
        <Popup onClose={() => setShowAddPopup(false)}>
          <AddCollectionForm
            onSubmit={handleCreateCollection}
            onCancel={() => setShowAddPopup(false)}
          />
        </Popup>
      )}

      {showAddCardPopup && selectedCollection && (
        <Popup onClose={() => setShowAddCardPopup(false)}>
          <AddCardForm
            amount={amount}
            filteredCards={homeCards}         // or use your old `filteredCards` logic
            changeAmount={changeAmount}
            franchise={
              collectionTabs.find((t) => t.name === selectedCollection)
                ?.franchiseKey ?? ""
            }
            onConfirm={handleCardConfirm}
            onCancel={() => setShowAddCardPopup(false)}
          />
        </Popup>
      )}
    </div>
  );
}