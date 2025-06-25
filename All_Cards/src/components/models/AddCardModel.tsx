import { useEffect, useState } from "react";
import { db } from "../../firebase/index.ts";
import { collection, addDoc } from "firebase/firestore";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../assets/css/AddCardModel.css";

interface AddCardProp {
  show: boolean;
  onClick: () => void;
}

function AddCardModel({ show, onClick }: AddCardProp) {
  const [shouldRender, setShouldRender] = useState(show);
  const [fadeClass, setFadeClass] = useState("");
  const [cardName, setCardName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [TCG, setTCG] = useState("Pokémon");

  const ref = collection(db, "users"); //to do change 'users' into user account name

  /*Testing Values
  useEffect(() => {
    console.log(TCG);
  }, [TCG]);*/

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      requestAnimationFrame(() => setFadeClass("show"));
    } else {
      setFadeClass("");
      const timeout = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!shouldRender) return null;

  const handlerSubmitCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(cardName + " | " + quantity + " | " + TCG);
    let data = {
      card_name: cardName,
      amount: quantity,
      trading_card: TCG,
    };
    try {
      addDoc(ref, data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className={`modal-backdrop fade ${fadeClass}`}></div>
      <div className={`modal d-block modal-fade ${fadeClass}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <div style={{ width: "40px" }}></div>
              <h5 className="modal-title anta-regular text-dark fs-5 text-center mb-0 mx-auto">
                Add Card to your Library
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClick}
              ></button>
            </div>
            <form onSubmit={handlerSubmitCard}>
              <div className="modal-body">
                {/*Put the form in here*/}
                {/*Card start*/}
                <div className="input-group mb-3">
                  <span className="input-group-text anta-regular text-dark fs-5">
                    Card Name
                  </span>
                  <input
                    type="text"
                    className="form-control anta-regular text-dark fs-5"
                    placeholder="Card Name"
                    aria-label="CardName"
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                {/*Card end*/}
                {/*Amount start*/}
                <div className="input-group mb-3">
                  <span className="input-group-text anta-regular text-dark fs-5">
                    Amount
                  </span>
                  <input
                    type="number"
                    className="form-control anta-regular text-dark fs-5"
                    value={quantity}
                    aria-label="Amount"
                    onChange={(e) => {
                      setQuantity(parseInt(e.target.value));
                    }}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setQuantity(quantity + 1);
                    }}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setQuantity(quantity - 1);
                    }}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                </div>
                {/*Amount end*/}
                {/*TCG Picker start*/}
                <div className="input-group mb-3">
                  <span className="input-group-text anta-regular text-dark fs-5">
                    TCG
                  </span>
                  <select
                    className="form-select anta-regular text-dark fs-5"
                    aria-label="TCG Picker"
                    value={TCG}
                    onChange={(e) => {
                      setTCG(e.target.value);
                    }}
                  >
                    <option defaultValue="Pokémon">Pokémon</option>
                    <option value="Yu-Gi-Oh">Yu-Gi-Oh</option>
                    <option value="One Piece">One Piece</option>
                    <option value="Magic The Gathering">
                      Magic The Gathering
                    </option>
                  </select>
                </div>
                {/*TCG Picker end*/}
                {/*Upload Picture start*/}
                <div className="input-group mb-3">
                  <input
                    type="file"
                    className="form-control anta-regular text-dark fs-5"
                  />
                </div>
                {/*Upload Picture end*/}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClick}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCardModel;
