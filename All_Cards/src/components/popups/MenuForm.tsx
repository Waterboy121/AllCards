// src/assets/components/popups/MenuForm.tsx

import "../../assets/css/popups/MenuForm.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SignOut } from "../../firebase/auth";

interface HamburgerMenuProps {
  onClose: () => void;
}

function MenuForm({ onClose }: HamburgerMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLogout = async () => {
    await SignOut();
    onClose();
    navigate("/login"); // Route defined in your main.tsx
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button className="hamburger-option">Profile</button>
      <button className="hamburger-option" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default MenuForm;
