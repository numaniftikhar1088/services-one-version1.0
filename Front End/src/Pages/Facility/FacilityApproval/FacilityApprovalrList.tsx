import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import useLang from "Shared/hooks/useLanguage";
import { InputChangeEvent } from "../../../Interface/Shared/Types";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { facilityApprovalTabsArr } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import FacilityApprovalListGrid from "./FacilityApprovalListGrid";

const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const FacilityApprovalrList = () => {
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
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
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);
  const [FacilityUserList, setFacilityUserList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  let [searchRequest, setSearchRequest] = useState<any>({
    clientName: "",
    statuID: "",
    phone: "",
    primaryContactName: "",
    primaryContactEmail: "",
    address1: "",
    address2: "",
    city: "",
    zipCode: "",
    isApproved: null,
  });

  const {
    clientName,
    statuID,
    phone,
    primaryContactName,
    primaryContactEmail,
    address1,
    address2,
    city,
    zipCode,
    isApproved,
  } = searchRequest;

  useEffect(() => {
    loadData(value, false);
  }, []);
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    loadData(newValue, false);
  };

  const loadData = async (key: number, reset: boolean) => {
    try {
      setLoading(true);
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(searchRequest).map(([k, v]) => [
          k,
          typeof v === "string" ? v.trim() : v,
        ])
      );

      getFacilitiesRequest = {
        ...getFacilitiesRequest,
        queryModel: reset
          ? nullobj
          : {
              ...trimmedSearchRequest,
              statuID: facilityApprovalTabsArr[key]?.value,
              isApproved: key === 1 ? true : key === 2 ? false : null,
            },
        sortColumn: reset ? initialSorting?.sortColumn : sort?.sortColumn,
        sortDirection: reset
          ? initialSorting?.sortDirection
          : sort?.sortDirection,
      };

      const res: AxiosResponse = await FacilityService.getAllFacilities(
        getFacilitiesRequest
      );

      setFacilityUserList(res.data.data.data);
      setSearchRequest((preVal: any) => ({
        ...preVal,
        statuID: facilityApprovalTabsArr[key]?.label,
      }));

      setTotal(res?.data?.data.total);
      setValue(key);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  function reset() {
    searchRequest = {
      clientName: "",
      statuID: "",
      phone: "",
      primaryContactName: "",
      primaryContactEmail: "",
      address1: "",
      address2: "",
      city: "",
      zipCode: "",
      isApproved: null,
    };
    setSearchRequest({
      clientName: "",
      statuID: "",
      phone: "",
      primaryContactName: "",
      primaryContactEmail: "",
      address1: "",
      address2: "",
      city: "",
      zipCode: "",
      isApproved: null,
    });
    setSorting(initialSorting);
    loadData(value, true);
  }
  const nullobj = {
    clientName: "",
    statuID: facilityApprovalTabsArr[value]?.value,
    phone: "",
    primaryContactName: "",
    primaryContactEmail: "",
    address1: "",
    address2: "",
    city: "",
    zipCode: "",
    isApproved: value === 1 ? true : value === 2 ? false : null,
  };
  // const [sortColumn, setSortColumn] = useState('facilityId')
  // const [sortDirection, setSortDirection] = useState(1)
  // const handleSort = (srtColumn: any, dir: any) => {
  //   setSortColumn(srtColumn)
  //   setSortDirection(dir)
  //   loadData(value, false)
  // }
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
    await loadData(value, false);
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <BreadCrumbs />
          {/* test */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id="FacilityRequestSearch"
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
              id="FacilityRequestCancel"
              className={`btn btn-info btn-sm fw-bold ${
                open ? "btn-icon" : "collapse"
              }`}
              style={{ height: "38.2px" }}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-times p-0"></i>
            </button>
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
                    <div className="fv-row mb-4">
                      <label htmlFor="" className="mb-2 fw-500">
                        {t("Facility Name")}
                      </label>
                      <input
                        id="RequestFacilityName"
                        type="text"
                        name="clientName"
                        value={clientName}
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("Facility Name")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="" className="mb-2 fw-500">
                        {t("Phone")}
                      </label>
                      <input
                        id="RequestFacilityPhone"
                        type="text"
                        name="phone"
                        value={phone}
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("(999) 999-9999")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("Primary Contact Name")}
                      </label>
                      <input
                        id="RequestPrimaryContactName"
                        type="text"
                        value={primaryContactName}
                        name="primaryContactName"
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("Primary Contact Name")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("Primary Contact Email")}
                      </label>
                      <input
                        id="RequestPrimaryContactEmail"
                        type="text"
                        value={primaryContactEmail}
                        name="primaryContactEmail"
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("Primary Contact Email")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Address1")}</label>
                      <input
                        id="RequestAddress1"
                        type="text"
                        value={address1}
                        name="address1"
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("Address1")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Address2")}</label>
                      <input
                        id="RequestAddress2"
                        type="text"
                        value={address2}
                        name="address2"
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("Address2")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("City")}</label>
                      <input
                        name="RequestCity"
                        value={city}
                        onChange={onInputChange}
                        id="txtContactPhone"
                        type="text"
                        className="form-control bg-transparent"
                        placeholder={t("City")}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Zip Code")}</label>
                      <input
                        id="RequestZipCode"
                        type="text"
                        name="zipCode"
                        value={zipCode}
                        onChange={onInputChange}
                        className="form-control bg-transparent"
                        placeholder={t("Zip Code")}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 gap-lg-3">
                    <button
                      id="FacilityRequestSearch"
                      type="button"
                      onClick={() => {
                        let valueObj: any = facilityApprovalTabsArr.find(
                          (items: any) => items.label === searchRequest.statuID
                        );

                        setValue(
                          valueObj.value == "pending"
                            ? 0
                            : valueObj.value == "rejected"
                            ? 2
                            : 1
                        );
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
                      id="FacilityRequestReset"
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
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{ style: { background: "transparent" } }}
              className="min-h-auto"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons": {
                  width: 0,
                  transition: "width 0.7s ease",
                  "&:not(.Mui-disabled)": {
                    width: "48px",
                  },
                },
              }}
            >
              {facilityApprovalTabsArr.map((items: any) => (
                <TabSelected
                  data-test-id={items?.label?.replace(/\s/g, "")}
                  label={t(items.label)}
                  {...a11yProps(items.value)}
                  className="fw-bold text-capitalize"
                  disabled={loading}
                />
              ))}
            </Tabs>
            <TabPanel value={value} index={value}>
              <div className="card tab-content-card">
                <FacilityApprovalListGrid
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
                  tabKey={value}
                  loading={loading}
                  handleSort={handleSort}
                  searchRef={searchRef}
                  sort={sort}
                />
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(FacilityApprovalrList);
