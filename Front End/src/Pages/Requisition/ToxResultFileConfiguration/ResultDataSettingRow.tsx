import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
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
  setCheck: any;
  buttonClicked: any;
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
    setCheck,
    buttonClicked,
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
                    <button className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleSubmit(inner);
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
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
                  id="dropdown-button-drop-end"
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  {inner?.isActive ? (
                    <>
                      <PermissionComponent
                        moduleName="TOX LIS"
                        pageName="Result Data Pre-Configuration"
                        permissionIdentifier="Edit"
                      >
                        <Dropdown.Item eventKey="3" className="w-auto">
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
                        moduleName="TOX LIS"
                        pageName="Requisition Type"
                        permissionIdentifier="Inactive"
                      >
                        <Dropdown.Item eventKey="3" className="w-auto">
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
                      moduleName="TOX LIS"
                      pageName="Requisition Type"
                      permissionIdentifier="Active"
                    >
                      <Dropdown.Item eventKey="3" className="w-auto">
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
        <TableCell scope="inner">
          {inner?.rowStatus ? (
            <>
              <div className="required d-flex">
                <select
                  name="labId"
                  className={`form-control min-w-250px w-100 rounded-2 fs-8 h-33px ${
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
        <TableCell scope="inner">
          {inner?.rowStatus ? (
            <>
              <div className="required d-flex">
                <select
                  name="panelId"
                  className={`form-control min-w-250px w-100 rounded-2 fs-8 h-33px ${
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
        <TableCell>
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
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
        <TableCell>
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
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
        <TableCell>
          {inner?.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
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
        <TableCell className="text-center">
          {" "}
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
