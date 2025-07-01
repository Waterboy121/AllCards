// src/assets/components/popups/HomeOptionsMenu.tsx

import "../../css/popups/HomeOptionsMenu.css";

type HomeOptionsMenuProps = {
    onClose: () => void;
};

function HomeOptionsMenu({ onClose }: HomeOptionsMenuProps) {
    return (
        <div className="home-options-menu">
            <button className="menu-btn" onClick={onClose}>
                Reorder franchises
            </button>
            <button className="menu-btn" onClick={onClose}>
                Preferences
            </button>
            <button className="menu-btn" onClick={onClose}>
                Settings
            </button>
        </div>
    );
}

export default HomeOptionsMenu;
