// src/components/popups/TabOptionsMenu.tsx

import { useEffect, useRef } from "react";

type TabOptionsMenuProps = {
  isHomeTab: boolean;
  collectionName?: string;
  closeMenu: () => void;
  handleDeleteCollection?: (collectionName: string) => void;
  handleReorderTabs?: () => void;
  position: {
    top: number;
    left: number;
  };
};

function TabOptionsMenu({
  isHomeTab,
  collectionName,
  closeMenu,
  handleDeleteCollection,
  handleReorderTabs,
  position,
}: TabOptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!menuRef.current) return;

      const rect = menuRef.current.getBoundingClientRect();
      const BUFFER = 500; // How far the user can move away before closing (in px)

      const isWithinBuffer =
        e.clientX >= rect.left - BUFFER &&
        e.clientX <= rect.right + BUFFER &&
        e.clientY >= rect.top - BUFFER &&
        e.clientY <= rect.bottom + BUFFER;

      if (!isWithinBuffer) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [closeMenu]);

  return (
    <div
      ref={menuRef}
      className="popup-options-menu"
      style={
        {
          "--top": `${position.top}px`,
          "--left": `${position.left}px`,
        } as React.CSSProperties
      }
    >
      {isHomeTab ? (
        <button
          className="button-menu-option anta-popups"
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
            handleReorderTabs?.();
          }}
        >
          Reorder Tabs
        </button>
      ) : (
        <button
          className="button-menu-option anta-popups"
          onClick={(e) => {
            e.stopPropagation();
            closeMenu();
            if (collectionName) {
              handleDeleteCollection?.(collectionName);
            }
          }}
        >
          Delete Collection
        </button>
      )}
    </div>
  );
}

export default TabOptionsMenu;
