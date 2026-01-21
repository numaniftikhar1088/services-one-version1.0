import React, { useState, useEffect, useCallback,useRef } from "react";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { toast } from "react-toastify";
import { FormControlLabel, styled, Switch, SwitchProps } from "@mui/material";
import useLang from "Shared/hooks/useLanguage";

interface Column {
  isShow: boolean;
  isShowOnUi: boolean;
  isExpandData: boolean;
  columnLabel: string;
}

interface DraggableColumnsProps {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  setDisabledSave: (disabled: boolean) => void;
  columnsHeader?: any[];
}

const DraggableColumns: React.FC<DraggableColumnsProps> = React.memo(
  ({ columns, setColumns, setDisabledSave, columnsHeader }) => {
    const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    
    const onInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedColumns = [...columns];
        updatedColumns[index].isShow = e.target.checked;
        setColumns(updatedColumns);
      },
      [columns, setColumns]
    );

    const handleDragStart = useCallback(
      (column: Column, e: React.DragEvent<HTMLDivElement>) => {
        setDraggedColumn(column);
        setIsDragging(true);
        
        // Set the entire row as the drag element
        const row = e.currentTarget;
        row.classList.add("dragging");

        // Create a custom drag image (clone of the row)
        const dragImage = row.cloneNode(true) as HTMLElement;
        dragImage.style.width = `${row.offsetWidth}px`; // Match the width of the row
        dragImage.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Add box shadow
        dragImage.style.backgroundColor = "#fff"; // Ensure background is white
        dragImage.style.borderRadius = "4px"; // Match the border radius
        dragImage.style.opacity = "1"; // Ensure full opacity
        dragImage.style.position = "absolute";
        dragImage.style.top = "-9999px"; // Move it off-screen
        document.body.appendChild(dragImage);

        // Set the drag image
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        
        // Clean up the drag image after the drag operation
        setTimeout(() => document.body.removeChild(dragImage), 0);
      },
      []
    );
    const { t } = useLang();

    const handleDragOver = useCallback(
      (event: React.DragEvent<HTMLDivElement>, targetColumn: Column) => {
        event.preventDefault();
        if (!draggedColumn || draggedColumn === targetColumn) return;
        
        const updatedColumns = [...columns];
        const draggedIndex = updatedColumns.findIndex(
          (col) => col === draggedColumn
        );
        const targetIndex = updatedColumns.findIndex(
          (col) => col === targetColumn
        );
        
        updatedColumns.splice(draggedIndex, 1);
        updatedColumns.splice(targetIndex, 0, draggedColumn);
        
        setColumns(updatedColumns);
      },
      [columns, draggedColumn, setColumns]
    );
    
    const handleDragEnd = useCallback(() => {
      setDraggedColumn(null);
      setIsDragging(false);
      
      // Remove the dragging class from all elements
      document
      .querySelectorAll(".dragging")
      .forEach((el) => el.classList.remove("dragging"));
    }, []);
    
    const anyColumnTrue = columnsHeader?.length
    ? columns.some((column) => column.isShow && !column.isExpandData)
    : columns.some((column) => column.isShowOnUi && column.isShow);

    useEffect(() => {
      if (!anyColumnTrue) {
        setDisabledSave(true);
        toast.error(t("Please select at least one column"));
      } else {
        setDisabledSave(false);
      }
    }, [anyColumnTrue, setDisabledSave,t]);

    const IOSSwitch = styled((props: SwitchProps) => (
      <Switch
        focusVisibleClassName=".Mui-focusVisible"
        size="small"
        disableRipple
        {...props}
      />
    ))(({ theme }) => ({
      width: 39,
      height: 22,
      padding: 0,
      "& .MuiSwitch-switchBase": {
        padding: 0,
        margin: 2,
        transition: theme.transitions.create(
          ["transform", "background-color"],
          {
            duration: 300,
            easing: theme.transitions.easing.easeInOut,
          }
        ),
        "&.Mui-checked": {
          transform: "translateX(16px)",
          color: "#fff",
          "& + .MuiSwitch-track": {
            backgroundColor: "#65C466",
            opacity: 1,
            border: 0,
            ...(theme.palette.mode === "dark" && {
              backgroundColor: "#2ECA45",
            }),
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.5,
          },
        },
        "&.Mui-focusVisible .MuiSwitch-thumb": {
          color: "#33cf4d",
          border: "6px solid #fff",
        },
        "&.Mui-disabled .MuiSwitch-thumb": {
          color: theme.palette.grey[100],
          ...(theme.palette.mode === "dark" && {
            color: theme.palette.grey[600],
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.7,
          ...(theme.palette.mode === "dark" && {
            opacity: 0.3,
          }),
        },
      },
      "& .MuiSwitch-thumb": {
        boxSizing: "border-box",
        width: 18,
        height: 18,
      },
      "& .MuiSwitch-track": {
        borderRadius: 26 / 2,
        backgroundColor: "#E9E9EA",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
          duration: 500,
        }),
        ...(theme.palette.mode === "dark" && {
          backgroundColor: "#69A54B",
        }),
      },
    }));


