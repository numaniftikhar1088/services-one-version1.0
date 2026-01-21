import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { memo, useState } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import { toast } from "react-toastify";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../../../Shared/Icons";
import { AOEsAssayNameLookup } from "Services/InfectiousDisease/AssayDataService";
import { SaveReflexRules } from "Services/InfectiousDisease/ReflexRules";
import useLang from "Shared/hooks/useLanguage";
import { styles } from "Utils/Common";
import { validateFields } from "Pages/LIS/Toxicology/CommonFunctions";

export interface ReflexRuleRow {
  id: number;
  labId: number;
  testId: number;
  panelId: number;
  labName: string;
  testName: string;
  panelName: string;
  rowStatus: boolean;
  reflexRule: string;
  isMainPanel: boolean;
  testConfigId: number;
  sourcePanelName: string;
  sourcePanelId: number | null;
}

const Row = (props: {
  rows: any;
  setRows: any;
  index: number;
  PanelLookUp: any;
  loadGridData: any;
  row: ReflexRuleRow;
  dropDownValues: any;
  setDropDownValues: any;
  queryDisplayTagNames: any;
  setIsAddButtonDisabled: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    PanelLookUp,
    loadGridData,
    dropDownValues,
    setDropDownValues,
    queryDisplayTagNames,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const [loader, setLoader] = useState(false);

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      PanelLookUp(row.labId);
      OrganismLookup(row.labId, row.sourcePanelId);

      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return {
            ...row,
            rowStatus: true,
          };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  const handleSubmit = async () => {
    const { isValid, invalidField } = validateFields({
      labId: row.labId,
      sourcePanelId: row.sourcePanelId,
      testConfigId: row.testConfigId,
      panelId: row.panelId,
      reflexRule: row.reflexRule,
    });

    if (isValid) {
      const submittedResults = {
        id: row.id,
        labId: row.labId,
        panelId: row.panelId,
        testId: row.testId,
        testConfigId: row.testConfigId,
        reflexRule: row.reflexRule,
        isMainPanel: row.isMainPanel,
        sourcePanelId: row.sourcePanelId,
      };

      if (row.sourcePanelId === row.panelId) {
        toast.error(t("Source Panel and Reflex Panel cannot be the same."));
        return;
      }

      setLoader(true);

      try {
        const response = await SaveReflexRules(submittedResults);

        if (response?.data?.httpStatusCode === 200) {
          toast.success(response?.data?.message);
          loadGridData(true, false);
          setDropDownValues((prev: any) => ({
            ...prev,
            PanelList: [],
            OrganismList: [],
          }));
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(t("Something went wrong while saving data."));
        console.error("Error saving reflex rule:", error);
      } finally {
        setLoader(false);
      }
    } else {
      const errorMessage = invalidField
        ? `Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`
        : "Invalid field found";
      toast.error(errorMessage);
    }
  };

  const handleChange = (
    name: string,
    value: any,
    id: number,
    testId?: number
  ) => {
    if (name === "labId") {
      PanelLookUp(value);
      setDropDownValues((prev: any) => ({
        ...prev,
        OrganismList: [],
      }));
      setRows((curr: any) =>
        curr.map((x: any) => {
          if (x.id !== id) return x;
          return {
            ...x,
            sourcePanelId: 0,
            testConfigId: 0,
            panelId: 0,
          };
        })
      );
    }

    if (name === "sourcePanelId") {
      OrganismLookup(row.labId, value);
    }

    setRows((curr: any) =>
      curr.map((x: any) => {
        if (x.id !== id) return x;
        return {
          ...x,
          [name]: value,
          ...(name === "testConfigId" && testId !== undefined && { testId }),
        };
      })
    );
  };

  const OrganismLookup = (labId: number | null, panelId: number | null) => {
    const payload = {
      reqTypeId: 4,
      panelId: panelId,
      referenceLabId: labId,
    };
    AOEsAssayNameLookup(payload)
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            OrganismList: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {loader ? (
                    <button
                      id={`compendiumDataPanelMapingLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`IDCompendiumDataReflexRuleSaveRow`}
                      onClick={handleSubmit}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`IDCompendiumDataReflexRuleCancelSaveRow`}
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
                        const newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                      setDropDownValues((prev: any) => ({
                        ...prev,
                        PanelList: [],
                        OrganismList: [],
                      }));
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
                  id={`IDCompendiumDataReflexRule3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`IDCompendiumDataReflexRuleEdit`}
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
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`IDCompendiumDataReflexRulePerformingLab_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataReflexRule_performingLab"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PerformingLabList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Performing Lab")}
                  name="labId"
                  value={dropDownValues.PerformingLabList?.filter(
                    (item: any) => item?.value === row?.labId
                  )}
                  onChange={(event: any) => {
                    handleChange("labId", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.labName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataReflexRuleFacility_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataReflexRule_panelName"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PanelList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Source Panel Name")}
                  name="sourcePanelId"
                  value={dropDownValues.PanelList?.filter(
                    (item: any) => item?.value === row?.sourcePanelId
                  )}
                  onChange={(event: any) => {
                    handleChange("sourcePanelId", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-capitalize">{row?.sourcePanelName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataReflexRuleOrganism_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataReflexRule_Organism"
                  menuPortalTarget={document.body}
                  options={dropDownValues.OrganismList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Organism")}
                  name="testConfigId"
                  value={dropDownValues.OrganismList?.filter(
                    (item: any) => item?.value === row?.testConfigId
                  )}
                  onChange={(event: any) => {
                    handleChange(
                      "testConfigId",
                      event.value,
                      row.id,
                      dropDownValues.OrganismList.find(
                        (item: any) => item.value === event.value
                      )?.testId
                    );
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-capitalize">{row?.testName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataReflexRuleFacility_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataReflexRule_panelName"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PanelList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Reflex Panel Name")}
                  name="panelId"
                  value={dropDownValues.PanelList?.filter(
                    (item: any) => item?.value === row?.panelId
                  )}
                  onChange={(event: any) => {
                    handleChange("panelId", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-capitalize">{row?.panelName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataReflexRuleReflexRule_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataReflexRule_reflexRule"
                  menuPortalTarget={document.body}
                  options={dropDownValues.ReflexRuleList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Reflex Rule")}
                  name="reflexRule"
                  value={dropDownValues.ReflexRuleList?.filter(
                    (item: any) => item?.value === row?.reflexRule
                  )}
                  onChange={(event: any) => {
                    handleChange("reflexRule", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.reflexRule}</span>
          )}
        </TableCell>
        {row?.rowStatus ? (
          <TableCell>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch m-0">
                <input
                  id={`IDResultDataPreconfTemplateSettingSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isMainPanel"
                  checked={row?.isMainPanel}
                  onChange={(event: any) => {
                    handleChange("isMainPanel", event.target.checked, row.id);
                  }}
                />
              </div>
            </div>
          </TableCell>
        ) : (
          <TableCell
          // id={`IDResultDataPreconfTemplateSettingSwitchCell_${row.templateId}`}
          >
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={row?.isMainPanel}
                  disabled={true}
                />
              </div>
            </div>
          </TableCell>
        )}
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
