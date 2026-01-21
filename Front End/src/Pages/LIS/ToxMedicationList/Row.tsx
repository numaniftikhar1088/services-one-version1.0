import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import React, { memo, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import BootstrapModal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";
export interface ITableObj {
  id: number;
  panelId: number;
  performingLabId: number;
  performingLabName: string;
  panelName: string;
  panelCode: string;
  assayName: string;
  organism: string;
  testCode: string;
  groupName: string;
  antibioticClass: string;
  assayNameId: number;
  reportingRuleId: number;
  groupNameId: number;
  reportingRuleName: string;
  resistance: boolean;
  numberOfRepeated: number;
  numberOfDetected: number;
  createDate: string;
}
const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: Function;
  handleSubmit: Function;
  loadGridData: Function;
  request: any;
  setRequest: any;
  setIsAddButtonDisabled: any;
  setCondition: any;
  convertState: any;
  testCode: any;
  setId: any;
  setTestCode: any;
  parseJSONToArray: any;
  selectedMedications: any;
  setSelectedMedications: any;
  selectedMetabolite: any;
  setSelectedMetabolite: any;
  panelCode: any;
  handleChangeTxt: any;
  PanelCodeLookup: any;
  referenceLab: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    handleSubmit,
    loadGridData,
    request,
    setRequest,
    setIsAddButtonDisabled,
    setCondition,
    convertState,
    testCode,
    setId,
    setTestCode,
    parseJSONToArray,
    selectedMedications,
    setSelectedMedications,
    selectedMetabolite,
    setSelectedMetabolite,
    panelCode,
    handleChangeTxt,
    PanelCodeLookup,
    referenceLab,
  } = props;

  const { t } = useLang();
  console.log(row, "row");

  const [lastTypedInput, setLastTypedInput] = useState<any>("");
  const [providerFormData, setProviderFormData] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<any>([]);
  const [openalert, setOpenAlert] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [select, setSelect] = useState<any>([]);
  const [tests, setTests] = useState<any>([]);
  const [metabolites, setMetabolites] = useState<any>([]);

  const getValues = async (r: any, action: string) => {
    if (action === "Edit") {
      setId(r.id);
      setSelectedMedications(row.id !== 0 ? row?.medicationList : []);
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });

      setRows(updatedRows);
    } else if (action === "Delete") {
      setCheck(true);
      await RequisitionType.deleteToxMedicationRow(r.id).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            loadGridData(true, true);
            setCheck(false);
          }
        }
      );
    }
  };
  function ArrayConversionMetabolite(ArrayToConvert: any) {
    const mappedData = ArrayToConvert.map((item: any) => ({
      value: item.metaboliteId,
      label: item.metaboliteName,
    }));
    return mappedData;
  }

  const handleChangeForMetabolite = (selectedOption: any, id: any) => {
    const updatedMetaboliteList = selectedOption
      ? [
          {
            metaboliteId: selectedOption.value,
            metaboliteName: selectedOption.label,
          },
        ]
      : [];

    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              metaboliteList: updatedMetaboliteList,
            }
          : x
      )
    );
  };

  const handleChangeForPanelCode = (selectedOption: any, id: any) => {
    const updatedPanelCodeList = selectedOption
      ? [
          {
            panelId: selectedOption.value,
            panelCode: selectedOption.label,
          },
        ]
      : [];

    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              panelCodeList: updatedPanelCodeList,
            }
          : x
      )
    );
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        let response = await RequisitionType.GetToxMedication(inputValue);
        setSuggestions(response.data.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    if (inputValue !== "") {
      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);
  const handleChangeab = (event: any) => {
    setInputValue(event.target.value);
  };
  const handleItemClick = (suggestion: any, id: any) => {
    setInputValue(""); // Clear the input field after selection
    selectedMedications.push(suggestion);
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              MedicationList: selectedMedications,
            }
          : x
      )
    );
  };
  const closeSuggestions = () => {
    setLastTypedInput("");
    setProviderFormData([]);
  };
  const removeMedicationFromList = (medicationCode: any) => {
    const updatedList = [...selectedMedications];
    const indexToRemove = updatedList.findIndex(
      (medication) => medication.medicationCode === medicationCode
    );
    if (indexToRemove !== -1) {
      updatedList.splice(indexToRemove, 1);
      setSelectedMedications(updatedList);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleClickOpen = () => {
    setOpenAlert(true);
  };
  // const PanelCodeLookup = () => {
  //   RequisitionType.ToxicologyGroupLookup()
  //     .then((res: AxiosResponse) => {
  //       console.log(res, "resssspanelCode");
  //     })
  //     .catch((err: AxiosError) => {
  //       console.error(err);
  //     });
  // };

  useEffect(() => {
    if (row.rowStatus && row.id !== 0) {
      getConfirmationTestLookup(row.specimenTypeId, row.labId);
      PanelCodeLookup(row.analyteId);
    }
  }, [row.rowStatus]);

  useEffect(() => {
    getMetabolites();
  }, []);

  const getConfirmationTestLookup = async (specimenTypeId: any, labId: any) => {
    if (!specimenTypeId || !labId) {
      return;
    }
    try {
      const response = await RequisitionType.getConfirmationTestLookup(
        specimenTypeId,
        labId
      );

      const mappedData = response.data.result.map((item: any) => ({
        value: item.TestId,
        label: item.TestName,
      }));

      setTests(mappedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getMetabolites = async () => {
    try {
      const response = await RequisitionType.getMetabolites();
      setMetabolites(response.data);
    } catch (error) {
      console.error("Error fetching metabolites:", error);
    }
  };
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row?.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request ? (
                    <button
                      id={`ToxMedicationLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`ToxMedicationSave`}
                      onClick={() => {
                        handleSubmit(row);
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`ToxMedicationCancel`}
                    onClick={() => {
                      if (row.id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true, false);
                      } else {
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                      setRequest(false);
                      setSelectedMedications([]);
                    }}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                </div>
              </>
            ) : (
              <div className="rotatebtnn">
                <DropdownButton
                  id={`ToxMedication3Dots_${row.id}`}
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="TOX LIS"
                      pageName="Medication"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`ToxMedicationEdit`}
                        eventKey="2"
                        onClick={() => getValues(row, "Edit")}
                        className="w-auto"
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-edit"
                            style={{ fontSize: "16px", color: "green" }}
                          ></i>
                          {t("Edit")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="TOX LIS"
                      pageName="Medication"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item
                        id={`ToxMedicationDelete`}
                        eventKey="2"
                        onClick={handleClickOpen}
                        className="w-auto"
                      >
                        <div className="menu-item px-3">
                          <i className="fa fa-trash text-danger w-20px"></i>
                          {t("Delete")}
                        </div>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell id={`ToxMedicationLabIdCell_${row.id}`} align="left">
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`ToxMedicationLabIdSelect`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={referenceLab}
                  onChange={(event: any) => {
                    handleChange(
                      "labId",
                      "labName",
                      event.value,
                      row?.id,
                      event
                    );
                    getConfirmationTestLookup(row.specimenTypeId, event.value);
                  }}
                  value={referenceLab.filter(function (option: any) {
                    return option.value === row?.labId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.labName}</span>
          )}
        </TableCell>
        <TableCell id={`ToxMedicationSpecimenTypeCell_${row.id}`} align="left">
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`ToxMedicationSpecimenTypeSelect`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={dropDownValues?.SpecimenTypeLookup}
                  onChange={(event: any) => {
                    handleChange(
                      "specimenTypeId",
                      "specimenTypeName",
                      event.value,
                      row?.id,
                      event
                    );
                    getConfirmationTestLookup(event.value, row.labId);
                  }}
                  value={dropDownValues?.SpecimenTypeLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.specimenTypeId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.specimenTypeName}</span>
          )}
        </TableCell>

        <TableCell
          id={`ToxMedicationAssociatedAnalytesCell_${row.id}`}
          align="left"
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`ToxMedicationAssociatedAnalytesSelect`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={tests}
                  onChange={(event: any) => {
                    handleChange(
                      "analyteId",
                      "analyteName",
                      event.value,
                      row?.id,
                      event
                    );
                  }}
                  value={tests.filter(function (option: any) {
                    return option.value === row?.analyteId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.analyteName}</span>
          )}
        </TableCell>
        <TableCell id={`ToxMedicationMetaboliteCell_${row.id}`} scope="row">
          {row?.rowStatus ? (
            // <div className="required d-flex">
            <div className="w-100">
              <Select
                inputId={`ToxMedicationMetaboliteSelect`}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme) => styles(theme)}
                options={metabolites}
                onChange={(event: any) => {
                  handleChange(
                    "metaboliteId",
                    "metabolite",
                    event.value,
                    row?.id,
                    event
                  );
                }}
                value={metabolites.filter(function (option: any) {
                  return option.value === row?.metaboliteId;
                })}
              />
            </div>
          ) : (
            // </div>
            <span>{row.metabolite}</span>
          )}
        </TableCell>
        <TableCell id={`ToxMedicationMedicationCell_${row.id}`} scope="row">
          {row?.rowStatus ? (
            <>
              <div className="required d-flex position-relative">
                <div className="w-100">
                  <input
                    id={`ToxMedicationMedicationInput`}
                    type="text"
                    name="Medication"
                    className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                    placeholder="Medications"
                    value={inputValue}
                    onChange={handleChangeab}
                  />
                  {loading && <span>{t("loading...")}</span>}
                  <div className="position-absolute">
                    {suggestions?.length ? (
                      <div className="bg-white card h-300px overflow-scroll px-3 py-2 shadow-xs w-100 z-index-3">
                        {suggestions?.map((item: any, index: any) => (
                          <div
                            onClick={() => {
                              closeSuggestions();
                              handleItemClick(item, row.id);
                            }}
                            key={index}
                            className="bg-hover-light-primary d-flex gap-2 flex-wrap py-2 px-4 rounded-4"
                            style={{
                              borderBottom: "1.5px solid var(--kt-primary)",
                            }}
                          >
                            <div className="text-hover-primary d-flex">
                              <span className="fw-600 fs-7">
                                {item?.medicationCode}
                              </span>
                              <span className="pl-2 fs-7">
                                {item?.medicationName}
                              </span>
                              <br />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {selectedMedications.length ? (
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {selectedMedications.map((i: any) => (
                    <div className="d-flex badge badge-secondary px-2 fw-500 gap-2 align-items-center pt-2">
                      <i
                        className="bi bi-x-lg fs-7"
                        onClick={() =>
                          removeMedicationFromList(i.medicationCode)
                        }
                      ></i>
                      <span>{i.medicationName || i.MedicationName}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <span>
              {row?.medicationList.map(
                (item: any, index: number, array: any[]) => (
                  <span key={index}>
                    {item?.medicationName}
                    {index < array.length - 1 ? ", " : ""}
                  </span>
                )
              )}
            </span>
          )}
        </TableCell>
        <TableCell id={`ToxMedicationPanelCode_${row.id}`} align="left">
          {row?.rowStatus ? (
            // <div className="required d-flex">
            <div className="w-100">
              <Select
                inputId={`ToxMedicationPanelCodeSelect`}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                options={panelCode}
                value={panelCode.find(
                  (option: any) =>
                    row?.panelCodeList?.length &&
                    option.value === row.panelCodeList[0]?.panelId
                )}
                onChange={(event: any) => {
                  handleChangeForPanelCode(event, row.id);
                }}
              />
            </div>
          ) : (
            // </div>
            <span>
              {" "}
              {row?.panelCodeList.map(
                (item: any, index: number, array: any[]) => (
                  <>
                    <span key={index}>{item?.panelCode}</span>
                    {index < array.length - 1 ? ", " : ""}
                  </>
                )
              )}
            </span>
          )}
        </TableCell>
        <TableCell id={`ToxMedicationDrugClass_${row.id}`} align="left">
          {row?.rowStatus ? (
            // <div className="required d-flex">
            <div className="w-100">
              <input
                id={`ToxMedicationDrugClassInput`}
                type="text"
                name="drugClass"
                className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                placeholder="Drug Class"
                onChange={(event) => {
                  handleChangeTxt(event, row.id);
                }}
                value={row?.drugClass}
              />
            </div>
          ) : (
            // </div>
            <span>{row?.drugClass}</span>
          )}
        </TableCell>
      </TableRow>
      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`ToxMedicationDeleteCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`ToxMedicationModalDelete`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => getValues(row, "Delete")}
          >
            <span>{check ? <LoaderIcon /> : null}</span>
            <span> {t("Delete")}</span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </React.Fragment>
  );
};

export default memo(Row);
