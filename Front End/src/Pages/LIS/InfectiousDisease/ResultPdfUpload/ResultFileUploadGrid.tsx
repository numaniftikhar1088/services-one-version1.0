import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { savePdfUrls } from "Redux/Actions/Index";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { Loader } from "Shared/Common/Loader";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import NoRecord from "Shared/Common/NoRecord";

const ResultFileUploadGrid = (props: {
  searchRequest: any;
  searchQuery: any;
  loading: boolean;
  ResultFileUploadList: any;
  ShowBlob: any;
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
    ShowBlob,
    searchRef,
    handleSort,
    sort,
    handleKeyPress,
  } = props;

  const { t } = useLang();
  const dispatch = useDispatch();

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

  return (
    <>
      <TableHead>
        <TableRow className="h-40px">
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
          <TableCell className="min-w-80px w-80px">
            {t("Download File")}
          </TableCell>
          <TableCell className="min-w-80px w-80px">{t("View File")}</TableCell>
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
        ) : ResultFileUploadList?.length ? (
          ResultFileUploadList?.map((item: any) => (
            <TableRow key={item.id} className="h-40px">
              <TableCell id={`IdResultPdfFileName_${item.id}`}>
                {item?.fileName}
              </TableCell>
              <TableCell className="text-center">
                <PermissionComponent
                  moduleName="ID LIS"
                  pageName="Result Upload PDF"
                  permissionIdentifier="Download"
                >
                  <button
                    id={`IdResultFileDownload_${item.id}`}
                    className="btn btn-icon btn-sm fw-bold btn-success btn-icon-light"
                    disabled={item.azureLink === null ? true : false}
                    onClick={() => ShowBlob(item.azureLink)}
                  >
                    <i className="fa fa-download"></i>
                  </button>
                </PermissionComponent>
              </TableCell>
              <TableCell className="text-center">
                <PermissionComponent
                  moduleName="ID LIS"
                  pageName="Result Upload PDF"
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
        ) : (
          <NoRecord colSpan={7} />
        )}
      </TableBody>
    </>
  );
};

export default ResultFileUploadGrid;
