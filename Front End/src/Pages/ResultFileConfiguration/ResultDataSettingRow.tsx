import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../Shared/Icons";
export interface ITableObj {
  templateId: number;
  labId: number;
  labName: string;
  rowStatus: boolean;
}
const ResultDataSettingRow = (props: {
  inner: any;
  handleSwitchChange: any;
  resultData: any;
  setResultData: any;
  index: number;
  handleSubmit: any;
  handleChange: any;
  setErrors: any;
  errors: any;
  request: any;
  setRequest: any;
  check: any;
  setButtonClicked: any;
  dropDownValues: any;
  dropDownPanelValues: any;
  loadGridData: any;
}) => {
  const {
    inner,
    handleSwitchChange,
    resultData,
    setResultData,
    index,
    handleSubmit,
    handleChange,
    setErrors,
    errors,
    request,
    setRequest,
    check,
    setButtonClicked,
    dropDownValues,
    dropDownPanelValues,
    loadGridData,
  } = props;

  const { t } = useLang();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const updatedRows = resultData?.map((inner: any) => {
        if (inner.id === r.id) {
          return { ...inner, rowStatus: true };
        }
        return inner;
      });
      setResultData(updatedRows);
    }
  };
  const statusChange = async (id: number) => {
    await RequisitionType.ChangeStatusPreConfiguration(id)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
        }
      })
      .catch((err: string) => {
        // setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <TableRow key={inner?.labName}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {inner?.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request && check ? (
                    <button id={`IDResultDataPreconfResultDataSettingLoadButton`} className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`IDResultDataPreconfResultDataSettingSave`}
                      onClick={() => {
                        handleSubmit(inner);
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`IDResultDataPreconfResultDataSettingCancel`}
                    onClick={() => {
                      if (inner.id != 0) {
                        const updatedRows = resultData?.map((r: any) => {
                          if (r.id === inner.id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setResultData(updatedRows);
                        loadGridData(true, false);
                      } else {
                        let newArray = [...resultData];
                        newArray.splice(index, 1);
                        setResultData(newArray);
                        setErrors(false);
                        setRequest(false);
                        setButtonClicked(false);
                      }
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
                  id={`IDResultDataPreconfResultDataSetting3Dots_${inner.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  {inner?.isActive ? (
                    <>
                      <PermissionComponent
                        moduleName="ID LIS"
                        pageName="Result Data Pre-Configuration"
                        permissionIdentifier="Edit"
                      >
                        <Dropdown.Item
                          id={`IDResultDataPreconfResultDataSettingEdit_${inner.id}`}
                          eventKey="3"
                          className="w-auto"
                        >
                          <div
                            onClick={() => getValues(inner, "Edit")}
                            className="menu-item px-3"
                          >
                            <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                            {t("Edit")}
                          </div>
                        </Dropdown.Item>
                      </PermissionComponent>
                      <PermissionComponent
                        moduleName="ID LIS"
                        pageName="Result Data Pre-Configuration"
                        permissionIdentifier="Inactive"
                      >
                        <Dropdown.Item
                          id={`IDResultDataPreconfResultDataSettingInactive_${inner.id}`}
                          eventKey="3"
                        >
                          <div
                            onClick={() => statusChange(inner?.id)}
                            className="menu-item px-3"
                          >
                            <i
                              className="fa fa-ban text-danger mr-2"
                              aria-hidden="true"
                            ></i>
                            {t("InActive")}
                          </div>
                        </Dropdown.Item>
                      </PermissionComponent>
                    </>
                  ) : (
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="Result Data Pre-Configuration"
                      permissionIdentifier="Active"
                    >
                      <Dropdown.Item
                        id={`IDResultDataPreconfResultDataSettingActive_${inner.id}`}
                        eventKey="3"
                      >
                        <div
                          onClick={() => statusChange(inner?.id)}
                          className="menu-item px-3"
                        >
                          <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                          {t("Active")}
                        </div>
                      </Dropdown.Item>
                    </PermissionComponent>
                  )}
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfResultDataSettingLabName_${inner.id}`}
          scope="inner"
        >
          {inner?.rowStatus ? (
            <>
              <div className="required d-flex">
                <select
                  id={`IDResultDataPreconfResultDataSettingLabName`}
                  name="labId"
                  className={`form-control min-w-100px w-100 rounded-2 fs-8 h-30px ${
                    inner?.id ? "bg-gray" : "bg-white"
                  } mb-3 mb-lg-0`}
                  value={inner?.labId}
                  disabled={inner?.id ? true : false}
                  onChange={(e) =>
                    handleChange("labId", e?.target?.value, inner?.id)
                  }
                >
                  <option value="">{t("Select a Lab")}</option>
                  {dropDownValues?.referenceLab?.map((option: any) => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors === true ? (
                <span style={{ color: "red" }}>{t("Fill Required Field")}</span>
              ) : null}
            </>
          ) : (
            <span className="px-2">{inner?.labName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfResultDataSettingPanel_${inner.id}`}
          scope="inner"
        >
          {inner?.rowStatus ? (
            <>
              <div className="required d-flex">
                <select
                  id={`IDResultDataPreconfResultDataSettingPanel`}
                  name="panelId"
                  className={`form-control min-w-100px w-100 rounded-2 fs-8 h-30px ${
                    inner?.id ? "bg-gray" : "bg-white"
                  } mb-3 mb-lg-0`}
                  value={inner?.panelId}
                  disabled={inner?.id ? true : false}
                  onChange={(e) =>
                    handleChange("panelId", e?.target?.value, inner?.id)
                  }
                >
                  <option value="">{t("Select a Panel")}</option>
                  {dropDownPanelValues?.referencePanel?.map((option: any) => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors === true ? (
                <span style={{ color: "red" }}>{t("Fill Required Field")}</span>
              ) : null}
            </>
          ) : (
            <span className="px-2">{inner?.panelName}</span>
          )}
        </TableCell>
        <TableCell id={`IDResultDataPreconfResultDataSettinggnCT_${inner.id}`}>
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`IDResultDataPreconfResultDataSettingCTSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnCt"
                  checked={inner?.calculationOnCt}
                  onChange={() =>
                    handleSwitchChange(
                      inner.id,
                      "calculationOnCt",
                      !inner?.calculationOnCt
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnCt"
                  checked={inner?.calculationOnCt}
                  disabled={true}
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfResultDataSettingAmpScore_${inner.id}`}
        >
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`IDResultDataPreconfResultDataSettingAmpScoreSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnAmpScore"
                  checked={inner?.calculationOnAmpScore}
                  onChange={() =>
                    handleSwitchChange(
                      inner.id,
                      "calculationOnAmpScore",
                      !inner?.calculationOnAmpScore
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnAmpScore"
                  checked={inner?.calculationOnAmpScore}
                  disabled={true}
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfResultDataSettingCqConf_${inner.id}`}
        >
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`IDResultDataPreconfResultDataSettingCqConfSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnCqConf"
                  checked={inner?.calculationOnCqConf}
                  onChange={() =>
                    handleSwitchChange(
                      inner.id,
                      "calculationOnCqConf",
                      !inner?.calculationOnCqConf
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnCqConf"
                  checked={inner?.calculationOnCqConf}
                  disabled={true}
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfResultDataSettingAmpStatus_${inner.id}`}
        >
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`IDResultDataPreconfResultDataSettingAmpStatusSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnAmpStatus"
                  checked={inner?.calculationOnAmpStatus}
                  onChange={() =>
                    handleSwitchChange(
                      inner.id,
                      "calculationOnAmpStatus",
                      !inner?.calculationOnAmpStatus
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnAmpStatus"
                  checked={inner?.calculationOnAmpStatus}
                  disabled={true}
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell id={`IDResultDataPreconfResultDataSettingRox_${inner.id}`}>
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`IDResultDataPreconfResultDataSettingRoxSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnRoxSignal"
                  checked={inner?.calculationOnRoxSignal}
                  onChange={() =>
                    handleSwitchChange(
                      inner.id,
                      "calculationOnRoxSignal",
                      !inner?.calculationOnRoxSignal
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnRoxSignal"
                  checked={inner?.calculationOnRoxSignal}
                  disabled={true}
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell id={`IDResultDataPreconfResultDataSettingTAI_${inner.id}`}>
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`IDResultDataPreconfResultDataSettingTAISwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnTaiScore"
                  checked={inner?.calculationOnTaiScore}
                  onChange={() =>
                    handleSwitchChange(
                      inner.id,
                      "calculationOnTaiScore",
                      !inner?.calculationOnTaiScore
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="calculationOnTaiScore"
                  checked={inner?.calculationOnTaiScore}
                  disabled={true}
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfResultDataSettingActive_InActive_${inner.id}`}
          className="text-center"
        >
          {inner?.isActive ? (
            <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
          ) : (
            <i className="fa fa-ban text-danger mr-2 w-20px"></i>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default ResultDataSettingRow;
