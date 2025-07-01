// src/assets/components/Sidebar.tsx

import "../css/Sidebar.css";
import HomeIcon from "../images/icons/home.svg?react";

// Import franchise icons as React components
import DigimonLogo from "../images/icons/digimon.svg?react";
import DisneyLogo from "../images/icons/disney-lorcana.svg?react";
import MagicLogo from "../images/icons/magic.svg?react";
import MarvelLogo from "../images/icons/marvel.svg?react";
import OnePieceLogo from "../images/icons/one-piece.svg?react";
import PokemonLogo from "../images/icons/pokemon.svg?react";
import StarWarsLogo from "../images/icons/star-wars.svg?react";
import YuGiOhLogo from "../images/icons/yu-gi-oh.svg?react";

// Franchise key-to-logo map
const franchiseLogos: Record<
    string,
    React.FC<React.SVGProps<SVGSVGElement>>
> = {
    digimon: DigimonLogo,
    "disney-lorcana": DisneyLogo,
    magic: MagicLogo,
    marvel: MarvelLogo,
    "one-piece": OnePieceLogo,
    pokemon: PokemonLogo,
    "star-wars": StarWarsLogo,
    "yu-gi-oh": YuGiOhLogo,
};

type Franchise = {
    name: string; // User-defined tab name
    logoKey: string; // Matches one of the keys above
};

type SidebarProps = {
    franchises: Franchise[];
    currentTab: string;
    onTabClick: (tabName: string) => void;
    onAddFranchise: () => void;
    onAddCard: (franchiseName: string) => void;
};

function Sidebar({
    franchises,
    currentTab,
    onTabClick,
    onAddFranchise,
    onAddCard,
}: SidebarProps) {
    return (
        <aside className="sidebar">
            {/* Home tab */}
            <div
                className={`sidebar-item sidebar-home ${
                    currentTab === "Home" ? "active" : ""
                }`}
                onClick={() => onTabClick("Home")}
            >
                <div className="sidebar-left">
                    <div className="sidebar-icon-wrapper">
                        <HomeIcon className="sidebar-icon" />
                    </div>
                    <div className="sidebar-name">Home</div>
                </div>

                <div className="sidebar-right">
                    <button
                        className="sidebar-icon-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddFranchise();
                        }}
                    >
                        +
                    </button>
                    <button
                        className="sidebar-icon-button"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="sidebar-dots">⋮</span>
                    </button>
                </div>
            </div>

            {/* Franchise tabs */}
            {franchises.map((f) => {
                const LogoComponent = franchiseLogos[f.logoKey];

                return (
                    <div
                        key={f.name}
                        className={`sidebar-item ${
                            currentTab === f.name ? "active" : ""
                        }`}
                        onClick={() => onTabClick(f.name)}
                    >
                        <div className="sidebar-left">
                            <div className="sidebar-icon-wrapper">
                                {LogoComponent ? (
                                    <LogoComponent className="sidebar-icon" />
                                ) : (
                                    <div className="sidebar-icon sidebar-icon-missing">
                                        ?
                                    </div>
                                )}
                            </div>
                            <div className="sidebar-name">{f.name}</div>
                        </div>

                        <div className="sidebar-right">
                            <button
                                className="sidebar-icon-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddCard(f.name);
                                }}
                            >
                                +
                            </button>
                            <button
                                className="sidebar-icon-button"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="sidebar-dots">⋮</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </aside>
    );
}

export default Sidebar;
