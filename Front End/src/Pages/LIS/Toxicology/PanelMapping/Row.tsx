import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import { validateFields } from "../CommonFunctions";
import useLang from "Shared/hooks/useLanguage";

const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: Function;
  loadGridData: Function;
  request: any;
  setRequest: any;
  setIsAddButtonDisabled: any;
  handleChangePanelMappinfId: any;
  selectedBox: any;
  groupValues: any;
  queryDisplayTagNames: any;
  groupTest: any;
  setIsEditing: any;
  isEditing: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    loadGridData,
    request,
    setRequest,
    setIsAddButtonDisabled,
    handleChangePanelMappinfId,
    selectedBox,
    queryDisplayTagNames,
    groupValues,
    groupTest,
    setIsEditing,
    isEditing,
  } = props;

  const { t } = useLang();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const rowIndex = rows.findIndex((row: any) => row.Id === r.Id);

      if (rowIndex !== -1) {
        setIsEditing({
          isEditing: true,
          rowIndex: rowIndex,
        });

        const updatedRows = rows.map((row: any, index: number) => {
          if (index === rowIndex) {
            return { ...row, rowStatus: true };
          }
          return row;
        });

        setRows(updatedRows);
      }
    }
  };

  const handlePanelMappingSave = async () => {
    const {
      DrugClass,
      GroupName,
      Unit,
      Cutoff,
      Linearity,
      Id,
      TestCode,
      GroupNameId,
      ...rest
    } = row;
    const { isValid, invalidField } = validateFields({
      ...rest,
      TestName: groupTest?.TestName,
      GroupName: row.GroupNameId,
    });

    if (isValid) {
      try {
        const response = await RequisitionType.saveToxPanelMappingData({
          ...rest,
          Id,
          GroupId: row.GroupNameId,
          TestName: groupTest?.TestName,
          TestCode: groupTest?.TestCode,
          IsGroupTest:
            groupValues?.some(
              (item: any) =>
                String(item.value) === String(groupTest?.TestCode)
            ) ?? false,
        });

        if (response.data.httpStatusCode === 200) {
          setIsAddButtonDisabled(false);
          toast.success(response.data.message);
          loadGridData(true);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        console.error(err, "err");
      }
    } else {
      const errorMessage = invalidField
        ? `Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`
        : "Invalid field found";
      toast.error(errorMessage);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell className="w-20px min-w-20px">
          <div className="d-flex justify-content-center">
            <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
              <input
                id={`compendiumDataPanelMapingCheckBox_${row.Id}`}
                className="form-check-input"
                type="checkbox"
                checked={selectedBox?.id?.includes(row?.Id)}
                onChange={(e) =>
                  handleChangePanelMappinfId(e.target.checked, row?.Id)
                }
              />
            </label>
          </div>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request ? (
                    <button
                      id={`compendiumDataPanelMapingLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`compendiumDataPanelMapingSave`}
                      onClick={() => handlePanelMappingSave()}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`compendiumDataPanelMapingCancel`}
                    onClick={() => {
                      if (row.Id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.Id === row.Id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true, false, 0);
                      } else {
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        loadGridData(false);
                        setIsAddButtonDisabled(false);
                      }
                      setRequest(false);
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
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`compendiumDataPanelMaping3Dots_${row.Id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="TOX LIS"
                      pageName="Compendium Data"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`compendiumDataPanelMapingEdit`}
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
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`compendiumDataPanelMapingPerformingLab_${row.Id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataPanelMapingPerformingLab`}
                  menuPortalTarget={document.body}
                  theme={(theme) => styles(theme)}
                  styles={reactSelectSMStyle}
                  placeholder={"Select..."}
                  options={dropDownValues?.ReferenceLabLookup}
                  onChange={(event: any) =>
                    handleChange("PerformingLabId", event.value, row?.Id)
                  }
                  value={dropDownValues?.ReferenceLabLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.PerformingLabId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.PerformingLabName}</span>
          )}
        </TableCell>

        <TableCell
          id={`compendiumDataPanelMapingPanelType_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataPanelMapingPanelType`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={"Select..."}
                  options={dropDownValues?.PanelTypeLookup}
                  onChange={(event: any) =>
                    handleChange("PanelTypeId", event.value, row?.Id)
                  }
                  value={dropDownValues?.PanelTypeLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.PanelTypeId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.PanelType}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataPanelMapingPanelName_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataPanelMapingPanelName`}
                  type="text"
                  name="PanelName"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Panel Name")}
                  value={row?.PanelName}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.Id)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.PanelName}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataPanelMapingPanelCode_${row.Id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataPanelMapingPanelCode`}
                  type="text"
                  name="PanelCode"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Panel Code")}
                  value={row?.PanelCode}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.Id)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.PanelCode}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataPanelMapingSpecimenType_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataPanelMapingSpecimenType`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  placeholder={"Select..."}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.SpecimenTypeLookup}
                  onChange={(event: any) =>
                    handleChange("SpecimenTypeID", event.value, row?.Id)
                  }
                  value={dropDownValues?.SpecimenTypeLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.SpecimenTypeID;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.SpecimenType}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataPanelMapingTestName_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataPanelMapingTestName`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  placeholder={"Select..."}
                  theme={(theme) => styles(theme)}
                  options={groupValues}
                  onChange={(event: any) =>
                    handleChange("TestId", event.value, row?.Id)
                  }
                  value={groupValues?.filter(function (option: any) {
                    return option.value === row?.TestId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.TestName}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataPanelMapingTestCode_${row.Id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataPanelMapingTestCode`}
                  type="text"
                  name="TestCode"
                  className="form-control min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Test Code")}
                  value={groupTest?.TestCode || row?.TestCode}
                  disabled
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.Id)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.TestCode}</span>
          )}
        </TableCell>
        <TableCell id={`compendiumDataPanelMapingGroup_${row.Id}`} align="left">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataPanelMapingGroup`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  placeholder={"Select..."}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.GroupLookup}
                  onChange={(event: any) =>
                    handleChange("GroupNameId", event.value, row?.Id)
                  }
                  value={dropDownValues?.GroupLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.GroupNameId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.GroupName}</span>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
