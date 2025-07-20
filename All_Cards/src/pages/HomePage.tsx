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
import CardDetailsModal from "../components/popups/CardDetailsModel";
import PokemonCardDetails from "../components/popups/tcgdetails/PokemonCardDetails";
import YuGiOhCardDetails from "../components/popups/tcgdetails/YuGiOhCardDetails";
import MTGCardDetails from "../components/popups/tcgdetails/MTGCardDetails";
import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card.ts";
import { getUser } from "../firebase/auth.ts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/index.ts";
import { addCard, getData } from "../firebase/database.ts";
import type { Franchise } from "../assets/types/franchise.ts";

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [addedCard, setAddedCard] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("Home");
  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);
  const [selectedCardFranchise, setSelectedCardFranchise] = useState<string>("");
  const [franchiseTabs, setFranchiseTabs] = useState<Franchise[]>([
    { name: "Pokemon", logoKey: "pokemon" },
    { name: "Yu-Gi-Oh", logoKey: "yu-gi-oh" },
    { name: "Magic", logoKey: "magic" },
  ]);

  const [amount, setAmount] = useState(1);

  const [homeCards, setHomeCards] = useState<StoredCard[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<string | null>(
    null
  );

  const changeAmount = (quantity: number) => {
    setAmount(quantity);
  };

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
    card.amount = amount;
    console.log("Card selected:", card);
    if (selectedFranchise === null) {
      console.log("Franchise is null"); //if for some reason this is null, don't use it
      return;
    }
    if (amount <= 0) {
      return;
    }
    const franchise = selectedFranchise ?? ""; //this should never be "", but I need a string only so i am using this workaround
    addCard(card, franchise);
    setShowAddCardPopup(false);
    setAddedCard(true);
    setSelectedFranchise(null);
    setAmount(1);
  };

  const fetchCards = async () => {
    const data = await getData(franchiseTabs);
    setHomeCards(data);
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
      console.log("Loading!");
      return;
    } else {
      getData(franchiseTabs).then((data) => {
        setHomeCards(data); //to do organize the cards into its proper franchise and collection
      });
      console.log("Loaded!");
    }
  }, [loading]);

  useEffect(() => {
    if (addedCard) {
      //it waits half a second for the document to be added to the database
      setTimeout(() => {
        getData(franchiseTabs).then((data) => {
          setHomeCards(data); //to do organize the cards into its proper franchise and collection
        });
        setAddedCard(false);
        console.log("Added!");
      }, 500);
    }
  }, [addedCard]);

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
            franchises={franchiseTabs}
            currentTab={currentTab}
            onTabClick={setCurrentTab}
            onAddFranchise={handleAddFranchise}
            onAddCard={handleAddCard}
          />
          <div className="mock-mainview">
            <h2>Welcome {getUser()}!</h2>

            <div className="mock-card-grid">
              {homeCards.map((card, index) => (
                <Card
  key={index}
  {...card}
  onClick={() =>{
      console.log("Clicked card:", card.name);
      setSelectedCard(card);
      }}// set card to be card that is clicked on for info
/>
              ))}
            </div>
          </div>
        </div>


        {/* {selectedCard && (      // when card is clicked open pop up for the selected card
          <Popup onClose={() => setSelectedCard(null)}>
            <CardDetailsModal
              card={selectedCard}
              onClose={(shouldRefresh = false) => {
              setSelectedCard(null);
              if (shouldRefresh) fetchCards(); // refresh after save
              }}
            />
          </Popup>
        )} */}
        {selectedCard && (
  <Popup onClose={() => setSelectedCard(null)}>
    {{
      Pokemon: (
        <PokemonCardDetails
          card={selectedCard}
          onClose={(shouldRefresh?: boolean) => {
            if (shouldRefresh) {
              getData(franchiseTabs).then(setHomeCards);
            }
            setSelectedCard(null);
          }}
        />
      ),
      "Yu-Gi-Oh": (
        <YuGiOhCardDetails
          card={selectedCard}
          onClose={(shouldRefresh?: boolean) => {
            if (shouldRefresh) {
              getData(franchiseTabs).then(setHomeCards);
            }
            setSelectedCard(null);
          }}
        />
      ),
      Magic: (
        <MTGCardDetails
          card={selectedCard}
          onClose={(shouldRefresh?: boolean) => {
            if (shouldRefresh) {
              getData(franchiseTabs).then(setHomeCards);
            }
            setSelectedCard(null);
          }}
        />
      ),
    }[selectedCard.franchise] ?? null}
  </Popup>
)}
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
              amount={amount}
              changeAmount={changeAmount}
              franchise={selectedFranchise}
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
