import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Select from "react-select";
import { useState } from "react";
import { reactSelectSMStyle2, styles } from "../../../Utils/Common";
import { OptionType } from "./ResultDataExpandableRow";
import { isJson } from "Utils/Common/Requisition";
import useLang from "Shared/hooks/useLanguage";

function DraggableTests(props: any) {
  const {
    bulkIds,
    handleIdsSelections,
    panel,
    handleChange,
    panelIndex,
    cannedComments,
    setExpandData,
  } = props;
  const { t } = useLang();
  const [draggedColumn, setDraggedColumn] = useState<any>(null);

  const handleDragStart = (column: any) => {
    setDraggedColumn(column);
  };

  const handleDragOver = (event: any, targetColumn: any) => {
    event.preventDefault();

    if (!draggedColumn || draggedColumn === targetColumn) {
      return;
    }

    // Clone the panel tests array
    const updatedColumns = [...panel.tests];

    // Find indices of dragged and target columns
    const draggedColumnIndex = updatedColumns.findIndex(
      (col: any) => col.id === draggedColumn.id
    );
    const targetColumnIndex = updatedColumns.findIndex(
      (col: any) => col.id === targetColumn.id
    );

    // Ensure valid indices
    if (draggedColumnIndex === -1 || targetColumnIndex === -1) {
      console.warn(t("Column not found in panel.tests"));
      return;
    }

    // Remove dragged column from its original position
    const [removedColumn] = updatedColumns.splice(draggedColumnIndex, 1);

    // Insert dragged column at new position
    updatedColumns.splice(targetColumnIndex, 0, removedColumn);

    // // Reassign sort order
    // const reorderedColumns = updatedColumns.map((item: any, index: number) => ({
    //   ...item,
    //   testSortOrder: index + 1,
    // }));

    handleColumnReorder(updatedColumns);
  };

  const handleColumnReorder = (newColumns: any) => {
    setExpandData((prev: any) => ({
      ...prev,
      panels: prev.panels.map((panel: any, pIndex: number) =>
        pIndex === panelIndex
          ? {
              ...panel,
              tests: newColumns,
            }
          : panel
      ),
    }));
  };

  return panel.tests.map((test: any, testIndex: number) => (
    <TableRow
      className={`${test.bgClass}`}
      onDragOver={(e) => handleDragOver(e, test)}
      draggable
      onDragStart={() => handleDragStart(test)}
      key={test.id}
    >
      <TableCell className="min-w-50px ms-2">
        <label className="form-check form-check-inline form-check-solid m-0 fw-500">
          <input
            id={`BloodResultDataExpandRowCheckBox_${testIndex + 1}`}
            style={{
              marginLeft: "-1.50rem",
            }}
            className="form-check-input"
            type="checkbox"
            checked={bulkIds.includes(test.id)}
            onChange={() => handleIdsSelections(test.id)}
          />
        </label>
      </TableCell>
      <TableCell id={`BloodResultDataExpandTestName_${testIndex + 1}`}>
        {test.testName}
      </TableCell>
      <TableCell id={`BloodResultDataExpandPreviousValue_${testIndex + 1}`}>
        <input
          id={`BloodResultDataExpandPreviousValue_${testIndex + 1}`}
          name="previousValue"
          className="form-control h-30px"
          value={test?.previousValue}
          disabled={true}
        />
      </TableCell>
      <TableCell>
        {test?.referenceValueType?.toLowerCase() === "list" ? (
          <Select
            inputId={`BloodResultDataExpandSelectResultValue_${testIndex + 1}`}
            name="resultValue"
            menuPortalTarget={document.body}
            options={
              isJson(test.listTypeJson)
                ? JSON.parse(test.listTypeJson)
                : test.listTypeJson
            }
            theme={(theme) => styles(theme)}
            value={
              isJson(test.listTypeJson)
                ? JSON.parse(test.listTypeJson)?.find(
                    (option: OptionType) => option.value === test.resultValue
                  )
                : test.listTypeJson
            }
            isSearchable={true}
            styles={reactSelectSMStyle2("25px")}
            onChange={(e) =>
              handleChange("resultValue", e?.value, panelIndex, testIndex)
            }
            isDisabled={test.isRejected}
          />
        ) : (
          <input
            id={`BloodResultDataExpandResultValue_${testIndex + 1}`}
            name="resultValue"
            className="form-control h-30px"
            value={test?.resultValue}
            onChange={(e) =>
              handleChange(
                e.target.name,
                e.target.value === "" ? null : e.target.value,
                panelIndex,
                testIndex
              )
            }
            onKeyDown={(e) => {
              const regex = /^[0-9.-]*$/;
              if (
                !(regex.test(e.key) || e.key === "Backspace" || e.key === "Tab")
              ) {
                e.preventDefault();
              }
            }}
            disabled={test.isRejected}
          />
        )}
      </TableCell>
      <TableCell id={`BloodResultDataExpandNormalizeResult_${testIndex + 1}`}>
        {test.normalizeResult ?? "N/A"}
      </TableCell>
      <TableCell id={`BloodResultDataExpandReference_${testIndex + 1}`}>
        {test.reference}
      </TableCell>
      <TableCell id={`BloodResultDataExpandUnits_${testIndex + 1}`}>
        {test.units}
      </TableCell>
      <TableCell id={`BloodResultDataExpandFlags_${testIndex + 1}`}>
        {test.flag}
      </TableCell>
      <TableCell>
        <Select
          inputId={`BloodResultDataExpandCannedComment_${testIndex + 1}`}
          name="cannedCommentId"
          menuPortalTarget={document.body}
          options={cannedComments as OptionType[]} // Ensure options have the correct type
          theme={(theme) => styles(theme)}
          value={cannedComments?.find(
            (option: OptionType) => option.value === test.cannedCommentId
          )}
          isSearchable={true}
          styles={reactSelectSMStyle2("25px")}
          onChange={(e) =>
            handleChange("cannedCommentId", e?.value, panelIndex, testIndex)
          }
          isDisabled={test.isRejected}
          isClearable
        />
      </TableCell>
      <TableCell>
        <input
          id={`BloodResultDataExpandLabComment_${testIndex + 1}`}
          name="labComments"
          className="form-control h-30px"
          value={test.labComments}
          onChange={(e) =>
            handleChange(e.target.name, e.target.value, panelIndex, testIndex)
          }
          disabled={test.isRejected}
        />
      </TableCell>
      <TableCell id={`BloodResultDataExpandPerformingLab_${testIndex + 1}`}>
        {test.performingLabName}
      </TableCell>
      <TableCell id={`BloodResultDataExpandValidateBy_${testIndex + 1}`}>
        {test.validateByAndDate}
      </TableCell>
      <TableCell id={`BloodResultDataExpandTestStatus_${testIndex + 1}`}>
        {test.testStatus}
      </TableCell>
    </TableRow>
  ));
}

export default DraggableTests;
