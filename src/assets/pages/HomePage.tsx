// src/assets/pages/HomePage.tsx
import "./Homepage.css";

import "../css/NavBar.css";
import "../css/Sidebar.css";
// import "../css/MainView.css";

import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Popup from "../components/Popup";
import AddFranchiseForm from "../components/popups/AddFranchiseForm";
import AddCardForm from "../components/popups/AddCardForm";
import Card from "../components/Card";

import { useState } from "react";
import type { StoredCard } from "../types/card";

function HomePage() {
    const [currentTab, setCurrentTab] = useState<string>("Home");

    const [franchiseTabs, setFranchiseTabs] = useState([
        { name: "Pokemon", logoKey: "pokemon" },
        { name: "Yu-Gi-Oh", logoKey: "yu-gi-oh" },
        { name: "Magic", logoKey: "magic" },
    ]);

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
        console.log("Card selected:", card);
        setShowAddCardPopup(false);
        setSelectedFranchise(null);
        // Later: store in Firestore / collection state
    };

    const mockCards: StoredCard[] = [
        {
            id: "base1-4",
            name: "Charizard",
            imageUrl: "https://images.pokemontcg.io/base1/4.png",
            set: "Base Set",
        },
        {
            id: "46986414",
            name: "Dark Magician",
            imageUrl: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
            set: "Legend of Blue Eyes White Dragon",
        },
        {
            id: "black-lotus",
            name: "Black Lotus",
            imageUrl:
                "https://cards.scryfall.io/large/front/4/c/4c85d097-e87b-41ee-93c6-0e54ec41b174.jpg?1562799094",
            set: "Alpha",
        },
    ];

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
                    <h2>Welcome to AllCards</h2>
                    <p>This is a "MOCK" MainView rendering.</p>

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
