import { Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import * as XLSX from "xlsx";
import { FacilityGridProps } from "../../Interface/Facility";
import FacilityService from "../../Services/FacilityService/FacilityService";
import NoRecord from "../../Shared/Common/NoRecord";
import Splash from "../../Shared/Common/Pages/Splash";
import PermissionComponent, { AnyPermission } from "../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp, LoaderIcon } from "../../Shared/Icons";
import ArrowBottomIcon from "../../Shared/SVG/ArrowBottomIcon";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../Utils/Style/Dropdownstyle";
import CustomPagination from "./../../Shared/JsxPagination/index";
import FacilityListExpandableTable from "./FacilityListExpandableTable";

const FacilityListGrid: React.FC<FacilityGridProps> = ({
  facilityUserList,
  curPage,
  pageSize,
  setPageSize,
  tabKey,
  total,
  totalPages,
  pageNumbers,
  nextPage,
  loadData,
  showPage,
  prevPage,
  loading,
  handleSort,
  searchRef,
  sort,
  searchRequest,
}) => {
  const { t } = useLang();
  const [request, setRequest] = useState<any>(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [value, setValue] = useState<any>({
    status: "",
  });
  const [openalert, setOpenAlert] = React.useState(false);
  const handleClickOpen = (status: string) => {
    if (selectedBox.facilityIds.length === 0) {
      toast.error(t("Please select atleast one record"));
    } else {
      setOpenAlert(true);
      setValue(() => {
        return {
          status: status,
        };
      });
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const [facilityBulkActivationRequest, setFacilityBulkActivationRequest] =
    useState({
      facilityIds: [] as string[],
    });
  const [selectedBox, setSelectedBox] = useState<any>({
    facilityIds: [],
  });
  const [Export, setExport] = React.useState<null | HTMLElement>(null);
  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setExport(event.currentTarget);
  };
  const base64ToExcel = (base64: string, filename: string) => {
    const decodedBase64 = atob(base64);
    const workbook = XLSX.read(decodedBase64, { type: "binary" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelBlob, `${filename}.xlsx`);
  };

  const downloadAll = () => {
    const obj = {
      status:
        tabKey === 0
          ? "Active"
          : tabKey === 1
            ? "Inactive"
            : tabKey === 2
              ? "Suspend"
              : tabKey === 3
                ? "Archived"
                : tabKey === 4
                  ? "Rejected"
                  : "",
      selectedRows: [],
      queryModel: searchRequest,
    };
    FacilityService.facilityExportToExcel(obj).then((res: AxiosResponse) => {
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);
        base64ToExcel(res.data.data.fileContents, "facilities");
      } else {
        toast.error(res?.data?.message);
      }
    });
  };
  const downloadSelected = () => {
    const obj = {
      status:
        tabKey === 0
          ? "Active"
          : tabKey === 1
            ? "Inactive"
            : tabKey === 2
              ? "Suspend"
              : tabKey === 3
                ? "Archived"
                : tabKey === 4
                  ? "Rejected"
                  : "",
      selectedRows: selectedBox.facilityIds,
    };
    if (selectedBox.facilityIds.length > 0) {
      FacilityService.facilityExportToExcel(obj).then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          base64ToExcel(res.data.data.fileContents, "facilities");
        } else {
          toast.error(res?.data?.message);
        }
      });
    } else {
      toast.error(t("Select atleast one record"));
    }
  };
  const [check, setCheck] = useState<any>(false);
  const onFacilityStatusChange = (item: any, status: string) => {
    setCheck(true);
    let obj = {
      facilityId: item?.facilityId,
      status: status,
    };
    FacilityService.updateFacilityStatus(obj)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          loadData(tabKey);
          toast.success(t("Status Successfully Changed"));
          setCheck(false);
        }
      })
      .catch((err: AxiosError) => { });
  };
  const changeFacilityStausInBulk = (status: string) => {
    setRequest(true);
    let obj = {
      facilityIds: selectedBox.facilityIds,
      status: status,
    };
    FacilityService.updateFacilityStatusInBulk(obj)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          if (status === "Active" || status === "active") {
            setRequest(false);
            setCheckedAll(false);
            setSelectedBox((pre: any) => {
              return {
                ...pre,
                facilityIds: [],
              };
            });
          }
          if (status === "InActive" || status === "inactive") {
            setRequest(false);
            setCheckedAll(false);
            setSelectedBox((pre: any) => {
              return {
                ...pre,
                facilityIds: [],
              };
            });
          }
          if (status === "Suspend" || status === "suspend") {
            setRequest(false);
            setCheckedAll(false);
            setSelectedBox((pre: any) => {
              return {
                ...pre,
                facilityIds: [],
              };
            });
          }
          if (status === "Archived" || status === "archived") {
            setRequest(false);
            setCheckedAll(false);
            setSelectedBox((pre: any) => {
              return {
                ...pre,
                facilityIds: [],
              };
            });
          }
          if (status === "Rejected" || status === "rejected") {
            setRequest(false);
            setCheckedAll(false);
            setSelectedBox((pre: any) => {
              return {
                ...pre,
                facilityIds: [],
              };
            });
          }
          handleCloseAlert();
          loadData(tabKey);
        }
      })
      .catch((err: AxiosError) => { });
  };
  const handleAllSelect = (checked: boolean, facilityuserlist: any) => {
    let idsArr: any = [];
    setCheckedAll(!checkedAll);
    facilityuserlist.forEach((item: any) => {
      idsArr.push(item?.facilityId);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          facilityIds: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          facilityIds: [],
        };
      });
    }
  };
  const handleChangeFacilityIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          facilityIds: [...selectedBox.facilityIds, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          facilityIds: selectedBox.facilityIds.filter(
            (item: any) => item !== id
          ),
        };
      });
    }
  };

  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
  });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  // *********** All Dropdown Function END ***********
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    setCheckedAll(false);
    setSelectedBox((pre: any) => {
      return {
        ...pre,
        facilityIds: [],
      };
    });
  }, [tabKey]);

  return (
    <div>
      <div className="card-body py-2">
        <div className="align-items-center d-flex flex-wrap gap-1 justify-content-center justify-content-sm-start pb-2">
          <div className="d-flex align-items-center justify-content-sm-start">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id="ManageFacility_Records"
              className="form-select w-125px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder={t("Select option")}
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
          <div className="border-0 d-flex justify-content-sm-start">
            <div className="d-flex gap-1 gap-lg-1">
              {tabKey === 3 || tabKey === 4 ? null : (
                <div>
                  <StyledDropButton
                    id="ManageFacilityBulkAction"
                    aria-controls={
                      openDrop ? "demo-positioned-menu1" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={openDrop ? "true" : undefined}
                    onClick={(event) => handleClick(event, "dropdown1")}
                    className="btn btn-info btn-sm"
                  >
                    {t("Bulk Action")}
                    <span className="svg-icon svg-icon-5 m-0">
                      <ArrowBottomIcon />
                    </span>
                  </StyledDropButton>
                  <StyledDropMenu
                    id="ManageFacilityExportRecords"
                    aria-labelledby="demo-positioned-button1"
                    anchorEl={anchorEl.dropdown1}
                    open={Boolean(anchorEl.dropdown1)}
                    onClose={() => handleClose("dropdown1")}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {tabKey === 0 ? (
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Suspend"
                      >
                        <MenuItem
                          id="ManageFacility_Suspend"
                          onClick={() => {
                            handleClose("dropdown1");
                            handleClickOpen("Suspend");
                          }}
                          className="w-125px"
                        >
                          <i className="fa fa-pause text-danger mr-2  w-20px"></i>
                          {t("Suspend")}
                        </MenuItem>
                      </PermissionComponent>
                    ) : null}
                    {tabKey === 0 ? (
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Inactive"
                      >
                        <MenuItem
                          id="ManageFacility_InActive"
                          onClick={() => {
                            handleClose("dropdown1");
                            handleClickOpen("InActive");
                          }}
                          className="w-125px"
                        >
                          <i className="fa fa-ban text-danger mr-2  w-20px"></i>
                          {t("Inactive")}
                        </MenuItem>
                      </PermissionComponent>
                    ) : null}
                    {tabKey === 0 ? (
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Archived"
                      >
                        <MenuItem
                          id="ManageFacility_Archived"
                          onClick={() => {
                            handleClose("dropdown1");
                            handleClickOpen("Archived");
                          }}
                          className="w-125px"
                        >
                          <i className="fa fa-archive mr-2 text-success"></i>
                          {t("Archived")}
                        </MenuItem>
                      </PermissionComponent>
                    ) : null}
                    {/* {tabKey === 0 ? (
                      <PermissionComponent
                        pageName="Manage Facility"
                        permissionIdentifier="Rejected"
                      >
                        <MenuItem
                          onClick={() => {
                            handleClose("dropdown1");
                            handleClickOpen("Rejected");
                          }}
                          className="w-125px"
                        >
                          <i className="fa fa-close mr-3 text-danger"></i>
                          {t("Rejected")}
                        </MenuItem>
                      </PermissionComponent>
                    ) : null} */}
                    {tabKey === 1 ||
                      tabKey === 2 ||
                      tabKey === 3 ||
                      tabKey === 4 ? (
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Active"
                      >
                        <MenuItem
                          id="ManageFacility_Active"
                          onClick={() => {
                            handleClose("dropdown1");
                            handleClickOpen("Active");
                          }}
                          className="w-125px"
                        >
                          <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                          {t("Active")}
                        </MenuItem>
                      </PermissionComponent>
                    ) : null}
                  </StyledDropMenu>
                </div>
              )}

              <div>
                <AnyPermission
                  moduleName="Facility"
                  pageName="Manage Facility"
                  permissionIdentifiers={[
                    "ExportAllRecords",
                    "ExportSelectedRecords",
                  ]}
                >
                  <StyledDropButton
                    id="ManageFacilityExportRecordButton"
                    aria-controls={openDrop ? "demo-positioned-menu2" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openDrop ? "true" : undefined}
                    onClick={(event) => handleClick(event, "dropdown2")}
                    className="btn btn-excle btn-sm"
                  >
                    <i
                      style={{
                        color: "white",
                        fontSize: "20px",
                        paddingLeft: "2px",
                      }}
                      className="fa"
                    >
                      &#xf1c3;
                    </i>
                    <span className="svg-icon svg-icon-5 m-0">
                      <ArrowBottomIcon />
                    </span>
                  </StyledDropButton>
                  <StyledDropMenu

                    aria-labelledby="demo-positioned-button2"
                    anchorEl={anchorEl.dropdown2}
                    open={Boolean(anchorEl.dropdown2)}
                    onClose={() => handleClose("dropdown2")}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Manage Facility"
                      permissionIdentifier="ExportAllRecords"
                    >
                      <MenuItem
                        id="ManageFacility_ExportAllRecords"
                        onClick={() => {
                          handleClose("dropdown2");
                          downloadAll();
                        }}
                        className="w-175px"
                      >
                        <i className="fa text-excle mr-2  w-20px">&#xf1c3;</i>
                        {t("Export All Records")}
                      </MenuItem>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Manage Facility"
                      permissionIdentifier="ExportSelectedRecords"
                    >
                      <MenuItem
                        id="ManageFacility_ExportSelectedRecords"
                        onClick={() => {
                          handleClose("dropdown2");
                          downloadSelected();
                        }}
                        className="w-200px"
                      >
                        <i className="fa text-success mr-2 w-20px">&#xf15b;</i>
                        {t("Export Selected Records")}
                      </MenuItem>
                    </PermissionComponent>
                  </StyledDropMenu>
                </AnyPermission>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <Box sx={{ height: "auto", width: "100%" }}>
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
                // component={Paper}
                className="shadow-none"
              // sx={{ maxHeight: 'calc(100vh - 100px)' }}
              >
                <Table
                  // stickyHeader
                  aria-label="sticky table collapsible"
                  className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                >
                  <TableHead>
                    <TableRow className="h-40px">
                      <TableCell className="w-auto">
                        {/* <span onClick={() => setOpen(!open)}>
                        {open ? (
                          <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                            <RemoveICon />
                          </button>
                        ) : (
                          <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                            <AddIcon />
                          </button>
                        )}
                      </span> */}
                      </TableCell>
                      <TableCell className="w-auto">
                        <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            checked={checkedAll}
                            type="checkbox"
                            onChange={(e) =>
                              handleAllSelect(
                                e.target.checked,
                                facilityUserList
                              )
                            }
                          />
                        </label>
                      </TableCell>
                      <TableCell className="w-auto">{t("Actions")}</TableCell>
                      <TableCell
                        sx={{ width: "max-content" }}
                        className="w-auto"
                      >
                        <div
                          onClick={() => handleSort("facilityId")}
                          className="d-flex justify-content-between cursor-pointer"
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Facility ID")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "facilityId"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "facilityId"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{ width: "max-content" }}
                        className="w-auto"
                      >
                        <div
                          onClick={() => handleSort("clientName")}
                          className="d-flex justify-content-between cursor-pointer"
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Facility Name")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "clientName"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "clientName"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{ width: "max-content" }}
                        className="w-auto"
                      >
                        <div
                          onClick={() => handleSort("address1")}
                          className="d-flex justify-content-between cursor-pointer"

                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Address 1")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "address1"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "address1"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell sx={{ width: "max-content" }}>
                        <div
                          onClick={() => handleSort("contactFirstName")}
                          className="d-flex justify-content-between cursor-pointer"
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Contact Name")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "contactFirstName"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "contactFirstName"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell
                        sx={{ width: "max-content" }}
                        className="w-auto"
                      >
                        <div
                          onClick={() => handleSort("contactPhone")}
                          className="d-flex justify-content-between cursor-pointer"

                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Contact Phone #")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "contactPhone"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "contactPhone"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{ width: "max-content" }}
                        className="w-auto"
                      >
                        <div
                          onClick={() => handleSort("facilityEmail")}
                          className="d-flex justify-content-between cursor-pointer"

                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Email")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "facilityEmail"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "facilityEmail"
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
                      <TableCell colSpan={8}>
                        <Splash />
                      </TableCell>
                    ) : facilityUserList?.length ? (
                      facilityUserList?.map((item: any) => (
                        <FacilityListExpandableTable
                          facilityUserList={facilityUserList}
                          selectedBox={selectedBox}
                          handleChangeFacilityIds={handleChangeFacilityIds}
                          tabKey={tabKey}
                          onFacilityStatusChange={onFacilityStatusChange}
                          item={item}
                          check={check}
                          open={open}
                          setOpen={setOpen}
                        />
                      ))
                    ) : (
                      <NoRecord colSpan={8} />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
            <CustomPagination
              curPage={curPage}
              nextPage={nextPage}
              pageNumbers={pageNumbers}
              pageSize={pageSize}
              prevPage={prevPage}
              showPage={showPage}
              total={total}
              totalPages={totalPages}
            />
            {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
          </Box>
        </div>
        <BootstrapModal
          show={openalert}
          onHide={handleCloseAlert}
          backdrop="static"
          keyboard={false}
        >
          <BootstrapModal.Header
            closeButton
            className="bg-light-primary m-0 p-5"
          >
            <h4>{t("Status")}</h4>
          </BootstrapModal.Header>
          <BootstrapModal.Body>
            {t("Are you sure you want to change status ?")}
          </BootstrapModal.Body>
          <BootstrapModal.Footer className="p-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseAlert}
            >
              {t("No")}
            </button>
            <button
              type="button"
              className="btn btn-danger m-2"
              onClick={() => changeFacilityStausInBulk(value.status)}
            >
              <span>{request ? <LoaderIcon /> : null}</span>
              <span>{t("Yes")}</span>
            </button>
          </BootstrapModal.Footer>
        </BootstrapModal>
      </div>
    </div>
  );
};
export default FacilityListGrid;
