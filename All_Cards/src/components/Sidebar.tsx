import "../assets/css/Sidebar.css";

// Import all logos from centralized file
import {
  HomeIcon,
  MagicLogo,
  PokemonLogo,
  YuGiOhLogo,
  DigimonLogo,
  DisneyLogo,
  MarvelLogo,
  OnePieceLogo,
  StarWarsLogo,
} from "./logos";

import type { UserCollection } from "../assets/types/collection";
import { useEffect, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DropdownMenu, DropdownMenuHome } from "./popups/DropdownMenus";
import { reorderCollections } from "../firebase/database";

// Franchise key-to-logo map
const franchiseLogos: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  "yu-gi-oh": YuGiOhLogo,
  magic: MagicLogo,
  pokemon: PokemonLogo,
  digimon: DigimonLogo,
  "disney-lorcana": DisneyLogo,
  marvel: MarvelLogo,
  "one-piece": OnePieceLogo,
  "star-wars": StarWarsLogo,
};

type SidebarProps = {
  collections: UserCollection[];
  collectionsCopy: UserCollection[];
  currentTab: string;
  onTabClick: (name: string) => void;
  onAddCollection: () => void;
  onAddCard: (collectionName: string) => void;
  onDeleteCollection: (collectionName: string) => void;
  handleChangeUserCollection: (collectionTabs: UserCollection[]) => void;
  handleChangeCollectionCopy: (collectionTabs: UserCollection[]) => void;
};

type SidebarItemProps = {
  col: UserCollection;
  currentTab: string;
  onTabClick: (name: string) => void;
  onAddCard: (collectionName: string) => void;
  onDeleteCollection: (collectionName: string) => void;
  isDragEnabled: boolean;
};

function Sidebar({
  collections,
  collectionsCopy,
  currentTab,
  onTabClick,
  onAddCollection,
  onAddCard,
  handleChangeUserCollection,
  handleChangeCollectionCopy,
  onDeleteCollection,
}: SidebarProps) {
  const [isDraggable, setIsDraggable] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    console.log(active.id + "      " + over.id);
    const oldIndex = collections.findIndex((item) => item.name === active.id);
    const newIndex = collections.findIndex((item) => item.name === over.id);
    const newItems = arrayMove(collections, oldIndex, newIndex);
    newItems.forEach((col, index) => (col.order = index));
    //console.log(newItems);
    handleChangeUserCollection(newItems);
  };

  useEffect(() => {
    if (!isDraggable) {
      //when you toggle draggable off, check to see if any changes were made and if so, update the changes
      if (collections !== collectionsCopy) {
        //console.log(collections);
        //console.log(collectionsCopy);
        reorderCollections(collections);
        handleChangeCollectionCopy(collections); //update the new collection into the copy
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (collections !== collectionsCopy) {
        reorderCollections(collections);
        handleChangeCollectionCopy(collections); //update the new collection into the copy
      }
    }, 10000); //10 seconds

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDraggable, collections]);

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
          <div className="sidebar-name handjet-sidebar d-none d-md-inline">
            Home
          </div>
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
          <DropdownMenuHome
            text={"Toggle Drag($)UnToggle Drag"}
            drag={isDraggable}
            switchState={() => {
              setIsDraggable((prev) => !prev);
            }}
          />
        </div>
      </div>

      {isDraggable ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={collections.map((c) => c.name)}
            strategy={verticalListSortingStrategy}
          >
            {/* Franchise tabs */}
            {collections.map((col) => (
              <SidebarItem
                key={col.name}
                col={col}
                currentTab={currentTab}
                onTabClick={onTabClick}
                onAddCard={onAddCard}
                onDeleteCollection={onDeleteCollection}
                isDragEnabled={isDraggable}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        collections.map((col) => (
          <SidebarItem
            key={col.name}
            col={col}
            currentTab={currentTab}
            onTabClick={onTabClick}
            onAddCard={onAddCard}
            onDeleteCollection={onDeleteCollection}
            isDragEnabled={isDraggable}
          />
        ))
      )}
    </aside>
  );
}

function SidebarItem({
  col,
  currentTab,
  onTabClick,
  onAddCard,
  onDeleteCollection,
  isDragEnabled,
}: SidebarItemProps) {
  const LogoComponent = franchiseLogos[col.franchiseKey];
  const logoClass = `logo-${col.franchiseKey.replace("-", "")}`;
  const { attributes, listeners, setNodeRef, transform, transition } =
    isDragEnabled ? useSortable({ id: col.name }) : {};

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };
  return (
    <div
      ref={isDragEnabled ? setNodeRef : undefined}
      style={style}
      {...attributes}
      {...listeners}
      className={`sidebar-item ${currentTab === col.name ? "active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onTabClick(col.name);
      }}
    >
      <div className="sidebar-left">
        <div className="sidebar-icon-wrapper">
          {LogoComponent ? (
            <LogoComponent className={`sidebar-icon logo-home ${logoClass} `} />
          ) : (
            <div className="sidebar-icon logo-missing">?</div>
          )}
        </div>
        <div className="sidebar-name handjet-sidebar d-none d-md-inline">
          {col.name}
        </div>
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
        <DropdownMenu
          collectionName={col.name}
          handleDeleteCollection={onDeleteCollection}
        />
      </div>
    </div>
  );
}

export default Sidebar;
