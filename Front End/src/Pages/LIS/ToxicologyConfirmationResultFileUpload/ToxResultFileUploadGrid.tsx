import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
const ToxResultFileUploadGrid = (props: {
  searchRequest: any;
  searchQuery: any;
  loading: boolean;
  ResultFileUploadList: any;
  setResultFileUploadList: any;
  ShowBlob: any;
  GetLogsById: any;
  searchRef: any;
  handleSort: any;
  sort: any;
  handleKeyPress: any;
  specimenTypeLookup: any;
  setSearchRequest: any;
}) => {
  const {
    searchRequest,
    searchQuery,
    loading,
    ResultFileUploadList,
    ShowBlob,
    GetLogsById,
    searchRef,
    handleSort,
    sort,
    handleKeyPress,
    specimenTypeLookup,
    setSearchRequest,
  } = props;

  const { t } = useLang();

  // ********** Dropdown START **********
  const [statusLookup, setStatusLookup] = useState([]);
  const GetFileStatusLookup = () => {
    RequisitionType.GetFileStatusLookup()
      .then((res: any) => {
        setStatusLookup(res.data);
      })
      .catch((err: AxiosError) => {
        console.log(err, "bulk request failure");
      });
  };
  useEffect(() => {
    GetFileStatusLookup();
  }, []);
  // ********** Dropdown End **********
  const dispatch = useDispatch();
  const handleStatusChange = (selectedOption: any) => {
    setSearchRequest((prevState: any) => ({
      ...prevState,
      status: selectedOption.value,
    }));
  };
  const handleSpecimenType = (selectedOption: any) => {
    setSearchRequest((prevState: any) => ({
      ...prevState,
      specimenType: selectedOption.label,
      specimenTypeId: selectedOption.value,
    }));
  };

  return (
    <>
      <TableHead>
        <TableRow className="h-40px">
          <TableCell>
            <input
              id={`ToxResultFileSearchFileName`}
              type="text"
              name="fileName"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.fileName}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
          <TableCell>
            <Select
              inputId={`ToxResultFileSearchSpecimenType`}
              menuPortalTarget={document.body}
              styles={reactSelectSMStyle}
              theme={(theme: any) => styles(theme)}
              options={specimenTypeLookup}
              name="specimenTypeId"
              placeholder={t("Search ...")}
              onChange={handleSpecimenType}
              value={specimenTypeLookup.filter(
                (option: any) => option.value === searchRequest.specimenTypeId
              )}
              isSearchable={true}
              required={true}
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <input
              id={`ToxResultFileSearchInstrument`}
              type="text"
              name="instrument"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.instrument}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <input
              id={`ToxResultFileSearchUploadDate`}
              type="date"
              name="uploadedDate"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.uploadedDate}
              onChange={searchQuery}
              onKeyDown={handleKeyPress}
            />
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <Select
              inputId={`ToxResultFileSearchStatus`}
              menuPortalTarget={document.body}
              styles={reactSelectSMStyle}
              theme={(theme: any) => styles(theme)}
              options={statusLookup}
              name="status"
              placeholder={t("Search ...")}
              onChange={handleStatusChange}
              value={statusLookup.filter(
                (option: any) => option.value === searchRequest.status
              )}
              isSearchable={true}
              required={true}
            />
          </TableCell>
          <TableCell>
            <input
              id={`ToxResultFileSearchUploadBy`}
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
        <TableRow>
          <TableCell
            className="min-w-200px w-200px"
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
          <TableCell className="min-w-200px w-200px">
            {t("Specimen Type")}
          </TableCell>
          <TableCell className="min-w-150px w-150px">
            {t("File Type")}
          </TableCell>
          <TableCell className="min-w-150px w-150px">
            {t("Instrument")}
          </TableCell>
          <TableCell className="min-w-125px w-125px">
            {t("Download File")}
          </TableCell>
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
              <div style={{ width: "max-content" }}>{t("View File")}</div>

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
            className="min-w-150px w-150px"
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
              <TableCell id={`ToxResultFileFileName_${item.id}`}>
                {item?.fileName}
              </TableCell>
              <TableCell id={`ToxResultFileSpecimenType_${item.id}`}>
                {item?.specimenType}
              </TableCell>
              <TableCell id={`ToxResultFileDataType_${item.id}`}>
                {item?.fileDataType}
              </TableCell>
              <TableCell
                id={`ToxResultFileInstrument_${item.id}`}
                className="text-center"
              >
                {item?.instrument}
              </TableCell>
              <TableCell
                id={`ToxResultFileDownloadCell_${item.id}`}
                className="text-center"
              >
                <PermissionComponent
                  moduleName="TOX LIS"
                  pageName="Result File"
                  permissionIdentifier="DownloadFile"
                >
                  <button
                    id={`ToxResultFileDownloadButton_${item.id}`}
                    className="btn btn-icon btn-sm fw-bold btn-success btn-icon-light"
                    disabled={item.azureLink == null ? true : false}
                    onClick={() => ShowBlob(item.azureLink)}
                  >
                    <i className="fa fa-download"></i>
                  </button>
                </PermissionComponent>
              </TableCell>
              <TableCell
                id={`ToxResultFileViewCell_${item.id}`}
                className="text-center"
              >
                <PermissionComponent
                  moduleName="TOX LIS"
                  pageName="Result File"
                  permissionIdentifier="ViewFile"
                >
                  <Link to={`/docs-viewer`} target="_blank">
                    <button
                      id={`ToxResultFileViewButton_${item.id}`}
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
              <TableCell id={`ToxResultFileUploadDate_${item.id}`}>
                {item?.uploadedDate}
              </TableCell>
              <TableCell id={`ToxResultFileUploadTime_${item.id}`}>
                {item?.uploadedTime}
              </TableCell>
              <TableCell id={`ToxResultFileStatus_${item.id}`}>
                {item?.status}
              </TableCell>
              <TableCell id={`ToxResultFileUploadedBy_${item.id}`}>
                {item?.uploadedBy}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </>
  );
};

export default ToxResultFileUploadGrid;
