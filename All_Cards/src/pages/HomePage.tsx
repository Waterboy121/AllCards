// src/assets/pages/HomePage.tsx
import "../assets/css/Homepage.css";

import "../assets/css/NavBar.css";
import "../assets/css/Sidebar.css";
// import "../css/MainView.css";
import pikachuGif from "../assets/images/gifs/pikachu.webp";

import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Popup from "../components/Popup";
import AddFranchiseForm from "../components/popups/AddFranchiseForm";
import AddCardForm from "../components/popups/AddCardForm";
import Card from "../components/Card";

import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card.ts";
import { getUser } from "../firebase/auth.ts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/index.ts";
import { addCard, getData } from "../firebase/database.ts";
import type { Franchise } from "../assets/types/franchise.ts";

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<string>("Home");

  const [franchiseTabs, setFranchiseTabs] = useState<Franchise[]>([
    { name: "Pokemon", logoKey: "pokemon" },
    { name: "Yu-Gi-Oh", logoKey: "yu-gi-oh" },
    { name: "Magic", logoKey: "magic" },
  ]);

  //const mockCards: StoredCard[] = [];
  const [mockCards, setMockCards] = useState<StoredCard[]>([]);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<string | null>(
    null
  );

  const handleAddFranchise = () => {
    setShowAddPopup(true);
  };

  const handleCreateFranchise = (name: string, logoKey: string) => {
    setFranchiseTabs((prev) => [...prev, { name, logoKey }]);
    setCurrentTab(name);
    setShowAddPopup(false);
  };

  const handleAddCard = (franchiseName: string) => {
    setSelectedFranchise(franchiseName);
    setShowAddCardPopup(true);
  };

  const handleCardConfirm = (card: StoredCard) => {
    const updatedCard: StoredCard = {
      id: card.id,
      name: card.name,
      imageUrl: card.imageUrl,
      set: card.set,
      amount: 1, //add a place to the form to add a amount for the card, when added delete this and just use card instead.
    };
    console.log("Card selected:", card);
    setShowAddCardPopup(false);
    if (selectedFranchise === null) {
      console.log("Franchise is null"); //if for some reason this is null, don't use it
      return;
    }
    const franchise = selectedFranchise ?? ""; //this should never be "", but I need a string only so i am using this workaround
    addCard(updatedCard, franchise);
    setSelectedFranchise(null);
  };

  //this will happen once per start of the homepage
  useEffect(() => {
    onAuthStateChanged(auth, () => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  }, []);

  useEffect(() => {
    if (loading) {
      console.log("no");
      return;
    } else console.log("yes");
    getData(franchiseTabs).then((data) => {
      setMockCards(data);
    });
  }, [mockCards, loading]);

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
    <div className="homepage-container">
      <NavBar />
      <div className="homepage-layout">
        <Sidebar
          franchises={franchiseTabs}
          currentTab={currentTab}
          onTabClick={setCurrentTab}
          onAddFranchise={handleAddFranchise}
          onAddCard={handleAddCard}
        />
        <div className="mock-mainview">
          <h2>Welcome {getUser()}!</h2>

          <div className="mock-card-grid">
            {mockCards.map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>

      {showAddPopup && (
        <Popup onClose={() => setShowAddPopup(false)}>
          <AddFranchiseForm
            onSubmit={handleCreateFranchise}
            onCancel={() => setShowAddPopup(false)}
          />
        </Popup>
      )}

      {showAddCardPopup && selectedFranchise && (
        <Popup onClose={() => setShowAddCardPopup(false)}>
          <AddCardForm
            franchise={selectedFranchise}
            onConfirm={handleCardConfirm}
            onCancel={() => setShowAddCardPopup(false)}
          />
        </Popup>
      )}
    </div>
  );
}

export default HomePage;
