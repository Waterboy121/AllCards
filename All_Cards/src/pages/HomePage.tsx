// src/assets/pages/HomePage.tsx

import "../assets/css/Homepage.css";
import "../assets/css/NavBar.css";
import "../assets/css/Sidebar.css";
import pikachuGif from "../assets/images/gifs/pikachu.webp";

import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Popup from "../components/Popup";
import AddCollectionForm from "../components/popups/AddCollectionForm.tsx";
import AddCardForm from "../components/popups/AddCardForm";
import MainView from "../components/MainView";

import { useEffect, useMemo, useState } from "react";
import type { StoredCard } from "../assets/types/card.ts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/index.ts";
import {
  addCardToCollection,
  getAllCardsFromCollections,
  addCollectionTab,
  getCollectionTabs,
  deleteCollection,
} from "../firebase/database.ts";
import type { UserCollection } from "../assets/types/collection.ts";
import type { AllCards } from "../assets/types/all-cards.ts";
import { getAllCardsFromJson } from "../assets/apis/card-api-router.ts";

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

  //all the card names for the 3 franchises
  const [allCards, setAllCards] = useState<AllCards[]>([]);

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

  const handleDeleteCollection = (collectionName: string) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${collectionName}?`
    );
    if (!confirm) return;

    setCurrentTab("Home");
    setCollectionTabs(
      collectionTabs.filter((coll) => coll.name !== collectionName)
    );
    deleteCollection(collectionName);
  };

  const handleAddCard = (collectionName: string) => {
    setSelectedCollection(collectionName);
    setShowAddCardPopup(true);
  };

  const handleCardConfirm = (card: StoredCard) => {
    if (selectedCollection === null) return;
    if (amount <= 0) return;

    card.amount = amount;
    card.collection = selectedCollection;

    addCardToCollection(card, selectedCollection);
    setShowAddCardPopup(false);
    setAddedCard(true);
    setSelectedCollection(null);
    setAmount(1);
  };

  const handleDeleteCard = (card: StoredCard) => {
    setAllCollections((prev) => {
      const updated = { ...prev };
      updated[card.collection] = updated[card.collection].filter(
        (c) => c.id !== card.id && c.set !== card.set
      );
      return updated;
    });
  };


  const filteredCards = useMemo(() => {
    if (currentTab === "Home") return allCards;
    const franchiseKey = collectionTabs.find(
      (collectionTabs) => collectionTabs.name === currentTab
    )?.franchiseKey;
    return allCards.filter((card) => card.tcg === franchiseKey);
  }, [allCards, currentTab]);

  //testing
  useEffect(() => {
    console.log(filteredCards);
  }, [filteredCards]);

  useEffect(() => {
    //getUniqueSetImages("Austere Command");\
    //getUniqueSetImages("blood");
  });

  // Fetch collection tabs on load and all the cards from the apis
  useEffect(() => {
    getAllCardsFromJson()
      .then((data) => setAllCards(data))
      .catch((error) => console.log("Error Loading: " + error));

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
      <div className="d-flex justify-content-center align-items-center vh-100">
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

          {/* ================ MainView (Home or Collection) ================ */}
          <div className="main-view">
            <MainView
              currentTab={currentTab}
              allCollections={allCollections}
              handleDeleteCard={handleDeleteCard}
            />
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
              filteredCards={filteredCards}
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
      </div>
    </>
  );
}

export default HomePage;