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
    const handleMouseMove = (e: MouseEvent) => {
      if (!menuRef.current) return;

      const rect = menuRef.current.getBoundingClientRect();
      const BUFFER = 500; // px — distance user can move away before it closes

      const isWithinBuffer =
        e.clientX >= rect.left - BUFFER &&
        e.clientX <= rect.right + BUFFER &&
        e.clientY >= rect.top - BUFFER &&
        e.clientY <= rect.bottom + BUFFER;

      if (!isWithinBuffer) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousemove", handleMouseMove);
    };
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
