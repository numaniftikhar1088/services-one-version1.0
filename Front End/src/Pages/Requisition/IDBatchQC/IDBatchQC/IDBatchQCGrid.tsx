import { Box, Paper, TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import AssigmentService from "../../../../Services/AssigmentService/AssigmentService";
import SpecimenTypeAssigmentService from "../../../../Services/Compendium/SpecimenTypeAssigmentService";
import { Loader } from "../../../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import Row from "./Row";
interface Facility {
  value: number;
  label: string;
}

interface FacilityDetails {
  facilityId: number;
  facility: string;
}
interface IDBatchQCGrid {
  // selectedBox: any
  // setSelectedBox: any
  searchRequest: any;
  onInputChangeSearch: any;
  loading: any;
  resultDataList: any;
  handleAllSelect: any;
  selectedBox: any;
  handleSelectedResultDataIds: any;
  IDLISReportView: any;
  isSubmitting: any;
  isPreviewing: any;
  setSearchRequest: any;
  handleKeyPress: any;
  handleSort: any;
  searchRef: any;
  sort: any;
  value: any;
}
const IDBatchQCGrid: React.FC<IDBatchQCGrid> = ({
  // selectedBox,
  // setSelectedBox,
  onInputChangeSearch,
  searchRequest,
  loading,
  resultDataList,
  handleAllSelect,
  selectedBox,
  handleSelectedResultDataIds,
  IDLISReportView,
  isSubmitting,
  isPreviewing,
  setSearchRequest,
  handleKeyPress,
  handleSort,
  searchRef,
  sort,
  value,
}) => {
  const { t } = useLang();

  const [dropDownValues, setDropDownValues] = useState({
    FacilityList: [],
    PanelNameList: [],
  });
  const loadData = () => {
    AssigmentService.FacilityLookUp()
      .then((res: AxiosResponse) => {
        let FacilityArray: any = [];

        res?.data?.data?.forEach((val: FacilityDetails) => {
          let FacilityDetails = {
            value: val?.facilityId,
            label: val?.facility,
          };
          FacilityArray.push(FacilityDetails);
        });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            FacilityList: FacilityArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const fetchPanelNameList = () => {
    // Assuming you have a function to fetch PanelNameList from an API
    SpecimenTypeAssigmentService.PanelSetupLookup().then((res: any) => {
      setDropDownValues((prevValues) => ({
        ...prevValues,
        PanelNameList: res.data, // Assuming the response contains the PanelNameList
      }));
    });
  };

  // Call fetchPanelNameList whenever necessary, such as when the component mounts

  const getTestDropdownOptions = (IDBatchQCList: any) => {
    const statusValues = IDBatchQCList.map((item: any) => item.panelName);
    const distinctTestValues = [...new Set(statusValues)];
    const dropdownOptions = distinctTestValues.map((panelName) => ({
      value: panelName,
      label: panelName,
    }));
    return dropdownOptions;
  };
  const dropdownOptions = getTestDropdownOptions(resultDataList);
  useEffect(() => {
    loadData();
    fetchPanelNameList();
  }, []);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLTableElement>(null);
  const div5Ref = useRef<HTMLTableElement>(null);
  const handleScroll = () => {
    if (div1Ref.current && div2Ref.current) {
      div2Ref.current.scrollLeft = div1Ref.current.scrollLeft;
    }
  };
  useEffect(() => {
    const setDiv3Width = () => {
      if (
        div3Ref.current &&
        div4Ref.current &&
        div5Ref.current &&
        div2Ref.current
      ) {
        const newWidth = `${div4Ref.current.clientWidth}px`;
        const stikWidth = `${div2Ref.current.clientWidth - 15}px`;

        div3Ref.current.style.width = newWidth;
        div5Ref.current.style.width = stikWidth;
      }
    };

    setDiv3Width(); // Set initial width

    // Update div3 and div5 width when div4 width changes (e.g., due to dynamic content)
    window.addEventListener("resize", setDiv3Width);

    return () => {
      window.removeEventListener("resize", setDiv3Width);
    };
  }, [div5Ref, div4Ref]);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div className="position-fixed bottom-0" ref={div5Ref}>
        <TableContainer
          ref={div1Ref}
          // style={{ width: '200px', height: '20px', overflowX: 'scroll', overflowY: 'hidden', border: '1px solid #ccc' }}
          onScroll={handleScroll}
        >
          {/* Content of div1 */}
          <div ref={div3Ref}></div>
          {/* ... */}
        </TableContainer>
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
                ref={div4Ref}
                // stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="w-10px text-center"
                    ></TableCell>
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="w-10px text-center"
                    ></TableCell>
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                    >
                      <input
                        id={`IdBatchQcBatchId`}
                        type="text"
                        name="fileName"
                        className="form-control bg-white mb-lg-0 rounded-2 fs-8 h-33px"
                        placeholder={t("Search ...")}
                        value={searchRequest.fileName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                    >
                      <select
                        id={`IdBatchQcTestType`}
                        name="panelName"
                        value={searchRequest.panelName}
                        className="form-select rounded-2 fs-8 h-30px"
                        data-kt-select2="true"
                        data-placeholder={t("Select option")}
                        data-dropdown-parent="#kt_menu_63b2e70320b73"
                        data-allow-clear="true"
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            panelName: event.target.value, // Assuming panelName is the field for panel name in searchRequest
                          });
                        }}
                      >
                        <option className="fw-500 text-dark">{t("Select...")}</option>
                        {dropdownOptions.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>{" "}
                    </TableCell>

                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                    >
                      <input
                        id={`IdBatchQcCreatedBy`}
                        type="text"
                        name="createdBy"
                        className="form-control bg-white    mb-lg-0 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.createdBy}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                    >
                      <input
                        id={`IdBatchQcCreatedDate`}
                        type="text"
                        name="createdDate"
                        className="form-control bg-white    mb-lg-0 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.createdDate}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="w-10px text-center"
                    >
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
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="w-10px text-center"
                    >
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          id={`IdBatchQcCheckAllCheckBox`}
                          className="form-check-input"
                          type="checkbox"
                          onChange={(e) =>
                            handleAllSelect(e.target.checked, resultDataList)
                          }
                        />
                      </label>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("accessionNumber")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Batch ID")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "accessionNumber"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "accessionNumber"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("testType")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Test Type")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "testType"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "testType"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("lisStatus")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Created By")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "lisStatus"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "lisStatus"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content", whiteSpace: "nowrap" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("facilityName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Created Date")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "facilityName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "facilityName"
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
                    resultDataList?.map((item: any) => (
                      <>
                        <Row
                          row={item}
                          handleSelectedResultDataIds={
                            handleSelectedResultDataIds
                          }
                          selectedBox={selectedBox}
                          IDLISReportView={IDLISReportView}
                          isPreviewing={isPreviewing}
                          open={open}
                          value={value}
                        />
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  );
};
export default IDBatchQCGrid;
