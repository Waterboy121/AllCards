import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import AddCardModel from "./AddCardModel";

function AddCard() {
  const [showWindow, setWindowState] = useState(false);

  return (
    <>
      <button
        className="btn btn-outline-secondary rounded-circle"
        type="button"
        onClick={() => {
          setWindowState(!showWindow);
        }}
      >
        <i className="bi bi-plus"></i>
      </button>
      {showWindow && (
        <AddCardModel
          show={showWindow}
          onClick={() => {
            setWindowState(!showWindow);
          }}
        />
      )}
    </>
  );
}

export default AddCard;
