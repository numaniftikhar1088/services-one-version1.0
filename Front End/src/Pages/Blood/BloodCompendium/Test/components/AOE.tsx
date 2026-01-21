import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import { closeMenuOnScroll } from "../Shared";

interface AoeRow {
  aoeCode: string;
  aoeQuestion: string;
  dataType: string;
  optionsList: string[];
}

const AOE = ({ formData, setFormData }: any) => {
  const { t } = useLang();
  const dataType = [
    { label: "Text", value: "Text" },
    { label: "Number", value: "Number" },
    { label: "Date", value: "Date" },
    { label: "Multiple Choice", value: "Multiple Choice" },
  ];

  // Function to add a new AOE row
  const addAoeRow = () => {
    setFormData((prevData: any) => ({
      ...prevData,
      aoEs: [
        ...prevData.aoEs,
        {
          aoeCode: "",
          aoeQuestion: "",
          dataType: "",
          // multipleChoice: 0,
          optionsList: [""],
        },
      ],
    }));
  };

  // Function to remove a tag section
  const removeAOE = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      aoEs: prevData.aoEs.filter((_: any, i: number) => index !== i),
    }));
  };

  // Function to handle input changes (for code, question, dataType)
  const handleInputChange = (
    id: number,
    field: keyof AoeRow,
    value: string,
    index: number
  ) => {
    setFormData((prevData: any) => ({
      ...prevData,
      aoEs: formData.aoEs.map((row: any, i: number) =>
        index === i ? { ...row, [field]: value } : row
      ),
    }));
  };

  const handleChangeForMulpleChoice = (value: number, index: number) => {
    // Prevent values greater than 5
    if (value > 5) return;

    // Create a copy of the existing state
    const newAoeRowsData = [...formData.aoEs];

    // Get the current optionsList
    const currentOptionsList = newAoeRowsData[index].optionsList;

    // Adjust the optionsList: slice or pad with empty strings based on the value
    const updatedOptionsList =
      value > currentOptionsList.length
        ? [
            ...currentOptionsList,
            ...Array(value - currentOptionsList.length).fill(""),
          ]
        : currentOptionsList.slice(0, value);

    // Update the specific index with the new multipleChoice value
    newAoeRowsData[index] = {
      ...newAoeRowsData[index], // Copy the existing object
      optionsList: updatedOptionsList, // Update optionsList with adjusted values
    };

    // Update the formData state
    setFormData((prevData: any) => ({
      ...prevData,
      aoEs: newAoeRowsData,
    }));
  };

  const handleIndividualInputChange = (
    value: string,
    index: number,
    mainIndex: number
  ) => {
    const updatedData = [...formData.aoEs];

    // Make a copy of the specific row to avoid direct mutation
    const updatedRow = { ...updatedData[mainIndex] };

    // Make a copy of multipleChoiceValues array
    const updatedMultipleChoiceValues = [...updatedRow.optionsList];

    // Update the specific value
    updatedMultipleChoiceValues[index] = value;

    // Set the updated multipleChoiceValues back into the row
    updatedRow.optionsList = updatedMultipleChoiceValues;

    // Set the updated row back into aoeRowsData
    updatedData[mainIndex] = updatedRow;

    setFormData((prevData: any) => ({
      ...prevData,
      aoEs: updatedData,
    }));
  };

  return (
    <div>
      <div className="d-flex">
        <h6 className="text-primary h5">{"Add AOEs for this test"}</h6>
      </div>

      <div className="d-flex flex-column gap-1">
        <div className="py-md-4 py-3">
          <div className="table_bordered overflow-hidden">
            <TableContainer className="shadow-none">
              <Table
                stickyHeader
                aria-label="sticky table collapsible"
                className="plate-mapping-table mb-1"
              >
                <TableHead className="h-35px">
                  <TableRow>
                    <TableCell className="w-10px">{t("No")}</TableCell>
                    <TableCell className="min-w-125px w-125px">
                      {t("Code")}
                    </TableCell>
                    <TableCell className="min-w-125px w-125px">
                      {t("Question")}
                    </TableCell>
                    <TableCell className="min-w-125px w-125px">
                      {t("Data Type")}
                    </TableCell>
                    <TableCell className="min-w-20px w-20px"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData?.aoEs?.map((row: any, index: number) => (
                    <React.Fragment key={index}>
                      <TableRow className="">
                        <TableCell className="w-10px">{index + 1}</TableCell>

                        {/* Responsive Code Input */}
                        <TableCell>
                          <div>
                            <input
                              id={`AOECode_${index + 1}`}
                              type="text"
                              className="form-control h-30px rounded"
                              value={row.aoeCode}
                              onChange={(e) =>
                                handleInputChange(
                                  row.id,
                                  "aoeCode",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                          </div>
                        </TableCell>

                        {/* Responsive Question Input */}
                        <TableCell>
                          <div>
                            <input
                              id={`AOEQuestion_${index + 1}`}
                              className="form-control h-30px rounded"
                              value={row.aoeQuestion}
                              onChange={(e) =>
                                handleInputChange(
                                  row.id,
                                  "aoeQuestion",
                                  e.target.value,
                                  index
                                )
                              }
                            />
                          </div>
                        </TableCell>

                        {/* Responsive Select for Data Type */}
                        <TableCell>
                          <Select
                            inputId={`AOEDataType_${index + 1}`}
                            options={dataType}
                            styles={reactSelectSMStyle}
                            menuPortalTarget={document.body}
                            theme={(theme) => styles(theme)}
                            placeholder={t("--Select--")}
                            className="z-index-3"
                            isSearchable={true}
                            value={dataType?.filter(
                              (item: any) => item.value == row.dataType
                            )}
                            closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                            onChange={(option: any) =>
                              handleInputChange(
                                row.id,
                                "dataType",
                                option?.value || "",
                                index
                              )
                            }
                          />
                        </TableCell>

                        {/* Delete Button */}
                        <TableCell>
                          <div className="align-items-end">
                            {formData.aoEs.length === 1 ? null : (
                              <IconButton
                                id={`AOEDelete_${index + 1}`}
                                sx={{
                                  height: "30px",
                                  width: "30px",
                                  borderRadius: "5px",
                                }}
                                className="bg-light-danger me-4"
                                color="error"
                                onClick={() => removeAOE(index)}
                              >
                                <i className="fa fa-trash text-danger"></i>
                              </IconButton>
                            )}
                            {formData.aoEs.length - 1 === index ? (
                              <button
                                id={`AOEAddRow`}
                                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded w-25px"
                                onClick={addAoeRow}
                              >
                                <AddIcon />
                              </button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Multiple Choice Row */}
                      {row.dataType === "Multiple Choice" ? (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="row mt-3">
                              <div className="col-6 col-md-2 mb-2">
                                <input
                                  id={`MultipleChoiceinput`}
                                  type="number"
                                  className="form-control h-30px rounded"
                                  value={
                                    row.optionsList.length === 0
                                      ? null
                                      : row.optionsList.length
                                  }
                                  min={1}
                                  max={5}
                                  onChange={(e) =>
                                    handleChangeForMulpleChoice(
                                      +e.target.value,
                                      index
                                    )
                                  }
                                />
                              </div>

                              {/* Render multiple inputs responsively */}
                              <div className="col-12 col-md-10 d-flex flex-wrap gap-2">
                                {row.optionsList.map(
                                  (value: string[], idx: number) => (
                                    <div
                                      key={idx}
                                      className="col-6 col-md-2 col-lg-2 mb-2"
                                    >
                                      <input
                                        id={`ChoiceInput_${idx + 1}`}
                                        type="text"
                                        className="form-control h-30px rounded"
                                        value={value}
                                        onChange={(e) =>
                                          handleIndividualInputChange(
                                            e.target.value,
                                            idx,
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AOE;
