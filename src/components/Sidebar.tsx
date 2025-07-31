// Import all logos from centralized file
import {
  HomeIcon,
  PlusIcon,
  DotsIcon,
  MagicLogo,
  PokemonLogo,
  YuGiOhLogo,
  MenuIcon,
  // DigimonLogo,
  // DisneyLogo,
  // MarvelLogo,
  // OnePieceLogo,
  // StarWarsLogo,
} from "./logos";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DragEndEvent } from "@dnd-kit/core";

import { useState, useEffect } from "react";
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
  isReordering: boolean;
  onTabClick: (name: string) => void;
  onAddCollection: () => void;
  onAddCard: (collectionName: string) => void;
  triggerTabOptions: (
    collectionName: string | null,
    coords: { top: number; left: number }
  ) => void;
  onReorderCancel: () => void;
  onReorderConfirm: (newOrder: UserCollection[]) => void;
};

function Sidebar({
  collections,
  currentTab,
  isReordering,
  onTabClick,
  onAddCollection,
  onAddCard,
  triggerTabOptions,
  onReorderCancel,
  onReorderConfirm,
}: SidebarProps) {
  const [items, setItems] = useState<UserCollection[]>([]);

  useEffect(() => {
    if (isReordering) {
      const ordered = [...collections].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setItems(ordered);
    }
  }, [isReordering, collections]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((tab) => tab.name === active.id);
    const newIndex = items.findIndex((tab) => tab.name === over.id);
    const updated = [...items];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    setItems(updated);
  };

  const handleReorderConfirm = () => {
    const updated = items.map((tab, i) => ({ ...tab, order: i }));
    onReorderConfirm(updated);
  };

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
          <div style={{ position: "relative" }}>
            <button
              className="button-tab-icon flex-center"
              onClick={(e) => {
                e.stopPropagation();
                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();
                triggerTabOptions("Home", {
                  top: rect.top + window.scrollY - 20,
                  left: rect.right + window.scrollX,
                });
              }}
            >
              <DotsIcon className="icon-vertical-ellipsis" />
            </button>
          </div>
        </div>
      </button>

      {/* Collection Tabs (DND-enabled when reordering) */}
      {isReordering ? (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((tab) => tab.name)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((tab) => (
              <SortableTab
                key={tab.name}
                tab={tab}
                activeTab={currentTab}
                isReordering={true}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        collections.map((tab) => (
          <StaticTab
            key={tab.name}
            tab={tab}
            activeTab={currentTab}
            onTabClick={onTabClick}
            onAddCard={onAddCard}
            triggerTabOptions={triggerTabOptions}
          />
        ))
      )}

      {/* Done / Cancel controls */}
      {isReordering && (
        <div className="form-buttons" style={{ marginTop: "1.5rem" }}>
          <button className="button-confirm" onClick={handleReorderConfirm}>
            Done
          </button>
          <button className="button-cancel" onClick={onReorderCancel}>
            Cancel
          </button>
        </div>
      )}
    </aside>
  );
}

function StaticTab({
  tab,
  activeTab,
  onTabClick,
  onAddCard,
  triggerTabOptions,
}: {
  tab: UserCollection;
  activeTab: string;
  onTabClick: (name: string) => void;
  onAddCard: (name: string) => void;
  triggerTabOptions: (
    name: string | null,
    coords: { top: number; left: number }
  ) => void;
}) {
  const Logo = franchiseLogos[tab.franchiseKey];
  const logoClass = `logo-${tab.franchiseKey.replace("-", "")}`;

  return (
    <button
      type="button"
      className={`button-sidebar-tab ${activeTab === tab.name ? "active" : ""}`}
      onClick={() => onTabClick(tab.name)}
    >
      <div className="sidebar-left">
        <div className="flex-center">
          <Logo className={`logo-sidebar ${logoClass}`} />
        </div>
        <div className="cinzel-sidebar">{tab.name}</div>
      </div>
      <div className="sidebar-right">
        <button
          className="button-tab-icon flex-center"
          onClick={(e) => {
            e.stopPropagation();
            onAddCard(tab.name);
          }}
        >
          <PlusIcon className="icon-plus" />
        </button>
        <div style={{ position: "relative" }}>
          <button
            className="button-tab-icon flex-center"
            onClick={(e) => {
              e.stopPropagation();
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              triggerTabOptions(tab.name, {
                top: rect.top + window.scrollY - 20,
                left: rect.right + window.scrollX,
              });
            }}
          >
            <DotsIcon className="icon-vertical-ellipsis" />
          </button>
        </div>
      </div>
    </button>
  );
}

function SortableTab({
  tab,
  activeTab,
  isReordering,
}: {
  tab: UserCollection;
  activeTab: string;
  isReordering: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tab.name });

  const Logo = franchiseLogos[tab.franchiseKey];
  const logoClass = `logo-${tab.franchiseKey.replace("-", "")}`;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      type="button"
      ref={setNodeRef}
      className={`button-sidebar-tab ${activeTab === tab.name ? "active" : ""}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="sidebar-left">
        {isReordering && (
          <div className="flex-center">
            <MenuIcon className="icon-grab" />
          </div>
        )}
        <div className="flex-center">
          <Logo className={`logo-sidebar ${logoClass}`} />
        </div>
        <div className="cinzel-sidebar">{tab.name}</div>
      </div>
    </button>
  );
}

export default Sidebar;
