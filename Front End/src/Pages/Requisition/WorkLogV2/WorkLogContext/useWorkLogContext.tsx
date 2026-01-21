import { AxiosResponse } from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import UserManagementService from "Services/UserManagement/UserManagementService";

export interface IRows {
  id: number | null;
  cutOff: number;
  groupName: string;
  groupNameId: number | null;
  linearity: number | null;
  organism: string;
  panelCode: string;
  panelId: number;
  panelName: string;
  panelType: string;
  panelTypeId: number | null;
  performingLabId: number;
  performingLabName: string;
  reportingRuleId: number;
  reportingRuleName: string;
  reqTypeId: number;
  specimenType: string;
  specimenTypeId: number | null;
  testCode: string;
  testId: number | null;
  testName: string;
  unit: string;
  rowStatus: boolean | undefined;
}

export interface FilterDataI {
  tabId: number;
  pageSize: number;
  pageNumber: number;
  sortColumn: string;
  sortDirection: string;
  filters: any[];
}

type SelectedBox = {
  requisitionOrderId: number[];
  requisitionId: number[];
  ids: number[];
};

type ContextType = {
  data: any;
  refetchData: React.Dispatch<SetStateAction<boolean>>;
  refetch: boolean;
  setData: React.Dispatch<SetStateAction<any>>;
  filterData: FilterDataI;
  setFilterData: React.Dispatch<SetStateAction<FilterDataI>>;
  searchValue: any;
  setSearchValue: React.Dispatch<SetStateAction<any>>;
  loadGridData: (
    showLoader?: boolean,
    reset?: boolean,
    payload?: FilterDataI
  ) => Promise<any>;
  getFacilityLookup: () => Promise<void>;
  selectedBox: SelectedBox;
  setSelectedBox: React.Dispatch<SetStateAction<any>>;
  initializeCalls: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  apiCalls: () => Promise<void>;
  value: number;
  setValue: React.Dispatch<SetStateAction<number>>;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  initialValue: FilterDataI;
  loadTabs: () => Promise<any>;
  initialPageLoadApiCalls: () => void;
  tabIdToSend: null | number;
  setTabIdToSend: React.Dispatch<SetStateAction<number | null>>;
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
  isFirstLoad: any;
  setInputFields: any;
  inputFields: any;
};

const Context = createContext<ContextType>({} as ContextType);

export const initialValue: FilterDataI = {
  tabId: 1,
  pageSize: 50,
  pageNumber: 1,
  sortColumn: "",
  sortDirection: "",
  filters: [],
};

export default function WorkLogDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isFirstLoad = useRef(true);
  const [value, setValue] = useState(0);
  const [refetch, refetchData] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [inputFields, setInputFields] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterData, setFilterData] = useState<FilterDataI>(initialValue);
  const [searchValue, setSearchValue] = useState<any>({});
  const [initializeCalls, setInitializeCalls] = useState<boolean>(false);
  const [tabIdToSend, setTabIdToSend] = useState<null | number>(null);
  const [total, setTotal] = useState<number>(50);

  const [data, setData] = useState<any>({
    gridData: [],
    gridColumns: [],
    gridHeaders: [],
    facilityLookup: [],
    rejectReasonTypeLookup: [],
    phlebotomistsLookup: [],
  });

  const [selectedBox, setSelectedBox] = useState<SelectedBox>({
    requisitionOrderId: [],
    requisitionId: [],
    ids: [],
  });

  const loadTabs = async (callFrom?: string) => {
    try {
      const response = await RequisitionType.viewRequisitionTabs();
      setData((prevVal: any) => ({
        ...prevVal,
        gridHeaders: response?.data?.data,
      }));
      const data = response?.data?.data?.[value];

      const inputFields = data?.tabHeaders?.map((column: any) => {
        if (column.isShowOnUi && !column.isExpandData && column.isShow) {
          return {
            inputType: column.filterColumnsType,
            name: column.columnKey,
            jsonOptionData: column.jsonOptionData,
            fieldName: column.fieldName,
            isIndividualEditable: column.isIndividualEditable,
          };
        }
      });

      const responseTabs = response?.data?.data.sort(
        (a: any, b: any) => a.sortOrder - b.sortOrder
      );

      if (callFrom !== "columnSetup") {
        setTabIdToSend(responseTabs[0]?.tabID);
      }

      if (isFirstLoad.current) {
        setValue(responseTabs[0]?.sortOrder - 1);
        isFirstLoad.current = false;
      }
      setInputFields(inputFields);
      return responseTabs;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const loadGridData = async (
    showLoader: boolean = false,
    reset: boolean = false,
    payload?: FilterDataI
  ) => {
    if (!payload && tabIdToSend === null) return;

    if (showLoader) setLoading(true);

    const cleanedFilters = filterData.filters?.map((filter: any) => ({
      ...filter,
      filterValue:
        typeof filter.filterValue === "string"
          ? filter.filterValue.trim()
          : filter.filterValue,
    }));
    const searchParams = payload || {
      tabId: tabIdToSend,
      pageNumber: reset ? 1 : filterData.pageNumber,
      pageSize: reset ? 50 : filterData.pageSize,
      sortColumn: reset ? "" : filterData.sortColumn,
      sortDirection: reset ? "" : filterData.sortDirection,
      filters: reset ? [] : cleanedFilters,
    };

    try {
      const response = await RequisitionType.workLogGetAll(searchParams);
      setInitializeCalls(true);
      setData((prevVal: any) => ({
        ...prevVal,
        gridData: response.data?.data,
      }));
      setTotal(response?.data?.total);

      return response;
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const initialPageLoadApiCalls = async () => {
    await Promise.all([
      await apiCalls(true),
      // getPrintersInfo(),
      getFacilityLookup(),
      getRejectionReasonTypeLookup(),
      getPhlebotomistLookup(),
    ]);
  };

  const apiCalls = async (showLoader: boolean = false) => {
    await loadTabs();
    await loadGridData(showLoader);
  };

  const getFacilityLookup = async () => {
    try {
      const response = await UserManagementService.GetFacilitiesLookup();
      setData((prevVal: any) => ({
        ...prevVal,
        facilityLookup: response?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getPhlebotomistLookup = async () => {
    try {
      const response = await RequisitionType.getPhlebotomistsLookup();
      setData((prevVal: any) => ({
        ...prevVal,
        phlebotomistsLookup: response?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getRejectionReasonTypeLookup = async () => {
    try {
      const response = await RequisitionType.getRejectReasonTypesLookup();
      setData((prevVal: any) => ({
        ...prevVal,
        rejectReasonTypeLookup: response?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Context.Provider
      value={{
        data,
        setData,
        refetch,
        refetchData,
        filterData,
        setFilterData,
        searchValue,
        setSearchValue,
        loadGridData,
        initializeCalls,
        getFacilityLookup,
        selectedBox,
        setSelectedBox,
        loading,
        apiCalls,
        value,
        setValue,
        open,
        setOpen,
        initialValue,
        loadTabs,
        initialPageLoadApiCalls,
        tabIdToSend,
        setTabIdToSend,
        total,
        setTotal,
        setLoading,
        isFirstLoad,
        setInputFields,
        inputFields,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useWorkLogDataContext = () => useContext(Context);
