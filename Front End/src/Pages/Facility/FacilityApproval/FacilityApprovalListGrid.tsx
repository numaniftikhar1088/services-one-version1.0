import { Box, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { FacilityGridProps } from "../../../Interface/Facility";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import CustomPagination from './../../../Shared/JsxPagination/index';
import FacilityListExpandableTable from "./FacilityListExpandableTable";
const FacilityApprovalListGrid: React.FC<FacilityGridProps> = ({
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
}) => {
  const [facilityBulkActivationRequest, setFacilityBulkActivationRequest] =
    useState({
      facilityIds: [] as string[],
    });
  const [selectedBox, setSelectedBox] = useState<any>({
    facilityIds: [],
  });

  const { t } = useLang()

  const onFacilityStatusChange = (item: any, status: string) => {
    let obj = {
      facilityId: item?.facilityId,
      status: status,
    };
    FacilityService.updateFacilityStatus(obj)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          loadData(tabKey);
          toast.success(t("Status Successfully Changed"));
        }
      })
      .catch((err: AxiosError) => { });
  };
  const changeStatus = (id: number, Status: string) => {
    FacilityService.FacilityStatusChangedForApproval({
      facilityId: id,
      status: Status,
    }).then((res: any) => {
      toast.success(t(res.data.message));
      loadData(0, false);
    });
  };

  //

  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
  });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  // *********** All Dropdown Function END ***********

  return (
    <div className="card-body py-2">
      <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-start">
        <span className="fw-400 mr-3">{t("Records")}</span>
        <select
        id="FacilityRequestRecords"
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
            component={Paper}
            className="shadow-none"
          // sx={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <Table
              stickyHeader
              aria-label="sticky table collapsible"
              className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              <TableHead>
                <TableRow className="h-30px">
                  {tabKey === 0 ? (
                    <>
                      <TableCell className="min-w-49px text-center">
                        {t("Actions")}
                      </TableCell>
                    </>
                  ) : null}

                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("facilityName")}
                      className="d-flex justify-content-between cursor-pointer"
                    
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Facility Name")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "facilityName"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "facilityName"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("phone")}
                      className="d-flex justify-content-between cursor-pointer"
                 
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Phone")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "phone"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "phone"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("primaryContactName")}
                      className="d-flex justify-content-between cursor-pointer"
                   
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("Primary Contact Name")}
                      </div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "primaryContactName"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "primaryContactName"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("primaryContactEmail")}
                      className="d-flex justify-content-between cursor-pointer"
               
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>
                        {" "}
                        {t("Primary Contact Email")}
                      </div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "primaryContactEmail"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "primaryContactEmail"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("address1")}
                      className="d-flex justify-content-between cursor-pointer"
                     
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Address 1")}</div>

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
                      onClick={() => handleSort("address2")}
                      className="d-flex justify-content-between cursor-pointer"
                    
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Address 2")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "address2"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "address2"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("city")}
                      className="d-flex justify-content-between cursor-pointer"
                  
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("City")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "city"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "city"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("zipCode")}
                      className="d-flex justify-content-between cursor-pointer"
                     
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Zip Code")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "zipCode"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "zipCode"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("submittedBy")}
                      className="d-flex justify-content-between cursor-pointer"
               
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Submitted By")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "submittedBy"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "submittedBy"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell sx={{ width: "max-content" }}>
                    <div
                      onClick={() => handleSort("submittedDate")}
                      className="d-flex justify-content-between cursor-pointer"
                      
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Submitted Date")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "submittedDate"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "submittedDate"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* <TableCell className="min-w-200px"></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody >
                {loading ? (
                  <TableCell colSpan={10}>
                    <Loader />
                  </TableCell>
                ) : facilityUserList.length ? (
                  facilityUserList?.map((item: any) => (
                    <FacilityListExpandableTable
                      facilityUserList={facilityUserList}
                      selectedBox={selectedBox}
                      tabKey={tabKey}
                      onFacilityStatusChange={onFacilityStatusChange}
                      item={item}
                      changeStatus={changeStatus}
                    />
                  ))
                ) : (
                  <NoRecord />
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
  );
};
export default FacilityApprovalListGrid;
