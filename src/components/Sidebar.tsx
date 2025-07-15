import "../assets/css/Sidebar.css";

// Import all logos from centralized file
import {
  HomeIcon,
  DigimonLogo,
  DisneyLogo,
  MagicLogo,
  MarvelLogo,
  OnePieceLogo,
  PokemonLogo,
  StarWarsLogo,
  YuGiOhLogo,
} from "./logos";

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
            <HomeIcon className="logo-home" />
          </div>
          <div className="sidebar-name handjet-sidebar">Home</div>
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
        const franchiseClass = `logo-${f.logoKey.replace("-", "")}`;

        return (
          <div
            key={f.name}
            className={`sidebar-item ${currentTab === f.name ? "active" : ""}`}
            onClick={() => onTabClick(f.name)}
          >
            <div className="sidebar-left">
              <div className="sidebar-icon-wrapper">
                {LogoComponent ? (
                  <LogoComponent className={`sidebar-icon ${franchiseClass}`} />
                ) : (
                  <div className="sidebar-icon logo-missing">?</div>
                )}
              </div>
              <div className="sidebar-name handjet-sidebar">{f.name}</div>
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
