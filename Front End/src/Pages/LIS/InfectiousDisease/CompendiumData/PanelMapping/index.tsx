import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useIsMobile from 'Shared/hooks/useIsMobile';
import useLang from "Shared/hooks/useLanguage";
import { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import PanelMappingService from "../../../../../Services/InfectiousDisease/PanelMappingService";
import { Loader } from "../../../../../Shared/Common/Loader";
import NoRecord from "../../../../../Shared/Common/NoRecord";
import PermissionComponent, { AnyPermission } from "../../../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../../../Shared/Icons";
import ArrowBottomIcon from "../../../../../Shared/SVG/ArrowBottomIcon";
import { StringRecord } from "../../../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import {
  StyledDropButton,
  StyledDropMenu,
} from '../../../../../Utils/Style/Dropdownstyle';
import { SortingTypeI, sortById } from '../../../../../Utils/consts';
import Row, { ITableObj } from './Row';
import ArchivedIdCompendium from "./archived";

interface IAssayData {
  assayNameId: string | number;
  assayName: string;
  organism: string | number;
  testCode: string | number;
}
interface IReportingRules {
  reportingRuleId: number;
  reportingRuleName: string;
}
interface IGroup {
  groupNameId: number;
  groupName: string;
}
interface IPerformingLab {
  labId: number;
  labDisplayName: string;
}

