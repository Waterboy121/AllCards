import "../css/Sidebar.css";
import homeIcon from "../images/icons/home.svg";

// Import franchise logos
import digimon from "../images/tcg-logos/digimon-logo.png";
import disney from "../images/tcg-logos/disney-lorcana-logo.png";
import magic from "../images/tcg-logos/magic-logo.png";
import marvel from "../images/tcg-logos/marvel-logo.png";
import onepiece from "../images/tcg-logos/one-piece-logo.png";
import pokemon from "../images/tcg-logos/pokemon-logo.png";
import starwars from "../images/tcg-logos/star-wars-logo.png";
import yugioh from "../images/tcg-logos/yu-gi-oh-logo.png";

// Franchise key-to-logo map
const franchiseLogos: Record<string, string> = {
    digimon,
    "disney-lorcana": disney,
    magic,
    marvel,
    "one-piece": onepiece,
    pokemon,
    "star-wars": starwars,
    "yu-gi-oh": yugioh,
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
                        <img
                            src={homeIcon}
                            alt="Home"
                            className="sidebar-icon"
                        />
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
            {franchises.map((f) => (
                <div
                    key={f.name}
                    className={`sidebar-item ${
                        currentTab === f.name ? "active" : ""
                    }`}
                    onClick={() => onTabClick(f.name)}
                >
                    <div className="sidebar-left">
                        <div className="sidebar-icon-wrapper">
                            <img
                                src={franchiseLogos[f.logoKey]}
                                alt={f.name}
                                className="sidebar-icon"
                            />
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
            ))}
        </aside>
    );
}

export default Sidebar;
