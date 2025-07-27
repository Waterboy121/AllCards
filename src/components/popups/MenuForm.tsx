// src/assets/components/popups/MenuForm.tsx

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
    navigate("/login");
  };

  return (
    <div className="popup-menu" ref={menuRef}>
      <button className="button-menu-option anta-popups">Profile</button>
      <button className="button-menu-option anta-popups" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default MenuForm;
