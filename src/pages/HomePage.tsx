// src/assets/pages/HomePage.tsx

import pikachuGif from "../assets/images/gifs/pikachu.webp";

import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Popup from "../components/Popup";
import AddCollectionForm from "../components/popups/AddCollectionForm.tsx";
import AddCardForm from "../components/popups/AddCardForm";
import MainView from "../components/MainView";

import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card.ts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/index.ts";
import {
  addCardToCollection,
  getAllCardsFromCollections,
  addCollectionTab,
  getCollectionTabs,
} from "../firebase/database.ts";
import type { UserCollection } from "../assets/types/collection.ts";

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [addedCard, setAddedCard] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("Home");

  const [collectionTabs, setCollectionTabs] = useState<UserCollection[]>([]);

  const [amount, setAmount] = useState(1);

  const [allCollections, setAllCollections] = useState<
    Record<string, StoredCard[]>
  >({});

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const changeAmount = (quantity: number) => {
    setAmount(quantity);
  };

  const handleAddCollection = () => {
    setShowAddPopup(true);
  };

  const handleCreateCollection = (name: string, franchiseKey: string) => {
    const order = collectionTabs.length;

    const newCollection: UserCollection = {
      name,
      franchiseKey,
      createdAt: undefined,
      order: order,
    };
    addCollectionTab(newCollection, order);
    setCollectionTabs((prev) => [...prev, newCollection]);
    setCurrentTab(name);
    setShowAddPopup(false);
  };

  const handleAddCard = (collectionName: string) => {
    setSelectedCollection(collectionName);
    setShowAddCardPopup(true);
  };

  const handleCardConfirm = (card: StoredCard) => {
    card.amount = amount;

    if (selectedCollection === null) return;
    if (amount <= 0) return;

    addCardToCollection(card, selectedCollection);
    setShowAddCardPopup(false);
    setAddedCard(true);
    setSelectedCollection(null);
    setAmount(1);
  };

  // Fetch collection tabs on load
  useEffect(() => {
    onAuthStateChanged(auth, async () => {
      const tabs = await getCollectionTabs();
      setCollectionTabs(tabs);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  }, []);

  // Fetch cards after loading or tab update
  useEffect(() => {
    if (loading) return;

    getAllCardsFromCollections(collectionTabs).then((data) => {
      setAllCollections(data);
    });
  }, [loading, collectionTabs]);

  // Fetch cards again after a card is added
  useEffect(() => {
    if (!addedCard) return;

    setTimeout(() => {
      getAllCardsFromCollections(collectionTabs).then((data) => {
        setAllCollections(data);
      });
      setAddedCard(false);
    }, 500);
  }, [addedCard, collectionTabs]);

  if (loading) {
    return (
      <div className="flex-center vh-100">
        <img
          src={pikachuGif}
          alt="Loading Pikachu"
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="homepage-layout">
        <Sidebar
          collections={collectionTabs}
          currentTab={currentTab}
          onTabClick={setCurrentTab}
          onAddCollection={handleAddCollection}
          onAddCard={handleAddCard}
        />

        {/* ================ MainView (Home or Collection) ================ */}
        <div className="container-mainview ">
          <MainView currentTab={currentTab} allCollections={allCollections} />
        </div>
      </div>

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
            changeAmount={changeAmount}
            franchise={
              collectionTabs.find((tab) => tab.name === selectedCollection)
                ?.franchiseKey ?? ""
            }
            onConfirm={handleCardConfirm}
            onCancel={() => setShowAddCardPopup(false)}
          />
        </Popup>
      )}
    </>
  );
}

export default HomePage;
