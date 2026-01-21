import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FacilityService from "../../Services/FacilityService/FacilityService";
import { AutocompleteStyle } from "../../Utils/MuiStyles/AutocompleteStyles";
import useLang from './../../Shared/hooks/useLanguage';


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
const ViewAssignedFacilities = (props: any) => {
  const { t } = useLang()
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const params = useParams();
  const columns = [
    {
      field: "facilityId",
      headerName: t("FACILITY ID"),
      flex: 1,
    },
    {
      field: "facilityName",
      headerName: t("FACILITY NAME"),
      flex: 1,
    },
    {
      field: "address",
      headerName: t("ADDRESS"),
      flex: 1,
    },
    {
      field: "state",
      headerName: t("STATE"),
      flex: 1,
    },
    {
      field: "city",
      headerName: t("CITY"),
      flex: 1,
    },
  ];
  const [UserList, setUserList] = useState<any>([]);

  const options = {
    headers: {
      Authorization: `Bearer ${props.User.userInfo.token}`,
      "X-Portal-Key": "DemoApp",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const loadData = () => {

    FacilityService.ViewAssignedFacilities(params.id).then(
      (result: AxiosResponse) => {
        setUserList(result.data.data);
      }
    );
  };

  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="#" className="text-muted text-hover-primary">
                  {t("Home")}
                </a>
              </li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">{t("Facility")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">{t("View All Users")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">
                {t("View Assigned Facilities")}
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/manage-facility-users"
              className="btn btn-secondary btn-sm btn-secondary--icon"
            >
              {t("Back")}
            </Link>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="mb-5 hover-scroll-x">
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{ style: { background: "transparent" } }}
              sx={{ p: 0 }}
              className="min-h-auto"
            >
              <TabSelected
                label={t("Active")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="tab-pane" id="activetab" role="tabpanel">
                <div className="card tab-content-card">
                  <div className="card-header border-0 pt-6 d-flex justify-content-end">
                    <div className="card-toolbar">
                      <div
                        className="d-flex justify-content-end d-none"
                        data-kt-user-table-toolbar="base"
                      >
                        <button
                          type="button"
                          className="btn btn-light-primary me-3"
                          data-kt-menu-trigger="click"
                          data-kt-menu-placement="right-start"
                        >
                          <span className="svg-icon svg-icon-2">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                          {t("Filter")}
                        </button>

                        <div
                          className="menu menu-sub menu-sub-dropdown w-300px w-md-325px"
                          data-kt-menu="true"
                        >
                          <div className="px-7 py-5">
                            <div className="fs-5 text-dark fw-bold">
                              {t("Filter Options")}
                            </div>
                          </div>

                          <div className="separator border-gray-200"></div>

                          <div
                            className="px-7 py-5"
                            data-kt-user-table-filter="form"
                          >
                            <div className="mb-10">
                              <label className="form-label fs-6 fw-semibold">
                                {t("Role:")}
                              </label>
                              <select
                                className="form-select form-select-solid fw-bold select2-hidden-accessible"
                                data-kt-select2="true"
                                data-placeholder={t("Select option")}
                                data-allow-clear="true"
                                data-kt-user-table-filter="role"
                                data-hide-search="true"
                                data-select2-id="select2-data-4-03re"
                                aria-hidden="true"
                                data-kt-initialized="1"
                              >
                                <option data-select2-id="select2-data-6-321u"></option>
                                <option value="Administrator">
                                  {t("Administrator")}
                                </option>
                                <option value="Analyst">{t("Analyst")}</option>
                                <option value="Developer">{t("Developer")}</option>
                                <option value="Support">{t("Support")}</option>
                                <option value="Trial">{t("Trial")}</option>
                              </select>
                              <span
                                className="select2 select2-container select2-container--bootstrap5"
                                dir="ltr"
                                data-select2-id="select2-data-5-q105"
                                style={{ width: "100%" }}
                              >
                                <span className="selection">
                                  <span
                                    className="select2-selection select2-selection--single form-select form-select-solid fw-bold"
                                    role="combobox"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    aria-disabled="false"
                                    aria-labelledby="select2-hu40-container"
                                    aria-controls="select2-hu40-container"
                                  >
                                    <span
                                      className="select2-selection__rendered"
                                      id="select2-hu40-container"
                                      role="textbox"
                                      aria-readonly="true"
                                      title={t("Select option")}
                                    >
                                      <span className="select2-selection__placeholder">
                                        {t("Select option")}
                                      </span>
                                    </span>
                                    <span
                                      className="select2-selection__arrow"
                                      role="presentation"
                                    >
                                      <b role="presentation"></b>
                                    </span>
                                  </span>
                                </span>
                                <span
                                  className="dropdown-wrapper"
                                  aria-hidden="true"
                                ></span>
                              </span>
                            </div>

                            <div className="mb-10">
                              <label className="form-label fs-6 fw-semibold">
                                {t("Two Step Verification:")}
                              </label>
                              <select
                                className="form-select form-select-solid fw-bold select2-hidden-accessible"
                                data-kt-select2="true"
                                data-placeholder={t("Select option")}
                                data-allow-clear="true"
                                data-kt-user-table-filter="two-step"
                                data-hide-search="true"
                                data-select2-id="select2-data-7-ktv4"
                                aria-hidden="true"
                                data-kt-initialized="1"
                              >
                                <option data-select2-id="select2-data-9-uyfh"></option>
                                <option value="Enabled">{t("Enabled")}</option>
                              </select>
                              <span
                                className="select2 select2-container select2-container--bootstrap5"
                                dir="ltr"
                                data-select2-id="select2-data-8-oij2"
                                style={{ width: "100%" }}
                              >
                                <span className="selection">
                                  <span
                                    className="select2-selection select2-selection--single form-select form-select-solid fw-bold"
                                    role="combobox"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    aria-disabled="false"
                                    aria-labelledby="select2-j0fp-container"
                                    aria-controls="select2-j0fp-container"
                                  >
                                    <span
                                      className="select2-selection__rendered"
                                      id="select2-j0fp-container"
                                      role="textbox"
                                      aria-readonly="true"
                                      title={t("Select option")}
                                    >
                                      <span className="select2-selection__placeholder">
                                        {t("Select option")}
                                      </span>
                                    </span>
                                    <span
                                      className="select2-selection__arrow"
                                      role="presentation"
                                    >
                                      <b role="presentation"></b>
                                    </span>
                                  </span>
                                </span>
                                <span
                                  className="dropdown-wrapper"
                                  aria-hidden="true"
                                ></span>
                              </span>
                            </div>

                            <div className="d-flex justify-content-end">
                              <button
                                type="reset"
                                className="btn btn-light-info btn-active-info fw-semibold me-2 px-6"
                                data-kt-menu-dismiss="true"
                                data-kt-user-table-filter="reset"
                              >
                                {t("Reset")}
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary fw-semibold px-6"
                                data-kt-menu-dismiss="true"
                                data-kt-user-table-filter="filter"
                              >
                                {t("Apply")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                        data-kt-menu="true"
                      >
                        <div className="menu-item px-3"></div>
                      </div>

                      <div
                        className="d-flex justify-content-end align-items-center d-none"
                        data-kt-user-table-toolbar="selected"
                      >
                        <div className="fw-bold me-5">
                          <span
                            className="me-2"
                            data-kt-user-table-select="selected_count"
                          ></span>
                          {t("Selected")}
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-kt-user-table-select="delete_selected"
                        >
                          {t("Delete Selected")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card-body py-md-4 py-3">
                    <DataGrid
                      className="table table-bordered table-head-bg table-head-custom table-vertical-center"
                      rows={UserList}
                      columns={columns}
                      getRowId={(row) => row.facilityId}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                      autoHeight
                      disableSelectionOnClick
                      experimentalFeatures={{ newEditingApi: true }}
                    />
                  </div>
                </div>
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
export default connect(mapStateToProps)(ViewAssignedFacilities);
