import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import LoadButton from "../../../../Shared/Common/LoadButton";
import { Loader } from "../../../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";
import { styles, stylesResultData } from "../../../../Utils/Common";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";

const IDBatchQCExpandableRow = (props: {
  ControlsList: any;
  IDLISReportView: any;
  isPreviewing: any;
  fileId: any;
  value: any;
}) => {
  const { t } = useLang();

  const { fileId, ControlsList, IDLISReportView, isPreviewing, value } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qcControl, setQcControl] = useState<string | undefined>("both");
  const QCOnChange = (value: any) => {
    GetExpandDataById(value);
  };
  const [mControlsList, setMControlsList] = useState<any>(ControlsList);
  console.log(mControlsList, "mControlsList");

  const GetExpandDataById = (qcName: any) => {
    const obj = {
      qccontrolName: qcName,
      fileId: fileId,
    };
    //setLoading(true)
    RequisitionType.GetIDBatchQCExpandData(obj)
      .then((res: any) => {
        setMControlsList(res?.data?.data);
        setLoading(false);
        // setShow2(true)
        // handleClose2('dropdown1')
      })
      .catch((err: any) => {
        console.trace(err, "err");
        // setLoading(false)
      });
  };

  const SaveIdResultDataExpand = () => {
    setIsSubmitting(true);
    RequisitionType.SaveIdBatchQCExpand(mControlsList)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          GetExpandDataById(qcControl);
          setIsSubmitting(false);
          // loadData()
        }
      })
      .catch((err: any) => {
        setIsSubmitting(false);
        console.trace(err);
      });
  };

  const handleControlsFieldChange = (
    controlsIndex: any,
    field: any,
    value: any
  ) => {
    const updatedControlsList = [...ControlsList];
    const controlsToUpdate = updatedControlsList?.[controlsIndex];
    if (controlsToUpdate) {
      controlsToUpdate[field] = value;
      if (field == "tnp" && value == false) {
        setMainCheckboxes((pre: any) => {
          return {
            ...pre,
            controlCheckbox: false,
          };
        });
      }
    }

    setMControlsList(updatedControlsList);
  };

  const [mainCheckboxes, setMainCheckboxes] = useState({
    controlCheckbox: false,
    organismCheckbox: false,
    resistanceCheckbox: false,
  });
  const controlsDropDown = [
    {
      value: "Pass",
      label: "Pass",
    },
    {
      value: "Fail",
      label: "Fail",
    },
  ];
  const QcControlsDropDown = [
    {
      value: "ENTC",
      label: "ENTC",
    },
    {
      value: "PC",
      label: "PC",
    },
    {
      value: "Both",
      label: "Both",
    },
  ];
  let renderedControls: { [key: string]: boolean } = {};

  const dispatch = useDispatch();

  return (
    <div className="d-flex flex-column flex-column-fluid table-expend-sticky table-expend-sm-sticky">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-0">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid mb-container"
        >
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center px-4 min-h-40px">
                <h5 className="m-0 text-info">{t("Batch Controls")}</h5>
              </div>
              <div className="card-body py-md-4 py-3 px-4">
                <div className="d-flex mb-5 gap-2">
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="ID Batch QC"
                    permissionIdentifier="Preview"
                  >
                    <LoadButton
                      id={`IDBatchQcExpandPreviewButton`}
                      className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                      loading={isPreviewing}
                      btnText={t("Preview")}
                      loadingText={t("Previewing")}
                      onClick={() => IDLISReportView(fileId)}
                    />
                  </PermissionComponent>
                  {value == 0 ? (
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="ID Batch QC"
                      permissionIdentifier="SaveQCBatch"
                    >
                      <LoadButton
                        id={`IDBatchQcExpandSaveButton`}
                        className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                        loading={isSubmitting}
                        btnText={t("Save")}
                        loadingText={t("Saving")}
                        onClick={() => SaveIdResultDataExpand()}
                      />
                    </PermissionComponent>
                  ) : (
                    ""
                  )}
                </div>
                <div className="d-flex mb-5 gap-2 position-relative z-index-3">
                  <label>{t("Select Batch Control:")}</label>
                  <Select
                    inputId={`IDBatchQcExpandBatchControlSelect`}
                    menuPortalTarget={document.body}
                    theme={(theme: any) => styles(theme)}
                    className="bg-transparent"
                    placeholder={t("Select...")}
                    options={QcControlsDropDown}
                    value={QcControlsDropDown.filter(function (option: any) {
                      return option.value === qcControl;
                    })}
                    onChange={(e: any) => {
                      setQcControl(e?.value);
                      QCOnChange(e?.value);
                    }}
                  />
                </div>
                <div className="table_bordered overflow-hidden">
                  <TableContainer className="shadow-none">
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="plate-mapping-table mb-1"
                    >
                      <TableHead className="h-35px">
                        <TableRow>
                          <TableCell className="min-w-180px w-180px">
                            {t("Organism")}
                          </TableCell>

                          {/* <TableCell className="min-w-80px w-80px">
                            Combined Result
                          </TableCell> */}

                          <TableCell className="min-w-125px w-125px">
                            {t("Crt")}
                          </TableCell>

                          <TableCell className="min-w-125px w-125px">
                            {t("Amp Score")}
                          </TableCell>

                          {/* <TableCell className="min-w-125px w-125px">
                            Crt SD
                          </TableCell> */}

                          <TableCell className="min-w-125px w-125px">
                            {t("Cq Conf")}
                          </TableCell>

                          <TableCell className="min-w-125px w-125px">
                            {t("Results")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Combined Results")}
                          </TableCell>

                          {/* {value == 0 ? (
                            <TableCell className="min-w-125px w-125px">
                              <label className="fw-500">
                                <input
                              className="form-check-input"
                              type="checkbox"
                              checked={mainCheckboxes.controlCheckbox}
                              onChange={(e) =>
                                handleSetReRunControlsForAll(e.target.checked)
                              }
                            />
                                TNP
                              </label>
                            </TableCell>
                          ) : (
                            ''
                          )} */}

                          <TableCell className="min-w-250px">
                            {t("Comments")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={5} className="padding-0">
                            <Loader />
                          </TableCell>
                        ) : (
                          mControlsList?.map(
                            (data: any, controlsIndex: any) => (
                              <TableRow>
                                <TableCell
                                  id={`IDBatchQcExpandOrganism_${data.id}`}
                                >
                                  [{data?.qccontrolName}] {data?.testName}
                                </TableCell>

                                {/* <TableCell>
                                <select name="" className="form-select">
                                  <option className="fw-500 text-dark">
                                    Select...
                                  </option>
                                </select>
                                {data?.combinedResult}
                              </TableCell> */}
                                <TableCell>
                                  <input
                                    id={`IDBatchQcExpandCrtInput_${data.id}`}
                                    type="text"
                                    className="form-control bg-transparent"
                                    value={data?.ct}
                                    onChange={(e) =>
                                      handleControlsFieldChange(
                                        controlsIndex,
                                        "ct",
                                        e.target.value
                                      )
                                    }
                                    onKeyDown={(e: any) => {
                                      const regex = /^[0-9.]*$/;
                                      if (
                                        !(
                                          regex.test(e.key) ||
                                          e.key === "Backspace" ||
                                          e.key === "Tab"
                                        )
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    disabled={value == 0 ? false : true}
                                  />
                                </TableCell>

                                <TableCell>
                                  <input
                                    id={`IDBatchQcExpandAmpScoreInput_${data.id}`}
                                    type="text"
                                    className="form-control bg-transparent"
                                    value={data?.ampscore}
                                    onChange={(e) =>
                                      handleControlsFieldChange(
                                        controlsIndex,
                                        "ampscore",
                                        e.target.value
                                      )
                                    }
                                    disabled={value == 0 ? false : true}
                                  />
                                </TableCell>

                                {/* <TableCell>
                                <input
                                  type="text"
                                  className="form-control bg-transparent"
                                  value={data?.crtSD}
                                />
                              </TableCell> */}

                                <TableCell>
                                  <input
                                    id={`IDBatchQcExpandCqConf_${data.id}`}
                                    type="text"
                                    className="form-control bg-transparent"
                                    value={data?.cqConf}
                                    onChange={(e) =>
                                      handleControlsFieldChange(
                                        controlsIndex,
                                        "cqConf",
                                        e.target.value
                                      )
                                    }
                                    disabled={value == 0 ? false : true}
                                  />
                                </TableCell>

                                <TableCell
                                  id={`IDBatchQcExpandResults_${data.id}`}
                                >
                                  {data?.result}
                                </TableCell>
                                <TableCell>
                                  {(mControlsList?.filter(
                                    (obj: any) => obj.testName === data.testName
                                  )).length > 1 ? (
                                    renderedControls[data.testName] ? null : (
                                      <>
                                        <Select
                                          inputId={`IDBatchQcExpandCombinedResult_${data.id}`}
                                          menuPortalTarget={document.body}
                                          theme={(theme) =>
                                            stylesResultData(theme)
                                          }
                                          placeholder={t("Select...")}
                                          className="bg-transparent"
                                          options={controlsDropDown}
                                          value={controlsDropDown.filter(
                                            function (option: any) {
                                              return (
                                                option.value ===
                                                data?.combinedResult
                                              );
                                            }
                                          )}
                                          onChange={(e) =>
                                            handleControlsFieldChange(
                                              controlsIndex,
                                              "combinedResult",
                                              e?.value
                                            )
                                          }
                                        />
                                        {
                                          (renderedControls[data.testName] =
                                            true)
                                        }{" "}
                                      </>
                                    )
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                {/* {value == 0 ? (
                                  <TableCell>
                                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={data?.tnp}
                                        value={data?.tnp}
                                        onChange={(e) =>
                                          handleControlsFieldChange(
                                            controlsIndex,
                                            'tnp',
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    </label>
                                  </TableCell>
                                ) : (
                                  ''
                                )} */}

                                <TableCell>
                                  <input
                                    id={`IDBatchQcExpandComments_${data.id}`}
                                    type="text"
                                    className="form-control bg-transparent"
                                    value={data?.comments}
                                    onChange={(e) =>
                                      handleControlsFieldChange(
                                        controlsIndex,
                                        "comments",
                                        e?.target?.value
                                      )
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDBatchQCExpandableRow;