export interface IRows {
  id: number;
  panelId: number;
  performingLabId: number;
  performingLabName: string;
  panelName: string;
  panelCode: string;
  assayName: string;
  organism: string;
  testCode: string;
  groupName: string;
  antibioticClass: string;
  subPanelName: string;
  assayNameId: number;
  reportingRuleId: number;
  groupNameId: number;
  reportingRuleName: string;
  resistance: boolean;
  numberOfDetected: number | null;
  numberOfRepeated: number | null;
  createDate: string;
  rowStatus: boolean | undefined;
}
interface NavProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}
export default function CollapsibleTable({ setRefresh, refresh }: NavProps) {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [isArchivedModalShown, showArchivedModal] = useState(false);
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
  const closeArchivedModal = () => {
    showArchivedModal(false);
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

  const [dropDownValues, setDropDownValues] = useState({
    PerformingLabList: [],
    AssayDataList: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>(() => []);

  const [request, setRequest] = useState(false);
  useEffect(() => {
    loadData1();
    loadData2();
    loadData3();
    loadData4();
    loadGridData(true, true);
  }, []);

  const handleChange = (name: string, value: any, id: number) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };
  // const handleChangeforRepeated = (name: string, value: any, id: number) => {
  //
  //
  //   const parsedValue = parseInt(value, 10)
  //   const temprow = rows.find((row) => row.id === id)
  //   //
  //   // const test =
  //   //   temprow?.numberOfDetected != null &&
  //   //   temprow?.numberOfDetected <= value
  //   //
  //   if (
  //     temprow?.numberOfDetected != null &&
  //     temprow?.numberOfDetected <= value
  //   ) {
  //     setRows((curr) =>
  //       curr.map((x) =>
  //         x.id === id
  //           ? {
  //               ...x,
  //               [name]: isNaN(parsedValue) ? '' : parsedValue,
  //             }
  //           : x,
  //       ),
  //     )
  //   } else {
  //     toast.error('test')
  //   }
  // }
  const handleChangeforRepeated = (name: string, value: any, id: number) => {
    const parsedValue = parseInt(value, 10);
    const temprow = rows.find((row) => row.id === id);

    if (
      temprow?.numberOfDetected != null &&
      parsedValue < temprow?.numberOfDetected
    ) {
      toast.error(
        t(
          "NumberOfRepeated value must be greater than or equal to numberOfDetected"
        )
      );
    } else {
      setRows((curr) =>
        curr.map((x) =>
          x.id === id
            ? {
              ...x,
              [name]: isNaN(parsedValue) ? "" : parsedValue,
            }
            : x
        )
      );
    }
  };

  const handleChangeForDetected = (name: string, value: any, id: number) => {
    // Assuming you have a state variable to store the rows
    const updatedRows = rows.map((row: any) => {
      if (row.id === id) {
        // Validate that the input is a valid integer
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue)) {
          // Input is not a valid integer, clear the field
          return {
            ...row,
            [name]: "", // Clear the field
          };
        }

        const otherValue = parseInt(
          row[
          name === "numberOfDetected"
            ? "numberOfRepeated"
            : "numberOfDetected"
          ],
          10
        ); // Get the other value

        // Check if "Number of Detected" is greater than "Number of Repeated"
        if (name === "numberOfDetected" && parsedValue > otherValue) {
          // Here, you can display an error message or prevent the change
          // For now, we'll set it to the other value
          return {
            ...row,
            [name]: otherValue, // Set to the other value
          };
        }

        return {
          ...row,
          [name]: parsedValue,
        };
      }
      return row;
    });

    // Update the state with the modified rows
    setRows(updatedRows);
  };

  const handleChangeCheckBox = (event: any, id: number) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
            ...x,
            [event.target.name]: event.target.checked,
          }
          : x
      )
    );
  };
  const handleChangeAssay = (
    name: string,
    value: string,
    id: number,
    e: any
  ) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
            ...x,
            [name]: value,
            organism: e.organism,
            testCode: e.testCode,
          }
          : x
      )
    );
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  let intialSearchQuery = {
    performingLabId: 0,
    performingLabName: "",
    panelName: "",
    panelCode: "",
    assayName: "",
    organism: "",
    testCode: "",
    groupName: "",
    antibioticClass: "",
    reportingRuleName: "",
    resistance: null,
    subPanelName: "",
  };

  const queryDisplayTagNames: StringRecord = {
    performingLabId: "Performing Lab",
    performingLabName: "Performing Lab",
    panelName: "Panel Name",
    panelCode: "Panel Code",
    assayName: "Display Name",
    organism: "Organism",
    testCode: "Test Code",
    groupName: "Group Name",
    antibioticClass: "Antibiotic Class",
    reportingRuleName: "Reporting Rule",
    resistance: "Resistance",
    subPanelName: "Sub Panel Name",
  };

  let [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    setSearchRequest({
      performingLabId: 0,
      performingLabName: "",
      panelName: "",
      panelCode: "",
      assayName: "",
      organism: "",
      testCode: "",
      groupName: "",
      antibioticClass: "",
      reportingRuleName: "",
      resistance: null,
      subPanelName: "",
    });
    loadGridData(true, true, sortById);
    setSorting(sortById);
  }

  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  const loadData1 = () => {
    PanelMappingService.AssayDataLookup()
      .then((res: AxiosResponse) => {
        let AssayDataArray: any = [];
        //

        res?.data?.data?.forEach((val: IAssayData) => {
          let AssayDataDetails = {
            value: val?.assayNameId,
            label: val?.assayName,
            organism: val?.organism,
            testCode: val?.testCode,
          };
          AssayDataArray.push(AssayDataDetails);
        });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            AssayDataList: AssayDataArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const loadData2 = () => {
    PanelMappingService.ReportingRulesLookup()
      .then((res: AxiosResponse) => {
        let ReportingRulesArray: any = [];
        //

        res?.data?.data?.forEach((val: IReportingRules) => {
          let ReportingRulesDetails = {
            value: val?.reportingRuleId,
            label: val?.reportingRuleName,
          };
          ReportingRulesArray.push(ReportingRulesDetails);
        });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            ReportingRulesList: ReportingRulesArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const loadData3 = () => {
    PanelMappingService.GroupLookup()
      .then((res: AxiosResponse) => {
        // let GroupArray: any = []

        // res?.data?.data?.forEach((val: IGroup) => {
        //   let GroupDetails = {
        //     value: val?.groupNameId,
        //     label: val?.groupName,
        //   }
        //   GroupArray.push(GroupDetails)
        // })
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            GroupList: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const loadData4 = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        // let PerformingLabArray: any = []
        //

        // res?.data?.forEach((val: any) => {
        //   let PerformingLabDetails = {
        //     value: val?.value,
        //     label: val?.label,
        //   }
        //   PerformingLabArray.push(PerformingLabDetails)
        // })
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            PerformingLabList: res?.data,
          };
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
    setIsAddButtonDisabled(false);

    const nullObj = {
      performingLabId: 0,
      performingLabName: "",
      panelName: "",
      panelCode: "",
      assayName: "",
      organism: "",
      testCode: "",
      groupName: "",
      antibioticClass: "",
      reportingRuleName: "",
      resistance: null,
    };

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    PanelMappingService.getPanelMapping({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);

        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };


  ////////////-----------------Get All Data-------------------//////////////////

  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: ITableObj) => {
    setRequest(true);

    if (
      row?.performingLabId != 0 &&
      row?.panelName != "" &&
      row?.panelCode != "" &&
      row?.assayNameId != 0 &&
      row?.reportingRuleId != 0 &&
      row?.groupNameId != 0
    ) {
      if (
        row?.numberOfRepeated != null &&
        row?.numberOfRepeated != 0 &&
        row?.numberOfDetected != null &&
        row?.numberOfDetected != 0
      ) {
        if (row?.numberOfRepeated >= row?.numberOfDetected) {
          const queryModel = {
            id: row.id,
            panelId: row.panelId,
            assayNameId: row.assayNameId,
            reportingRuleId: row.reportingRuleId,
            performingLabId: row.performingLabId,
            groupNameId: row.groupNameId,
            panelName: row.panelName,
            panelCode: row.panelCode,
            organism: row.organism,
            testCode: row?.testCode,
            antibioticClass: row.antibioticClass,
            resistance: row.resistance,
            numberOfDetected: row?.numberOfDetected,
            numberOfRepeated: row?.numberOfRepeated,
            subPanelName: row?.subPanelName,
          };

          PanelMappingService.createOrUpdatePanelMapping(queryModel)
            .then((res: AxiosResponse) => {
              if (res?.data.httpStatusCode === 200) {
                toast.success(t(res?.data?.message));
                setRequest(false);
                loadGridData(true, false);
                setIsAddButtonDisabled(false);
              } else {
                toast.error(t(res?.data?.message));
                setRequest(false);
              }
            })
            .catch((err: any) => {
              console.trace(err);
            });
        } else {
          toast.error(
            t(
              "NumberOfRepeated value must be greater than or equal to NumberOfDetected"
            )
          );
          setRequest(false);
        }
      } else {
        toast.error(
          t("Number of Detected And Repeated should be greater than 0")
        );
        setRequest(false);
      }
    } else {
      toast.error(t("Please Enter The Required Fields"));
      setRequest(false);
    }

    // setRequest(false);
  };
  ////////////-----------------Save a Row-------------------///////////////////

  ////////////-----------------Delete a Row-------------------///////////////////

  const deleteRow = (id: number) => { };
  ////////////-----------------Delete a Row-------------------///////////////////

  const handleAllSelect = (checked: boolean, rows: any) => {
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.id);
    });

    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: [],
        };
      });
    }
  };
  const handleChangePanelMappinfId = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: [...selectedBox.id, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: selectedBox.id.filter((item: any) => item !== id),
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
  const [selectedBox, setSelectedBox] = useState<any>({
    id: [],
  });
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
    PanelMappingService.panelMappingExportToExcel({
      queryModel: searchRequest,
    }).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res?.data?.message));
        base64ToExcel(res.data.data.fileContents, "Panel Mapping");
      } else {
        toast.error(t(res?.data?.message));
      }
    });
  };

  const downloadSelected = () => {
    if (selectedBox.id.length > 0) {
      const payLoad = {
        selectedRow: selectedBox.id,
        queryModel: searchRequest,
      };
      PanelMappingService.panelMappingExportToExcel(payLoad).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(res.data.data.fileContents, "Panel Mapping");
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t("Select atleast one record"));
    }
    // PanelMappingService.panelMappingExportToExcel(selectedBox.id).then(
    //   (res: AxiosResponse) => {
    //     if (res?.data?.httpStatusCode === 200) {
    //       toast.success(res?.data?.message)
    //       base64ToExcel(res.data.data.fileContents, 'Panel Mapping')
    //     } else {
    //       toast.error(res?.data?.message)
    //     }
    //   },
    // )
  };
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

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
    // loadArchieveData(true, false);
  }, [sort, refresh]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (intialSearchQuery as any)[clickedTag],
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
    <>
      <div className="d-flex gap-4 flex-wrap mb-1">
        {searchedTags.map((tag) => (
          <div
            className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
            onClick={() => handleTagRemoval(tag)}
          >
            <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
            <i className="bi bi-x"></i>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id="IDCompendiumDataPanelMapingRecords"
              className="form-select w-sm-125px w-90px h-33px rounded py-2"
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
          <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
            <div className="mt-0">
              <PermissionComponent
                moduleName="ID LIS"
                pageName="Compendium Data"
                permissionIdentifier="AddNew"
              >
                <Button
                  id="IDCompendiumDataPanelMapingAddNew"
                  onClick={() => {
                    if (!isAddButtonDisabled) {
                      setRows((prevRows: any) => [
                        //createData("", "", "", "--select", "", "", "--select", "", true),
                        {
                          id: 0,
                          panelId: 0,
                          performingLabId: 0,
                          performingLabName: "",
                          panelName: "",
                          panelCode: "",
                          assayName: "",
                          organism: "",
                          testCode: "",
                          groupName: "",
                          antibioticClass: "",
                          reportingRuleName: "",
                          assayNameId: 0,
                          reportingRuleId: 0,
                          groupNameId: 0,
                          numberOfRepeated: 1,
                          numberOfDetected: 1,
                          subPanelName: "",
                          resistance: true,
                          rowStatus: true,
                        },
                        ...prevRows,
                      ]);
                      setIsAddButtonDisabled(true);
                    }
                  }}
                  variant="contained"
                  color="success"
                  className="btn btn-primary btn-sm text-capitalize fw-400"
                  disabled={loading}
                  sx={{
                    "&.Mui-disabled": {
                      opacity: "0.65",
                      backgroundColor: "#69A54B",
                      color: "white",
                    },
                  }}
                >
                  <i className="bi bi-plus-lg"></i>
                  {t("Add New")}
                </Button>
              </PermissionComponent>
              <button
                id="IDCompendiumDataPanelMapingSearch"
                onClick={() => {
                  showArchivedModal(true);
                }}
                className="btn btn-info btn-sm fw-500 ms-2"
                aria-controls="archieved"
              >
                {t("Archive")}
              </button>
            </div>
            <div>
              <AnyPermission
                moduleName="ID LIS"
                pageName="Compendium Data"
                permissionIdentifiers={[
                  "ExportAllRecords",
                  "ExportSelectedRecords",
                ]}
              >
                <StyledDropButton
                  id="IDCompendiumDataPanelMapingExportData"
                  aria-controls={openDrop ? 'demo-positioned-menu2' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDrop ? 'true' : undefined}
                  onClick={event => handleClick(event, 'dropdown2')}
                  className="btn btn-excle btn-sm"
                >
                  <i
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      paddingLeft: '2px',
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
                  onClose={() => handleClose('dropdown2')}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="ExportAllRecords"
                  >
                    <MenuItem className="p-0">
                      <a
                        id="IDCompendiumDataPanelMapingExportAllRecord"
                        className="w-auto text-dark w-200px "
                        onClick={() => {
                          handleClose('dropdown2');
                          downloadAll();
                        }}
                      >
                        {t('Export All Records')}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="ExportSelectedRecords"
                  >
                    <MenuItem className="p-0">
                      <a
                        id="IDCompendiumDataPanelMapingExportSelectedRecords"
                        className="w-auto w-100px text-dark"
                        onClick={() => {
                          handleClose('dropdown2');
                          downloadSelected();
                        }}
                      >
                        {t('Export Selected Records')}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                </StyledDropMenu>
              </AnyPermission>
            </div >
          </div >
        </div >
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id="IDCompendiumDataPanelMapingSearch"
              onClick={() => {
                setCurPage(1);
                setTriggerSearchData((prev) => !prev);
              }}
              className="btn btn-info btn-sm fw-500"
              aria-controls="Search"
            >
              {t("Search")}
            </button>
            <button
              onClick={resetSearch}
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              id="IDCompendiumDataPanelMapingReset"
            >
              <span>
                <span>{t("Reset")}</span>
              </span>
            </button>
          </div>
        </div>
      </div >
      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                isMobile ? {}
                  : {
                    maxHeight: 'calc(100vh - 100px)',
                    '&::-webkit-scrollbar': {
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
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Select
                        inputId="IDCompendiumDataPanelMapingPerformingLab"
                        menuPortalTarget={document.body}
                        className="my-1"
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        options={dropDownValues?.PerformingLabList}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            performingLabId: event.value,
                          });
                        }}
                        value={dropDownValues?.PerformingLabList.filter(
                          function (option: any) {
                            return (
                              option.value === searchRequest?.performingLabId
                            );
                          }
                        )}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingPanelName"
                        type="text"
                        name="panelName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.panelName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingSubPanelName"
                        type="text"
                        name="subPanelName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.subPanelName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingPanelCode"
                        type="text"
                        name="panelCode"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
                        placeholder={t("Search ...")}
                        value={searchRequest.panelCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingAssayName"
                        type="text"
                        name="assayName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.assayName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingOrganism"
                        type="text"
                        name="organism"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.organism}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingTestCode"
                        type="text"
                        name="testCode"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.testCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingReportingRuleName"
                        type="text"
                        name="reportingRuleName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.reportingRuleName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingGroupName"
                        type="text"
                        name="groupName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.groupName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingAntibioticClass"
                        type="text"
                        name="antibioticClass"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.antibioticClass}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="IDCompendiumDataPanelMapingRedidtance"
                        type="text"
                        name="resistance"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={
                          searchRequest.resistance == null
                            ? ""
                            : searchRequest.resistance
                        }
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ width: "30px" }} />
                    <TableCell className="w-25px min-w-25px">
                      <div className="d-flex justify-content-center">
                        <label className="form-check form-check-sm form-check-solid">
                          <input
                            id={`PanelMapingCheckAll`}
                            className="form-check-input"
                            type="checkbox"
                            onChange={(e) =>
                              handleAllSelect(e.target.checked, rows)
                            }
                          />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-50px">{t("Actions")}</TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("performingLabName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Performing Lab")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'performingLabName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'performingLabName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("panelName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Panel Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'panelName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'panelName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("subPanelName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Sub Panel Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'subPanelName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'subPanelName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("panelCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Panel Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'panelCode'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'panelCode'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("assayName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Display(Assay) Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'assayName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'assayName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("organism")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Organism")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'organism'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'organism'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("testCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Test Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'testCode'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'testCode'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("reportingRuleName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Reporting Rule")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'reportingRuleName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'reportingRuleName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("groupName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Group Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'groupName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'groupName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("antibioticClass")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Antibiotic Class")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'antibioticClass'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'antibioticClass'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("resistance")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Resistance")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'resistance'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'resistance'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("numberOfRepeated")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Number Of Repeated")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'numberOfRepeated'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'numberOfRepeated'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("numberOfDetected")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Number Of Detected")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'numberOfDetected'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'numberOfDetected'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={15}>
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((item: any, index) => {
                      return (
                        <Row
                          row={item}
                          index={index}
                          rows={rows}
                          setRows={setRows}
                          dropDownValues={dropDownValues}
                          handleChange={handleChange}
                          handleChangeCheckBox={handleChangeCheckBox}
                          handleChangeAssay={handleChangeAssay}
                          // updateRow={updateRow}
                          // handleDelete={deleteRow}
                          handleSubmit={handleSubmit}
                          loadGridData={loadGridData}
                          handleChangePanelMappinfId={
                            handleChangePanelMappinfId
                          }
                          selectedBox={selectedBox}
                          request={request}
                          setRequest={setRequest}
                          handleChangeForDetected={handleChangeForDetected}
                          handleChangeforRepeated={handleChangeforRepeated}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={15} />
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
              {t("Showing 0 to 0 of")} {total} {t("entries")}
            </span>
          ) : (
            <span>
              {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}
              {Math.min(pageSize * curPage, total)} {t("of Total")}
              <span> {total} </span> {t("entries")}
            </span>
          )}
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
          <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
            <i className="fa fa-angle-double-left"></i>
          </li>
          <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
            <i className="fa fa-angle-left"></i>
          </li>

          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`px-2 ${page === curPage
                ? 'font-weight-bold bg-primary text-white h-33px'
                : ''
                }`}
              style={{ cursor: 'pointer' }}
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
      <BootstrapModal
        size="xl"
        BootstrapModal
        show={isArchivedModalShown}
        onHide={closeArchivedModal}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Archive")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="pt-0">
          <ArchivedIdCompendium
            curPage={curPage}
            pageSize={pageSize}
            loadGridData={loadGridData}
          />
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0"></BootstrapModal.Footer>
      </BootstrapModal>
      {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
    </>
  );
}
