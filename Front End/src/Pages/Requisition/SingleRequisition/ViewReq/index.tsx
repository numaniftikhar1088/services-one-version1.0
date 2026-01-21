import { MenuItem, Tooltip, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import ColumnSetup from "../../../../Shared/ColumnSetup/ColumnSetup";
import PermissionComponent, {
  AnyPermission,
  getPermissionDisplayName,
} from "../../../../Shared/Common/Permissions/PermissionComponent";
import {
  ExportAllRecords,
  ExportIcon,
  LoaderIcon,
  SelectedRecords,
} from "../../../../Shared/Icons";
import ArrowBottomIcon from "../../../../Shared/SVG/ArrowBottomIcon";
import BreadCrumbs from "../../../../Utils/Common/Breadcrumb";
import { checkPermissions } from "../../../../Utils/Common/CommonMethods";
import { emptyObjectValues } from "../../../../Utils/Common/Requisition";
import { AutocompleteStyle } from "../../../../Utils/MuiStyles/AutocompleteStyles";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../../Utils/Style/Dropdownstyle";
import { DymoMultiPrint } from "../../../Printing/DymoMultiPrint";
import { ZebraMultiPrint } from "../../../Printing/ZebraMultiPrint";
import BrotherPrint from "../../../Printing/BrotherPrint";
import ReqDataGrid from "./ReqDataGrid";
import { useReqDataContext } from "./RequisitionContext/useReqContext";
import { styles } from "Utils/Common";
import usePagination from "Shared/hooks/usePagination";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";
import CustomPagination from "Shared/JsxPagination";
import { base64ToExcel } from "Pages/DynamicGrid/bulkExportActions";

export const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}

