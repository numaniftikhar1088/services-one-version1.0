import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Status from "Shared/Common/Status";

const ResultFileUploadGrid = (props: {
  searchRequest: any;
  searchQuery: any;
  loading: boolean;
  ResultFileUploadList: any;
  setResultFileUploadList: any;
  handleAllSelect: any;
  handleChangeRequisitionIds: any;
  selectedBox: any;
  ShowBlob: any;
  handleClickOpen2: any;
  GetLogsById: any;
  tabPanel: any;
  searchRef: any;
  handleSort: any;
  sort: any;
  handleKeyPress: any;
}) => {
  const {
    searchRequest,
    searchQuery,
    loading,
    ResultFileUploadList,
    setResultFileUploadList,
    handleAllSelect,
    handleChangeRequisitionIds,
    selectedBox,
    ShowBlob,
    handleClickOpen2,
    GetLogsById,
    tabPanel,
    searchRef,
    handleSort,
    sort,
    handleKeyPress,
  } = props;

  const { t } = useLang();

  // ********** Dropdown START **********
  const [statusLookup, setStatusLookup] = useState([]);
  const GetFileStatusLookupID = () => {
    RequisitionType.GetFileStatusLookupID()
      .then((res: any) => {
        setStatusLookup(res.data);
      })
      .catch((err: AxiosError) => {
        console.log(err, "bulk request failure");
      });
  };
  useEffect(() => {
    GetFileStatusLookupID();
  }, []);
  const dispatch = useDispatch();
  return (
    <>
      <TableHead>
        <TableRow className="h-40px">
          {tabPanel == "1" ? <TableCell></TableCell> : null}
          <TableCell>
            <input
              id={`IdResultFileFileName`}
              type="text"
              name="fileName"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Search ...")}
              value={searchRequest.fileName}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <input
              id={`IdResultFileUploadDate`}
              type="text"
              name="uploadedDate"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Search ...")}
              value={searchRequest.uploadedDate}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <select
              id={`IdResultFileStatus`}
              name="status"
              value={searchRequest.status}
              className="form-select rounded-2 fs-8 h-30px py-2"
              data-kt-select2="true"
              data-placeholder={t("Select option")}
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-allow-clear="true"
              onChange={searchQuery}
            >
              <option className="fw-500 text-dark">{t("Select...")}</option>
              {statusLookup?.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </TableCell>
          <TableCell>
            <input
              id={`IdResultFileUploadedBy`}
              type="text"
              name="uploadedBy"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Search ...")}
              value={searchRequest.uploadedBy}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
        </TableRow>
        <TableRow className="h-30px">
          {tabPanel == "1" ? (
            <TableCell style={{ width: "49px" }}>
              <label className="form-check form-check-sm form-check-solid">
                <input
                  id={`IdResultFileCheckAllCheckBox`}
                  className="form-check-input"
                  type="checkbox"
                  onChange={(e) =>
                    handleAllSelect(e.target.checked, ResultFileUploadList)
                  }
                />
              </label>
            </TableCell>
          ) : null}
          <TableCell
            className="min-w-250px w-250px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("fileName")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("File Name")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "fileName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "fileName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell className="min-w-125px">{t("Download File")}</TableCell>
          <TableCell className="min-w-80px w-80px">{t("View File")}</TableCell>
          <TableCell className="min-w-80px w-80px">{t("Log File")}</TableCell>
          <TableCell
            className="min-w-100px w-100px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("fileDataType")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("File Type")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "fileDataType"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "fileDataType"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell
            className="min-w-100px w-100px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("uploadedDate")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Date")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "uploadedDate"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "uploadedDate"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell
            className="min-w-60px w-60px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("uploadedTime")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Time")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "uploadedTime"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "uploadedTime"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell
            className="min-w-100px w-100px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("status")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Status")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "status"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "status"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>

          <TableCell
            className="min-w-150px w-150px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("uploadedBy")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Uploaded By")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "uploadedBy"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "uploadedBy"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableCell colSpan={10} className="padding-0">
            <Loader />
          </TableCell>
        ) : (
          ResultFileUploadList?.map((item: any) => (
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
              {tabPanel == "1" ? (
                <TableCell>
                  <label className="form-check form-check-sm form-check-solid">
                    <input
                      id={`IdResultFileCheckBox_${item.id}`}
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedBox?.id?.includes(item?.id)}
                      onChange={(e) =>
                        handleChangeRequisitionIds(e.target.checked, item.id)
                      }
                    />
                  </label>
                </TableCell>
              ) : null}

              <TableCell id={`IdResultFileName_${item.id}`}>
                {item?.fileName}
              </TableCell>
              {/* {item?.downloadFile == true ? (
                <>
                  <TableCell className="fas fa-download">
                    {item?.downloadFile}
                  </TableCell>
                </>
              ) : null} */}

              <TableCell className="text-center">
                <PermissionComponent
                  moduleName="ID LIS"
                  pageName="Result File"
                  permissionIdentifier="DownloadFile"
                >
                  <button
                    id={`IdResultFileDownload_${item.id}`}
                    className="btn btn-icon btn-sm fw-bold btn-success btn-icon-light"
                    disabled={item.azureLink == null ? true : false}
                    onClick={() => ShowBlob(item.azureLink)}
                  >
                    <i className="fa fa-download"></i>
                  </button>
                </PermissionComponent>
              </TableCell>
              <TableCell className="text-center">
                <PermissionComponent
                  moduleName="ID LIS"
                  pageName="Result File"
                  permissionIdentifier="ViewFile"
                >
                  <Link to={`/docs-viewer`} target="_blank">
                    <button
                      id={`IdResultFileView_${item.id}`}
                      className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light"
                      onClick={() => {
                        dispatch(savePdfUrls(item.azureLink));
                      }}
                    >
                      <i className="fa fa-eye cursor-pointer"></i>
                    </button>
                  </Link>
                </PermissionComponent>
                {/* <button
                  className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light"
                  disabled={item.azureLink == null ? true : false}
                  onClick={() => ShowBlob(item.azureLink)}
                >
                  <i className="fa fa-eye"></i>
                </button> */}
              </TableCell>
              <TableCell
                id={`IdResultFileLogFile_${item.id}`}
                className="text-center"
              >
                {item?.status?.trim().toLowerCase() == "fail" ? (
                  <button
                    id={`IdResultFileLogFile_${item.id}`}
                    className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
                    // disabled={item.logFile == null ? true : false}
                    onClick={() => GetLogsById(item?.id)}
                  >
                    <i className="fa fa-key"></i>
                  </button>
                ) : null}
              </TableCell>
              <TableCell id={`IdResultFileDataType_${item.id}`}>
                {item?.fileDataType}
              </TableCell>
              <TableCell id={`IdResultFileUploadedDate_${item.id}`}>
                {item?.uploadedDate}
              </TableCell>
              <TableCell id={`IdResultFileUploadedTime_${item.id}`}>
                {item?.uploadedTime}
              </TableCell>
              <>
                <TableCell
                  id={`IdResultFileStatus_${item.id}`}
                  sx={{ width: "max-content", textAlign: "center" }}
                >
                  <Status
                    cusText={item?.status}
                    cusClassName={
                      item?.status === t("Success")
                        ? "badge-status-success"
                        : item?.status === t("Invalid Format")
                        ? "badge-status-invalid-format"
                        : item?.status === t("Pending")
                        ? "badge-status-pending"
                        : item?.status === t("Fail")
                        ? "badge-status-fail"
                        : "badge-status-default"
                    }
                  />
                </TableCell>
              </>
              <TableCell id={`IdResultFileUploadedBy_${item.id}`}>
                {item?.uploadedBy}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </>
  );
};

export default ResultFileUploadGrid;
