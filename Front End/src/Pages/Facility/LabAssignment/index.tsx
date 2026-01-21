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
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import UserManagementService from "../../../Services/UserManagement/UserManagementService";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { StringRecord } from "../../../Shared/Type";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import CustomPagination from "./../../../Shared/JsxPagination/index";
import Row from "./Row";
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


useEffect(() => {
  if (isMobile) {
    // ✅ Allow outer scroll
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.touchAction = "auto";

    // ✅ Disable only inner table scroll
    const containers = document.querySelectorAll(
      ".MuiTableContainer-root, .table_bordered"
    );

    (containers as NodeListOf<HTMLElement>).forEach((el) => {
      el.style.overflowY = "hidden";
      el.style.overflowX = "visible";
      el.style.maxHeight = "none";
      el.style.height = "auto";
    });
  } else {
    // ✅ Desktop: restore scrollable table behavior
    const containers = document.querySelectorAll(
      ".MuiTableContainer-root, .table_bordered"
    );

    (containers as NodeListOf<HTMLElement>).forEach((el) => {
      el.style.overflowY = "auto";
      el.style.maxHeight = "calc(100vh - 100px)";
    });

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.style.touchAction = "auto";
  }
}, [isMobile]);



  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
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

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>(() => []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    loadData();
    loadFacilities();
    loadGridData(true, true);
  }, []);
  const [switchValue, setSwitchValue] = useState(true);

  const handleChangeSwitch = (e: any, id: any) => {
    setSwitchValue(e.target.checked);
    setCheck(true);
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              isDefault: e.target.checked,
            }
          : x
      )
    );
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
          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              group: res?.data,
            };
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

  const initialSearchQuery = {
    id: 0,
    profileName: "",
    refLabId: 0,
    refLabName: "",
    reqTypeId: 0,
    reqTypeName: "",
    insuranceId: null,
    insuranceName: "",
    genderId: null,
    genderName: "",
    groupIds: [],
    groupNames: "",
    isDefault: null,
    facilities: [0],
  };
  const queryDisplayTagNames: StringRecord = {
    profileName: "Profile Name",
    refLabName: "Lab",
    reqTypeName: "Requisition Type",
    insuranceName: "Insurance",
    // genderName: "Gender",
    groupNames: "Group",
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    searchRequest = {
      id: 0,
      profileName: "",
      refLabId: 0,
      refLabName: "",
      reqTypeId: 0,
      reqTypeName: "",
      insuranceId: null,
      insuranceName: "",
      genderId: null,
      genderName: "",
      groupIds: [],
      groupNames: "",
      isDefault: null,
      facilities: [0],
    };
    setSearchRequest({
      id: 0,
      profileName: "",
      refLabId: 0,
      refLabName: "",
      reqTypeId: 0,
      reqTypeName: "",
      insuranceId: null,
      insuranceName: "",
      genderId: null,
      genderName: "",
      groupIds: [],
      groupNames: "",
      isDefault: null,
      facilities: [0],
    });
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }

  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const loadFacilities = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setFacilities(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  const searchQuery = {
    profileName: searchRequest?.profileName,
    refLabName: searchRequest?.refLabName,
    reqTypeName: searchRequest?.reqTypeName,
    insuranceName: searchRequest?.insuranceName,
    genderName: searchRequest?.genderName,
    groupNames: searchRequest?.groupNames,
    isDefault: searchRequest?.isDefault,
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
  //[Hafiz Abdullah - Mobile Responsiveness Issue | Ticket # 45132]
  //disable button until  get faculity post req data comes
  const [isDataLoading, setIsDataLoading] = useState(true);

  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any,
    preserveUnsavedRows: boolean = true
  ) => {
    if (loader) {
      //[Hafiz Abdullah - Mobile Responsiveness Issue | Ticket # 45132]
      //add  disbale lab button
      setIsDataLoading(true);

      setLoading(true);
    }

    // 🟢 Create a sanitized copy of searchQuery
    const trimmedQuery = Object.fromEntries(
      Object.entries(searchQuery).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    const nullobj = {
      profileName: "",
      refLabId: 0,
      reqTypeId: 0,
      insuranceId: null,
      genderId: null,
      groupIds: [],
      isDefault: null,
    };
    const obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullobj : trimmedQuery,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };
    FacilityService.getLabAssignment({ ...obj })
      .then((res: AxiosResponse) => {
        setRows((prevRows: any) => {
          const apiData = res?.data?.data || [];
          // If preserveUnsavedRows is false (e.g., after successful save), don't preserve unsaved rows
          if (!preserveUnsavedRows) {
            return apiData;
          }
          const apiDataIds = new Set(apiData.map((row: any) => row.id));
          const existingNewRows = prevRows.filter(
            (row: any) => row.rowStatus === true && (row.id === 0 || !apiDataIds.has(row.id))
          );
          
          // Merge existing new rows with API data (new rows at the top)
          return [...existingNewRows, ...apiData];
        });
        setTotal(res?.data?.total);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        //[Hafiz Abdullah - Mobile Responsiveness Issue | Ticket # 45132]
        //disable button until get faculity post.req data comes
        setIsDataLoading(false);
        setLoading(false);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////
  const searchRef = useRef<any>(null);

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
      gender: 0,
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
          setIsAddButtonDisabled(false);
          loadGridData(true, false, undefined, false);
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
      } finally {
        setIsAddButtonDisabled(false);
      }
    }
    setRequest(false);
    setCheck(false);
  };

  ////////////-----------------Update a Row-------------------///////////////////
  const updateRow = (row: any) => {};

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value && key !== "facilities" && key !== "groupIds") {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="app-container container-fluid"
  
      >
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-body py-2">
              <div className="d-flex gap-4 flex-wrap mb-2">
                {searchedTags.map((tag) =>
                  tag === "isArchived" ? null : (
                    <div
                      className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                      onClick={() => handleTagRemoval(tag)}
                    >
                      <span className="fw-bold">
                        {t(queryDisplayTagNames[tag])}
                      </span>
                      <i className="bi bi-x"></i>
                    </div>
                  )
                )}
              </div>
              <div className="align-items-center d-flex flex-column flex-md-row flex-wrap gap-0 gap-lg-0 justify-content-center justify-content-sm-between responsive-flexed-actions">
                <div className="align-items-center d-flex flex-column flex-sm-row gap-2 justify-content-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-3">{t("Records")}</span>
                    <select
                      id="LabAssignmentRecord"
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
                  <div className="d-flex align-items-center gap-2">
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Lab Assignment"
                      permissionIdentifier="AddNewLabAssignment"
                    >
                      <button
                        id="LAbAsignmentAddNewLabAssignment"
                        onClick={() => {
                          if (!isAddButtonDisabled) {
                            const emptyRowExists = rows.some(
                              (row: any) => row.rowStatus === true
                            );
                            if (!emptyRowExists) {
                              setRows((prevRows: any) => [
                                {
                                  id: 0,
                                  profileName: "",
                                  refLabId: 0,
                                  refLabName: "",
                                  reqTypeId: 0,
                                  reqTypeName: "",
                                  insuranceId: 0,
                                  insuranceName: "",
                                  genderId: 0,
                                  genderName: "",
                                  groupIds: [],
                                  groupNames: "",
                                  isDefault: true,
                                  facilities: [],
                                  rowStatus: true,
                                },
                                ...prevRows,
                              ]);
                              setIsAddButtonDisabled(true);
                            }
                          }
                        }}
                        className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                        //disable button until  get faculity post req data comes
                        disabled={isDataLoading}
                      >
                        {t("Add New Lab Assignment")}
                      </button>
                    </PermissionComponent>
                  </div>
                </div>
                <div className="align-items-center d-flex gap-2 justify-content-center mb-2">
                  {" "}
                  <button
                    id="LabAssignmentSearch"
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
                    onClick={resetSearch}
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                    id="LabAssignmentReset"
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
                      sx={{
             ...(isMobile
             ? {
          maxHeight: "none", // Disable scroll
          overflowY: "visible",
        }
      : {
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 7 },
          "&::-webkit-scrollbar-track": { backgroundColor: "#fff" },
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
        }),
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
                          <TableRow className="h-40px">
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <input
                                id="LabAssignmentProfileNameSearch"
                                type="text"
                                name="profileName"
                                className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.profileName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="LabAssignmentLabSearch"
                                type="text"
                                name="refLabName"
                                className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.refLabName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="LabAssignmentreqTypeNameSearch"
                                type="text"
                                name="reqTypeName"
                                className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.reqTypeName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="LabAssignmentgroupNameSearch"
                                type="text"
                                name="groupNames"
                                className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.groupNames}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="LabAssignmentinsuranceNameSearch"
                                type="text"
                                name="insuranceName"
                                className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.insuranceName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            {/* <TableCell>
                              <input
                                type="text"
                                name="genderName"
                                className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.genderName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell> */}
                            <TableCell>
                              {/* <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  name="isDefault"
                                  id="flexSwitchCheckDefault"
                                  onChange={(event: any) => handleSwitch(event)}
                                  //onKeyDown={handleKeyPress}
                                />
                                <label className="form-check-label"></label>
                              </div> */}
                            </TableCell>
                          </TableRow>

                          <TableRow className="h-35px">
                            <TableCell />
                            <TableCell className="min-w-50px">
                              {t("Actions")}
                            </TableCell>
                            <TableCell
                              className="min-w-100px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("profileName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Profile Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "profileName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "profileName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("refLabName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Lab")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "refLabName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "refLabName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("reqTypeName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Requisition Type")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "reqTypeName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "reqTypeName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-250px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("groupNames")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Group")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "groupNames"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "groupNames"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("insuranceName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Insurance")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "insuranceName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "insuranceName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            {/* <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("genderName")}
                                className="d-flex justify-content-between cursor-pointer"
                               
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Gender")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "genderName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "genderName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell> */}
                            <TableCell
                              className="min-w-50px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("isDefault")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Default")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "isDefault"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "isDefault"
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
                            <TableCell colSpan={9} className="padding-0">
                               <Loader  className="start" extraClass="10%"  />
                            
                            </TableCell>
                          ) : rows?.length ? (
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
                                  setIsAddButtonDisabled={
                                    setIsAddButtonDisabled
                                  }
                                  setDropDownValues={setDropDownValues}
                                />
                              );
                            })
                          ) : (
                            <NoRecord colSpan={9} />
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
