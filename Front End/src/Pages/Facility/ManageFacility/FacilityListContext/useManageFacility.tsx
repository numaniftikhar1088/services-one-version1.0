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
import FacilityService from "Services/FacilityService/FacilityService";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import UserManagementService from "Services/UserManagement/UserManagementService";
import useLang from "Shared/hooks/useLanguage";

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
  selectedBox: number[];
  setSelectedBox: React.Dispatch<SetStateAction<any>>;
  getPrintersInfo: () => Promise<void>;
  initializeCalls: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  nextStep: (formData: any) => Promise<void>;
  isSubmittingNextStepAction: boolean;
  apiCalls: () => Promise<void>;
  value: number;
  setValue: React.Dispatch<SetStateAction<number>>;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  restoreRequisition: (id: number) => void;
  initialValue: FilterDataI;
  loadTabs: () => Promise<any>;
  getRejectionReasonLookup: () => Promise<void>;
  rejectionReason: any[];
  initialPageLoadApiCalls: () => void;
  tabIdToSend: null | number;
  setTabIdToSend: React.Dispatch<SetStateAction<number | null>>;
  total: number;
  setTotal: Dispatch<SetStateAction<number>>;
  isFirstLoad: any;
  requisitionStatuses: any;
  requisitionTypes: any;
  getRequisitionTypes: () => void;
  getRequisitionStatus: () => void;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
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

export default function ManageFacilityContextProvider({
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
  const [rejectionReason, setRejectionReason] = useState<any[]>([]);
  const [initializeCalls, setInitializeCalls] = useState<boolean>(false);
  const [tabIdToSend, setTabIdToSend] = useState<number | null>(null);
  const [total, setTotal] = useState<number>(50);
  const [status, setStatus] = useState("");

  const [requisitionStatuses, setRequisitionStatuses] = useState<number[]>([]);
  const [requisitionTypes, setRequisitionTypes] = useState<
    Record<string, number>[]
  >([]);

  const [data, setData] = useState<any>({
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
  });
  const { t } = useLang();
  const [selectedBox, setSelectedBox] = useState<number[]>([]);

  const [isSubmittingNextStepAction, setIsSubmittingNextStepAction] =
    useState(false);

  const getPrintersInfo = async () => {
    try {
      const res = await RequisitionType.GetPrintersInfo();
      setData((prevVal: any) => ({
        ...prevVal,
        printersInfo: res?.data?.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getRejectionReasonLookup = async () => {
    try {
      const res = await RequisitionType.GetRejectionReasonLookup();
      setRejectionReason(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

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
    console.log("payload in useManageFacility",payload)
    if (!payload && tabIdToSend === null || !tabIdToSend) return;
    console.log("filterData.filters>>>",filterData.filters)
    if (showLoader) setLoading(true);

    const searchParams = {
      tabId: payload?.tabId ?? tabIdToSend ?? 1,
      pageNumber: payload?.pageNumber ?? filterData.pageNumber,
      pageSize: payload?.pageSize ?? filterData.pageSize,
      sortColumn: payload?.sortColumn ?? filterData.sortColumn,
      sortDirection: payload?.sortDirection ?? filterData.sortDirection,
      filters: payload?.filters ?? [...filterData.filters],
    };

    setFilterData(searchParams);

    try {
      const response = await FacilityService.getFacilities(searchParams);
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
      await apiCalls(true),
      // getPrintersInfo(),
      // getFacilityLookup(),
      // getRequisitionStatus(),
      // getRequisitionTypes(),
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

  const getRequisitionStatus = async () => {
    try {
      const response = await RequisitionType.requisitionStatuses();
      setRequisitionStatuses(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRequisitionTypes = async () => {
    try {
      const response = await RequisitionType.requisitionTypeLookup();
      setRequisitionTypes(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const nextStep = async (formData: any) => {
    setIsSubmittingNextStepAction(true);
    try {
      const response = await RequisitionType.NextStepAction(formData);
      if (response?.data?.httpStatusCode === 200) {
        await loadGridData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingNextStepAction(false);
    }
  };

  const restoreRequisition = async (id: number) => {
    try {
      const res: AxiosResponse = await RequisitionType.RestoreRequisition(id);
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res.data.message));
        await loadGridData();
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Context.Provider
      value={{
        status,
        setStatus,
        data,
        getPrintersInfo,
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
        nextStep,
        isSubmittingNextStepAction,
        apiCalls,
        value,
        setValue,
        open,
        setOpen,
        restoreRequisition,
        initialValue,
        loadTabs,
        getRejectionReasonLookup,
        rejectionReason,
        initialPageLoadApiCalls,
        tabIdToSend,
        setTabIdToSend,
        total,
        setTotal,
        setLoading,
        isFirstLoad,
        requisitionStatuses,
        requisitionTypes,
        getRequisitionTypes,
        getRequisitionStatus,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useManageFacility = () => useContext(Context);
