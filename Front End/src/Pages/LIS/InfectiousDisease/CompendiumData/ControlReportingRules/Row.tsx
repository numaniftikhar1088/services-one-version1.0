import { Box, Collapse, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo, useState } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputMask from "react-input-mask";
import Select from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { ampStatusDropdown } from ".";
import ControlReportingRuleService from "../../../../../Services/InfectiousDisease/ControlReportingRulesService";
import Radio from "../../../../../Shared/Common/Input/Radio";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../../Shared/Icons";
import { defaultSearchQuery } from "../PharmDPreference";
import PanelAssignment from "./PanelAssignment";

export interface ControlReportingRulesRow {
  id: number;
  qcControlName: string;
  qcControlType: string;
  fail: string;
  pass: string;
  undeterminedResult: boolean;
  rowStatus: boolean | undefined;
  cqConf: number;
  ampStatus: string;
  controlCode: string;
  ampScore: string;
}

const Row = (props: {
  row: ControlReportingRulesRow;
  rows: any;
  setRows: any;
  index: number;
  loadGridData: Function;
  setIsAddButtonDisabled: any;
  panels: Record<number, string>;
  compendiumReportingRules: any;
  setCompendiumReportingRules: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    loadGridData,
    setIsAddButtonDisabled,
    panels,
    compendiumReportingRules,
    setCompendiumReportingRules,
  } = props;

  const { t } = useLang();

  const [addOpen, setAddOpen] = React.useState(true);
  const [sports2, setSports2] = useState<any>([]);
  const [selectedPanels, setSelectedPanels] = useState<any>([]);
  const [openPanels, setOpenPanels] = useState<any>({
    id: "",
    isOpen: false,
  });

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });

      setRows(updatedRows);
      setCompendiumReportingRules({
        ...r,
        undeterminedResult: JSON.stringify(r.undeterminedResult),
      });

      let filteredSelectedPanel = (row as any)?.panels.map((row: any) => ({
        id: row.panelId,
        facilityName: row.panelName,
      }));

      setSports2(filteredSelectedPanel);
    }
  };

  const handleSubmit = async () => {
    const isValidField = (value: string) => value && value.trim().length > 0;

    const isValidPassFormat = (value: string) =>
      /^\d{2}\.\d{2}-\d{2}\.\d{2}$/.test(value);

    const isValidFailFormat = (value: string) =>
      /^(\d{2}\.\d{2}-\d{2}\.\d{2})(,\d{2}\.\d{2}-\d{2}\.\d{2})?$/.test(value);

    const panels = sports2
      .filter((item: any) => Object.values(item).some((val) => val !== null))
      .map((item: any) => ({
        panelId: item?.id,
        panelName: item?.facilityName,
      }));

    const { qcControlName, qcControlType, fail, pass, undeterminedResult } =
      compendiumReportingRules;

    if (
      !isValidField(qcControlName) ||
      !isValidField(qcControlType) ||
      !isValidField(fail) ||
      !isValidField(pass) ||
      !isValidField(undeterminedResult) ||
      !panels.length
    ) {
      toast.error(t("Please enter all required fields."));
      return;
    }

    if (!isValidFailFormat(fail)) {
      toast.error(t("Invalid format. Expected: Fail: 99.99-99.99,99.99-99.99"));
      return;
    }

    if (!isValidPassFormat(pass)) {
      toast.error(t("Invalid format. Expected: Pass: 99.99-99.99"));
      return;
    }

    const submittedResults = {
      ...compendiumReportingRules,
      undeterminedResult: JSON.parse(undeterminedResult),
      panels,
    };

    try {
      const response =
        await ControlReportingRuleService.saveControlReportingRules(
          submittedResults
        );

      if (response?.data?.httpStatusCode === 200) {
        toast.success(response?.data?.message);
        loadGridData(true, false);
        setCompendiumReportingRules(defaultSearchQuery);
      } else if (response?.data?.httpStatusCode === 409) {
        toast.error(response?.data?.error);
      }
    } catch (error) {
      toast.error(t("Something went wrong while saving data."));
    }
  };

  const setInputValues = (event: any) => {
    setCompendiumReportingRules((prevValue: any) => ({
      ...prevValue,
      [event.target.name]:
        event.target.name === "cqConf"
          ? event.target.value === ""
            ? 0
            : parseFloat(event.target.value) || 0
          : event.target.value,
    }));
  };

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setAddOpen(!addOpen)}
            >
              {addOpen ? (
                <button
                  id="IDCompendiumDataControlReportingRuleAddExpandClose"
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id="IDCompendiumDataControlReportingRuleAddExpandShow"
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpenPanels((prevVal: any) => ({
                  id: row.id,
                  isOpen: !prevVal.isOpen,
                }));
                setSports2((row as any).panels);
              }}
            >
              {openPanels.isOpen ? (
                <button
                  id={`IDCompendiumDataControlReportingRuleExpandClose_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`IDCompendiumDataControlReportingRuleExpandOpen_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  <button
                    id={`IDCompendiumDataControlReportingRuleSaveRow`}
                    onClick={handleSubmit}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    id={`IDCompendiumDataControlReportingRuleCancelSaveRow`}
                    onClick={() => {
                      if (row.id != 0) {
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
                      setCompendiumReportingRules(defaultSearchQuery);
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
                  id={`IDCompendiumDataControlReportingRule3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`IDCompendiumDataControlReportingRuleEdit`}
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
          id={`IDCompendiumDataControlReportingRuleQcControlName_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataControlReportingRuleQcControlName}`}
                  type="text"
                  name="qcControlName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Reporting Rule Name")}
                  value={compendiumReportingRules?.qcControlName}
                  onChange={setInputValues}
                  required={true}
                />
              </div>
            </div>
          ) : (
            <span>{row?.qcControlName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRuleControlCode_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataControlReportingRuleControlCode`}
                  type="text"
                  name="controlCode"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Control Code")}
                  value={compendiumReportingRules?.controlCode}
                  onChange={setInputValues}
                />
              </div>
            </div>
          ) : (
            <span>{row?.controlCode}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRule_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <>
              <span className="required"></span>
              <Radio
                label=""
                name="qcControlType"
                onChange={setInputValues}
                choices={[
                  {
                    id: "RadioIndividual",
                    label: t("Individual"),
                    value: t("individual"),
                  },
                  {
                    id: "RadioBatch",
                    label: t("Batch"),
                    value: t("batch"),
                  },
                ]}
                checked={compendiumReportingRules.qcControlType}
              />
            </>
          ) : (
            <span className="text-capitalize">{row?.qcControlType}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRuleFail_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <InputMask
                  mask="99.99-99.99,99.99-99.99"
                  name="fail"
                  onChange={setInputValues}
                  value={compendiumReportingRules?.fail}
                  placeholder="99.99-99.99,99.99-99.99"
                  className="form-control bg-white min-w-150px w-150px rounded-2 fs-8 h-30px"
                />
              </div>
            </div>
          ) : (
            <span>{row?.fail}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRulePass_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <InputMask
                  mask="99.99-99.99"
                  name="pass"
                  onChange={setInputValues}
                  value={compendiumReportingRules?.pass}
                  placeholder="99.99-99.99"
                  className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-30px"
                />
              </div>
            </div>
          ) : (
            <span>{row?.pass}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRuleCqConf_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="w-100">
              <input
                id={`IDCompendiumDataControlReportingRuleCqConf`}
                type="number"
                name="cqConf"
                className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-30px"
                placeholder={t("CqConf")}
                value={
                  compendiumReportingRules?.cqConf === 0
                    ? ""
                    : compendiumReportingRules?.cqConf
                }
                onChange={setInputValues}
                required={true}
              />
            </div>
          ) : (
            <span>{row?.cqConf === 0 ? "" : row?.cqConf}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRuleAmpStatus_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="w-100">
              <Select
                inputId="IDCompendiumDataPanelMapingPerformingLab"
                menuPortalTarget={document.body}
                className="my-1"
                theme={(theme) => styles(theme)}
                placeholder={t("Select...")}
                options={ampStatusDropdown}
                styles={reactSelectSMStyle}
                onChange={(event: any) => {
                  setCompendiumReportingRules((prevValue: any) => ({
                    ...prevValue,
                    ampStatus: event?.value,
                  }));
                }}
                value={ampStatusDropdown.filter(function (option: any) {
                  return option.value === compendiumReportingRules?.ampStatus;
                })}
              />
            </div>
          ) : (
            <span>{row?.ampStatus}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRuleAmpScore_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="w-100">
              <input
                id={`IDCompendiumDataControlReportingRuleAmpScore_${row.id}`}
                type="text"
                name="ampScore"
                className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-30px"
                placeholder={t("Amp Score")}
                value={compendiumReportingRules?.ampScore || ""}
                onChange={setInputValues}
                required={true}
              />
            </div>
          ) : (
            <span>{row?.ampScore}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataControlReportingRuleUndetermined_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <>
              <span className="required"></span>
              <Radio
                label=""
                name="undeterminedResult"
                onChange={setInputValues}
                choices={[
                  {
                    id: "RadioFail",
                    label: t("Fail"),
                    value: "false",
                  },
                  {
                    id: "RadioPass",
                    label: t("Pass"),
                    value: "true",
                  },
                ]}
                checked={compendiumReportingRules.undeterminedResult}
              />
            </>
          ) : (
            <span className="text-capitalize">
              {row?.undeterminedResult === false ? "fail" : "pass"}
            </span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={13} className="padding-0">
          <Collapse
            in={row.rowStatus ? addOpen : false}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <PanelAssignment
                        sports2={sports2}
                        facilities={panels}
                        setSports2={setSports2}
                        selectedPanels={selectedPanels}
                        setSelectedPanels={setSelectedPanels}
                      />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow key={row.id}>
        <TableCell colSpan={8} className="padding-0">
          <Collapse in={openPanels.isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-5 py-2">
                    <h5 className="text-primary fw-700">
                      {t("Selected Panels")}
                    </h5>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xl-12 d-flex flex-wrap gap-2">
                      {sports2?.map((i: any) => (
                        <div
                          className="badge badge-secondary round-2 py-2 my-2 fs-7"
                          key={i?.panelId}
                        >
                          {capitalizeFirstLetter(i?.panelName || "")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
