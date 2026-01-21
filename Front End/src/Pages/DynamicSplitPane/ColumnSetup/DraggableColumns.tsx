import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLang from './../../../Shared/hooks/useLanguage';

function DraggableColumns({
  columns,
  setColumns,
  setDisabledSave,
  columnsHeader,
}: any) {
  const {t} = useLang()
  const [draggedColumn, setDraggedColumn] = useState(null);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let gridColumnsCopy = [...columns];
    gridColumnsCopy[index].isShow = e.target.checked;
    setColumns(gridColumnsCopy);
  };

  const handleDragStart = (column: any) => {
    setDraggedColumn(column);
  };

  const handleDragOver = (event: any, targetColumn: any) => {
    event.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumn) {
      return;
    }
    const updatedColumns: any = [...columns];
    const draggedColumnIndex = updatedColumns.findIndex(
      (col: any) => col === draggedColumn
    );
    const targetColumnIndex = updatedColumns.findIndex(
      (col: any) => col === targetColumn
    );
    updatedColumns.splice(draggedColumnIndex, 1);
    updatedColumns.splice(targetColumnIndex, 0, draggedColumn);
    handleColumnReorder(updatedColumns);
  };

  const handleColumnReorder = (newColumns: any) => {
    setColumns([...newColumns]);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  let anyColumnTrue: boolean = false;
  if (!columnsHeader?.length) {
    anyColumnTrue = columns
      .map((column: any) => column.isShowOnUi && column.isShow)
      .some((status: boolean) => status === true);
  } else {
    anyColumnTrue = columns
      .map((column: any) => column.isShow && !column.isExpandData)
      .some((status: boolean) => status === true);
  }

  useEffect(() => {
    if (!anyColumnTrue) {
      setDisabledSave(true);
      toast.error(t("Please select atleast one column"));
    } else {
      setDisabledSave(false);
      return;
    }
  }, [anyColumnTrue]);

  return (
    <div>
      {Array.isArray(columns) &&
        columns?.map((option: any, index: any) =>
          option.isShowOnUi && !option.isExpandData ? (
            <div
              key={index}
              className="mb-3 d-flex justify-content-between align-items-center"
              onDragOver={(e) => handleDragOver(e, option)}
              onDrop={handleDragEnd}
            >
              <span draggable onDragStart={(e) => handleDragStart(option)}>
                {option.columnLabel}
              </span>
              <div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    onChange={(e) => onInputChange(e, index)}
                    name="isShow"
                    type="checkbox"
                    checked={option.isShow ? true : false}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  ></label>
                </div>
              </div>
            </div>
          ) : null
        )}
    </div>
  );
}

export default DraggableColumns;
