import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import AssignComorRow from "./AssignComorRow";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";

function AssignedComorIndex({
  addAssignComor,
  setAddAssignComor,
  handleSort,
  setSearchAssignComor,
  searchAssignComor,
  setApiGetDataComor,
  apiGetDataComor,
  setAssignLoadingComor,
  assignloadingComor,
  handleDelete,
  handleEditComor,
  curPage,
  nextPage,
  pageSize,
  pageNumbers,
  prevPage,
  showPage,
  total,
  totalPages,
  setPageSize,
  searchRef,
  ComorGetAllData,
  handleStatusChangeComor,
  triggerSearchData,
  sort,
  reset,
}: any) {
  const { t } = useLang();

  const AddNewTab2 = () => {
    setAddAssignComor(true);
  };

  const SearchTab2 = () => {
    setSearchAssignComor(true);
  };

  const Searchfalse = () => {
    setSearchAssignComor(false);
    ComorGetAllData();
  };

  useEffect(() => {
    ComorGetAllData();
  }, [pageSize, curPage, triggerSearchData, reset]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id={`AssignmentComorbiditiesRecords`}
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
        <div className="d-flex align-items-center gap-2 ">
          {searchAssignComor ? (
            <button
              id={`AssignmentComorbiditiesOpenSearchModal`}
              className={`btn btn-info btn-sm fw-bold btn-icon`}
              style={{ height: "38.2px" }}
              onClick={Searchfalse}
              aria-controls="SearchCollapse"
              aria-expanded={searchAssignComor}
            >
              <i className="fa fa-times p-0"></i>
            </button>
          ) : (
            <button
              id={`AssignmentComorbiditiesCloseSearchModal`}
              className={`btn btn-info btn-sm fw-bold search`}
              onClick={SearchTab2}
              aria-controls="SearchCollapse"
              aria-expanded={searchAssignComor}
              disabled={addAssignComor}
            >
              <i className="fa fa-search"></i>
              <span>{t("Search")}</span>
            </button>
          )}
          <PermissionComponent
            moduleName="Setup"
            pageName="Comorbidities Assignment"
            permissionIdentifier="AddComorbiditiesAssignment"
          >
            <button
              id={`AddAssignmentComorbidities`}
              className={`btn btn-sm fw-bold btn-primary`}
              onClick={AddNewTab2}
              aria-controls="ModalCollapse"
              disabled={searchAssignComor}
            >
              <span className="">{t("Add Assignment Comorbidities")}</span>
            </button>
          </PermissionComponent>
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
                    <TableCell style={{ width: "49px" }}>
                      {t("Actions")}
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("comorbidityCode")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Comorbidities Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "comorbidityCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "comorbidityCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("comorbidityCodeDescription")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Comorbidities Description")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData ===
                                "comorbidityCodeDescription"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData ===
                                "comorbidityCodeDescription"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("comorbidityGroup")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Group")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "comorbidityGroup"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "comorbidityGroup"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("facility")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Facility")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "facility"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "facility"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("referenceLab")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Reference Lab")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "referenceLab"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "referenceLab"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("requisitionType")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Requisition Type")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "requisitionType"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "requisitionType"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("panelName")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Panel")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "panelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "panelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Status")}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignloadingComor ? (
                    <TableCell colSpan={8}>
                      <Loader />
                    </TableCell>
                  ) : apiGetDataComor.length === 0 ? (
                    <NoRecord colSpan={10} />
                  ) : (
                    apiGetDataComor.map((row: any) => (
                      <AssignComorRow
                        row={row}
                        key={row.id}
                        ComorGetAllData={ComorGetAllData}
                        handleDelete={handleDelete}
                        handleStatusChangeComor={handleStatusChangeComor}
                        handleEditComor={handleEditComor}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
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
    </>
  );
}

export default AssignedComorIndex;
