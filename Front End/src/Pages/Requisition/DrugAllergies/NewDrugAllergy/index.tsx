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
import React, { useEffect } from "react";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import DrugRow from "./row";
import CustomPagination from "Shared/JsxPagination";
import useIsMobile from "Shared/hooks/useIsMobile";

function NewDrugAllergy({
  setAddTab2,
  apiGetData,
  handleEdit,
  handleDelete,
  loading2,
  setLoading2,
  tab2Search,
  addTab2,
  setTab2Search,
  showData,
  curPage1,
  handleSort1,
  sort1,
  nextPage1,
  pageNumbers1,
  pageSize1,
  prevPage1,
  showPage1,
  total1,
  searchRef1,
  setPageSize1,
  totalPages1,
  triggerSearchData1,
  reset1,
}: any) {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const Searchfalse = () => {
    setTab2Search(false);
    showData();
  };
  const SearchTab2 = () => {
    setTab2Search(true);
  };
  useEffect(() => {
    showData();
  }, [pageSize1, curPage1, triggerSearchData1, reset1]);
  return (
    <>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id={`NewDrugAllergyRecords`}
              className="form-select w-125px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-allow-clear="true"
              onChange={(e) => {
                setPageSize1(parseInt(e.target.value));
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
          {tab2Search ? (
            <button
              id={`NewDrugAllergyOpenSearch`}
              className={`btn btn-info btn-sm fw-bold btn-icon`}
              style={{ height: "38.2px" }}
              onClick={Searchfalse}
              aria-controls="SearchCollapse"
              aria-expanded={tab2Search}
            >
              <i className="fa fa-times p-0"></i>
            </button>
          ) : (
            <button
              id={`NewDrugAllergyCloseSearch`}
              className={`btn btn-info btn-sm fw-bold search`}
              onClick={SearchTab2}
              aria-controls="SearchCollapse"
              aria-expanded={tab2Search}
              disabled={addTab2}
            >
              <i className="fa fa-search"></i>
              <span>{t("Search")}</span>
            </button>
          )}

          <button
            id={`NewDrugAllergyAddNew`}
            className={`btn btn-sm fw-bold btn-primary`}
            onClick={() => setAddTab2(true)}
            aria-controls="ModalCollapse"
            disabled={tab2Search}
          >
            <span className="">{t("Add New Drug Allergies")}</span>
          </button>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                isMobile
                  ? {
                      overflowY: "hidden",
                    }
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
                        onClick={() => handleSort1("dacode")}
                        ref={searchRef1}
                      >
                        <div style={{ width: "max-content" }}>{t("Code")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort1.sortingOrder === "desc" &&
                              sort1.clickedIconData === "dacode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort1.sortingOrder === "asc" &&
                              sort1.clickedIconData === "dacode"
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
                        onClick={() => handleSort1("description")}
                        ref={searchRef1}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Description")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort1.sortingOrder === "desc" &&
                              sort1.clickedIconData === "description"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort1.sortingOrder === "asc" &&
                              sort1.clickedIconData === "description"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Status")}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading2 ? (
                    <TableCell colSpan={4}>
                      {" "}
                      <Loader />{" "}
                    </TableCell>
                  ) : apiGetData.length === 0 ? (
                    <NoRecord colSpan={4} />
                  ) : (
                    apiGetData.map((row: any) => (
                      <DrugRow
                        row={row}
                        key={row.id}
                        showData={showData}
                        handleDelete={handleDelete}
                        // handleStatusChange={handleStatusChange}
                        handleEdit={handleEdit}
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
        curPage={curPage1}
        nextPage={nextPage1}
        pageNumbers={pageNumbers1}
        pageSize={pageSize1}
        prevPage={prevPage1}
        showPage={showPage1}
        total={total1}
        totalPages={totalPages1}
      />
      {/* ==========================================================================================
                  //====================================  PAGINATION END =====================================
                  //============================================================================================ */}
    </>
  );
}

export default NewDrugAllergy;
