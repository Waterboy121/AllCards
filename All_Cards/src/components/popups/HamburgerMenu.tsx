// src/assets/components/popups/HamburgerMenu.tsx

import "../../assets/css/popups/HamburgerMenu.css";
import { useEffect, useRef } from "react";
import { SignOut } from "../../firebase/auth.ts";
import { useNavigate } from "react-router-dom";

interface HamburgerMenuProps {
  onClose: () => void;
}

function HamburgerMenu({ onClose }: HamburgerMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleLogOut = () => {
    SignOut();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button className="hamburger-option">Profile</button>
      <button className="hamburger-option" onClick={handleLogOut}>
        Log Out
      </button>
    </div>
  );
}

export default HamburgerMenu;
