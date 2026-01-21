import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import moment from "moment";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

const BulkPatientUploadGrid = (props: {
  searchRequest: any;
  searchQuery: any;
  loading: boolean;
  PatientFileUploadList: any;
  ShowBlob: any;
  GetLogsById: any;
  searchRef: any;
  handleSort: any;
  sort: any;
  handleKeyPress: any;
  statusDropdown: any;
}) => {
  const {
    searchRequest,
    searchQuery,
    loading,
    PatientFileUploadList,
    ShowBlob,
    GetLogsById,
    searchRef,
    handleSort,
    sort,
    handleKeyPress,
    statusDropdown,
  } = props;

  const { t } = useLang();

  return (
    <>
      <TableHead>
        <TableRow className="h-40px">
          <TableCell>
            <input
              id={`BulkPatientUploadSearchFileName`}
              type="text"
              name="fileName"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
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
              id={`BulkPatientUploadSearchFacilityName`}
              type="text"
              name="facilityName"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.facilityName}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
          <TableCell className="min-w-150px w-150px">
            <SearchDatePicker
              name="uploadedDate"
              value={searchRequest.uploadedDate}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <select
              id={`BulkPatientUploadSearchStatus`}
              name="status"
              value={searchRequest.status}
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 py-2 ps-2"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-allow-clear="true"
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            >
              <option className="fw-500 text-dark">{t("Select...")}</option>
              {statusDropdown?.map((option: any) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </TableCell>
          <TableCell>
            <input
              id={`BulkPatientUploadSearchUploadedBy`}
              type="text"
              name="uploadedBy"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
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
          <TableCell className="min-w-125px w-125px">
            {t("Download File")}
          </TableCell>
          <TableCell className="min-w-80px w-80px">{t("Log File")}</TableCell>
          <TableCell
            className="min-w-100px w-100px"
            sx={{ width: "max-content" }}
          >
            <div
              onClick={() => handleSort("facilityName")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Facility")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "facilityName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "facilityName"
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
        ) : !PatientFileUploadList.length ? (
          <NoRecord colSpan={8} />
        ) : (
          PatientFileUploadList?.map((item: any) => (
            <TableRow
              sx={{ "& > *": { borderBottom: "unset" } }}
              className="h-30px"
            >
              <TableCell id={`BulkPatientUploadFileName${item?.id}`}>
                {item?.fileName}
              </TableCell>
              <TableCell
                id={`BulkPatientUploadDownload_${item?.id}`}
                className="text-center"
              >
                <PermissionComponent
                  moduleName="Patient"
                  pageName="Bulk Patient Upload"
                  permissionIdentifier="Download"
                >
                  <button
                    id={`BulkPatientUploadDownload_${item?.id}`}
                    className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light"
                    disabled={item.azureLink == null ? true : false}
                    onClick={() => ShowBlob(item.azureLink)}
                  >
                    <i className="bi bi-download"></i>
                  </button>
                </PermissionComponent>
              </TableCell>
              <TableCell className="text-center">
                {item?.status?.trim().toLowerCase() == "fail" ? (
                  <button
                    id={`BulkPatientUploadLogFile_${item?.id}`}
                    className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
                    // disabled={item.logFile == null ? true : false}
                    onClick={() => GetLogsById(item?.id)}
                  >
                    <i className="fa fa-key"></i>
                  </button>
                ) : null}
              </TableCell>
              <TableCell id={`BulkPatientUploadFacilityName_${item?.id}`}>
                {item?.facilityName}
              </TableCell>
              <TableCell id={`BulkPatientUploadUploadDate_${item?.id}`}>
                {item?.uploadedDate}
              </TableCell>
              <TableCell id={`BulkPatientUploadUploadTime_${item?.id}`}>
                {item?.uploadedTime}
              </TableCell>
              <TableCell id={`BulkPatientUploadStatus_${item?.id}`}>
                {item?.status}
              </TableCell>
              <TableCell id={`BulkPatientUploadUploadedBy_${item?.id}`}>
                {item?.uploadedBy}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </>
  );
};

export default BulkPatientUploadGrid;
