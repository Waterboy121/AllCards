import { useEffect, useState } from "react";
import type { StoredCard } from "../assets/types/card.ts";
import { useForm, type SubmitHandler } from "react-hook-form";
import { getCardDetailsByName } from "../assets/apis/yu-gi-oh.ts";
import { addCard } from "../firebase/database.ts";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../assets/css/AddCardModel.css";

interface AddCardProp {
  show: boolean;
  onClick: () => void;
}

function AddCardModel({ show, onClick }: AddCardProp) {
  const [shouldRender, setShouldRender] = useState(show);
  const [fadeClass, setFadeClass] = useState("");
  const [showCardSets, setShowCardSets] = useState(false);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showCardSetsButton, setShowCardSetsButton] = useState(true);
  const [cardSets, setCardSets] = useState<string[]>([]);
  const [errorName, setErrorName] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<StoredCard>({
    defaultValues: {
      amount: 1,
    },
  });

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

  const handlerSubmitCard: SubmitHandler<StoredCard> = async (data) => {
    const cardInfo = getCardDetailsByName(data.name);
    let card: StoredCard = {
      id: "",
      name: data.name,
      imageUrl: "",
      set: data.set,
      amount: data.amount,
      tcg: data.tcg,
    };
    cardInfo.then((value) => {
      card.id = String(value.id);
      card.imageUrl = `https://images.ygoprodeck.com/images/cards/${value.id}.jpg`;
      console.log(card);
      addCard(card);
    });
  };

  const handlerCardSets = () => {
    if (getValues("name") === "") {
      setErrorName(true);
      return;
    }
    setErrorName(false);
    setShowCardSets(true);
    setShowCardSetsButton(false);
    setShowAddButton(true);
    const cardInfo = getCardDetailsByName(getValues("name"));
    cardInfo.then((data) => {
      const names = data.card_sets?.map((set) => set.set_name) || [];
      const unique = [...new Set(names)];
      setCardSets(unique);
      setValue("set", unique[0]);
    });
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
            <form onSubmit={handleSubmit(handlerSubmitCard)}>
              <div className="modal-body">
                {/*Put the form in here*/}
                {/*Card start*/}
                <div className="input-group mb-3">
                  <span className="input-group-text anta-regular text-dark fs-5">
                    Card Name
                  </span>
                  <input
                    {...register("name", {
                      required: "You need to input a name",
                    })}
                    type="text"
                    className="form-control anta-regular text-dark fs-5"
                    placeholder="Card Name"
                    aria-label="CardName"
                  />
                  {errorName && (
                    <div className="invalid-feedback d-block anta-regular">
                      You need to input a name
                    </div>
                  )}
                </div>
                {/*Card end*/}
                {/*Amount start*/}
                <div className="input-group mb-3">
                  <span className="input-group-text anta-regular text-dark fs-5">
                    Amount
                  </span>
                  <input
                    {...register("amount")}
                    type="number"
                    className="form-control anta-regular text-dark fs-5"
                    aria-label="Amount"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      let currentValue = getValues("amount") ?? 0; //never should be 0 because default value is 1 but otherwise it thinks its undefine
                      setValue("amount", currentValue + 1);
                    }}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      let currentValue = getValues("amount") ?? 0;
                      if (currentValue !== 1) {
                        setValue("amount", currentValue - 1);
                      }
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
                    {...register("tcg")}
                    className="form-select anta-regular text-dark fs-5"
                    aria-label="TCG Picker"
                  >
                    <option key={1}>Pokémon</option>
                    <option key={2}>Yu-Gi-Oh</option>
                    <option key={3}>Magic The Gathering</option>
                    <option key={4}>One Piece</option>
                  </select>
                </div>
                {/*TCG Picker end*/}
                {/*Upload Picture start
                <div className="input-group mb-3">
                  <input
                    type="file"
                    className="form-control anta-regular text-dark fs-5"
                  />
                </div>
                {/*Upload Picture end*/}
                {showCardSets && (
                  <div className="input-group mb-3">
                    <span className="input-group-text anta-regular text-dark fs-5">
                      Card Sets
                    </span>
                    <select
                      {...register("set")}
                      className="form-select anta-regular text-dark fs-5"
                      aria-label="Card Sets"
                    >
                      {cardSets.map((item, i) => (
                        <option className="anta-regular text-dark" key={i}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary">
                  Reset
                </button>
                {showAddButton && (
                  <button type="submit" className="btn btn-primary">
                    {isSubmitting ? "Loading..." : "Add Card"}
                  </button>
                )}
                {showCardSetsButton && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlerCardSets}
                  >
                    Show Card Sets
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCardModel;
