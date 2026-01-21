import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { closeMenuOnScroll } from "Pages/Blood/BloodCompendium/Test/Shared";
import { AoE } from "Pages/Blood/BloodCompendium/Test/ExpandRow";
import {
  GetExpandDataAOEs,
  SaveExpandAOEs,
} from "Services/InfectiousDisease/AOEForIDService";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
interface Props {
  row: any;
  setOpen: (open: boolean) => void;
}
const AOEsExpand: React.FC<Props> = ({ row, setOpen }) => {
  const { t } = useLang();

  const dataType = [
    { label: "Text", value: "Text" },
    { label: "Number", value: "Number" },
    { label: "Date", value: "Date" },
    { label: "Multiple Choice", value: "Multiple Choice" },
  ];

  const initialAOEs = {
    aoeCode: "",
    aoeQuestion: "",
    dataType: "",
    optionsList: [""],
  };
  const [formData, setFormData] = useState<AoE[]>([initialAOEs]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

  const GetExpandData = async () => {
    const response = await GetExpandDataAOEs(row.id);
    if (response.data.httpStatusCode === 200) {
      setFormData(response.data.data.aoEs ?? [initialAOEs]);
    }
  };

  // Function to handle input changes (for code, question, dataType)
  const handleInputChange = (
    field: keyof AoE,
    value: string,
    index: number
  ) => {
    setFormData((prevData: any) =>
      prevData.map((row: any, i: number) =>
        index === i ? { ...row, [field]: value } : row
      )
    );
  };

  // Function to add a new AOE row
  const addAoeRow = () => {
    setFormData((prevData: any) => [...prevData, initialAOEs]);
  };

  // Function to remove a tag section
  const removeAOE = (index: number) => {
    setFormData((prevData: any) =>
      prevData.filter((_: any, i: number) => index !== i)
    );
  };

  const handleChangeForMulpleChoice = (value: number, index: number) => {
    // Prevent values greater than 5
    if (value > 5) return;

    // Create a copy of the existing state
    const newAoeRowsData = [...formData];

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
    setFormData(newAoeRowsData);
  };

  const handleIndividualInputChange = (
    value: string,
    index: number,
    mainIndex: number
  ) => {
    const updatedData = [...formData];

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

    setFormData(updatedData);
  };

  const validateFormData = () => {
    const errors = [];
    // AOE validation
    if (formData.length > 1) {
      formData.forEach((aoe, index) => {
        if (!aoe.aoeCode) errors.push(`AOEs #${index + 1}: Code is required.`);
        if (!aoe.aoeQuestion)
          errors.push(`AOEs #${index + 1}: Question is required.`);
        if (!aoe.dataType)
          errors.push(`AOEs #${index + 1}: Data Type is required.`);
        if (aoe.dataType === "Multiple Choice") {
          aoe.optionsList.forEach((option, i) => {
            if (!option)
              errors.push(`AOEs #${index + 1}: Option #${i + 1} is required.`);
          });
        }
      });
    } else if (
      formData.length === 1 &&
      formData.some((obj) => {
        return Object.values(obj).some(
          (value) => value.toString().trim() !== ""
        );
      })
    ) {
      if (!formData[0].aoeCode) errors.push(`AOEs #1: Code is required.`);
      if (!formData[0].aoeQuestion)
        errors.push(`AOEs #1: Question is required.`);
      if (!formData[0].dataType) errors.push(`AOEs #1: Data Type is required.`);
      if (formData[0].dataType === "Multiple Choice") {
        formData[0].optionsList.forEach((option, i) => {
          if (!option) errors.push(`AOEs #1: Option #${i + 1} is required.`);
        });
      }
      // Add more validation rules as needed
    }
    return errors;
  };

  const handleSave = async () => {
    setIsAddButtonDisabled(true);

    const validationErrors = validateFormData();
    if (validationErrors?.length) {
      toast.error(t(validationErrors[0]));
      setIsAddButtonDisabled(false);
      return;
    }
    try {
      const newFormData = {
        aoeId: row.id,
        aoEs: formData,
      };

      const response = await SaveExpandAOEs(newFormData);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(t(response?.data?.message));
      } else if (response?.data?.status === 400) {
        toast.error(t(response?.data?.message));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddButtonDisabled(false);
      GetExpandData();
    }
  };

  useEffect(() => {
    GetExpandData();
  }, []);

  return (
    <div>
      <div className="d-flex">
        <h6 className="text-primary h5 my-4">{"Add AOEs for this test"}</h6>
      </div>

      <div className="d-flex flex-column gap-1">
        <div className="pb-md-4 pb-3">
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
                      {t("Answer Type")}
                    </TableCell>
                    <TableCell className="min-w-20px w-20px"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData?.map((row: any, index: number) => (
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
                              (item: any) => item.value === row.dataType
                            )}
                            closeMenuOnScroll={(e: any) => closeMenuOnScroll(e)}
                            onChange={(option: any) =>
                              handleInputChange(
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
                            {formData.length === 1 ? null : (
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
                            {formData.length - 1 === index ? (
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
      <div className="d-flex align-items-center gap-2">
        <button
          id={`IDCompendiumDataExpandCancelButton`}
          className="btn btn-warning btn-sm fw-bold mr-3 px-5 text-capitalize text-white h-30px"
          aria-controls="SearchCollapse"
          aria-expanded="true"
          type="button"
          onClick={() => setOpen(false)}
        >
          <span>
            <span>{t("Cancel")}</span>
          </span>
        </button>
        <PermissionComponent
          moduleName="ID LIS"
          pageName="Compendium Data"
          permissionIdentifier="Save"
        >
          <button
            id={`IDCompendiumDataExpandSaveButton`}
            className="btn btn-primary btn-sm fw-bold mr-3 px-5 text-capitalize h-30px"
            aria-controls="SearchCollapse"
            aria-expanded="true"
            type="button"
            onClick={handleSave}
            disabled={isAddButtonDisabled}
          >
            <span>
              <span>{t("Save")}</span>
            </span>
          </button>
        </PermissionComponent>
      </div>
    </div>
  );
};
export default AOEsExpand;
