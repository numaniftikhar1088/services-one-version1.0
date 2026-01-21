import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SpecimenTypeAssigmentService from "../../../Services/Compendium/SpecimenTypeAssigmentService";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { StringRecord } from "../../../Shared/Type";
import useLang from "Shared/hooks/useLanguage";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import ResultDataSettingRow from "./ResultDataSettingRow";
const ResultDataSetting = () => {
  const { t } = useLang();

  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  //============================================================================================
  //====================================  PAGINATION STATES=====================================
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
  }, [curPage]);
  //============================================================================================
  //====================================  PAGINATION STATES END=======================================
  //============================================================================================

  const [loading, setLoading] = useState<any>(false);
  const [request, setRequest] = useState<any>(false);
  const [check, setCheck] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<any>(false);
  const [buttonLoaded, setButtonLoaded] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any>([]);
  const [dropDownValues, setDropDownValues] = useState({
    referenceLab: [],
  });
  const [searchArrayLab, setSearchArrayLab] = useState<any>([]);
  const [dropDownPanelValues, setDropDownPanelValues] = useState({
    referencePanel: [],
  });

  useEffect(() => {
    setCurPage(1);
    loadData();
    loadSelecter();
    loadGridData(true, false);
  }, [pageSize]);
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
  };
  const loadSelecter = () => {
    SpecimenTypeAssigmentService.PanelSetupLookup(29)
      .then((res: AxiosResponse) => {
        let referenceArray: any = [];
        res?.data?.data?.forEach((val: any) => {
          let referenceDetail = {
            value: val?.panelId,
            label: val?.panelDisplayName,
          };
          referenceArray.push(referenceDetail);
        });
        setDropDownPanelValues((preVal: any) => {
          return {
            ...preVal,
            referencePanel: referenceArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const handleSwitchChange = (id: number, name: any, checked: any) => {
    let updatedResultData = resultData.map((inner: any) => {
      if (inner.id === id) {
        return {
          ...inner,
          [name]: checked,
        };
      } else {
        return inner;
      }
    });
    setResultData(updatedResultData);
  };
  const [errors, setErrors] = useState(false);
  const handleChange = (name: string, value: string, id: number) => {
    setErrors(false);
    setCheck(true);

    setResultData((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: parseInt(value),
            }
          : x
      )
    );
  };

  const handleSubmit = async (inner: any) => {
    if (inner?.id === 0 || inner?.id >= 0) {
      setErrors(false);
    } else {
      setErrors(true);
    }

    let dropDownPanel: any = dropDownPanelValues.referencePanel.find(
      (val: any) => val.value === inner.panelId
    );
    let dropDownLab: any = dropDownValues.referenceLab.find(
      (val: any) => val.value === inner?.labId
    );
    if (
      dropDownLab?.label !== undefined &&
      dropDownPanel?.label !== undefined
    ) {
      const queryModel = {
        id: inner?.id,
        labId: inner?.labId,
        labName: dropDownLab?.label,
        panelId: inner?.panelId,
        panelName: dropDownPanel?.label,
        calculationOnCt: inner?.calculationOnCt,
        calculationOnAmpScore: inner?.calculationOnAmpScore,
        calculationOnCqConf: inner?.calculationOnCqConf,
        isActive: inner?.isActive,
      };
      try {
        setRequest(true);
        const res = await FacilityService.SaveResultDataSettings(queryModel);
        setErrors(false);

        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
          setRequest(false);
          setButtonClicked(false);
        } else if (res?.data.statusCode === 409) {
          toast.info(t(res?.data?.message));
          setRequest(false);
          setButtonClicked(false);
          setRequest(false);
        }
      } catch (err) {
        console.trace(err);
        setRequest(false);
      }
    } else {
      toast.error(t("Please select the required value"));
      setRequest(false);
      setCheck(false);
      setButtonClicked(true);
    }
  };
  const handleResultDataSetting = () => {
    if (!buttonClicked) {
      setButtonClicked(true);
      setResultData((prevRows: any) => [
        {
          id: 0,
          labId: 0,
          labName: "",
          rowStatus: true,
          calculationOnCt: true,
          calculationOnAmpScore: true,
          calculationOnCqConf: true,
          panelId: 0,
          panelName: "",
          isActive: true,
        },
        ...prevRows,
      ]);
    }
  };
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const nullobj = {
      labId: 0,
      panelId: 0,
    };
    const obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullobj : searchQuery,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };
    FacilityService.GetResultDataSetting({ ...obj })
      .then((res: AxiosResponse) => {
        setSearchArrayLab(res?.data?.data);
        setResultData(res?.data?.data);
        setLoading(false);
        setTotal(res?.data?.total);
        setButtonLoaded(true);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const initialSearchQuery = {
    labId: 0,
    panelId: 0,
  };
  const queryDisplayTagNames: StringRecord = {
    labId: "Lab Name",
    panelId: "Panel",
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    searchRequest = {
      labId: 0,
      panelId: 0,
    };
    setSearchRequest(searchRequest);
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }
  const searchQuery = {
    labId: searchRequest?.labId,
    panelId: searchRequest?.panelId,
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
  function removeDuplicatesById(array: any, value: string) {
    const seenLabIds = [{}];
    return array.filter((item: any) => {
      const id = value === "lab" ? item.labId : item.panelId;
      if (!seenLabIds[id]) {
        seenLabIds[id] = true;
        return true;
      }
      return false;
    });
  }
  const uniqueLab = removeDuplicatesById(resultData, "lab");
  const uniquePanel = removeDuplicatesById(resultData, "panel");

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <div className="card-body py-5">
      <div className="my-6 mt-0 d-flex justify-content-center justify-content-sm-start">
        <PermissionComponent
          moduleName="TOX LIS"
          pageName="Result Data Preconfiguration"
          permissionIdentifier="AddNewTemplate"
        >
          <button
            onClick={handleResultDataSetting}
            className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
            disabled={!buttonLoaded || buttonClicked}
          >
            <i style={{ fontSize: "16px" }} className="fa">
              &#xf067;
            </i>{" "}
            {t("Add Result Data Setting")}
          </button>
        </PermissionComponent>
      </div>
      <div className="d-flex gap-4 flex-wrap">
        {searchedTags.map((tag) =>
          tag === "isArchived" ? null : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
              onClick={() => handleTagRemoval(tag)}
            >
              <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>
      <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
        <div className="d-flex align-items-center mb-2 mt-3">
          <span className="fw-400 mr-3">{t("Records")}</span>
          <select
            className="form-select w-125px h-33px rounded"
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
        <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
          <button
            onClick={() => loadGridData(true, false)}
            className="btn btn-linkedin btn-sm fw-500 py-2 rounded-3"
            aria-controls="Search"
          >
            {t("Search")}
          </button>
          <button
            onClick={resetSearch}
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-bold py-2 rounded-3"
            id="kt_reset"
          >
            <span>
              <span>{t("Reset")}</span>
            </span>
          </button>
        </div>
      </div>
      {/* <div>
          <button
            className=" btn btn-secondary btn-sm btn-secondary--icon fw-bold py-2 rounded-3"
            onClick={reset}
          >
            Cancel
          </button>
          <PermissionComponent
            pageName="Result Data Preconfiguration"
            permissionIdentifier="AddNewTemplate105"
          >
            <button
              className="btn btn-primary btn-sm fw-500 py-2 rounded-3"
              onClick={handleSubmit}
            >
              {request ? <LoaderIcon /> : null}
              <span>Save</span>
            </button>
          </PermissionComponent>
        </div> */}
      <Box sx={{ height: "auto", width: "100%" }}>
        <div className="table_bordered overflow-hidden">
          <TableContainer>
            <Table className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0">
              <TableHead className="h-40px">
                <TableRow className="h-50px">
                  <TableCell></TableCell>
                  <TableCell className="min-w-150px w-150px">
                    <select
                      name="labId"
                      className="form-select bg-white mb-3 mb-lg-0"
                      value={searchRequest.labId}
                      onChange={onInputChangeSearch}
                    >
                      <option value="">{t("Select a Lab")}</option>
                      {uniqueLab.map((option: any) => (
                        <option key={option.id} value={option.labId}>
                          {option.labName}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="min-w-150px w-150px">
                    <select
                      name="panelId"
                      className="form-select bg-white mb-3 mb-lg-0"
                      value={searchRequest.panelId}
                      onChange={onInputChangeSearch}
                    >
                      <option value="">{t("Select a Panel")}</option>
                      {uniquePanel.map((option: any) => (
                        <option key={option.value} value={option.panelId}>
                          {option.panelName}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="min-w-50px w-50px">
                    {t("Actions")}
                  </TableCell>
                  <TableCell
                    className="min-w-200px w-200px"
                    sx={{ width: "max-content" }}
                  >
                    <div
                      onClick={() => handleSort("labName")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("Lab Name")}
                      </div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${
                            sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "labName"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "labName"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    className="min-w-200px w-200px"
                    sx={{ width: "max-content" }}
                  >
                    <div
                      onClick={() => handleSort("panelName")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
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
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "panelName"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0`}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-150px w-150px">
                    {t("Calculation On CT")}
                  </TableCell>
                  <TableCell className="min-w-175px w-175px">
                    {t("Calculation On AmpScore")}
                  </TableCell>
                  <TableCell className="min-w-175px w-175px">
                    {t("Calculation On CqConf")}
                  </TableCell>
                  <TableCell className="min-w-75px w-75px">
                    {t("Inactive/Active")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="padding-0">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : (
                  resultData.map((inner: any, index: any) => (
                    <ResultDataSettingRow
                      inner={inner}
                      resultData={resultData}
                      index={index}
                      setResultData={setResultData}
                      handleSwitchChange={handleSwitchChange}
                      handleSubmit={handleSubmit}
                      handleChange={handleChange}
                      setErrors={setErrors}
                      errors={errors}
                      request={request}
                      setRequest={setRequest}
                      check={check}
                      setCheck={setCheck}
                      setButtonClicked={setButtonClicked}
                      buttonClicked={buttonClicked}
                      dropDownValues={dropDownValues}
                      dropDownPanelValues={dropDownPanelValues}
                      loadGridData={loadGridData}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
      {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
      <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
        <p className="pagination-total-record">
          {Math.min(pageSize * curPage, total) === 0 ? (
            <span>
              {t("Showing 0 to 0 of")} {total} {t("entries")}
            </span>
          ) : (
            <span>
              {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
              {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
              <span> {total} </span> {t("entries")}{" "}
            </span>
          )}
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination">
          <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
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
            <i className="fa fa-angle-double-right"></i>
          </li>
        </ul>
      </div>
      {/* ==========================================================================================
                    //====================================  PAGINATION End =====================================
                    //============================================================================================ */}
    </div>
  );
};

export default ResultDataSetting;
