import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Tab from "@mui/material/Tab";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { useQuery } from "react-query";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { InputChangeEvent } from "../../Interface/Shared/Types";
import FacilityService from "../../Services/FacilityService/FacilityService";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { facilityTabsArr } from "../../Utils/Common";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { checkPermissions } from "../../Utils/Common/CommonMethods";
import FacilityListGrid from "./FacilityListGrid";

const FacilityList = (props: any) => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<any>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };

  const showPage = (i: number) => {
    setCurPage(i);
  };

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    loadData(value, false);
  }, [curPage, triggerSearchData]);
  useEffect(() => {
    setCurPage(1);
    loadData(value, true);
  }, [pageSize]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [value, setValue] = React.useState("0");
  const [open, setOpen] = useState(false);
  const [FacilityUserList, setFacilityUserList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchRequest, setSearchRequest] = useState<any>({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    clientName: "",
    clientID: "",
    statuID: "",
    address1: "",
  });

  const {
    contactName,
    contactPhone,
    contactEmail,
    clientName,
    statuID,
    clientID,
    address1,
  } = searchRequest;

  const onInputChange = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({
      ...searchRequest,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  let getFacilitiesRequest: any = {
    pageNumber: curPage,
    pageSize: pageSize,
    queryModel: searchRequest,
  };

  const loadData: any = (key?: any, reset?: any) => {
    const nullobj = {
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      clientName: "",
      clientID: "",
      statuID: facilityTabsArr[key]?.label,
    };
    setLoading(true);
    setValue(key);
    getFacilitiesRequest = {
      ...getFacilitiesRequest,
      queryModel: reset
        ? nullobj
        : {
            ...searchRequest,
            statuID: facilityTabsArr[key]?.label,
          },
      sortColumn: sort?.sortColumn,
      sortDirection: sort?.sortDirection,
    };
    FacilityService.getAllFacilities(getFacilitiesRequest)
      .then((res: AxiosResponse) => {
        setFacilityUserList(res.data.data.data);
        setSearchRequest((preVal: any) => {
          return {
            ...preVal,
            statuID: facilityTabsArr[key]?.label,
          };
        });
        setTotal(res?.data?.data.total);
      })
      .catch((error: any) => {
        console.error("An error occurred:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    refetch();
  }, []);
  const { isLoading, data, refetch } = useQuery(
    "facility",
    () => loadData(value, false),
    {
      enabled: false,
    }
  );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setCurPage(1);
    loadData(newValue, true);
  };

  const [message, ErrorMessage] = useState("");
  const [openalert, setOpenAlert] = React.useState(false);
  const handleClickOpen = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  function PrintStringByColonNewline({ inputString }: any) {
    if (!inputString) return null;
    const splitStrings = inputString.split("\n");

    const sections = splitStrings.map((section: any, index: any) => {
      if (index === 0) {
        return (
          <React.Fragment key={index}>
            <span style={{ fontWeight: "bold" }}>{section}</span>
            <br /> <br />
          </React.Fragment>
        );
      } else if (index !== splitStrings.length - 1) {
        return (
          <div
            key={index}
            style={{
              border: "2px solid #FF0000",
              padding: "5px",
              marginBottom: "10px",
            }}
          >
            <ul>
              <li>{section}</li>
            </ul>
          </div>
        );
      } else {
        return null;
      }
    });

    return <div>{sections}</div>;
  }
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...byteArray));
        setFileContents(base64String);
        const filedata: FileData = {
          fileName: "",
          contents: base64String,
        };
        FacilityService.BulkFacilityUpload(filedata).then(
          (res: AxiosResponse) => {
            if (res?.data?.statusCode === 200) {
              toast.success(res.data.message);
              loadData(value, false);
            } else {
              handleClickOpen();

              ErrorMessage(res.data.message);
            }
          }
        );
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = "";
  };
  const [bulkFacilityDownload, setBulkFacilityDownload] = useState([]);
  // const DownloadTemplate = () => {
  //   FacilityService.DownloadTemplate("FacilityUpload").then(
  //     (res: AxiosResponse) => {
  //       let uri: string =
  //         res?.data?.data !== null ? res.data.data : "localhost";
  //       window.open(uri, "_blank");
  //       setBulkFacilityDownload(res.data.data.data);
  //     }
  //   );
  // };
  const DownloadTemplate = () => {
    FacilityService.DownloadTemplate()
      .then((res: any) => {
        const fileContent = res.data;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
        downloadLink.download = "Manage Facility Template.xlsx";
        downloadLink.click();
      })
      .catch((error: AxiosError) => {
        console.error("Error downloading template:", error);
      });
  };
  interface FileData {
    fileName: string;
    contents: string;
  }
  const [fileContents, setFileContents] = useState<string>("");
  const reset = () => {
    setSearchRequest({
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      clientName: "",
      clientID: "",
      //statuID: "",
      address1: "",
    });
    setSorting(initialSorting);
    loadData(value, true);
  };
  const initialSorting = {
    sortColumn: "facilityId",
    sortDirection: "desc",
  };
  const [sort, setSorting] = useState<any>(initialSorting);
  const searchRef = useRef<any>(null);

  const handleSort = async (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    sort.sortColumn = columnName;
    sort.sortDirection = searchRef.current.id;
    setSorting((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef?.current?.id,
        clickedIconData: columnName,
      };
    });
    await loadData(value, true);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      let valueObj: any = facilityTabsArr.find(
        (items: any) => items.label === searchRequest.statuID
      );
      setValue(valueObj.value);
      loadData(valueObj.value, false);
    }
  };
  const triggerFileInput = () => {
    const inputElement = document.getElementById("excel-file");
    if (inputElement) {
      inputElement.click();
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_toolbar" className="app-toolbar py-2 pt-lg-3">
          <div
            id="kt_app_toolbar_container"
            className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
          >
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <PermissionComponent
                moduleName="Facility"
                pageName="Manage Facility"
                permissionIdentifier="Download"
              >
                <Tooltip title="Download Template" arrow placement="top">
                  <button
                    id="ManageFacilityDownload"
                    className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                    title={t("Download Template")}
                    onClick={DownloadTemplate}
                  >
                    <i className="bi bi-download"></i>
                  </button>
                </Tooltip>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="Manage Facility"
                permissionIdentifier="Upload"
              >
                <Tooltip title="Upload" arrow placement="top">
                  <button
                    id="ManageFacilityUpload"
                    className="btn btn-icon btn-sm fw-bold btn-warning "
                    onClick={triggerFileInput}
                  >
                    <i className="bi bi-cloud-upload"></i>
                  </button>
                </Tooltip>
              </PermissionComponent>
              <input
                type="file"
                id="excel-file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                id="ManageFacilitySearch"
                className={`btn btn-info btn-sm fw-bold search ${
                  open ? "d-none" : "d-block"
                }`}
                onClick={() => setOpen(!open)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-search"></i>
                <span>{t("Search")}</span>
              </button>
              <button
                id="ManageFacilityCancel"
                className={`btn btn-info btn-sm fw-bold ${
                  open ? "btn-icon" : "collapse"
                }`}
                onClick={() => setOpen(!open)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-times p-0"></i>
              </button>
              {checkPermissions(props.User.Menus, "/addfacility") && (
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Manage Facility"
                  permissionIdentifier="AddaFacility"
                >
                  <Link
                    id="ManageFacilityAddAFacility"
                    to="/addfacility"
                    className="btn btn-sm fw-bold btn-primary"
                  >
                    <span>
                      <i style={{ fontSize: "15px" }} className="fa">
                        &#xf067;
                      </i>
                      <span>{t("Add a Facility")}</span>
                    </span>
                  </Link>
                </PermissionComponent>
              )}
            </div>
          </div>
        </div>
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <Collapse in={open}>
              <div className="card mb-5">
                <div className=" card-body py-4">
                  <div className="row">
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-3">
                        <label htmlFor="" className="mb-2 fw-500">
                          {t("Facility Name")}
                        </label>
                        <input
                          id="txtfacilityName"
                          type="text"
                          name="clientName"
                          value={clientName}
                          onChange={onInputChange}
                          className="form-control bg-transparent"
                          placeholder={t("Facility Name")}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-3">
                        <label htmlFor="" className="mb-2 fw-500">
                          {t("Facility ID")}
                        </label>
                        <input
                          id="txtfacilityId"
                          type="text"
                          name="clientID"
                          value={clientID}
                          onChange={onInputChange}
                          className="form-control bg-transparent"
                          placeholder={t("Facility ID")}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-3">
                        <label htmlFor="" className="mb-2 fw-500">
                          {t("Address 1")}
                        </label>
                        <input
                          id="txtaddress1"
                          type="text"
                          name="address1"
                          value={address1}
                          onChange={onInputChange}
                          className="form-control bg-transparent"
                          placeholder={t("Address 1")}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-3">
                        <label className="mb-2 fw-500">
                          {t("Contact Name")}
                        </label>
                        <input
                          id="txtName"
                          type="text"
                          value={contactName}
                          name="contactName"
                          onChange={onInputChange}
                          className="form-control bg-transparent"
                          placeholder={t("Contact Name")}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-3">
                        <label className="mb-2 fw-500">
                          {t("Contact Phone #")}
                        </label>
                        <input
                          name="contactPhone"
                          value={contactPhone}
                          onChange={onInputChange}
                          id="txtContactPhone"
                          type="text"
                          className="form-control bg-transparent"
                          placeholder={t("Contact Phone #")}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-3">
                        <label className="mb-2 fw-500">{t("Email")}</label>
                        <input
                          id="txtEmail"
                          type="text"
                          name="contactEmail"
                          value={contactEmail}
                          onChange={onInputChange}
                          className="form-control bg-transparent"
                          placeholder={t("Email")}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 gap-lg-3">
                      <button
                        id="ManageFacilityExpandSearch"
                        type="button"
                        onClick={() => {
                          let valueObj: any = facilityTabsArr.find(
                            (items: any) =>
                              items.label === searchRequest.statuID
                          );
                          setValue(valueObj.value);
                          setTriggerSearchData((prev) => !prev);
                          setCurPage(1);
                        }}
                        className="btn btn-primary btn-sm btn-primary--icon"
                      >
                        <span>
                          <i className="fa fa-search"></i>
                          <span>{t("Search")}</span>
                        </span>
                      </button>
                      <button
                        id="ManageFacilityReset"
                        onClick={reset}
                        className="btn btn-secondary btn-sm btn-secondary--icon"
                      >
                        <span>
                          <i className="fa fa-times"></i>
                          <span>{t("Reset")}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Collapse>
            <div className="mb-5 hover-scroll-x">
              <Box sx={{ width: "100%", typography: "body1" }}>
                <TabContext value={value}>
                  <TabList
                    onChange={handleChange}
                    aria-label={t("lab API tabs example")}
                    className="min-h-auto"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                      "& .MuiTabs-scrollButtons": {
                        width: 0,
                        transition: "width .7s ease",
                        "&:not(.Mui-disabled)": {
                          width: "48px",
                        },
                      },
                      "& .MuiButtonBase-root": { textTransform: "capitalize" },
                      "& .Mui-selected": {
                        background: "#fff",
                        borderStartStartRadius: "8px",
                        borderStartEndRadius: "8px",
                        zIndex: 4,
                        color: "var(--bs-primary) !important",
                      },
                      "& .MuiTabs-indicator": { display: "none" },
                    }}
                  >
                    {facilityTabsArr.map((items: any) => (
                      <Tab
                        data-test-id={items?.label?.replace(/\s/g, "")}
                        label={items.label}
                        value={items.value ? items.value : "0"}
                      />
                    ))}
                  </TabList>
                  <div className="card shadow-sm mb-3 rounded-top-0">
                    <TabPanel value={value} sx={{ p: 0 }}>
                      <FacilityListGrid
                        searchRequest={searchRequest}
                        curPage={curPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        total={total}
                        totalPages={totalPages}
                        pageNumbers={pageNumbers}
                        nextPage={nextPage}
                        showPage={showPage}
                        prevPage={prevPage}
                        loadFacilities={loadData}
                        loadData={loadData}
                        facilityUserList={FacilityUserList}
                        tabKey={parseInt(value)}
                        loading={loading}
                        handleSort={handleSort}
                        sort={sort}
                        searchRef={searchRef}
                      />
                    </TabPanel>
                  </div>
                </TabContext>
              </Box>
            </div>
          </div>
        </div>
      </div>
      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
        className="modal-lg"
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Upload Error List")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <PrintStringByColonNewline inputString={message} />
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-danger py-2"
            onClick={handleCloseAlert}
          >
            {t("Close")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(FacilityList);