const ViewReq = () => {
  const { state, pathname } = useLocation();
  const [isInitialRender2, setIsInitialRender2] = useState(false);

  const portalType = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.portalType
  );

  const {
    data,
    setData,
    filterData,
    searchValue,
    setSearchValue,
    selectedBox,
    setSelectedBox,
    loadGridData,
    initialPageLoadApiCalls,
    setFilterData,
    value,
    setValue,
    getRejectionReasonLookup,
    rejectionReason,
    tabIdToSend,
    setTabIdToSend,
    loadTabs,
    getRequisitionTypes,
    getRequisitionStatus,
    getFacilityLookup,
    total,
  } = useReqDataContext();

  const [triggerSearchData, setTriggerSearchData] = useState(false);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const {
    curPage,
    nextPage,
    pageNumbers,
    pageSize,
    prevPage,
    setCurPage,
    setPageSize,
    setTotal,
    showPage,
    totalPages,
  } = usePagination();

  useEffect(() => {
    setTotal(total);
  }, [total]);

  useEffect(() => {
    filterData.pageNumber = curPage;
    filterData.pageSize = pageSize;
    if (isInitialRender2) {
      loadGridData(true);
    } else {
      setIsInitialRender2(true);
    }
  }, [pageSize, curPage, triggerSearchData]);

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const navigate = useNavigate();
  const { t } = useLang();
  const isMobile = useIsMobile();
  const menus = useSelector((state: any) => state.Reducer.Menus);

  const [check, setCheck] = useState(false);
  const [input, setInput] = useState<any>();
  const [error, setError] = useState<any>("");
  const [openalert, setOpenAlert] = React.useState(false);
  const [initialRender, setInitialRender] = useState(false);
  const [showSetupModal, setShowModalSetup] = useState(false);
  const [inputFields, setInputFields] = useState<boolean>(false);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [showReason, setShowReason] = useState<any>(null);
  const [filteredRow, setFilteredRow] = useState<any>([]);
  const [addRejection, setAddRejection] = useState<{
    subject: string;
    description: string;
  }>({
    subject: "",
    description: "",
  });

  // Separate state for single row delete (to avoid checkbox selection)
  const [singleRowDelete, setSingleRowDelete] = useState<{
    requisitionOrderId: number | null;
    requisitionId: number | null;
    isOpen: boolean;
  }>({
    requisitionOrderId: null,
    requisitionId: null,
    isOpen: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddRejection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeRejectionReasonDropdown = async (selectedOption: any) => {
    const obj = {
      item1: selectedOption?.label,
    };
    await RequisitionType.ShowRejectionReason(obj).then((res: any) => {
      setShowReason(res?.data);
    });
  };

  const handleSaveAgainstReason = async (val: any) => {
    const ReqTypeArray: any[] = [];
    filteredRow.map((row: any) => {
      ReqTypeArray.push(row?.RequisitionTypeId);
    });
    const obj = {
      assignments: selectedBox.requisitionOrderId.map(
        (row: any, index: any) => ({
          requisitionId: selectedBox.requisitionId[index],
          requisitionOrderId: row,
          requisitionType: ReqTypeArray[index],
        })
      ),
      rejection: val,
    };
    await RequisitionType.SaveRequisitionAgainstReason(obj);
  };

  const clearState = () => navigate(pathname, { state: null });

  // api calls on initial page load
  useEffect(() => {
    if (state?.callFrom !== "dashboard") {
      initialPageLoadApiCalls();
    } else {
      getRequisitionTypes();
      getRequisitionStatus();
      getFacilityLookup();
    }
  }, []);

  useEffect(() => {
    if (tabIdToSend !== null && state?.callFrom !== "dashboard") {
      loadGridData(true);
    }
  }, [tabIdToSend]);

  useEffect(() => {
    if (state?.status && state?.filterDate) {
      // Find the filter using the columnKey from state
      async function getTabs() {
        const tabs = await loadTabs();

        if (tabs.length > 0) {
          const tabData = tabs.find((tab: any) => tab.tabID === state?.tabId);
          const filterToAdd = tabs?.[value]?.tabHeaders.find(
            (header: any) => header.columnKey === state.filterDate
          );

          if (filterToAdd) {
            // Construct the filterValue and statusFilter objects
            const filterValue = {
              columnName: filterToAdd.filterColumns,
              filterValue: state.dateFilter,
              columnType: filterToAdd.filterColumnsType,
              label: filterToAdd.columnLabel,
              columnKey: filterToAdd.columnKey,
            };
            // empty log

            const statusFilter = {
              columnName: "wstatus.WorkFlowDisplayName",
              filterValue: state.status,
              columnType: "text",
              label: "Requisition Status",
              columnKey: "RequisitionStatus",
            };

            const searchParams = {
              tabId: state?.tabId,
              pageNumber: filterData?.pageNumber,
              pageSize: filterData?.pageSize,
              sortColumn: filterData.sortColumn,
              sortDirection: filterData.sortDirection,
              filters: [filterValue, statusFilter],
            };

            setValue(tabData.sortOrder - 1);
            setFilterData(searchParams);

            await loadGridData(true, searchParams);

            setTabIdToSend(state?.tabId);
            setSearchValue((prev: any) => ({
              ...prev,
              ...(filterValue && {
                [filterToAdd.columnKey]: state.dateFilter,
              }),
              ...(statusFilter && { [statusFilter.columnKey]: state.status }),
            }));
          }
        }
      }

      getTabs();
    }
  }, [state?.status, state?.filter, pathname]);

  useEffect(() => {
    getRejectionReasonLookup();
  }, []);

  useEffect(() => {
    setSelectedBox({ requisitionOrderId: [] });
    setFilterData((prev: any) => ({
      ...prev,
      pageSize: 50,
    }));
  }, [value]);

  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);

  const [reason, setReason] = useState("");

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleCloseDropDown = (dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleClose = () => {
    setShowModalSetup(false);
  };

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
    clearState();
    const Id: any = event.currentTarget.id;
    const _tabId = +(event.target as any).id;

    const thenum: any = Id.match(/\d+/)[0];
    if (filterData?.tabId !== thenum) {
      const emptySearchObj = emptyObjectValues(searchValue);
      setSearchValue(emptySearchObj);

      filterData.tabId = parseInt(thenum);
      filterData.filters = [];
      filterData.pageNumber = 1;
      setCurPage(1);
      filterData.pageSize = 50;
    }

    setTabIdToSend(_tabId);
  };

  const downloadAll = () => {
    const obj = {
      tabId: filterData.tabId,
      // pageNumber: filterData.pageNumber,
      // pageSize: filterData.pageSize,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData.filters,
    };

    RequisitionType.viewRequisitionExportToExcelV2(obj).then(
      (res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          base64ToExcel(res.data.data.fileContents, "View Requisition");
        } else {
          toast.error(t(res?.data?.message));
        }
      }
    );
  };
  const downloadSelected = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      const obj = {
        tabId: filterData.tabId,
        // pageNumber: filterData.pageNumber,
        // pageSize: filterData.pageSize,
        sortColumn: filterData.sortColumn,
        sortDirection: filterData.sortDirection,
        filters: filterData.filters,
        selectedRow: selectedBox.requisitionOrderId,
      };
      RequisitionType.viewRequisitionExportToExcelV2(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(res.data.data.fileContents, "View Requisition");
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  const changeFacilityStausInBulk = async (requisitionStatus: number) => {
    if (buttonDisable) return;
    setButtonDisable(true);

    const value = selectedBox.requisitionOrderId
      .map((item: any) =>
        data.gridData.find((values: any) => values.RequisitionOrderId === item)
      )
      .find((val: any) => val.RequisitionStatus === "On Hold");

    if (value && requisitionStatus === 2) {
      toast.error(t("Cannot change status of On Hold Requisition"));
      setButtonDisable(false);
      return;
    }

    if (!showReason && requisitionStatus === 4) {
      toast.error(t("Please Select Reason"));
      setButtonDisable(false);
      return;
    }

    if (!reason && requisitionStatus !== 4) {
      toast.error(t("Please Enter Reason"));
      setButtonDisable(false);
      return;
    }

    const obj = {
      statusId: requisitionStatus,
      RequisitionOrderIds: selectedBox.requisitionOrderId,
      ActionReasons: input !== 4 ? reason : showReason?.subject,
    };

    try {
      const res: any =
        await RequisitionType.ViewRequisitionBulkStatusChange(obj);

      if (showReason?.subject !== "") {
        if (res.status === 200) {
          setCheck(true);
          setSelectedBox((prevState: any) => ({
            ...prevState,
            requisitionOrderId: [],
          }));
          handleCloseAlert();

          if (input === 4) {
            handleSaveAgainstReason(showReason?.subject);
          }

          loadGridData();
          toast.success(t("Request Succesfully Processed"));
          setShowReason(null);
          setReason("");
          setCheck(false);
        }
      } else {
        toast.error(t("Please Select Reason"));
        setError(t("Please Enter reasons"));
        setCheck(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Something went wrong"));
    } finally {
      setButtonDisable(false);
    }
  };

  // Single row delete function (separate from bulk)
  const handleSingleRowDelete = async (requisitionStatus: number) => {
    if (buttonDisable) return;
    setButtonDisable(true);

    if (!reason) {
      toast.error(t("Please Enter Reason"));
      setButtonDisable(false);
      return;
    }

    const obj = {
      statusId: requisitionStatus,
      RequisitionOrderIds: [singleRowDelete.requisitionOrderId],
      ActionReasons: reason,
    };

    try {
      const res: any =
        await RequisitionType.ViewRequisitionBulkStatusChange(obj);

      if (res.status === 200) {
        setCheck(true);
        handleCloseSingleRowDelete();
        loadGridData();
        toast.success(t("Request Succesfully Processed"));
        setReason("");
        setCheck(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(t("Something went wrong"));
    } finally {
      setButtonDisable(false);
    }
  };

  function filterRecordsById(records: any, ids: any) {
    return records.filter((record: any) => ids.includes(record.RequisitionId));
  }

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  const PrintSelectedReports = () => {
    const requisitionIds = selectedBox?.requisitionOrderId;

    if (!requisitionIds?.length) return;

    const hasMissingReport = requisitionIds.some((id) => {
      const row = data?.gridData.find(
        (template: any) =>
          template?.RequisitionOrderId === id ||
          template?.RequisitionOrderID === id
      );
      return !row?.ResultFile;
    });

    if (hasMissingReport) {
      toast.error(t("Please Select Records That Contain Reports"));
      return;
    }

    RequisitionType.PrintSelectedReports(requisitionIds).then(
      (res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res.data.message));
          ShowBlob(res.data.data);
        } else {
          toast.error(t(res.data.message));
        }
      }
    );
  };

  const PrintSelectedRecords = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      RequisitionType.PrintSelectedRecords(
        selectedBox?.requisitionOrderId
      ).then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          ShowBlob(res?.data?.data);
        } else {
          toast.error(t(res?.data?.message));
        }
      });
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  const PrintingFunctionArray = (label: any) => {
    if (label === "Print Selected Label") {
      if (selectedBox?.requisitionOrderId.length === 0) {
        toast.error(t("Select atleast one record ..."));
      } else {
        const filteredRecords = filterRecordsById(
          data?.gridData,
          selectedBox?.requisitionOrderId
        );
        const defaultPrinter = data.printersInfo.find(
          (printer: any) => printer.isDefault === true
        );
        if (defaultPrinter.label === "Dymo Printer") {
          DymoMultiPrint(filteredRecords);
        }
        if (defaultPrinter.label === "Zebra Printer") {
          ZebraMultiPrint(filteredRecords);
        }
        setSelectedBox({
          requisitionOrderId: [],
        });
      }
    }
    if (label === "Print Selected Records") {
      if (selectedBox?.requisitionOrderId.length === 0) {
        toast.error(t("Select atleast one record ..."));
      } else {
        PrintSelectedRecords();
      }
    }
    if (label === "Print Selected Reports") {
      if (selectedBox?.requisitionOrderId.length === 0) {
        toast.error(t("Select atleast one record ..."));
      } else {
        PrintSelectedReports();
      }
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    handleAddReasonClickClose();
    setError("");
    setShowReason(null);
    setReason("");
  };

  const handleCloseSingleRowDelete = () => {
    setSingleRowDelete({
      requisitionOrderId: null,
      requisitionId: null,
      isOpen: false,
    });
    setError("");
    setReason("");
  };

  const handleClickOpen = (
    status: any,
    requisitionOrderId?: number,
    requisitionId?: number
  ) => {
    // If requisitionOrderId is provided, it's a single row action
    if (requisitionOrderId && requisitionId) {
      // Set the selected box to contain only this single record
      setSelectedBox({
        requisitionOrderId: [requisitionOrderId],
        requisitionId: [requisitionId],
      });
      setOpenAlert(true);
      setInput(status);
      setShowReason(null);
    } else {
      // This is a bulk action, check if records are selected
      if (selectedBox.requisitionOrderId.length === 0) {
        toast.error(t("Please select atleast one record"));
      } else {
        setOpenAlert(true);
        setInput(status);
        setShowReason(null);
      }
    }
  };

  // Direct single row delete function
  const handleDirectSingleDelete = (
    requisitionOrderId: number,
    requisitionId: number
  ) => {
    setSelectedBox({
      requisitionOrderId: [requisitionOrderId],
      requisitionId: [requisitionId],
    });

    // Use separate state to avoid checkbox selection
    setSingleRowDelete({
      requisitionOrderId: requisitionOrderId,
      requisitionId: requisitionId,
      isOpen: true,
    });
    setInput(5); // 5 is the delete status
    setShowReason(null);
  };

  // Direct single row print function
  const handleDirectSinglePrint = (
    requisitionOrderId: number,
    requisitionId: number
  ) => {
    // Create the object for single record export
    const obj = {
      tabId: filterData.tabId,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData.filters,
      selectedRow: [requisitionOrderId],
    };

    setSelectedBox({
      requisitionOrderId: [requisitionOrderId],
      requisitionId: [requisitionId],
    });

    RequisitionType.viewRequisitionExportToExcelV2(obj).then(
      (res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          base64ToExcel(res.data.data.fileContents, "View Requisition");
        } else {
          toast.error(t(res?.data?.message));
        }
      }
    );
  };

  const handleChangeForActionReason = (message: any) => {
    setReason(message);
    setError("");
  };

  const resetSearch = () => {
    const emptySearchObj = emptyObjectValues(searchValue);
    const emptyObj = {
      tabId: tabIdToSend,
      pageSize: 50,
      pageNumber: 1,
      sortColumn: "",
      sortDirection: "",
      filters: [],
    };

    setFilterData(emptyObj);
    setSearchValue(emptySearchObj);
    setSearchedTags([]);
    setSelectedBox({ requisitionOrderId: [] });
    loadGridData(true, emptyObj);
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  useEffect(() => {
    const filteredObject: any = {};

    filterData.filters?.forEach((filterData: any) => {
      filteredObject[filterData.label] = filterData.filterValue;
    });

    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(filteredObject)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [filterData?.filters?.length]);

  const handleTagRemoval = (clickedTag: string) => {
    const resultedTab = filterData.filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });
    const resulted = filterData.filters.find((tab: any) => {
      return tab.label === clickedTag;
    });
    setFilterData((prev: any) => ({
      ...prev,
      filters: [...resultedTab],
    }));
    setSearchValue((prevValue: any) => ({
      ...prevValue,
      [resulted.columnKey]: "",
    }));
  };

  useEffect(() => {
    if (initialRender) {
      const hasTags = searchedTags.length > 0;
      if (!hasTags) {
        resetSearch();
      }
    } else {
      setInitialRender(true);
    }
  }, [searchedTags.length]);

  useEffect(() => {
    return () => {
      setData((prev: any) => ({
        ...prev,
        gridHeaders: [],
        gridColumns: [],
        gridData: [],
      }));
    };
  }, []);

  const handleClickForBulkPrint = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleCloseForBulkPrint = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const getPrinterContentData = async (payload: any) => {
    try {
      const printerContent = await RequisitionType.getPrinterContent(payload);
      return printerContent?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const printLabel = async (option: any, printerId: number) => {
    const objToSend = {
      printerId: printerId,
      contentList: selectedBox.requisitionOrderId.map(
        (orderId: number, index: number) => ({
          requisitionOrderId: orderId.toString(),
          requisitionId: selectedBox.requisitionId[index] || "",
        })
      ),
    };

    if (selectedBox.requisitionOrderId.length !== 0) {
      const content = await getPrinterContentData(objToSend);
      if (option?.includes("zebra") || option?.includes("Zebra")) {
        ZebraMultiPrint(content);
        handleCloseForBulkPrint("dropdown4");
        return;
      }
      if (option.includes("dymo") || option.includes("Dymo")) {
        DymoMultiPrint(content);
        handleCloseForBulkPrint("dropdown4");
        return;
      }
      if (option.includes("brother") || option.includes("Brother")) {
        BrotherPrint(content);
        handleCloseForBulkPrint("dropdown4");
        return;
      } else {
        toast.error(t("Configuration not available"));
        return;
      }
    } else {
      toast.error(t("Please select atleast one record"));
    }
  };

  const handleAddReasonClick = () => {
    setInputFields(true); // Show the input fields on button click
  };

  const handleAddReasonClickClose = () => {
    setInputFields(false); // Show the input fields on button click
  };

  const addRejectionReason = async () => {
    const obj = {
      text: addRejection?.subject,
      subject: addRejection?.subject,
      description: addRejection?.description,
      requisitionAssignment: [],
    };
    if (addRejection?.subject === "" && addRejection?.description === "")
      return;
    setButtonDisable(true);
    await RequisitionType.AddRejectionReason(obj).then((res: any) => {
      if (res.status === 200) {
        toast.success(t(res?.data?.message));
        setButtonDisable(false);
        handleAddReasonClickClose();
        getRejectionReasonLookup();
        setAddRejection({ subject: "", description: "" });
      } else {
        toast.success(t(res?.data?.message));
        setButtonDisable(false);
      }
    });
  };

  useEffect(() => {
    setFilteredRow(
      data?.gridData?.filter((item: any) =>
        selectedBox?.requisitionOrderId?.includes(
          item?.RequisitionOrderId || item?.RequisitionOrderID
        )
      )
    );
  }, [selectedBox]);

  // api calls on initial page load
  useEffect(() => {
    if (state?.callFrom !== "dashboard") {
      initialPageLoadApiCalls();
    }
  }, []);

  useEffect(() => {
    if (tabIdToSend !== null && state?.callFrom !== "dashboard") {
      loadGridData(true);
    }
  }, [tabIdToSend]);

  useEffect(() => {
    getRejectionReasonLookup();
  }, []);

  useEffect(() => {
    setSelectedBox({ requisitionOrderId: [] });
    setFilterData((prev: any) => ({
      ...prev,
      pageSize: 50,
    }));
  }, [value]);

  const handleDeleteReason = async (reasonId: number) => {
    const res = await RequisitionType.RequisitionRejectionDelete(reasonId);
    if (res?.data?.httpStatusCode) {
      getRejectionReasonLookup();
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message);
    }
  };

  // Custom option (what appears in the dropdown)
  const Option = (props: any) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 10,
          paddingLeft: 10,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <span
          ref={innerRef}
          {...innerProps}
          style={{ marginLeft: 8, cursor: "pointer" }}
        >
          {data.label}
        </span>
        <RxCross2
          color="red"
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteReason(data.value)}
        />
      </div>
    );
  };

  const transferRecords = async (actionName: string) => {
    try {
      if (selectedBox.requisitionOrderId.length === 0) {
        toast.error(t("Please select atleast one record"));
        return;
      }

      const response = await RequisitionType.transferRecords(
        selectedBox.requisitionOrderId,
        actionName
      );

      if (response.data.httpStatusCode === 200) {
        toast.success(t(response.data.message));
        setSelectedBox({ requisitionOrderId: [] });
        loadGridData();
      } else {
        toast.error(t(response.data.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ColumnSetup
        show={showSetupModal}
        closeSetupModal={handleClose}
        loadData={loadTabs}
        dynamicGridLoad={loadGridData}
        columnsToUse={data?.gridHeaders[value]?.tabHeaders}
        value={tabIdToSend}
      />
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              {/* <PermissionComponent
                moduleName="Requisition"
                pageName="View Requisition"
                permissionIdentifier="Setup"
              > */}
              <Tooltip title={t("Setup")} arrow placement="top">
                <button
                  id="ViewRequisitionButtonSetup"
                  className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
                  onClick={() => setShowModalSetup(true)}
                >
                  <i className="fa fa-gear"></i>
                </button>
              </Tooltip>
              {/* </PermissionComponent> */}

              {checkPermissions(menus, "/requisition") && (
                <PermissionComponent
                  moduleName="Requisition"
                  pageName="View Requisition"
                  permissionIdentifier="CreateRequisition"
                >
                  <Link
                    id="CreatRequisitionButton"
                    className="btn btn-sm fw-500 btn-primary"
                    to={"/requisition"}
                  >
                    <i className="bi bi-plus-lg"></i>
                    {t("Create Requisition")}
                  </Link>
                </PermissionComponent>
              )}
            </div>
          </div>
        </div>

        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="mb-5">
              <Tabs
                value={value}
                onChange={handleChange}
                className="min-h-auto"
                TabIndicatorProps={{
                  style: { background: "transparent", cursor: "pointer" },
                }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  "& .MuiTabs-scrollButtons": {
                    width: 0,
                    transition: "width 0.7s ease",
                    "&:not(.Mui-disabled)": {
                      width: "48px",
                    },
                  },
                }}
              >
                {Array.isArray(data.gridHeaders) &&
                  data?.gridHeaders?.map((items: any) => (
                    <TabSelected
                      data-test-id={items?.tabName?.replace(/\s/g, "")}
                      key={items?.tabID}
                      label={t(items?.tabName)}
                      {...a11yProps(items?.tabID, items.sortOrder)}
                      className="fw-bold text-capitalize"
                      // disabled={loading.header}
                    />
                  ))}
              </Tabs>
              <div className="card tab-content-card">
                <div className="mb-2 mt-2 px-3 px-md-8">
                  <div className="d-flex gap-2 flex-wrap">
                    {searchedTags.map((tag: any, index: number) =>
                      tag === "isArchived" ? null : (
                        <div
                          key={tag + index}
                          className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                          onClick={() => handleTagRemoval(tag)}
                        >
                          <span className="fw-bold">{tag}</span>
                          <i className="bi bi-x"></i>
                        </div>
                      )
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="d-flex align-items-center">
                        <span className="fw-400 mr-3">{t("Records")}</span>
                        <select
                          id="ViewRequisitionRecord"
                          className="form-select w-100px h-33px rounded"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          onChange={async (e) => {
                            const value = parseInt(e.target.value);
                            setPageSize(value);
                            filterData.pageSize = value;
                            await loadGridData();
                          }}
                          value={filterData.pageSize}
                        >
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="150">150</option>
                          <option value="200">200</option>
                        </select>
                      </div>
                      <div className="d-flex gap-lg-3 gap-2 justify-content-around">
                        {filterData?.tabId === 2 ||
                        filterData?.tabId === 3 ||
                        filterData?.tabId === 4 ||
                        filterData?.tabId === 5 ? null : (
                          <>
                            {!isMobile && (
                              <div>
                                <StyledDropButton
                                  id="ViewRequisitionBulkAction"
                                  aria-controls={
                                    openDrop
                                      ? "demo-positioned-menu1"
                                      : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={openDrop ? "true" : undefined}
                                  onClick={(event) =>
                                    handleClick(event, "dropdown1")
                                  }
                                  className="btn btn-info btn-sm"
                                >
                                  {t("bulk action")}
                                  <span className="svg-icon svg-icon-5 m-0">
                                    <ArrowBottomIcon />
                                  </span>
                                </StyledDropButton>
                                <StyledDropMenu
                                  aria-labelledby="demo-positioned-button1"
                                  anchorEl={anchorEl.dropdown1}
                                  open={Boolean(anchorEl.dropdown1)}
                                  onClose={() =>
                                    handleCloseDropDown("dropdown1")
                                  }
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                  }}
                                >
                                  <div className="d-flex flex-wrap">
                                    <div style={{ minWidth: "150px" }}>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="Completed"
                                      >
                                        <MenuItem className="p-0">
                                          <a
                                            className="p-0 text-dark w-100"
                                            id="ViewRequisitionBulkComplete"
                                            onClick={() => {
                                              handleCloseDropDown("dropdown1");
                                              handleClickOpen(3);
                                            }}
                                          >
                                            {t("Complete")}
                                          </a>
                                        </MenuItem>
                                      </PermissionComponent>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="Deleted"
                                      >
                                        <MenuItem className="p-0">
                                          <a
                                            id="ViewRequisitionBulkDelete"
                                            className="p-0 text-dark w-100"
                                            onClick={() => {
                                              handleCloseDropDown("dropdown1");
                                              handleClickOpen(5);
                                            }}
                                          >
                                            {t("Delete")}
                                          </a>
                                        </MenuItem>
                                      </PermissionComponent>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="OnHold"
                                      >
                                        <MenuItem className="p-0">
                                          <a
                                            id="ViewRequisitionBulkHold"
                                            className="p-0 text-dark w-100"
                                            onClick={() => {
                                              handleCloseDropDown("dropdown1");
                                              handleClickOpen(2);
                                            }}
                                          >
                                            {t("Hold")}
                                          </a>
                                        </MenuItem>
                                      </PermissionComponent>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="Rejected"
                                      >
                                        <MenuItem className="p-0">
                                          <a
                                            id="ViewRequisitionBilkReject"
                                            className="p-0 text-dark w-100"
                                            onClick={() => {
                                              handleCloseDropDown("dropdown1");
                                              handleClickOpen(4);
                                            }}
                                          >
                                            {t("Reject")}
                                          </a>
                                        </MenuItem>
                                      </PermissionComponent>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="TransferOrderToZoho"
                                      >
                                        {({
                                          pageName,
                                          moduleName,
                                          permissionIdentifier,
                                        }) => (
                                          <MenuItem className="p-0">
                                            <a
                                              id="ViewRequisitionBulkTransfer"
                                              className="p-0 text-dark w-100"
                                              onClick={() => {
                                                handleCloseDropDown(
                                                  "dropdown1"
                                                );
                                                transferRecords(
                                                  permissionIdentifier
                                                );
                                              }}
                                            >
                                              {getPermissionDisplayName(
                                                pageName,
                                                moduleName,
                                                permissionIdentifier,
                                                "Transfer To Zoho"
                                              )}
                                            </a>
                                          </MenuItem>
                                        )}
                                      </PermissionComponent>
                                    </div>

                                    <div style={{ minWidth: "200px" }}>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="PrintSelectedRecords"
                                      >
                                        <MenuItem className="p-0">
                                          <a
                                            className="p-0 text-dark w-100"
                                            id="ViewRequisitionBilkPrintSelectedRecord"
                                            onClick={() => {
                                              PrintingFunctionArray(
                                                "Print Selected Records"
                                              );
                                              handleCloseDropDown("dropdown2");
                                            }}
                                          >
                                            {t("Print Selected Records")}
                                          </a>
                                        </MenuItem>
                                      </PermissionComponent>
                                      <PermissionComponent
                                        moduleName="Requisition"
                                        pageName="View Requisition"
                                        permissionIdentifier="PrintSelectedReports"
                                      >
                                        <MenuItem className="p-0">
                                          <a
                                            id="ViewRequisitionPrintReports"
                                            className="p-0 text-dark w-100"
                                            onClick={() => {
                                              PrintingFunctionArray(
                                                "Print Selected Reports"
                                              );
                                              handleCloseDropDown("dropdown3");
                                            }}
                                          >
                                            {t("Print Selected Reports")}
                                          </a>
                                        </MenuItem>
                                      </PermissionComponent>
                                    </div>
                                  </div>
                                </StyledDropMenu>
                              </div>
                            )}
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="View Requisition"
                              permissionIdentifier="PrintSelectedLabel"
                            >
                              <div>
                                <StyledDropButton
                                  id="ViewRequisitionBulkLablePrint"
                                  aria-controls={
                                    openDrop
                                      ? "demo-positioned-menu4"
                                      : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={openDrop ? "true" : undefined}
                                  onClick={(event) =>
                                    handleClickForBulkPrint(event, "dropdown4")
                                  }
                                  className="btn btn-warning  btn-sm"
                                >
                                  {t("Bulk Label Print")}
                                  <span className="svg-icon svg-icon-5 m-0">
                                    <ArrowBottomIcon />
                                  </span>
                                </StyledDropButton>
                                <StyledDropMenu
                                  id="BilkLabelPrintMenu"
                                  aria-labelledby="demo-positioned-button4"
                                  anchorEl={anchorEl.dropdown4}
                                  open={Boolean(anchorEl.dropdown4)}
                                  onClose={() =>
                                    handleCloseForBulkPrint("dropdown4")
                                  }
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                  }}
                                  className="w-auto"
                                >
                                  {data?.printersInfo?.map((option: any) => (
                                    <a
                                      key={option.value}
                                      id={`ViewRequisitionPrinter${option?.value}`}
                                    >
                                      <MenuItem
                                        className="w-auto"
                                        key={option.value}
                                        value={t(option.value)}
                                        onClick={() =>
                                          printLabel(
                                            option?.label,
                                            option.value
                                          )
                                        }
                                      >
                                        <i className="fa fa fa-print text-warning mr-2 w-20px"></i>
                                        {option?.label}
                                      </MenuItem>
                                    </a>
                                  ))}
                                </StyledDropMenu>
                              </div>{" "}
                            </PermissionComponent>
                          </>
                        )}
                        <div>
                          <AnyPermission
                            moduleName="Requisition"
                            pageName="View Requisition"
                            permissionIdentifiers={[
                              "ExportAllRecords",
                              "ExportSelectedRecords",
                            ]}
                          >
                            <StyledDropButton
                              id="ViewRequisitiionExportRecordButton"
                              aria-controls={
                                openDrop ? "demo-positioned-menu2" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event) =>
                                handleClick(event, "dropdown2")
                              }
                              className="btn btn-excle btn-sm"
                            >
                              <ExportIcon />
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                            <StyledDropMenu
                              aria-labelledby="demo-positioned-button2"
                              anchorEl={anchorEl.dropdown2}
                              open={Boolean(anchorEl.dropdown2)}
                              onClose={() => handleCloseDropDown("dropdown2")}
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
                                moduleName="Requisition"
                                pageName="View Requisition"
                                permissionIdentifier="ExportAllRecords"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id="ViewRequisitionExportAllRecord"
                                    className="p-0 text-dark w-100"
                                    onClick={() => {
                                      handleCloseDropDown("dropdown2");
                                      downloadAll();
                                    }}
                                  >
                                    <ExportAllRecords />
                                    {t("Export All Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                              <PermissionComponent
                                moduleName="Requisition"
                                pageName="View Requisition"
                                permissionIdentifier="ExportSelectedRecords"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id="ViewRequisitionExportSelectedRecord"
                                    className="p-0 text-dark w-100"
                                    onClick={() => {
                                      handleCloseDropDown("dropdown2");
                                      downloadSelected();
                                    }}
                                  >
                                    <SelectedRecords />
                                    {t("Export Selected Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenu>
                          </AnyPermission>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      {isMobile && (
                        <div>
                          <StyledDropButton
                            id="ViewRequisitionBulkAction"
                            aria-controls={
                              openDrop ? "demo-positioned-menu1" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openDrop ? "true" : undefined}
                            onClick={(event) => handleClick(event, "dropdown1")}
                            className="btn btn-info btn-sm"
                          >
                            {t("bulk action")}
                            <span className="svg-icon svg-icon-5 m-0">
                              <ArrowBottomIcon />
                            </span>
                          </StyledDropButton>
                          <StyledDropMenu
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown1}
                            open={Boolean(anchorEl.dropdown1)}
                            onClose={() => handleCloseDropDown("dropdown1")}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <div className="row m-0 p-0">
                              <div className="col-12 col-sm-6 px-0">
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="Completed"
                                >
                                  <MenuItem className="p-0">
                                    <a
                                      className="p-0 text-dark w-100"
                                      id="ViewRequisitionBulkComplete"
                                      onClick={() => {
                                        handleCloseDropDown("dropdown1");
                                        handleClickOpen(3);
                                      }}
                                    >
                                      {t("Complete")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="Deleted"
                                >
                                  <MenuItem className="p-0">
                                    <a
                                      id="ViewRequisitionBulkDelete"
                                      className="p-0 text-dark w-100"
                                      onClick={() => {
                                        handleCloseDropDown("dropdown1");
                                        handleClickOpen(5);
                                      }}
                                    >
                                      {t("Delete")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="OnHold"
                                >
                                  <MenuItem className="p-0">
                                    <a
                                      id="ViewRequisitionBulkHold"
                                      className="p-0 text-dark w-100"
                                      onClick={() => {
                                        handleCloseDropDown("dropdown1");
                                        handleClickOpen(2);
                                      }}
                                    >
                                      {t("Hold")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="Rejected"
                                >
                                  <MenuItem className="p-0">
                                    <a
                                      id="ViewRequisitionBilkReject"
                                      className="p-0 text-dark w-100"
                                      onClick={() => {
                                        handleCloseDropDown("dropdown1");
                                        handleClickOpen(4);
                                      }}
                                    >
                                      {t("Reject")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                              </div>

                              <div className=" col-12 col-sm-6 px-0 w-185px ">
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="PrintSelectedRecords"
                                >
                                  <MenuItem
                                    className=" p-0"
                                    style={{ width: "230px" }}
                                  >
                                    <a
                                      className="p-0 text-dark  "
                                      id="ViewRequisitionBilkPrintSelectedRecord"
                                      onClick={() => {
                                        PrintingFunctionArray(
                                          "Print Selected Records"
                                        );
                                        handleCloseDropDown("dropdown2");
                                      }}
                                    >
                                      {t("Print Selected Records")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="PrintSelectedReports"
                                >
                                  <MenuItem
                                    className="p-0"
                                    style={{ width: "230px" }}
                                  >
                                    <a
                                      id="ViewRequisitionPrintReports"
                                      className="p-0 text-dark "
                                      onClick={() => {
                                        PrintingFunctionArray(
                                          "Print Selected Reports"
                                        );
                                        handleCloseDropDown("dropdown3");
                                      }}
                                    >
                                      {t("Print Selected Reports")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                              </div>
                            </div>
                          </StyledDropMenu>
                        </div>
                      )}

                      <button
                        id="ViewRequisitionSearchButton"
                        onClick={() => {
                          setCurPage(1);
                          setTriggerSearchData((prev) => !prev);
                        }}
                        className="btn btn-linkedin btn-sm fw-500"
                        aria-controls="Search"
                      >
                        {" "}
                        {t("Search")}
                      </button>
                      <button
                        onClick={resetSearch}
                        type="button"
                        className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                        id="ViewRequisitionResetButton"
                      >
                        <span>
                          <span>{t("Reset")}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <TabPanel value={value} index={value}>
                    <ReqDataGrid
                      tabsInfo={data?.gridHeaders[value]?.tabHeaders}
                      rowInfo={data?.gridData}
                      portalType={portalType}
                      setCurPage={setCurPage}
                      onSingleDelete={handleDirectSingleDelete}
                      onSinglePrint={handleDirectSinglePrint}
                    />
                  </TabPanel>
                  {!data?.gridHeaders[0]?.tabHeaders ? null : (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <BootstrapModal
          show={openalert}
          onHide={handleCloseAlert}
          backdrop="static"
          keyboard={false}
        >
          <BootstrapModal.Header
            closeButton
            className="bg-light-warning m-0 p-5"
          >
            <h5>{t("Reason")}</h5>
          </BootstrapModal.Header>
          {input !== 4 ? (
            <BootstrapModal.Body>
              <div className="required d-flex">
                <div className="w-100">
                  <input
                    type="text"
                    name="actionReasons"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder="Enter Reasons"
                    required
                    onChange={(event: any) =>
                      handleChangeForActionReason(event?.target?.value)
                    }
                  />
                </div>
              </div>
              {error ? <span style={{ color: "red" }}>{error}</span> : null}
            </BootstrapModal.Body>
          ) : (
            <BootstrapModal.Body>
              <div className="fv-row mb-4">
                <label htmlFor="status" className="mb-2 required form-label">
                  {t("Select Reason")}
                </label>
                <Select
                  options={rejectionReason}
                  components={{ Option }}
                  placeholder={"Select Reason"}
                  theme={(theme) => styles(theme)}
                  isSearchable={true}
                  onChange={handleChangeRejectionReasonDropdown}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      borderColor: "var(--kt-input-border-color)",
                      color: "var(--kt-input-border-color)",
                    }),
                  }}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-warning btn-sm mb-2"
                  onClick={handleAddReasonClick}
                >
                  {t("Add Another Reason")}
                </button>
              </div>
              {inputFields && (
                <>
                  <div>
                    <div className="mb-3">
                      <label className="form-label required">
                        {t("Subject")}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        className="form-control bg-transparent"
                        placeholder="Subject"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label required">
                        {t("Description")}
                      </label>
                      <input
                        type="text"
                        name="description"
                        className="form-control bg-transparent"
                        placeholder="Description"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-info btn-sm mb-2"
                      onClick={handleAddReasonClickClose}
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      className="btn btn-primary btn-sm mb-2"
                      onClick={addRejectionReason}
                      disabled={buttonDisable}
                    >
                      {t("Save")}
                    </button>
                  </div>
                </>
              )}

              {Array.isArray(filteredRow) && (
                <>
                  <div className="mb-2">
                    <span className="fw-500">
                      {t("Following Order is selected")}
                    </span>
                  </div>
                  <br />
                  <div>
                    {filteredRow.map((row: any, index: number) => (
                      <>
                        <span key={index}>{row?.Order}</span>
                        <span> | </span>
                        <span key={index}>
                          {moment(row?.AddedDate).format("MM/DD/YYYY")}
                        </span>
                        <span> | </span>
                        <span key={index}>{row?.RequisitionType}</span>
                        {index !== filteredRow.length - 1 && <br />}
                      </>
                    ))}
                  </div>
                  <br />
                  <div>
                    {showReason && (
                      <div className="mt-5">
                        <span className="fw-bold">{t("Reason")} : </span>
                        <span className="text-danger">
                          {showReason?.subject}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="mt-5">
                <label className="form-label">{t("Rejection Comment")}</label>
                <textarea
                  name="actionReasons"
                  className="form-control bg-transparent mb-3 mb-lg-0 h-50px"
                  placeholder="Rejection Comments"
                  required
                  onChange={(event: any) =>
                    handleChangeForActionReason(event?.target?.value)
                  }
                />
              </div>
              {error ? <span style={{ color: "red" }}>{error}</span> : null}
            </BootstrapModal.Body>
          )}
          <BootstrapModal.Footer className="p-0">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCloseAlert}
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm m-2"
              disabled={buttonDisable}
              style={{
                pointerEvents: buttonDisable ? "none" : "auto",
                opacity: buttonDisable ? 0.6 : 1,
              }}
              onClick={() => changeFacilityStausInBulk(input)}
            >
              <span>{check ? <LoaderIcon /> : null}</span>{" "}
              <span>{t("Save")}</span>
            </button>
          </BootstrapModal.Footer>
        </BootstrapModal>

        {/* Single Row Delete Modal */}
        <BootstrapModal
          show={singleRowDelete.isOpen}
          onHide={handleCloseSingleRowDelete}
          backdrop="static"
          keyboard={false}
        >
          <BootstrapModal.Header
            closeButton
            className="bg-light-warning m-0 p-5"
          >
            <h5>{t("Delete Requisition")}</h5>
          </BootstrapModal.Header>
          <BootstrapModal.Body>
            <div className="mb-3">
              <p>{t("Are you sure you want to delete this requisition?")}</p>
            </div>
            <div className="required d-flex">
              <div className="w-100">
                <input
                  type="text"
                  name="actionReasons"
                  className="form-control bg-transparent mb-3 mb-lg-0"
                  placeholder="Enter Reason for Deletion"
                  required
                  onChange={(event: any) =>
                    handleChangeForActionReason(event?.target?.value)
                  }
                />
              </div>
            </div>
            {error ? <span style={{ color: "red" }}>{error}</span> : null}
          </BootstrapModal.Body>
          <BootstrapModal.Footer className="p-0">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCloseSingleRowDelete}
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm m-2"
              disabled={buttonDisable}
              style={{
                pointerEvents: buttonDisable ? "none" : "auto",
                opacity: buttonDisable ? 0.6 : 1,
              }}
              onClick={() => handleSingleRowDelete(5)}
            >
              <span>{check ? <LoaderIcon /> : null}</span>{" "}
              <span>{t("Delete")}</span>
            </button>
          </BootstrapModal.Footer>
        </BootstrapModal>
      </div>
    </>
  );
};

export default ViewReq;
