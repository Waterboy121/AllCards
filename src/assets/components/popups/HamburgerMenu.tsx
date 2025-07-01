// src/assets/components/popups/HamburgerMenu.tsx

import "../../css/popups/HamburgerMenu.css";
import { useEffect, useRef } from "react";

interface HamburgerMenuProps {
    onClose: () => void;
}

function HamburgerMenu({ onClose }: HamburgerMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="hamburger-menu" ref={menuRef}>
            <button className="hamburger-option">Profile</button>
            <button className="hamburger-option">Log Out</button>
        </div>
    );
}

export default HamburgerMenu;
