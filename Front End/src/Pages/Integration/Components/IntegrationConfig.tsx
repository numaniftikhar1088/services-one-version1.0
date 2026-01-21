import { MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

// Type definitions
export interface Item {
  id: string;
  name: string;
  level: number;
  parent: string | null;
  order: number;
  length: number;
  messageHeadersInfoId?: number;
}

type DropPosition = "before" | "after" | "child" | null;

const IntegrationConfig: React.FC<{
  handleSelectItem: (item: Item | null) => void;
  selectedItem: Item | null;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onItemLengthChange?: (
    itemId: string,
    oldLength: number,
    newLength: number
  ) => void;
}> = ({
  handleSelectItem,
  selectedItem,
  items,
  setItems,
  onItemLengthChange,
}) => {
  const { t } = useLang();
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [dragOverItem, setDragOverItem] = useState<Item | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);

  // Edit functionality state
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editLength, setEditLength] = useState<string>("");

  const [anchorEl, setAnchorEl] = React.useState<{ [key: string]: any }>({});

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  // Edit functions
  const handleEditClick = (item: Item) => {
    setEditingItem(item.id);
    setEditLength(item.length.toString());
    handleClose(`dropdown_${item.id}`);
  };

  const handleSaveEdit = (itemId: string) => {
    const lengthNum = parseInt(editLength);

    // Validate length: must be between 1 and 40
    if (isNaN(lengthNum) || lengthNum < 1 || lengthNum > 40) {
      toast.error(t("Length must be a number between 1 and 40"));
      return;
    }

    // Get the old length before updating
    const oldItem = items.find((item) => item.id === itemId);
    const oldLength = oldItem?.length ?? 0;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, length: lengthNum } : item
      )
    );

    // Update selectedItem if it was the one being edited
    if (selectedItem?.id === itemId) {
      handleSelectItem({
        ...selectedItem,
        length: lengthNum,
      });
    }

    // Notify parent about length change
    if (onItemLengthChange && lengthNum !== oldLength) {
      onItemLengthChange(itemId, oldLength, lengthNum);
    }

    setEditingItem(null);
    setEditLength("");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditLength("");
  };

  const handleDeleteClick = (item: Item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (confirmDelete) {
      // Remove the item and all its children
      const itemsToRemove = new Set<string>();

      // Function to collect all descendants
      const collectDescendants = (parentId: string) => {
        itemsToRemove.add(parentId);
        items.forEach((item) => {
          if (item.parent === parentId) {
            collectDescendants(item.id);
          }
        });
      };

      collectDescendants(item.id);

      // Filter out all items to be removed
      const filteredItems = items.filter((item) => !itemsToRemove.has(item.id));
      setItems(filteredItems);

      // If selected item was deleted, select first remaining item
      if (selectedItem && itemsToRemove.has(selectedItem.id)) {
        if (filteredItems.length > 0) {
          handleSelectItem(filteredItems[0]);
        } else {
          handleSelectItem(null);
        }
      }
    }
    handleClose(`dropdown_${item.id}`);
  };

  // Ensure a default selection: first item
  useEffect(() => {
    if (!selectedItem && items.length > 0) {
      handleSelectItem(items[0]);
    }
  }, [selectedItem, items, handleSelectItem]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: Item
  ): void => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const isDescendant = (parentId: string, childId: string): boolean => {
    const findChildren = (id: string): Item[] => {
      const children = items.filter((item) => item.parent === id);
      return children.concat(
        children.flatMap((child) => findChildren(child.id))
      );
    };

    const descendants = findChildren(parentId);
    return descendants.some((desc) => desc.id === childId);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: Item
  ): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (!draggedItem || draggedItem.id === targetItem.id) return;

    if (isDescendant(targetItem.id, draggedItem.id)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (y < height * 0.25) {
      setDropPosition("before");
    } else if (y > height * 0.75) {
      setDropPosition("after");
    } else {
      setDropPosition("child");
    }

    setDragOverItem(targetItem);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverItem(null);
      setDropPosition(null);
    }
  };

  const updateDescendantLevels = (
    itemsList: Item[],
    parentItem: Item
  ): void => {
    const updateChildren = (
      currentParentId: string,
      currentLevel: number
    ): void => {
      itemsList.forEach((item) => {
        if (item.parent === currentParentId) {
          item.level = currentLevel;
          updateChildren(item.id, currentLevel + 1);
        }
      });
    };

    updateChildren(parentItem.id, parentItem.level + 1);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: Item
  ): void => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      setDropPosition(null);
      return;
    }

    if (isDescendant(targetItem.id, draggedItem.id)) {
      setDraggedItem(null);
      setDragOverItem(null);
      setDropPosition(null);
      return;
    }

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(
      (item) => item.id === draggedItem.id
    );
    const targetIndex = newItems.findIndex((item) => item.id === targetItem.id);

    const [draggedItemCopy] = newItems.splice(draggedIndex, 1);
    const newTargetIndex =
      draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;

    if (dropPosition === "child") {
      draggedItemCopy.parent = targetItem.id;
      draggedItemCopy.level = targetItem.level + 1;

      const targetChildren = newItems.filter(
        (item) => item.parent === targetItem.id
      );
      if (targetChildren.length === 0) {
        newItems.splice(newTargetIndex + 1, 0, draggedItemCopy);
      } else {
        const lastChildIndex = newItems.findIndex(
          (item) => item.id === targetChildren[targetChildren.length - 1].id
        );
        newItems.splice(lastChildIndex + 1, 0, draggedItemCopy);
      }
    } else {
      draggedItemCopy.parent = targetItem.parent;
      draggedItemCopy.level = targetItem.level;

      if (dropPosition === "before") {
        newItems.splice(newTargetIndex, 0, draggedItemCopy);
      } else {
        newItems.splice(newTargetIndex + 1, 0, draggedItemCopy);
      }
    }

    updateDescendantLevels(newItems, draggedItemCopy);

    setItems(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
    setDropPosition(null);
  };

  const handleRootDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();

    if (!draggedItem) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex(
      (item) => item.id === draggedItem.id
    );
    const [draggedItemCopy] = newItems.splice(draggedIndex, 1);

    draggedItemCopy.parent = null;
    draggedItemCopy.level = 0;

    newItems.push(draggedItemCopy);

    updateDescendantLevels(newItems, draggedItemCopy);

    setItems(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
    setDropPosition(null);
  };

  const handleRootDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (draggedItem) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const getItemsByLevel = (
    parentId: string | null = null,
    level: number = 0
  ): Item[] => {
    return items.filter((item) => {
      if (level === 0) return item.level === 0 && item.parent === null;
      return item.parent === parentId && item.level === level;
    });
  };

  const renderItem = (item: Item): JSX.Element => {
    const children = getItemsByLevel(item.id, item.level + 1);
    const isOver = dragOverItem?.id === item.id;
    const isEditing = editingItem === item.id;

    const getDropIndicatorClasses = (): string => {
      if (!isOver) return "";

      switch (dropPosition) {
        case "before":
          return "border-t-4 border-t-blue-500";
        case "after":
          return "border-b-4 border-b-blue-500";
        case "child":
          return "border-2 border-blue-500 bg-blue-50";
        default:
          return "";
      }
    };

    // Use unique dropdown key for each item
    const dropdownKey = `dropdown_${item.id}`;
    if (isEditing) {
      return (
        <div key={item.id} style={{ marginTop: item.level > 0 ? "4px" : "0" }}>
          <div
            className="d-flex align-items-center px-2 py-2 bg-gray-50"
            style={{
              marginLeft: item.level * 24,
              border: "1px solid #D1D3E0",
              borderRadius: "5px",
              backgroundColor: "#FFF3CD",
            }}
          >
            <i className="fas fa-grip-vertical w-4 h-4 text-gray-400 mr-3 flex-shrink-0"></i>

            {/* Display Name (read-only) */}
            <span
              style={{
                width: "120px",
                marginRight: "8px",
                padding: "4px 8px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              {item.name}
            </span>

            {/* Edit Length Input */}
            <input
              type="number"
              value={editLength}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty string for typing, or numbers in valid range
                if (
                  value === "" ||
                  (!isNaN(Number(value)) &&
                    Number(value) >= 1 &&
                    Number(value) <= 40)
                ) {
                  setEditLength(value);
                }
              }}
              style={{
                width: "60px",
                marginRight: "8px",
                padding: "4px 8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              placeholder="1-40"
              min="1"
              max="40"
              autoFocus
            />

            {/* Save/Cancel Buttons */}
            <div className="d-flex gap-1">
              <button
                onClick={() => handleSaveEdit(item.id)}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                title="Save"
              >
                <i className="fas fa-check"></i>
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
                title="Cancel"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {children.map((child) => renderItem(child))}
        </div>
      );
    }

    return (
      <div key={item.id} style={{ marginTop: item.level > 0 ? "4px" : "0" }}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => {
            e.stopPropagation();
            handleDragOver(e, item);
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            handleDragLeave(e);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            handleDrop(e, item);
          }}
          onClick={() => handleSelectItem(item)}
          className={`
            d-flex justify-content-between align-items-baseline px-2 py-2 bg-gray-50 cursor-move
            ${getDropIndicatorClasses()}
            ${draggedItem?.id === item.id ? "opacity-50" : ""}
            hover:bg-gray-100 transition-all duration-200
          `}
          style={{
            marginLeft: item.level * 24,
            border: "1px solid #D1D3E0",
            borderRadius: "5px",
            backgroundColor: selectedItem?.id === item.id ? "#E8EFF7" : "white",
          }}
        >
          <div>
            <i className="fas fa-grip-vertical w-4 h-4 text-gray-400 mr-3 flex-shrink-0"></i>
            <span className="text-sm font-medium text-gray-900 flex-1">
              {item.name}
            </span>
          </div>
          {item.level > 0 && (
            <span className="text-xs text-gray-400 mr-2 flex-shrink-0">
              L{item.level}
            </span>
          )}

          <StyledDropButtonThreeDots
            id="demo-positioned-button"
            aria-haspopup="true"
            className="btn btn-sm btn-icon moreactions min-w-auto rounded-4 p-1 bg-transparent"
            onClick={(event) => handleClick(event, dropdownKey)}
          >
            <i className="fas fa-ellipsis-v" style={{ color: "black" }}></i>
          </StyledDropButtonThreeDots>
          <StyledDropMenuMoreAction
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl[dropdownKey]}
            open={Boolean(anchorEl[dropdownKey])}
            onClose={() => handleClose(dropdownKey)}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem className="w-auto" onClick={() => handleEditClick(item)}>
              <i
                className="fa-solid fa-pen-to-square mr-2"
                style={{ color: "#69a54b" }}
              ></i>
              {t("Edit")}
            </MenuItem>
            <MenuItem
              className="w-auto"
              onClick={() => handleDeleteClick(item)}
            >
              <i
                className="fa-solid fa-xmark mr-2"
                style={{ color: "#ee2d41", fontSize: "16px" }}
              ></i>
              {t("Delete")}
            </MenuItem>
          </StyledDropMenuMoreAction>
        </div>

        {children.map((child) => renderItem(child))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div
        className="d-flex flex-column"
        style={{ gap: "8px" }}
        onDragOver={handleRootDragOver}
        onDrop={handleRootDrop}
      >
        {getItemsByLevel().map((item) => renderItem(item))}

        {draggedItem && (
          <div className="p-4 text-center text-sm text-gray-500 border-2 border-dashed border-blue-300 rounded-md bg-blue-50 mt-4">
            💡 Drop here to move to root level
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationConfig;
