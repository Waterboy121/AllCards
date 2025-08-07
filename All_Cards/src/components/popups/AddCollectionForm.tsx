// src/assets/components/popups/AddCollectionForm.tsx
import React, { useState } from "react";
import "../../assets/css/popups/AddCollectionForm.css";

// Import all logos from centralized file
import {
  YuGiOhLogo,
  PokemonLogo,
  MagicLogo,
  // DigimonLogo,
  // DisneyLogo,
  // MarvelLogo,
  // OnePieceLogo,
  // StarWarsLogo,
} from "../logos";

type AddCollectionFormProps = {
  onSubmit: (name: string, franchiseKey: string) => void;
  onCancel: () => void;
};

const franchiseOptions = [
  { label: "Pokémon", key: "pokemon", Logo: PokemonLogo },
  { label: "Yu-Gi-Oh!", key: "yu-gi-oh", Logo: YuGiOhLogo },
  { label: "Magic the Gathering", key: "magic", Logo: MagicLogo },
  // { label: "Digimon", key: "digimon", Logo: DigimonLogo },
  // { label: "Disney Lorcana", key: "disney-lorcana", Logo: DisneyLogo },
  // { label: "Marvel Champions", key: "marvel", Logo: MarvelLogo },
  // { label: "One Piece", key: "one-piece", Logo: OnePieceLogo },
  // { label: "Star Wars", key: "star-wars", Logo: StarWarsLogo },
];

function AddCollectionForm({ onSubmit, onCancel }: AddCollectionFormProps) {
  const [name, setName] = useState("");
  const [franchiseKey, setFranchiseKey] = useState(franchiseOptions[0].key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), franchiseKey);
    }
  };

  return (
    <form className="add-franchise-form" onSubmit={handleSubmit}>
      <h2>Create Franchise Tab</h2>

      <div className="form-row">
        <label htmlFor="custom-name">Custom Name:</label>
        <input
          id="custom-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Binder"
        />
      </div>

      <div className="franchise-select-label">Select Franchise:</div>
      <div className="franchise-grid">
        {franchiseOptions.map(({ key, label, Logo }) => (
          <button
            type="button"
            key={key}
            className={`franchise-tile ${
              franchiseKey === key ? "selected" : ""
            }`}
            onClick={() => setFranchiseKey(key)}
          >
            <Logo className="franchise-logo" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="form-buttons">
        <button type="submit" className="confirm-btn">
          Create
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddCollectionForm;
