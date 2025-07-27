// src/assets/components/Popup.tsx
import React, { useEffect } from "react";

type PopupProps = {
  onClose: () => void;
  children: React.ReactNode;
};

function Popup({ onClose, children }: PopupProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleClickBackground = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("popup-overlay")) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleClickBackground}>
      {children}
    </div>
  );
}

export default Popup;
