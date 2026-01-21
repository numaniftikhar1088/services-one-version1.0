import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import UserManagementService from "../../../Services/UserManagement/UserManagementService";
import { Loader } from "../../../Shared/Common/Loader";
import { AddIcon, ArrowDown, ArrowUp, RemoveICon } from "../../../Shared/Icons";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

export interface IRows {
  id: number;
  testName: string;
  testDisplayName: string;
  testCode: string;
  referenceLabId: number;
  referenceLabName: string;
  createDate: string;
  rowStatus: boolean | undefined;
}
export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const searchRef = useRef<any>(null);

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
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
    loadGridData(true, false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [request, setRequest] = useState(false);
  const [check, setCheck] = useState(false);
  const [dropDownValues, setDropDownValues] = useState({
    requisitionList: [],
    departments: [],
    referenceLab: [],
    insuranceType: [],
    gender: [],
    group: [],
  });

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadData();
    loadFacilities();
    loadGridData(true, true);
  }, []);
  const [switchValue, setSwitchValue] = useState(true);

  const handleChangeSwitch = (e: any, Id: any) => {
    setSwitchValue(e.target.checked);
    setCheck(true);
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === Id
          ? {
              ...x,
              isEnabled: e.target.checked,
            }
          : x
      )
    );
    handleSubmitForEnabled([{ id: Id, isEnabled: e.target.checked }]);
  };
  const [errors, setErrors] = useState(false);
  const [errorsMessage, setErrorMessage] = useState({
    profileName: "",
    refLabName: "",
    reqTypeName: "",
    groupNames: "",
  });
  const validateForm = (row: any) => {
    let formIsValid = true;
    const newErrors: any = {};
    if (!row.profileName) {
      newErrors.profileName = "Enter Profile Name";
      formIsValid = false;
    }
    if (!row.reqTypeId) {
      newErrors.reqTypeName = "Select Requisition Field";
      formIsValid = false;
    }
    if (!row.refLabId) {
      newErrors.refLabName = "Select Lab Field";
      formIsValid = false;
    }
    if (row.groupIds.length === 0) {
      newErrors.groupNames = "Select Group Field";
      formIsValid = false;
    }
    setErrorMessage(newErrors);
    return formIsValid;
  };
  const handleChange = (name: string, value: string, id: number) => {
    setCheck(true);
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
    if (name === "profileName") {
      setErrorMessage((pre: any) => {
        return {
          ...pre,
          profileName: "",
        };
      });
    }
    if (name === "refLabId") {
      setErrorMessage((pre: any) => {
        return {
          ...pre,
          refLabName: "",
        };
      });
      FacilityService.reqTypeLookup()
        .then((res: AxiosResponse) => {
          let genArray: any = [];
          res?.data?.forEach((val: any) => {
            let genDetails = {
              value: val?.value,
              label: val?.label,
            };
            genArray.push(genDetails);
            setDropDownValues((preVal: any) => {
              return {
                ...preVal,
                requisitionList: genArray,
              };
            });
          });
        })
        .catch((err: any) => {
          console.trace(err);
        });
    }
    if (name === "reqTypeId") {
      setErrorMessage((pre: any) => {
        return {
          ...pre,
          reqTypeName: "",
        };
      });
      FacilityService.groupLookup(value)
        .then((res: AxiosResponse) => {
          let genArray: any = [];
          res?.data?.forEach((val: any) => {
            let genDetails = {
              value: val?.value,
              label: val?.label,
            };
            genArray.push(genDetails);
            setDropDownValues((preVal: any) => {
              return {
                ...preVal,
                group: genArray,
              };
            });
          });
        })
        .catch((err: any) => {
          console.trace(err);
        });
    }
  };
  useEffect(() => {
    FacilityService.reqTypeLookup()
      .then((res: AxiosResponse) => {
        let genArray: any = [];
        res?.data?.forEach((val: any) => {
          let genDetails = {
            value: val?.value,
            label: val?.label,
          };
          genArray.push(genDetails);
          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              requisitionList: genArray,
            };
          });
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
    FacilityService.groupLookup(0)
      .then((res: AxiosResponse) => {
        let genArray: any = [];
        res?.data?.forEach((val: any) => {
          let genDetails = {
            value: val?.value,
            label: val?.label,
          };
          genArray.push(genDetails);
          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              group: genArray,
            };
          });
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  }, []);

  const [selectedValues, setSelectedValues] = useState([]);
  const handleChangeGroup = (selectedOptions: any, id: any) => {
    const values = selectedOptions.map((option: any) => option.value);
    setSelectedValues(values);
    setCheck(true);
    setErrorMessage((pre: any) => {
      return {
        ...pre,
        groupNames: "",
      };
    });
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              groupIds: values,
            }
          : x
      )
    );
  };

  ////////////-----------------Section For Searching-------------------///////////////////
  const handleSwitch = (event: any) => {
    setCheck(true);
    setSearchRequest((curr) => ({
      ...curr,
      isEnabled: event.target.checked,
    }));
  };

  const handleonChange = (
    name: string,
    nameId: string,
    label: string,
    value: any
  ) => {
    setSearchRequest((curr) => ({
      ...curr,
      [name]: label || null,
      [nameId]: value || null,
    }));

    if (nameId === "refLabId") {
      FacilityService.reqTypeLookup()
        .then((res: AxiosResponse) => {
          let genArray: any = [];
          res?.data?.forEach((val: any) => {
            let genDetails = {
              value: val?.value,
              label: val?.label,
            };
            genArray.push(genDetails);
            setDropDownValues((preVal: any) => {
              return {
                ...preVal,
                requisitionList: genArray,
              };
            });
          });
        })
        .catch((err: any) => {
          console.trace(err);
        });
    }
    if (nameId === "reqTypeId") {
      FacilityService.groupLookup(value)
        .then((res: AxiosResponse) => {
          let genArray: any = [];
          res?.data?.forEach((val: any) => {
            let genDetails = {
              value: val?.value,
              label: val?.label,
            };
            genArray.push(genDetails);
            setDropDownValues((preVal: any) => {
              return {
                ...preVal,
                group: genArray,
              };
            });
          });
        })
        .catch((err: any) => {
          console.trace(err);
        });
    }
  };
  const handleonChangeGroup = (label: string, value: any) => {
    let id: any[] = [];
    id.push(value);
    setSearchRequest((curr: any) => ({
      ...curr,
      groupIds: id,
      groupNames: label,
    }));
  };
  let [searchRequest, setSearchRequest] = useState({
    id: 0,
    optionName: "",
    isEnabled: null,
  });
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    searchRequest = {
      id: 0,
      optionName: "",
      isEnabled: null,
    };
    setSearchRequest({
      id: 0,
      optionName: "",
      isEnabled: null,
    });
    setSorting(sortById);
    loadGridData(true, true);
  }

  const [facilities, setFacilities] = useState([]);
  const loadFacilities = () => {
    setLoading(true);
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setFacilities(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => setLoading(false));
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  const searchQuery = {
    optionName: searchRequest?.optionName,
    isEnabled: searchRequest?.isEnabled,
  };
  //

  const loadData = () => {
    FacilityService.referenceLabLookup()
      .then((res: AxiosResponse) => {
        let referenceArray: any = [];
        res?.data?.data?.forEach((val: any) => {
          let referenceDetail = {
            value: val?.labId,
            label: val?.labDisplayName,
          };
          referenceArray.push(referenceDetail);
        });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            referenceLab: referenceArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
    FacilityService.insuranceLookup()
      .then((res: AxiosResponse) => {
        let insArray: any = [];
        res?.data?.forEach((val: any) => {
          let insDetails = {
            value: val?.value,
            label: val?.label,
          };
          insArray.push(insDetails);
          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              insuranceType: insArray,
            };
          });
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
    FacilityService.genderLookup()
      .then((res: AxiosResponse) => {
        let genArray: any = [];
        genArray.push({ value: 0, label: "All" });
        res?.data?.forEach((val: any) => {
          let genDetails = {
            value: val?.value,
            label: val?.label,
          };
          genArray.push(genDetails);

          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              gender: genArray,
            };
          });
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const nullobj = {
      optionName: "",
      isEnabled: null,
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchQuery).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() : v,
      ])
    );
    const obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullobj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };
    FacilityService.getAllFacilitieOptions({ ...obj })
      .then((res: AxiosResponse) => {
        setRows(res?.data?.data);
        setLoading(false);
        setTotal(res?.data?.total);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const handleSubmitForEnabled = (list: any) => {
    // setIsRequest(true)
    FacilityService.SaveFacilityOption(list)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          toast.success(t("Request Successfully Saved"));
          // setIsRequest(false)
          // loadGridData(true, false)
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  useEffect(() => {
    loadGridData(true, false);
  }, [sort]);

  ////////////-----------------Sorting-------------------///////////////////
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };
  const handleSubmit = async (row: any) => {
    let groupIds: any[] = [];
    groupIds.push(...selectedValues);

    if (row.id === 0 || row.id >= 0) {
      setErrors(false);
    } else {
      setErrors(true);
    }
    const queryModel = {
      id: row.id,
      profileName: row.profileName,
      refLabId: row.refLabId,
      reqTypeId: row.reqTypeId,
      insuranceId: row.insuranceId,
      gender: row.genderId,
      groupIds: row.groupIds,
      isDefault: row.isDefault,
    };
    if (validateForm(row)) {
      try {
        setRequest(true);
        const res = await FacilityService.createassignment(queryModel);
        setErrors(false);
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.responseMessage));
          setSelectedValues([]);
          setSwitchValue(false);
          loadGridData(true, false);
          setRequest(false);
          setErrorMessage((pre: any) => {
            return {
              profileName: "",
              refLabName: "",
              reqTypeName: "",
              insuranceName: "",
              groupNames: "",
            };
          });
        }
        if (res?.data.statusCode === 409) {
          setRequest(false);
          toast.error(t(res?.data?.responseMessage));
        }
      } catch (err) {
        console.trace(err);
        setRequest(false);
      }
    }
    setRequest(false);
    setCheck(false);
  };

  ////////////-----------------Update a Row-------------------///////////////////
  const updateRow = (row: any) => {};

  return (
    <>
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              {/* <div className="my-6 mt-0 d-flex justify-content-center justify-content-sm-start">
                <button
                  onClick={() =>
                    setRows((prevRows: any) => [
                      {
                        id: 0,
                        profileName: '',
                        refLabId: 0,
                        refLabName: '',
                        reqTypeId: 0,
                        reqTypeName: '',
                        insuranceId: 0,
                        insuranceName: '',
                        genderId: 0,
                        genderName: '',
                        groupIds: [],
                        groupNames: '',
                        isDefault: true,
                        facilities: [],
                        rowStatus: true,
                      },
                      ...prevRows,
                    ])
                  }
                  className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                >
                  Add New Lab Assignment
                </button>
              </div> */}
              <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id="FacilityOptionsRecord"
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
                <div className="dalign-items-center d-flex gap-2 gap-lg-3 mb-2 ms-3 ms-sm-0">
                  {/* <button
                    onClick={() => handleSubmitForEnabled()}
                    className="btn btn-primary btn-sm fw-500"
                    aria-controls="Search"
                  >
                    Save
                  </button> */}
                  <button
                    id="FacilityOptionSearch"
                    onClick={() => {
                      setCurPage(1);
                      setTriggerSearchData((prev) => !prev);
                    }}
                    className="btn btn-linkedin btn-sm fw-500"
                    aria-controls="Search"
                  >
                    {t("Search")}
                  </button>
                  <button
                    id="FacilityOptionReset"
                    onClick={resetSearch}
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  >
                    <span>
                      <span>{t("Reset")}</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="card">
                <Box sx={{ height: "auto", width: "100%" }}>
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={
                         isMobile
                           ? {} :
                        
                        {
                        maxHeight: 800,
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
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                      >
                        <TableHead>
                          <TableRow className="h-30px">
                            <TableCell></TableCell>
                            {/* <TableCell></TableCell> */}
                            <TableCell>
                              <input
                                id="FacilityOptionName"
                                type="text"
                                name="optionName"
                                className="form-control bg-white my-2 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.optionName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>

                            <TableCell>
                              {/* <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  name="isEnabled"
                                
                                  onChange={(event: any) => handleSwitch(event)}
                                  //onKeyDown={handleKeyPress}
                                />
                                <label className="form-check-label"></label>
                              </div> */}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>

                          <TableRow className="h-30px">
                            <TableCell className="w-20px min-w-20px">
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
                            {/* <TableCell className="min-w-50px">
                              Actions
                            </TableCell> */}
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("optionName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {" "}
                                  {t("Option Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="min-w-50px">
                              {t("Is Enabled")}
                            </TableCell>
                            <TableCell className="min-w-50px">
                              {t("All Facility")}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableCell colSpan={4} className="padding-0">
                              <Loader />
                            </TableCell>
                          ) : (
                            rows.map((item: any, index) => {
                              return (
                                <Row
                                  row={item}
                                  index={index}
                                  rows={rows}
                                  setRows={setRows}
                                  dropDownValues={dropDownValues}
                                  handleChange={handleChange}
                                  updateRow={updateRow}
                                  handleSubmit={handleSubmit}
                                  handleChangeGroups={handleChangeGroup}
                                  selectedValues={selectedValues}
                                  handleChangeSwitch={handleChangeSwitch}
                                  loadFacilities={loadFacilities}
                                  facilities={facilities}
                                  loadGridData={loadGridData}
                                  setErrors={setErrors}
                                  errors={errors}
                                  switchValue={switchValue}
                                  request={request}
                                  setRequest={setRequest}
                                  check={check}
                                  setCheck={setCheck}
                                  errorsMessage={errorsMessage}
                                  setErrorMessage={setErrorMessage}
                                />
                              );
                            })
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
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                <p className="pagination-total-record mb-0">
                  {Math.min(pageSize * curPage, total) === 0 ? (
                    <span>
                      {t("Showing 0 to 0 of")} {total} {t("enteries")}
                    </span>
                  ) : (
                    <span>
                      {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
                      {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
                      <span> {total} </span> {t("entries")}{" "}
                    </span>
                  )}
                </p>
                <ul className="p-0 d-flex align-items-center justify-content-end custome-pagination mb-0">
                  <li
                    className="btn btn-lg p-2 h-33px"
                    onClick={() => showPage(1)}
                  >
                    <i className="fa fa-angle-double-left"></i>
                  </li>
                  <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                    <i className="fa fa-angle-left"></i>
                  </li>

                  {pageNumbers.map((page) => (
                    <li
                      key={page}
                      className={`px-2 ${
                        page === curPage
                          ? "font-weight-bold bg-primary text-white h-33px"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => showPage(page)}
                    >
                      {page}
                    </li>
                  ))}

                  <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
                    <i className="fa fa-angle-right"></i>
                  </li>
                  <li
                    className="btn btn-lg p-2 h-33px"
                    onClick={() => {
                      if (totalPages === 0) {
                        showPage(curPage);
                      } else {
                        showPage(totalPages);
                      }
                    }}
                  >
                    <i className="fa fa-angle-double-right "></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
    </>
  );
}
