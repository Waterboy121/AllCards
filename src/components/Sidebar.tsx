// Import all logos from centralized file
import {
  HomeIcon,
  PlusIcon,
  DotsIcon,
  MagicLogo,
  PokemonLogo,
  YuGiOhLogo,
  // DigimonLogo,
  // DisneyLogo,
  // MarvelLogo,
  // OnePieceLogo,
  // StarWarsLogo,
} from "./logos";

import type { UserCollection } from "../assets/types/collection";

// Franchise key-to-logo map
const franchiseLogos: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  magic: MagicLogo,
  pokemon: PokemonLogo,
  "yu-gi-oh": YuGiOhLogo,
  // digimon: DigimonLogo,
  // "disney-lorcana": DisneyLogo,
  // marvel: MarvelLogo,
  // "one-piece": OnePieceLogo,
  // "star-wars": StarWarsLogo,
};

type SidebarProps = {
  collections: UserCollection[];
  currentTab: string;
  onTabClick: (name: string) => void;
  onAddCollection: () => void;
  onAddCard: (collectionName: string) => void;
};

function Sidebar({
  collections,
  currentTab,
  onTabClick,
  onAddCollection,
  onAddCard,
}: SidebarProps) {
  return (
    <aside className="container-sidebar">
      {/* Home tab */}
      <button
        type="button"
        className={`button-sidebar-tab sidebar-home ${
          currentTab === "Home" ? "active" : ""
        }`}
        onClick={() => onTabClick("Home")}
      >
        <div className="sidebar-left">
          <div className="flex-center">
            <HomeIcon className="logo-home" />
          </div>
          <div className="cinzel-sidebar">Home</div>
        </div>

        {/* Tab Action Buttons */}
        <div className="sidebar-right">
          <button
            className="button-tab-icon flex-center"
            onClick={(e) => {
              e.stopPropagation();
              onAddCollection();
            }}
          >
            <PlusIcon className="icon-plus" />
          </button>
          <button
            className="button-tab-icon flex-center"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsIcon className="icon-vertical-ellipsis" />
          </button>
        </div>
      </button>

      {/* Franchise tabs */}
      {collections.map((col) => {
        const LogoComponent = franchiseLogos[col.franchiseKey];
        const logoClass = `logo-${col.franchiseKey.replace("-", "")}`;

        return (
          <button
            key={col.name}
            type="button"
            className={`button-sidebar-tab ${
              currentTab === col.name ? "active" : ""
            }`}
            onClick={() => onTabClick(col.name)}
          >
            <div className="sidebar-left">
              <div className="flex-center">
                <LogoComponent className={`logo-sidebar ${logoClass}`} />
              </div>
              <div className="cinzel-sidebar">{col.name}</div>
            </div>

            {/* Tab Action Buttons */}
            <div className="sidebar-right">
              <button
                className="button-tab-icon flex-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddCard(col.name);
                }}
              >
                <PlusIcon className="icon-plus" />
              </button>
              <button
                className="button-tab-icon flex-center"
                onClick={(e) => e.stopPropagation()}
              >
                <DotsIcon className="icon-vertical-ellipsis" />
              </button>
            </div>
          </button>
        );
      })}
    </aside>
  );
}

export default Sidebar;
