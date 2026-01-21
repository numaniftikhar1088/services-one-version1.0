import { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
import { SortingTypeI } from "../../Utils/consts";
import { FilterDataI } from "../ResultDataContext";
import { StringRecord } from "../Type";
export interface IRows {
  Id: number | null;
  CuttOff: number;
  GroupName: string;
  GroupNameId: number | null;
  Linearity: number | null;
  Organism: string;
  PanelCode: string;
  PanelId: number;
  PanelName: string;
  PanelType: string;
  PanelTypeId: number | null;
  PerformingLabId: number;
  PerformingLabName: string;
  ReportingRuleId: number;
  ReportingRuleName: string;
  ReqTypeId: number;
  SpecimenType: string;
  SpecimenTypeID: number | null;
  TestCode: string;
  TestId: number | null;
  TestName: string;
  Unit: string;
  rowStatus: boolean | undefined;
}
type Context = {
  data: any;
  refetchData: any;
  refetch: any;
  setData: any;
  filterData: FilterDataI;
  setFilterData: any;
  searchValue: any;
  setSearchValue: any;
  loadDataAllRequisition: any;
  getFacilityLookup: any;
  selectedBox: any;
  setSelectedBox: any;
  getPrintersInfo: any;
  initializeCalls: any;
  loading: any;
  NextStep: any;
  isSubmittingNextStepAction: any;
  apiCalls: any;
  value: any;
  setValue: any;
  open: boolean;
  setOpen: any;
  RestoreRequisition: any;
  intialValue: any;
  value1: any;
  setValue1: any;
  handleChange: any;
  a11yProps: any;
  rows: any;
  setRows: any;
  selectedOptions: any;
  setSelectedOptions: any;
  SetInitilizeCalls: any;
  addRow: any;
  handleDeleteRow: any;
  handleChangeTestType: any;
  GroupLookup: any;
  DropDowns: any;
  ApiCallsForToxicology: any;
  setCurPage: any;
  curPage: any;
  pageSize: any;
  setPageSize: any;
  total: any;
  setTotal: any;
  searchRequest: any;
  setSearchRequest: any;
  sort: any;
  setSorting: any;
  intialSearchQuery: any;
  LoadToxCompendium: any;
  tox: any;
  setTox: any;
  resetSearch: any;
  proceed: any;
  setDropdowns: any;
  queryDisplayTagNames: any;
  onInputChangeSearch: any;
  searchedTags: any;
  setSearchedTags: any;
  handleTagRemoval: any;
  handleSubmitForToxCompendium: any;
  handleKeyPress: any;
  handleSort: any;
  searchRef: any;
  FindPanelType: any;
  handleAllSelect: any;
  handleChangePanelMappinfId: any;
  handleChangeForToxCompendium: any;
  selectedBox1: any;
  setSelectedBox1: any;
  downloadAll: any;
  downloadSelected: any;
  isAddButtonDisabled: any;
  setIsAddButtonDisabled: any;
  request1: any;
  setRequest1: any;
  setDefaultValue: React.Dispatch<SetStateAction<boolean>>;
  SpecimenTypeLookup: any;
  ConfirmationTestTypeLookup: any;
  loadData: () => void;
  getRejectionReasonLookup: any;
  rejectionReason: any;
};

const context = createContext<Context>({} as Context);
export const intialValue = {
  tabId: 1,
  pageSize: 50,
  pageNumber: 1,
  sortColumn: "",
  sortDirection: "",
  filters: [],
};

export default function BillingDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  // ----------------------------------View Requisition Functions & States---------------------------------------------

  const [refetch, refetchData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<any>(false);
  const [value, setValue] = useState(0);
  const [filterData, setFilterData] = useState<any>(intialValue);
  const [searchValue, setSearchValue] = useState({});
  const [defaultValue, setDefaultValue] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<any>([]);
  const [initializeCalls, SetInitilizeCalls] = useState<any>(false);
  const sortById = {
    clickedIconData: "Id",
    sortingOrder: "desc",
  };
  const [data, setData] = useState<any>({
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
  });
  console.log(data, "data");

  const [selectedBox, setSelectedBox] = useState<any>({
    requisitionOrderId: [],
  });
  const [isSubmittingNextStepAction, setisSubmittingNextStepAction] =
    useState(false);
  //const [printersInfo, setPrintersInfo] = useState<any[]>([]);
  const getPrintersInfo = async () => {
    await RequisitionType.GetPrintersInfo().then((res: any) => {
      setData((preVal: any) => {
        return {
          ...preVal,
          printersInfo: res?.data?.data,
        };
      });
    });
  };

  const getRejectionReasonLookup = async () => {
    await RequisitionType.GetRejectionReasonLookup().then((res: any) => {
      setRejectionReason(res?.data);
    });
  };

  const loadData = async () => {
    let response: any;
    try {
      response = await RequisitionType.viewRequisitionTabs();
      setData((preVal: any) => {
        return {
          ...preVal,
          gridHeaders: response?.data?.data,
        };
      });

      const responseTabs = response?.data?.data.sort(function (a: any, b: any) {
        return a.sortOrder - b.sortOrder;
      });
      return responseTabs;
    } catch (error) {
      return error;
    }
  };
  const loadDataAllRequisition = async (initialTabId?: number) => {
    let searchParams = {
      tabId: initialTabId ?? filterData?.tabId,
      pageNumber: filterData?.pageNumber,
      pageSize: filterData?.pageSize,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData?.filters,
    };
    let response: any;
    try {
      response = await RequisitionType.getAllBillingRequisition(searchParams);
      SetInitilizeCalls(true);
      setData((preVal: any) => {
        return {
          ...preVal,
          gridData: response,
        };
      });
      setTotal(response?.data?.total);
      return response;
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };
  const apiCalls = async () => {
    loadData();
    loadDataAllRequisition();
  };
  const getFacilityLookup = async () => {
    let response: any;
    try {
      response = await UserManagementService.GetFacilitiesLookup();

      setData((preVal: any) => {
        return {
          ...preVal,
          facilityLookup: response?.data,
        };
      });
    } catch (error) {
      return error;
    }
  };

  const NextStep = async (formData: any) => {
    setisSubmittingNextStepAction(true);
    let response: any;
    try {
      response = await RequisitionType.NextStepAction(formData);
      if (response?.data?.httpStatusCode === 200) {
        loadDataAllRequisition();
      }
    } catch (error) {
    } finally {
      setisSubmittingNextStepAction(false);
    }
  };
  const RestoreRequisition = (id: number) => {
    RequisitionType.RestoreRequisition(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res.data.message);
          loadDataAllRequisition();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err: AxiosError) => {});
  };
  //-------------------------------------------- Toxicology Functions State and all things---------------------------------------

  let intialSearchQuery = {
    performingLabId: 0,
    panelTypeId: 0,
    panelName: "",
    panelCode: "",
    specimenTypeID: 0,
    testName: "",
    drugClass: "",
    testCode: "",
    groupName: "",
    unit: "",
    cutoff: 0,
    linearity: 0,
  };
  const [value1, setValue1] = useState(0);
  const [rows, setRows] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState(50);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [curPage, setCurPage] = useState(1);
  let [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  const [tox, setTox] = useState<any[]>(() => []);
  const [confirmation, setConfirmation] = useState<any[]>(() => []);
  const [proceed, setProceed] = useState(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [request1, setRequest1] = useState(false);
  const [DropDowns, setDropdowns] = useState<any>({
    GroupLookup: [],
    ReferenceLabLookup: [],
    PanelTypeLookup: [],
    SpecimenTypeLookup: [],
    ScreenTestLookup: [],
    ConfiramtionTestType: [],
  });
  const [selectedBox1, setSelectedBox1] = useState<any>({
    id: [],
  });
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTox([]);
    setTotal(0);
    setValue1(newValue);
  };
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const addRow = () => {
    setRows((prevRows: any) => [...prevRows, prevRows.length + 1]);
  };
  const handleDeleteRow = (index: number) => {
    setRows((prevRows: any) =>
      prevRows.filter((_: any, i: any) => i !== index)
    );
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    );
  };
  const handleChangeTestType = (selectedOption: any, rowIndex: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[rowIndex] = selectedOption;
    setSelectedOptions(updatedOptions);
  };
  const GroupLookup = () => {
    RequisitionType.ToxicologyGroupLookup()
      .then((res: AxiosResponse) => {
        setDropdowns((prev: any) => ({
          ...prev,
          GroupLookup: res?.data,
        }));
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const ScreenTestLookup = () => {
    RequisitionType.ScreenTestLookup()
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.result.map((item: any) => ({
          value: item.TestId,
          label: item.TestName,
        }));
        setDropdowns((prev: any) => ({
          ...prev,
          ScreenTestLookup: mappedData,
        }));
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const PanelTypeLookup = () => {
    RequisitionType.ToxicologyPanelTypeLookup()
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.data.map((item: any) => ({
          value: item.panelTypeId,
          label: item.panelType,
        }));
        setDropdowns((prev: any) => ({
          ...prev,
          PanelTypeLookup: mappedData,
        }));
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const ReferenceLabLookup = () => {
    RequisitionType.ToxicologyReferenceLab()
      .then((res: AxiosResponse) => {
        setDropdowns((prev: any) => ({
          ...prev,
          ReferenceLabLookup: res?.data,
        }));
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const ConfirmationTestTypeLookup = () => {
    RequisitionType.ConfirmationTestTypeLookup()
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.result.map((item: any) => ({
          value: item.TestId,
          label: item.TestName,
        }));
        setDropdowns((prev: any) => ({
          ...prev,
          ConfiramtionTestType: mappedData,
        }));
      })
      .catch((err: AxiosError) => {});
  };
  const SpecimenTypeLookup = () => {
    RequisitionType.SpecimenTypeLookup()
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.data.map((item: any) => ({
          value: item.specimenTypeId,
          label: item.specimenType,
        }));
        setDropdowns((prev: any) => ({
          ...prev,
          SpecimenTypeLookup: mappedData,
        }));
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const LoadToxCompendium = async (
    loader: boolean,
    reset: boolean,
    P_Id: any,
    sortingState?: any
  ) => {
    if (loader) {
      setProceed(true);
    }
    setIsAddButtonDisabled(false);
    const nullObj = {
      performingLabId: 0,
      panelTypeId: P_Id,
      panelName: "",
      panelCode: "",
      specimenTypeID: 0,
      testName: "",
      drugClass: "",
      testCode: "",
      groupName: "",
      unit: "",
      cutoff: 0,
      linearity: 0,
    };
    await RequisitionType.ToxCompendiumGetAll({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : searchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        console.log(res, "Response");
        if (res.status === 200) {
          setTox(res?.data.result);

          setConfirmation(res?.data?.result);
          setTotal(res?.data?.totalRecord);
          setProceed(false);
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setProceed(false);
      });
  };
  function resetSearch(pid: any) {
    setSearchRequest({
      performingLabId: 0,
      panelTypeId: 0,
      panelName: "",
      panelCode: "",
      specimenTypeID: 0,
      testName: "",
      drugClass: "",
      testCode: "",
      groupName: "",
      unit: "",
      cutoff: 0,
      linearity: 0,
    });
    LoadToxCompendium(true, true, pid, sortById);
    setSorting(sortById);
  }
  const queryDisplayTagNames: StringRecord = {
    performingLabId: "Performing Lab",
    panelTypeId: "Panel Type",
    panelName: "Panel Name",
    panelCode: "Panel Code",
    specimenTypeID: "Specimen Type",
    testName: "Test Name",
    drugClass: "Drug Class",
    testCode: "Test Code",
    groupName: "Group",
    unit: "Unit",
    cutoff: "CuttOff",
    linearity: "Linearity",
  };

  const ApiCallsForToxicology = async () => {
    GroupLookup();
    ReferenceLabLookup();
    PanelTypeLookup();
    SpecimenTypeLookup();
    ScreenTestLookup();
  };
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (intialSearchQuery as any)[clickedTag],
      };
    });
  };
  const FindPanelType = (PanelName: string) => {
    const panelType = DropDowns?.PanelTypeLookup?.find(
      (option: any) => option.label === PanelName
    );
    return panelType || null;
  };
  const handleSubmitForToxCompendium = async (
    row: any,
    PanelName: any,
    LoadFunction: Function
  ) => {
    console.log(row, "row");
    // debugger;

    let isDataValidated = false;
    switch (PanelName) {
      case "Confirmation":
        if (
          row.CuttOff &&
          row.GroupNameId &&
          row.Linearity &&
          row.PanelName &&
          row.PerformingLabId &&
          row.SpecimenTypeID &&
          row.TestCode &&
          row.TestName &&
          row.Unit
        ) {
          isDataValidated = true;
        }
        break;
      case "Screening":
        if (
          row.CuttOff &&
          row.GroupNameId &&
          row.PanelName &&
          row.PerformingLabId &&
          // row.ReportingRuleId && (test case # 02 > #86798m7gc)
          row.SpecimenTypeID &&
          row.TestCode &&
          row.TestName &&
          row.Unit
        ) {
          isDataValidated = true;
        }
        break;
      case "Validity":
        if (
          row.CuttOff &&
          row.GroupNameId &&
          row.Linearity &&
          row.PerformingLabId &&
          row.SpecimenTypeID &&
          row.TestCode &&
          row.TestName &&
          row.Unit
        ) {
          isDataValidated = true;
        }
        break;
      default:
        if (
          row.GroupNameId &&
          row.PanelCode &&
          row.PanelName &&
          row.PanelTypeId &&
          row.PerformingLabId &&
          row.TestCode &&
          row.TestName &&
          row.SpecimenTypeID
        ) {
          isDataValidated = true;
        }
        break;
    }

    if (!isDataValidated) {
      toast.error("Fill the required Fields");
      return;
    }

    setRequest1(true);
    let obj = FindPanelType(PanelName);
    const queryModel = {
      id: row.Id,
      performingLabId: row.PerformingLabId,
      panelTypeId: row.PanelTypeId ? row.PanelTypeId : obj.value,
      panelTypeName: row.PanelTypeName !== "" ? row.PanelTypeName : obj.label,
      panelId: row.PanelId,
      panelName: row.PanelName,
      panelCode: row.PanelCode,
      specimenTypeId: row.SpecimenTypeID,
      testName: row.TestName,
      testCode: row.TestCode,
      groupId: row.GroupNameId,
      cutoff: parseInt(row.CuttOff),
      linearity: parseInt(row.Linearity),
      unit: row.Unit,
      reportingRuleId: row.ReportingRuleId,
    };
    await RequisitionType.SaveToxCompendium(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          setIsAddButtonDisabled(false);
          setRequest1(false);
          LoadFunction(false);
        } else {
          toast.error(res?.data?.message);
          setIsAddButtonDisabled(false);
          setRequest1(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    Pid: any
  ) => {
    if (event.key === "Enter") {
      LoadToxCompendium(true, false, Pid);
    }
  };
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
  const handleAllSelect = (checked: boolean, rows: any) => {
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.Id);
    });

    if (checked) {
      setSelectedBox1((pre: any) => {
        return {
          ...pre,
          id: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox1((pre: any) => {
        return {
          ...pre,
          id: [],
        };
      });
    }
  };
  const handleChangePanelMappinfId = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox1((pre: any) => {
        return {
          ...pre,
          id: [...selectedBox1.id, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox1((pre: any) => {
        return {
          ...pre,
          id: selectedBox1.id.filter((item: any) => item !== id),
        };
      });
    }
  };
  const handleChangeForToxCompendium = (
    name: string,
    value: any,
    id: number
  ) => {
    setTox((curr: any[]) =>
      curr.map((x: { Id: number }) =>
        x.Id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };
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
  const downloadAll = async () => {
    await RequisitionType.ExportAllToxCompendiumData({
      queryModel: searchRequest,
      selectedRow: [],
    }).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        base64ToExcel(
          res.data.data.fileContents,
          "Tox Compendium Data Panel Mapping"
        );
        setSelectedBox1((pre: any) => {
          return {
            ...pre,
            id: [],
          };
        });
      } else {
        toast.error(res?.data?.message);
      }
    });
  };
  const downloadSelected = async () => {
    if (selectedBox1.id.length > 0) {
      const payLoad = {
        selectedRow: selectedBox1.id,
        queryModel: searchRequest,
      };
      await RequisitionType.ExportAllToxCompendiumData(payLoad).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            base64ToExcel(
              res.data.data.fileContents,
              "Tox Compendium Data Panel Mapping"
            );
            setSelectedBox1((pre: any) => {
              return {
                ...pre,
                id: [],
              };
            });
          } else {
            toast.error(res?.data?.message);
          }
        }
      );
    } else {
      toast.error("Select atleast one record");
    }
  };
  return (
    <context.Provider
      value={{
        data,
        getPrintersInfo,
        setData,
        refetch,
        refetchData,
        filterData,
        setFilterData,
        searchValue,
        SetInitilizeCalls,
        setSearchValue,
        loadDataAllRequisition,
        initializeCalls,
        getFacilityLookup,
        selectedBox,
        setSelectedBox,
        loading,
        NextStep,
        isSubmittingNextStepAction,
        apiCalls,
        value,
        setValue,
        open,
        setOpen,
        RestoreRequisition,
        intialValue,
        value1,
        setValue1,
        handleChange,
        a11yProps,
        rows,
        setRows,
        selectedOptions,
        setSelectedOptions,
        addRow,
        handleDeleteRow,
        handleChangeTestType,
        GroupLookup,
        DropDowns,
        ApiCallsForToxicology,
        setCurPage,
        curPage,
        pageSize,
        setPageSize,
        total,
        setTotal,
        searchRequest,
        setSearchRequest,
        sort,
        setSorting,
        intialSearchQuery,
        LoadToxCompendium,
        tox,
        setTox,
        resetSearch,
        proceed,
        setDropdowns,
        queryDisplayTagNames,
        onInputChangeSearch,
        searchedTags,
        setSearchedTags,
        handleTagRemoval,
        handleSubmitForToxCompendium,
        handleKeyPress,
        handleSort,
        searchRef,
        FindPanelType,
        handleAllSelect,
        handleChangePanelMappinfId,
        handleChangeForToxCompendium,
        selectedBox1,
        setSelectedBox1,
        downloadAll,
        downloadSelected,
        isAddButtonDisabled,
        setIsAddButtonDisabled,
        request1,
        setRequest1,
        setDefaultValue,
        SpecimenTypeLookup,
        ConfirmationTestTypeLookup,
        loadData,
        getRejectionReasonLookup,
        rejectionReason,
      }}
    >
      {children}
    </context.Provider>
  );
}

export const useBillingDataContext = () => useContext(context);
