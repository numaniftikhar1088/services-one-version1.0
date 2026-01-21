import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";

const ReqGridColumns = ({ setShowAnyColumnError }: any) => {
  const [draggedColumn, setDraggedColumn] = useState(null);
  const { data, setData } = useToxResultDataContext();
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: any,
    index: number,
    option?: any
  ) => {
    let gridColumnsCopy = [...data?.gridColumns];
    gridColumnsCopy[index].isShow = e.target.checked;
    setData((preVal: any) => {
      return {
        ...preVal,
        gridColumns: gridColumnsCopy,
      };
    });
  };
  const handleDragStart = (event: any, column: any) => {
    setDraggedColumn(column);
  };
  const handleDragOver = (event: any, targetColumn: any) => {
    event.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumn) {
      return;
    }
    const updatedColumns: any = [...data?.gridColumns];
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
    setData((preVal: any) => {
      return {
        ...preVal,
        gridColumns: newColumns,
      };
    });
  };
  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  let anyColumnTrue = data?.gridColumns
    .map((column: any) => column.isShowOnUi && column.isShow)
    .some((status: boolean) => status === true);

  useEffect(() => {
    if (!anyColumnTrue) {
      setShowAnyColumnError(true);
      toast.error("Please select atleast one column");
    } else {
      setShowAnyColumnError(false);
    }
  }, [anyColumnTrue]);

  return (
    <div>
      {Array.isArray(data?.gridColumns) &&
        data?.gridColumns?.map((option: any, index: any) =>
          option.isShowOnUi == true ? (
            <div
              key={index}
              className="mb-3 d-flex justify-content-between align-items-center"
              onDragOver={(e) => handleDragOver(e, option)}
              onDrop={handleDragEnd}
            >
              <span
                className=""
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
              >
                {option.columnLabel}
              </span>
              <div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    onChange={(e) => onInputChange(e, option.id, index, option)}
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
};

export default React.memo(ReqGridColumns);
