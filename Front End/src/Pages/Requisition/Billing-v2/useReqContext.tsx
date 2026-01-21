import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState
} from "react";
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
  tabId: number | null;
  pageSize: number;
  pageNumber: number;
  sortColumn: string;
  sortDirection: string;
  filters: any[];
}

type SelectedBox = {
  requisitionOrderId: number[];
  requisitionId: number[];
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
  loadGridData: (showLoader?: boolean, payload?: FilterDataI) => Promise<any>;
  getFacilityLookup: () => Promise<void>;
  selectedBox: SelectedBox;
  setSelectedBox: React.Dispatch<SetStateAction<any>>;
  initializeCalls: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isSubmittingNextStepAction: boolean;
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

export default function BillingDataProvier({
  children,
}: {
  children: ReactNode;
}) {
  const isFirstLoad = useRef(true);
  const [refetch, refetchData] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState(0);
  const [filterData, setFilterData] = useState<FilterDataI>(initialValue);
  const [searchValue, setSearchValue] = useState<any>({});
  const [initializeCalls, setInitializeCalls] = useState<boolean>(false);
  const [tabIdToSend, setTabIdToSend] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(50);
  const [data, setData] = useState<any>({
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
  });
  const [selectedBox, setSelectedBox] = useState<SelectedBox>({
    requisitionOrderId: [],
    requisitionId: [],
  });

  const [isSubmittingNextStepAction, setIsSubmittingNextStepAction] =
    useState(false);

  const loadTabs = async (callFrom?: string) => {
    try {
      const response = await RequisitionType.viewRequisitionTabs();
      setData((prevVal: any) => ({
        ...prevVal,
        gridHeaders: response?.data?.data,
      }));

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

      return responseTabs;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const loadGridData = async (
    showLoader: boolean = false,
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
      tabId: tabIdToSend ?? 1,
      pageNumber: filterData.pageNumber,
      pageSize: filterData.pageSize,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: cleanedFilters,
    };

    setFilterData(searchParams);

    try {
      const response = await RequisitionType.getAllBillingRequisition(
        searchParams
      );
      setInitializeCalls(true);
      setData((prevVal: any) => ({
        ...prevVal,
        gridData: response.data?.data,
      }));
      setTotal(response?.data?.total);

      return response;
    } catch (error) {
      console.error(error);
      setData((prevVal: any) => ({
        ...prevVal,
        gridData: [],
      }));
      return error;
    } finally {
      setLoading(false);
    }
  };

  const initialPageLoadApiCalls = async () => {
    await Promise.all([
      apiCalls(true),
      getFacilityLookup(),
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
        isSubmittingNextStepAction,
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
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useBillingContext = () => useContext(Context);
