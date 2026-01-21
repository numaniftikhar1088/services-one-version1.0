import React, { useState, useEffect } from "react";
import { stateDropdownArray } from "../../Utils/Common"; // for state dropdown
import Select from "../../Shared/Common/Input/Select";
import {
  StyledDropMenu,
  StyledDropButton,
} from "../../Utils/Style/Dropdownstyle";
import {
  ExportAllRecords,
  ExportIcon,
  SelectedRecords,
} from ".././.././Shared/Icons";
import ArrowBottomIcon from ".././.././Shared/SVG/ArrowBottomIcon";
import { MenuItem } from "@mui/material";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import TableCell from "@mui/material/TableCell";

//table change

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";

// breadcrumb
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import useLang from "Shared/hooks/useLanguage";

//time pciker
// import DatePicker from '@mui/lab/DatePicker';

// import DateFnsUtils from "@mui/lab/AdapterDateFns";


const Fedex = () => {
  const { t } = useLang();
  const [pickupTime, setPickupTime] = useState(dayjs().format("HH:mm")); // Current time in HH:mm format
  const [pickupTimeAsDayjs, setPickupTimeAsDayjs] = useState(dayjs()); // Initialize with current time
  const [endPickupTime, setEndPickupTime] = useState(dayjs()); // Initialize with current time

  // for showing and hiding data
  const [showData, setShowData] = useState(false);
  // for state component
  //for export option
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleCloseDropDown = (dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  // for date
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (pickupTime) {
      const selectedTime = dayjs(pickupTime, "HH:mm");
      setPickupTimeAsDayjs(selectedTime);
      setEndPickupTime(selectedTime);
    }
  }, [pickupTime]);

  // Function to handle change in the pickup time input
  const handlePickupTimeChange = (e: any) => {
    const newPickupTime = e.target.value;
    setPickupTime(newPickupTime);
    setEndPickupTime(dayjs(newPickupTime, "HH:mm"));
  };
  // for time
  const today = dayjs();
  console.log(today, "today");
  const tomorrow = dayjs().add(1, "day");
  console.log(tomorrow, "tomorrow");
  const todayEndOfTheDay = today.endOf("day");
  console.log(todayEndOfTheDay, "todayEndOfTheDay");

  console.log(pickupTimeAsDayjs, "pickupTimeAsDayjs");
  console.log(pickupTimeAsDayjs.format("HH:mm"), "formatted pickupTimeAsDayjs");
  console.log(pickupTime, "pcikup time");
  return (
    <div>
      <div className="container-fluid px-10 py-5">
        {/* breadcrumb */}
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3 mb-5">
          <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
            <li className="breadcrumb-item text-muted">Home</li>
            <li className="breadcrumb-item">
              <span className="bullet bg-gray-400 w-5px h-2px" />
            </li>
            <li className="breadcrumb-item text-muted">Shipping & Pickup</li>
            <li className="breadcrumb-item">
              <span className="bullet bg-gray-400 w-5px h-2px" />
            </li>
            <li className="breadcrumb-item text-muted">Fedex Pickup</li>
          </ul>
        </div>

        {showData ? (
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center mt-0 bg-light-warning">
              <p className="m-0 fs-4 lead fw-500">Schedule a Pickup</p>
              <div className="d-flex align-items-center justify-content-end mb-2">
                <button
                  className="btn btn-secondary btn-sm btn-secondary--icon mr-3"
                  aria-controls="Search"
                  onClick={() => setShowData(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm fw-500"
                  aria-controls="Search"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="card-body py-md-4 py-3 ">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">Contact Name</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="facilityName"
                    placeholder="Contact Name"
                    required
                    type="text"
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">Business Name</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="address1"
                    placeholder="Business Name"
                    required
                    type="text"
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">
                    Confirmation No
                  </label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="facilityPhone"
                    placeholder="(999) 999-9999"
                    required
                    type="tel"
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="mb-2 fw-500">Address</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="address2"
                    placeholder="Address"
                    type="text"
                  />
                  {/* <DatePicker
                    selected={startDate}
                    onChange={(date: any) => setStartDate(date)}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    showTimeSelect
                    // filterTime={(date: any) => filterTime(date)}
                  /> */}
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="mb-2 fw-500">Address 2</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="address2"
                    placeholder="Address 2"
                    type="text"
                  />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">City</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="city"
                    placeholder="city"
                    required
                    type="text"
                  />
                </div>
                {/* <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4"> */}
                <Select
                  label="State"
                  name="state"
                  id="state2"
                  // parentDivClassName="col-lg-3 col-md-4 col-sm-6 col-12"
                  options={stateDropdownArray}
                  required={true}
                />
                {/* </div> */}
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">Zip Code</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="zipCode"
                    placeholder="Zip Code"
                    required
                    type="text"
                  />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">Pickup Date</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="zipCode"
                    placeholder="Scheduled Date"
                    required
                    type="date"
                    min={todayDate} // Set the minimum date to today
                  />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">Pickup Time</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    name="zipCode"
                    placeholder="Scheduled Date"
                    required
                    type="time"
                    value={pickupTime} // Use pickupTime state as value
                    onChange={handlePickupTimeChange}
                  />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">
                    End Pickup Time
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <DemoItem>
                        <TimePicker
                          className="form-control bg-transparent"
                          defaultValue={pickupTimeAsDayjs}
                          //   disablePast
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="mb-2 fw-500">Packages Count</label>
                  <input
                    required
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="facilityWebsite"
                    placeholder="Packages Count"
                    type="number"
                    min={1}
                  />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="mb-2 fw-500">Courier Remarks</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="facilityWebsite"
                    placeholder="Courier Remarks"
                    type="text"
                  />
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                  <label className="required mb-2 fw-500">Tracking #</label>
                  <input
                    autoComplete="off"
                    className="form-control bg-transparent"
                    defaultValue=""
                    name="facilityFax"
                    placeholder="Tracking Number"
                    required
                    type="tel"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="card shadow-sm mb-3 mt-6">
          <div className="container p-0 rounded-0">
            <div className="d-flex flex-wrap gap-4 justify-content-sm-between align-items-center col-12 responsive-flexed-actions mt-8">
              <div className="d-flex gap-3 responsive-flexed-actions-reverse">
                <div className="d-flex align-items-center">
                  <span className="fw-400 mr-3">Records</span>
                  <select
                    className="form-select w-125px h-33px rounded"
                    data-kt-select2="true"
                    data-placeholder="Select option"
                    data-dropdown-parent="#kt_menu_63b2e70320b73"
                    data-allow-clear="true"
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                  </select>
                </div>
                <div className="d-flex gap-lg-3 gap-2">
                  <div>
                    <button
                      className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium btn btn-primary btn-sm css-18ngdvv-MuiButtonBase-root-MuiButton-root"
                      tabIndex={0}
                      type="button"
                      id="demo-positioned-button1"
                      aria-haspopup="true"
                      onClick={() => setShowData(true)}
                    >
                      <i className="bi bi-plus-lg" />
                      Add New
                    </button>
                  </div>
                  <div>
                    <StyledDropButton
                      id="demo-positioned-button2"
                      aria-controls={
                        openDrop ? "demo-positioned-menu2" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openDrop ? "true" : undefined}
                      onClick={(event) => handleClick(event, "dropdown2")}
                      className="btn btn-excle btn-sm"
                    >
                      <ExportIcon />
                      <span className="svg-icon svg-icon-5 m-0">
                        <ArrowBottomIcon />
                      </span>
                    </StyledDropButton>
                    <StyledDropMenu
                      id="demo-positioned-menu2"
                      aria-labelledby="demo-positioned-button2"
                      anchorEl={anchorEl.dropdown2}
                      open={Boolean(anchorEl.dropdown2)}
                      onClose={() => handleCloseDropDown("dropdown2")}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleCloseDropDown("dropdown2");
                        }}
                      >
                        <ExportAllRecords />
                        Export All Records
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleCloseDropDown("dropdown2");
                        }}
                      >
                        <SelectedRecords />
                        Export Selected Records
                      </MenuItem>
                    </StyledDropMenu>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  className="btn btn-setting btn-sm fw-500"
                  aria-controls="Search"
                >
                  {" "}
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  id="kt_reset"
                >
                  <span>
                    <span>Reset</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="card-body py-3 px-0">
              <div className="table_bordered overflow-hidden table-responsive">
                <Box sx={{ height: "auto", width: "100%" }}>
                  <TableContainer
                    component={Paper}
                    className="shadow-none"
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
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                    >
                      <TableHead>
                        <TableRow
                          className="h-40px"
                          style={{ backgroundColor: "#E9EEF4" }}
                        >
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            {" "}
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                              defaultValue=""
                              name="userGroup"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow
                          className="h-40px"
                          style={{
                            color: "#3F4254 !important",
                            backgroundColor: "#F3F6F9 !important",
                          }}
                        >
                          <TableCell>
                            <label className="form-check form-check-sm form-check-solid">
                              <input
                                className=" form-check-input"
                                type="checkbox"
                              />
                            </label>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>Actions</div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Contact Name
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Business Name
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Confirmation No
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>Address</div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Address 2
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>City</div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>State</div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>Zip Code</div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Pickup Date
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Pickup Time
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              End Pickup Date
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Packages Count
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Courier Remarks
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>
                              Tracking #
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ width: "max-content" }}>Location</div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <label className="form-check form-check-sm form-check-solid">
                              <input
                                className=" form-check-input"
                                type="checkbox"
                              />
                            </label>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownButton
                              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                              key="end"
                              id="dropdown-button-drop-end"
                              drop="end"
                              title={
                                <i className="bi bi-three-dots-vertical p-0"></i>
                              }
                            >
                              <Dropdown.Item eventKey="1">
                                <div className="menu-item">
                                  <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                  Edit
                                </div>
                              </Dropdown.Item>
                              <Dropdown.Item eventKey="2">
                                <div className="menu-item">
                                  <i className="fa fa-eye text-success mr-2  w-20px"></i>
                                  View
                                </div>
                              </Dropdown.Item>
                            </DropdownButton>
                          </TableCell>
                          <TableCell>Ali Hassan Mehdi</TableCell>
                          <TableCell>@ShahWebs</TableCell>
                          <TableCell>+923164221184</TableCell>
                          <TableCell>224-C Bankers Town C Block</TableCell>
                          <TableCell>224-C Bankers Town C-2 Block </TableCell>
                          <TableCell>Lahore</TableCell>
                          <TableCell>Islamic Republic Of Pakistan</TableCell>
                          <TableCell>05840</TableCell>
                          <TableCell>10/03/2021</TableCell>
                          <TableCell>4:36 am</TableCell>
                          <TableCell>6:32pm</TableCell>
                          <TableCell>+3</TableCell>
                          <TableCell>Well Service Impressed !</TableCell>
                          <TableCell>+3274835</TableCell>
                          <TableCell>Islamabad Pakistan</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <label className="form-check form-check-sm form-check-solid">
                              <input
                                className=" form-check-input"
                                type="checkbox"
                              />
                            </label>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownButton
                              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                              key="end"
                              id="dropdown-button-drop-end"
                              drop="end"
                              title={
                                <i className="bi bi-three-dots-vertical p-0"></i>
                              }
                            >
                              <Dropdown.Item eventKey="1">
                                <div className="menu-item">
                                  <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                  Edit
                                </div>
                              </Dropdown.Item>
                              <Dropdown.Item eventKey="2">
                                <div className="menu-item">
                                  <i className="fa fa-eye text-success mr-2  w-20px"></i>
                                  View
                                </div>
                              </Dropdown.Item>
                            </DropdownButton>
                          </TableCell>
                          <TableCell>Ali Hassan Mehdi</TableCell>
                          <TableCell>@ShahWebs</TableCell>
                          <TableCell>+923164221184</TableCell>
                          <TableCell>224-C Bankers Town C Block</TableCell>
                          <TableCell>224-C Bankers Town C-2 Block </TableCell>
                          <TableCell>Lahore</TableCell>
                          <TableCell>Islamic Republic Of Pakistan</TableCell>
                          <TableCell>05840</TableCell>
                          <TableCell>10/03/2021</TableCell>
                          <TableCell>4:36 am</TableCell>
                          <TableCell>6:32pm</TableCell>
                          <TableCell>+3</TableCell>
                          <TableCell>Well Service Impressed !</TableCell>
                          <TableCell>+3274835</TableCell>
                          <TableCell>Islamabad Pakistan</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </div>
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                <p className="pagination-total-record">
                  <span>
                    Showing 1 to 3 of Total <span> 3 </span> entries{" "}
                  </span>
                </p>
                <ul className="d-flex align-items-center justify-content-end custome-pagination">
                  <li className="btn btn-lg p-2">
                    <i className="fa fa-angle-double-left" />
                  </li>
                  <li className="btn btn-lg p-2">
                    <i className="fa fa-angle-left" />
                  </li>
                  <li
                    className="px-2 font-weight-bold bg-primary text-white"
                    style={{ cursor: "pointer" }}
                  >
                    1
                  </li>
                  <li className="px-2 " style={{ cursor: "pointer" }}>
                    2
                  </li>
                  <li className="px-2 " style={{ cursor: "pointer" }}>
                    3
                  </li>
                  <li className="btn btn-lg p-2">
                    <i className="fa fa-angle-right" />
                  </li>
                  <li className="btn btn-lg p-2">
                    <i className="fa fa-angle-double-right" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* second */}
      </div>
    </div>
  );
};
export default Fedex;
