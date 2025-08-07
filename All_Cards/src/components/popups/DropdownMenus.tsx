import { useState, useEffect, useRef } from "react";
import "../../assets/css/popups/DropdownMenu.css"; //reuses other css from other components
import "../../assets/css/popups/MenuForm.css";
import { Link, useNavigate } from "react-router-dom";
import { SignOut } from "../../firebase/auth";

type DropdownMenuProps = {
  collectionName: string;
  handleDeleteCollection: (collectionName: string) => void;
};

type DropdownMenuHomeProps = {
  text: string;
  drag: boolean;
  switchState: () => void;
};

type HamburgerMenuProps = {
  onClose: () => void;
};

export function DropdownMenu({
  collectionName,
  handleDeleteCollection,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (!buttonRef.current) return;
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setTimeout(() => setOpen(false), 200); //don't close instantly and give it some time, to handle the onClick
    }
  }
  function handleMouseMove(e: MouseEvent) {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buffer = 250; // pixels away before it closes

    const isNear =
      e.clientX >= rect.left - buffer &&
      e.clientX <= rect.right + buffer &&
      e.clientY >= rect.top - buffer &&
      e.clientY <= rect.bottom + buffer;

    if (!isNear) {
      setOpen(false);
    }
  }

  //when you click outside of the window it will close
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  //if the mouse gets far away it closes and non selected tabs get closed
  useEffect(() => {
    if (open) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="sidebar-icon-button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span className="sidebar-dots">⋮</span>
      </button>

      {open && (
        <div
          className="menu"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <button
            className="menu-option nata-sans"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCollection(collectionName);
            }}
          >
            Delete {collectionName}
          </button>
        </div>
      )}
    </>
  );
}

export function DropdownMenuHome({
  text,
  drag,
  switchState,
}: DropdownMenuHomeProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (!buttonRef.current) return;
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setTimeout(() => setOpen(false), 200); //don't close instantly and give it some time, to handle the onClick
    }
  }
  function handleMouseMove(e: MouseEvent) {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buffer = 250; // pixels away before it closes

    const isNear =
      e.clientX >= rect.left - buffer &&
      e.clientX <= rect.right + buffer &&
      e.clientY >= rect.top - buffer &&
      e.clientY <= rect.bottom + buffer;

    if (!isNear) {
      setOpen(false);
    }
  }

  //when you click outside of the window it will close
  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  //if the mouse gets far away it closes and non selected tabs get closed
  useEffect(() => {
    if (open) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="sidebar-icon-button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span className="sidebar-dots">⋮</span>
      </button>

      {open && (
        <div
          className="menu"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <button
            className="menu-option nata-sans"
            onClick={(e) => {
              e.stopPropagation();
              switchState();
            }}
          >
            {text.split("($)")[drag ? 1 : 0]}
          </button>
        </div>
      )}
    </>
  );
}

export function MenuForm({ onClose }: HamburgerMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setTimeout(onClose, 200);
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!menuRef.current) return;

      const rect = menuRef.current.getBoundingClientRect();
      const BUFFER = 250; // px — distance user can move away before it closes

      const isWithinBuffer =
        e.clientX >= rect.left - BUFFER &&
        e.clientX <= rect.right + BUFFER &&
        e.clientY >= rect.top - BUFFER &&
        e.clientY <= rect.bottom + BUFFER;

      if (!isWithinBuffer) {
        onClose();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = async () => {
    await SignOut();
    onClose();
    navigate("/login"); // Route defined in your main.tsx
  };

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <Link
        to="/profile"
        className="hamburger-option"
        style={{ textDecoration: "none" }}
        onClick={onClose}
      >
        Profile
      </Link>
      <button className="hamburger-option" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
