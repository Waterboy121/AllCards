// src/assets/components/popups/AddFranchiseForm.tsx
import React, { useState } from "react";
import "../../assets/css/popups/AddFranchiseForm.css";

// Logo imports (same as Sidebar)
import pokemon from "../../assets/images/tcg-logos/pokemon-logo.png";
import yugioh from "../../assets/images/tcg-logos/yu-gi-oh-logo.png";
import magic from "../../assets/images/tcg-logos/magic-logo.png";
import digimon from "../../assets/images/tcg-logos/digimon-logo.png";
import disney from "../../assets/images/tcg-logos/disney-lorcana-logo.png";
import marvel from "../../assets/images/tcg-logos/marvel-logo.png";
import onepiece from "../../assets/images/tcg-logos/one-piece-logo.png";
import starwars from "../../assets/images/tcg-logos/star-wars-logo.png";

type AddFranchiseFormProps = {
  onSubmit: (name: string, franchiseKey: string) => void;
  onCancel: () => void;
};

const franchiseOptions = [
  { label: "Pokemon", key: "pokemon", logo: pokemon },
  { label: "Yu-Gi-Oh", key: "yu-gi-oh", logo: yugioh },
  { label: "Magic the Gathering", key: "magic", logo: magic },
  { label: "Digimon", key: "digimon", logo: digimon },
  { label: "Disney Lorcana", key: "disney-lorcana", logo: disney },
  { label: "Marvel Champions", key: "marvel", logo: marvel },
  { label: "One Piece", key: "one-piece", logo: onepiece },
  { label: "Star Wars", key: "star-wars", logo: starwars },
];

function AddFranchiseForm({ onSubmit, onCancel }: AddFranchiseFormProps) {
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
        {franchiseOptions.map((f) => (
          <button
            type="button"
            key={f.key}
            className={`franchise-tile ${
              franchiseKey === f.key ? "selected" : ""
            }`}
            onClick={() => setFranchiseKey(f.key)}
          >
            <img src={f.logo} alt={f.label} />
            <span>{f.label}</span>
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

export default AddFranchiseForm;
