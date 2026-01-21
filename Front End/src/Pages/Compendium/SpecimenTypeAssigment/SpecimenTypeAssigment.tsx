import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import { Loader } from "../../../Shared/Common/Loader";
import { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { ReactState } from "../../../Shared/Type";
import { inputs } from "../../../Utils/Compendium/Inputs";
import GridNavbar from "./GridNavbar";
import Row from "./Row";
import useIsMobile from "Shared/hooks/useIsMobile";
import CustomPagination from "../../../Shared/JsxPagination";
interface Props {
  rows: {
    id: any;
    name: any;
    description: any;
    isActive: any;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: ReactState;
  values: any;
  setValues: any;
  statusChange: Function;
  setEditGridHeader: any;
  searchRequest: any;
  setSearchRequest: any;
  DeleteSpecimenTypeAssignmentById: any;
  loading: boolean;
  curPage: any;
  pageSize: any;
  setPageSize: any;
  total: any;
  totalPages: any;
  pageNumbers: any;
  nextPage: any;
  showPage: any;
  prevPage: any;
  Edit: any;
  handleOpen: any;
  handleOnChange: any;
  errors: any;
  setErrors: any;
  editGridHeader: any;

  PanelSetupList: any;
  setPanelSetupList: any;
  openModal: any;
  modalheader: any;
  handleSubmit: any;
  setRequest: any;
  request: any;
  panels: any;
  setPanels: any;
  sports2: any;
  setSports2: any;
  loadData: any;
  selectedPanels: any;
  setSelectedPanels: any;
  check: any;
  sort: any;
  handleSort: any;
  searchRef: any;
  setSorting: any;
  setCurPage: any;
  setTriggerSearchData: any;
}
const SpecimenTypeAssigmentGrid: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setOpenModal,
  setValues,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  DeleteSpecimenTypeAssignmentById,
  loading,
  curPage,
  pageSize,
  setPageSize,
  total,
  totalPages,
  pageNumbers,
  nextPage,
  showPage,
  prevPage,
  Edit,
  handleOpen,
  handleOnChange,
  values,
  errors,
  setErrors,
  editGridHeader,
  PanelSetupList,
  setPanelSetupList,
  openModal,
  modalheader,
  handleSubmit,
  setRequest,
  request,
  panels,
  setPanels,
  sports2,
  setSports2,
  loadData,
  selectedPanels,
  setSelectedPanels,
  check,
  sort,
  handleSort,
  searchRef,
  setSorting,
  setCurPage,
  setTriggerSearchData,
}) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  // ********** DROPDOWN START *********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  // ******** DROPDOWN END ***********
  const [open, setOpen] = useState<any>(false);
  return (
    <>
      <GridNavbar
        NavigatorsArray={NavigatorsArray}
        AddBtnText={t("Add Specimen Type Assignment")}
        setOpenModal={setOpenModal}
        openModal={openModal}
        Inputs={inputs}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        statusDropDownName={t("specimenStatus")}
        handleOpen={handleOpen}
        handleOnChange={handleOnChange}
        values={values}
        errors={errors}
        setErrors={setErrors}
        editGridHeader={editGridHeader}
        PanelSetupList={PanelSetupList}
        setPanelSetupList={setPanelSetupList}
        setValues={setValues}
        modalheader={modalheader}
        setEditGridHeader={setEditGridHeader}
        handleSubmit={handleSubmit}
        setRequest={setRequest}
        request={request}
        panels={panels}
        setPanels={setPanels}
        sports2={sports2}
        setSports2={setSports2}
        loadData={loadData}
        selectedPanels={selectedPanels}
        setSelectedPanels={setSelectedPanels}
        setOpen={setOpen}
        open={open}
        setSorting={setSorting}
        setCurPage={setCurPage}
        setTriggerSearchData={setTriggerSearchData}
      />
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-start">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id={`SpecimenTypeAssigmentRecords`}
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
                    sx={
                      
                      isMobile
                        ? {
                            overflowY: "hidden",
                          }
                        :
                      {
                      maxHeight: 428,
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
                      <TableHead className="h-40px">
                        <TableRow>
                          <TableCell style={{ width: "49px" }}></TableCell>
                          <TableCell style={{ width: "49px" }}>
                            {t("Actions")}
                          </TableCell>
                          <TableCell
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("specimenType")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Specimen Type")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "specimenType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "specimenType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("requisitionTypeName")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Requisition Type")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData ===
                                      "requisitionTypeName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData ===
                                      "requisitionTypeName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("refLabName")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Reference Lab")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData ===
                                      "refLabName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData ===
                                      "refLabName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="min-w-100px text-center"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("isactive")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Inactive/Active")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "isactive"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "isactive"
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
                          <TableCell colSpan={6} className="">
                            <Loader />
                          </TableCell>
                        ) : (
                          rows?.map((item: any) => (
                            <>
                              <Row
                                item={item}
                                Edit={Edit}
                                handleClose={handleClose}
                                DeleteSpecimenTypeAssignmentById={
                                  DeleteSpecimenTypeAssignmentById
                                }
                                statusChange={statusChange}
                                panels={panels}
                                sports2={sports2}
                                row={item.panels}
                                setSports2={setSports2}
                                setPanels={setPanels}
                                loadData={loadData}
                                selectedPanels={selectedPanels}
                                setSelectedPanels={setSelectedPanels}
                                check={check}
                                setOpen={setOpen}
                              />
                            </>
                          ))
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecimenTypeAssigmentGrid;
