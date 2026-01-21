import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import PatientServices from "../../../Services/PatientServices/PatientServices";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import UserManagementService from "../../../Services/UserManagement/UserManagementService";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import usePagination from "../../../Shared/hooks/usePagination";
import { StringRecord } from "../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import BulkPatientUploadGrid from "./BulkPatientUploadGrid";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

function BulkPatientUpload() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const initialSearchQuery = {
    fileName: "",
    facilityName: "",
    uploadedDate: "",
    status: "",
    uploadedBy: "",
    isArchived: false,
  };
  const queryDisplayTagNames: StringRecord = {
    fileName: "File Name",
    facilityName: "Facility Name",
    uploadedDate: "Uploaded Date",
    status: "Status",
    uploadedBy: "uploadedBy",
  };
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [show2, setShow2] = useState(false);
  const [upload, setUpload] = useState<any>({ facilityId: "", file: "" });
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [statusDropdown, setStatusDropdown] = useState([]);
  const [patientFileUpload, setPatientFileUpload] = useState([]);
  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
    setCurPage,
  } = usePagination();
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;

  const onInputChangeSearch = (e: ChangeEvent<InputChangeEvent>) => {
    // debugger;

    if (e.target.name === "uploadedDate") {
      const formattedDate = moment(e.target.value).format("MM-DD-YYYY");

      setSearchRequest({
        ...searchRequest,
        [e.target.name]: formattedDate,
      });
    } else {
      setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
    }
  };
  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  const [logList, setLogList] = useState([]);
  const GetLogsById = (id: number) => {
    PatientServices.GetLogsById(id)
      .then((res: AxiosResponse) => {
        setLogList(res?.data?.responseModel);
        setLoading(false);
        setShow2(true);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    PatientServices.GetBulkUploadFiles({
      pageNumber: curPage,
      pageSize: pageSize,
      requestModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total);
        setPatientFileUpload(res?.data?.responseModel);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  const DownloadTemplate = () => {
    PatientServices.DownloadTemplate()
      .then((res: any) => {
        const fileContent = res.data;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
        downloadLink.download = "Patient File Template.xlsx";
        downloadLink.click();
      })
      .catch((error: AxiosError) => {
        console.error("Error downloading template:", error);
      });
  };
  const loadFacilitiesLookUp = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setDropdown(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const loadStatusLookUp = () => {
    PatientServices.GetStatusLookup()
      .then((res: AxiosResponse) => {
        setStatusDropdown(res?.data?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const handleChange = (e: any, name: string) => {
    setUpload((prev: any) => ({
      ...prev,
      [name]: e.value,
    }));
  };
  const handleFileSelect = (e: any) => {
    const selectedFile = e.target.files[0];
    setUpload({ ...upload, file: selectedFile });
    e.target.value = "";
  };
  const handleImageDeselect = () => {
    setUpload({ ...upload, file: "" });
  };
  const PatientFileUpload = async () => {
    if (upload?.file != "" && upload?.facilityId != "") {
      const formData = new FormData();
      formData.append("file", upload?.file);
      formData.append("facilityId", upload?.facilityId);
      try {
        PatientServices.FileUploadPatientFileUpload(formData).then(
          (res: AxiosResponse) => {
            if (res?.data?.statusCode === 200) {
              toast.success(t(res?.data?.message));
            } else if (res?.data?.statusCode === 400) {
              toast.error(t(res?.data?.message));
            }
            loadGridData(true, true);
            setUpload({ facilityId: "", file: "" });
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error(t("Please select facility and upload file"));
    }
  };
  const ModalhandleClose2 = () => setShow2(false);
  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  useEffect(() => {
    if (initialRender) {
      loadGridData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  useEffect(() => {
    if (initialRender2) {
      loadGridData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    loadGridData(true, false);
    loadFacilitiesLookUp();
    loadStatusLookUp();
  }, []);

  return (
    <>
      <Modal
        show={show2}
        onHide={ModalhandleClose2}
        backdrop="static"
        keyboard={false}
        className="modal-xl"
        tabindex="-2"
      >
        <Modal.Title>
          <div className="card card-header bg-light-secondary">
            <h5 className="m-0">{t("Log File Detail")}</h5>
          </div>
        </Modal.Title>
        <ModalBody>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center">
                <h5 className="m-0 text-info">{t("Log Detail")}</h5>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={{
                      maxHeight: "calc(100vh - 100px)",
                      "&::-webkit-scrollbar": {
                        width: 7,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#fff",
                      },
                      "&:hover": {
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "var(--kt-gray-400)",
                          borderRadius: 2,
                        },
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--kt-gray-400)",
                        borderRadius: 2,
                      },
                    }}
                    component={Paper}
                    className="shadow-none"
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead className="h-40px">
                        <TableRow>
                          <TableCell className="min-w-150px w-150px">
                            {t("Row Number")}
                          </TableCell>
                          <TableCell className="min-w-200px w-200px">
                            {t("Error Message")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={8} className="padding-0">
                            <Loader />
                          </TableCell>
                        ) : (
                          logList?.map((row: any, index: number) => (
                            <TableRow key={index + row?.rowNumber}>
                              <TableCell
                                id={`BulkPatientUploadLogDetailRowNumber`}
                              >
                                {row?.rowNumber}
                              </TableCell>
                              <TableCell
                                id={`BulkPatientUploadLogDetailMessage`}
                              >
                                {row?.exceptionMessage}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <Modal.Footer className="py-2">
          <button
            id={`BulkPatientUploadLogDetailClose`}
            type="button"
            className="btn btn-sm btn-secondary btn-danger"
            onClick={ModalhandleClose2}
          >
            {t("Close")}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid mb-4">
        <div className="card shadow-sm">
          <div className="card-body px-3 px-md-8 py-2">
            <div className="row d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between">
              <div className="col-12 col-sm-7 col-lg-7 page-title">
                <PermissionComponent
                  moduleName="Patient"
                  pageName="Bulk Patient Upload"
                  permissionIdentifier="Upload"
                >
                  <div className="d-flex gap-2 mb-2 align-items-center flex-wrap">
                    <div className="fv-row col-12 col-sm-7">
                      <Select
                        inputId={`BulkPatientUploadSelectFacility`}
                        menuPortalTarget={document.body}
                        styles={reactSelectSMStyle}
                        theme={(theme: any) => styles(theme)}
                        placeholder={t("Select the Facility")}
                        name="facilityId"
                        options={dropdown}
                        value={dropdown?.filter(
                          (item: any) => item.value === upload.facilityId
                        )}
                        onChange={(event: any) => {
                          handleChange(event, "facilityId");
                        }}
                      />
                    </div>
                    <input
                      id={`BulkPatientUploadUoloadFile`}
                      type="file"
                      onChange={handleFileSelect}
                      className="d-none"
                      // disabled={images.length > 0 ? true : false}
                      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    />
                    <label
                      htmlFor="BulkPatientUploadUoloadFile"
                      className="dropzone py-2 px-4 px-sm-8 d-flex align-items-center border-linkedin dropzoneBulk"
                    >
                      <div className="dz-message needsclick">
                        {t("Choose File")}
                      </div>
                    </label>
                    <div>
                      <Tooltip title={t("Upload")} arrow placement="top">
                        <button
                          id={`BulkPatientUploadUoloadButton`}
                          className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                          onClick={() => PatientFileUpload()}
                          // disabled={
                          //   images.length > 0 ? isSubmitting : true
                          // }
                        >
                          <i className="bi bi-cloud-upload"></i>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  {upload?.file === "" ? null : (
                    <div className="col-lg-12 col-sm-12 col-md-12">
                      <div className="border bg-light-secondary rounded p-2 my-3">
                        <div className="d-flex justify-content-between">
                          <>
                            <div className="text-dark-65">
                              <span>{upload?.file?.name} </span>
                              <br />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleImageDeselect()}
                              >
                                &#x2716;
                              </span>
                            </div>
                          </>
                        </div>
                      </div>
                    </div>
                  )}
                  <span className="text-muted">
                    {t(
                      "Note: Patient First Name, Last Name, Address 1, City, State, Zip Code, Phone No, Gender And DOB Required."
                    )}
                  </span>
                </PermissionComponent>
              </div>
              <div className="col-12 col-sm-4 col-lg-4 text-sm-end">
                <Tooltip title={t("Download Template")} arrow placement="top">
                  <button
                    id={`BulkPatientUploadDownloadButtton`}
                    className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light mb-2"
                    onClick={DownloadTemplate}
                  >
                    <i className="bi bi-download"></i>
                  </button>
                </Tooltip>
                <div>
                  <span className="text-muted">
                    {t("Download The Patient File Template")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-body py-2">
              <div className=" py-1 py-lg-2">
                <div className="d-flex gap-4 flex-wrap mb-2">
                  {searchedTags.map((tag, index: number) =>
                    tag === "isPhlebotomist" ? (
                      ""
                    ) : (
                      <div
                        key={index + tag}
                        className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light pe-1"
                        onClick={() => handleTagRemoval(tag)}
                      >
                        <span className="fw-bold">
                          {t(queryDisplayTagNames[tag])}
                        </span>
                        <i className="bi bi-x"></i>
                      </div>
                    )
                  )}
                </div>
                <div className="mb-2 d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center">
                  <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
                    <div className="d-flex align-items-center">
                      <span className="fw-400 mr-3">Records:</span>
                      <select
                        id={`BulkPatientUploadRecords`}
                        className="form-select w-125px h-33px rounded py-2"
                        data-kt-select2="true"
                        data-placeholder="Select option"
                        data-dropdown-parent="#kt_menu_63b2e70320b73"
                        data-allow-clear="true"
                        onChange={(e) => {
                          setPageSize(parseInt(e.target.value));
                        }}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="50" selected>
                          50
                        </option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      id={`BulkPatientUploadSearch`}
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData((prev) => !prev);
                      }}
                      className="btn btn-linkedin btn-sm fw-500"
                      aria-controls="Search"
                    >
                      {t("Search")}
                    </button>
                    <button
                      onClick={resetSearch}
                      type="button"
                      className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                      id={`BulkPatientUploadReset`}
                    >
                      <span>
                        <span>{t("Reset")}</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="card">
                  <Box sx={{ height: "auto", width: "100%" }}>
                    <div className="table_bordered overflow-hidden">
                      <TableContainer
                        sx={
                          
                        isMobile ?
                       
                        {}
                        :
                          
                          {
                          
                          
                          
                          maxHeight: "calc(100vh - 100px)",
                          "&::-webkit-scrollbar": {
                            width: 7,
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "#fff",
                          },
                          "&:hover": {
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "var(--kt-gray-400)",
                              borderRadius: 2,
                            },
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "var(--kt-gray-400)",
                            borderRadius: 2,
                          },
                        }}
                        // component={Paper}
                        className="shadow-none"
                        // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                      >
                        <Table
                          // stickyHeader
                          aria-label="sticky table collapsible"
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                        >
                          <BulkPatientUploadGrid
                            searchRequest={searchRequest}
                            searchQuery={onInputChangeSearch}
                            loading={loading}
                            PatientFileUploadList={patientFileUpload}
                            ShowBlob={ShowBlob}
                            GetLogsById={GetLogsById}
                            searchRef={searchRef}
                            handleSort={handleSort}
                            sort={sort}
                            handleKeyPress={handleKeyPress}
                            statusDropdown={statusDropdown}
                          />
                        </Table>
                      </TableContainer>
                    </div>
                    {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
                      {/* =============== */}
                      <p className="pagination-total-record mb-0">
                        {Math.min(pageSize * curPage, total) === 0 ? (
                          <span>{t("Showing 0 of Total 0 Entries")}</span>
                        ) : (
                          <span>
                            {t("Showing")} {pageSize * (curPage - 1) + 1}{" "}
                            {t("to")} {Math.min(pageSize * curPage, total)}{" "}
                            {t("of Total")} <span> {total} </span>{" "}
                            {t("entries")}{" "}
                          </span>
                        )}
                      </p>
                      {/* =============== */}
                      <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={() => showPage(1)}
                        >
                          <i className="fa fa-angle-double-left"></i>
                        </li>
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={prevPage}
                        >
                          <i className="fa fa-angle-left"></i>
                        </li>

                        {pageNumbers.map((page: any) => (
                          <li
                            key={page}
                            className={`px-2 ${
                              page === curPage
                                ? "font-weight-bold bg-primary text-white h-33px"
                                : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => showPage(page)}
                          >
                            {page}
                          </li>
                        ))}

                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={nextPage}
                        >
                          <i className="fa fa-angle-right"></i>
                        </li>
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={() => {
                            if (totalPages === 0) {
                              showPage(curPage);
                            } else {
                              showPage(totalPages);
                            }
                          }}
                        >
                          <i className="fa fa-angle-double-right"></i>
                        </li>
                      </ul>
                    </div>
                    {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BulkPatientUpload;