// mobile touch handlers function 

const [touchStartY, setTouchStartY] = useState<number>(0);
const draggedIndexRef = useRef<number>(-1);


const handleTouchStart = useCallback(
  (column: Column, index: number, e: React.TouchEvent<HTMLDivElement>) => {
    // Prevents drag if user touches the switch
    const target = e.target as HTMLElement;
    if (target.closest('.MuiSwitch-root') || target.closest('.MuiFormControlLabel-root')) {
      return;
    }

    setDraggedColumn(column);
    setIsDragging(true);
    draggedIndexRef.current = index;
    setTouchStartY(e.touches[0].clientY);
    
    const row = e.currentTarget;
    row.classList.add("dragging");
  },
  []
);




const handleTouchMove = useCallback(
  (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggedColumn || draggedIndexRef.current === -1) return;
    
    const touchY = e.touches[0].clientY;
    // Finds which element is under the finger
    const elements = document.elementsFromPoint(
      e.touches[0].clientX,
      touchY
    );
    
    const targetElement = elements.find((el) =>
      el.classList.contains("draggable-item")
    ) as HTMLElement;
    
    if (!targetElement) return;
    
    // Calculates target index
    const allItems = Array.from(
      document.querySelectorAll(".draggable-item")
    );
    const targetIndex = allItems.indexOf(targetElement);
    
    if (targetIndex === -1 || targetIndex === draggedIndexRef.current) return;
    
    // Reorders the columns
    const updatedColumns = [...columns];
    const [removed] = updatedColumns.splice(draggedIndexRef.current, 1);
    updatedColumns.splice(targetIndex, 0, removed);
    
    draggedIndexRef.current = targetIndex;
    setColumns(updatedColumns);
  },
  [columns, draggedColumn, setColumns]
);




const handleTouchEnd = useCallback(() => {
  setDraggedColumn(null);
  setIsDragging(false);
  draggedIndexRef.current = -1;
  
  document
    .querySelectorAll(".dragging")
    .forEach((el) => el.classList.remove("dragging"));
}, []);



    return (
      <div>
        {columns.map(
          (option, index) =>
            option.isShowOnUi &&
            !option.isExpandData && (
              <div
                key={index}
                className={`mb-1 d-flex justify-content-between align-items-center draggable-item ${
                  isDragging && draggedColumn === option ? "dragging" : ""
                }`}
                draggable
                onDragStart={(e) => handleDragStart(option, e)}
                onDragOver={(e) => handleDragOver(e, option)}
                onDragEnd={handleDragEnd}

             //for mobile drag and drop
              onTouchStart={(e) => handleTouchStart(option, index, e)}
              onTouchMove={handleTouchMove}
               onTouchEnd={handleTouchEnd}


              >
                <div className="d-flex align-items-center">
                  <RxDragHandleHorizontal size={20} />
                  <span className="draggable-label ms-2">
                    {t(option.columnLabel)}
                  </span>
                </div>
                <FormControlLabel
                  style={{ width: "25px" }}
                  name="isShow"
                  // type="checkbox"
                  control={
                    <IOSSwitch
                      onChange={(e) => onInputChange(e, index)}
                      checked={option.isShow}
                    />
                  }
                  label=""
                />
              </div>
            )
        )}
      </div>
    );
  }
);

export default DraggableColumns;