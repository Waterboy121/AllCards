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

import type { UserCollection } from "../assets/types/collection";
import DropdownMenu from "./popups/DropdownMenu";

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

type SidebarProps = {
  collections: UserCollection[];
  currentTab: string;
  onTabClick: (name: string) => void;
  onAddCollection: () => void;
  onAddCard: (collectionName: string) => void;
  onDeleteCollection: (collectionName: string) => void;
};

function Sidebar({
  collections,
  currentTab,
  onTabClick,
  onAddCollection,
  onAddCard,
  onDeleteCollection,
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
              onAddCollection();
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
      {collections?.map((col) => {
  const LogoComponent = franchiseLogos[col.franchiseKey];
  const logoClass = `logo-${col.franchiseKey.replace("-", "")}`;

  return (
    <div
      key={col.name}
      className={`sidebar-item ${currentTab === col.name ? "active" : ""}`}
      onClick={() => onTabClick(col.name)}
    >
            <div className="sidebar-left">
              <div className="sidebar-icon-wrapper">
                {LogoComponent ? (
                  <LogoComponent className={`sidebar-icon ${logoClass}`} />
                ) : (
                  <div className="sidebar-icon logo-missing">?</div>
                )}
              </div>
              <div className="sidebar-name handjet-sidebar">{col.name}</div>
            </div>

            <div className="sidebar-right">
              <button
                className="sidebar-icon-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddCard(col.name);
                }}
              >
                +
              </button>
              {/* <button
                className="sidebar-icon-button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="sidebar-dots">⋮</span>
              </button> */}
              <DropdownMenu
                collectionName={col.name}
                handleDeleteCollection={onDeleteCollection}
              />
            </div>
          </div>
        );
      })}
    </aside>
  );
}

export default Sidebar;
