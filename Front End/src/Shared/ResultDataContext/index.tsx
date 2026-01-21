import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
export interface FilterDataI {
  tabId: number;
  pageSize: number;
  pageNumber: number;
  sortColumn: string;
  sortDirection: string;
  filters: any[];
}
type Context = {
  data: any;
  panel: any;
  value: any;
  setOpen: any;
  refetch: any;
  setData: any;
  loading: any;
  setTotal: any;
  total: number;
  apiCalls: any;
  setValue: any;
  open: boolean;
  checkedAll: any;
  refetchData: any;
  searchValue: any;
  selectedBox: any;
  loadGridData: any;
  setCheckedAll: any;
  setFilterData: any;
  setSelectedBox: any;
  setSearchValue: any;
  getPanelLookup: any;
  getFacilityLookup: any;
  filterData: FilterDataI;
  rowsToExpand: number[];
  setRowsToExpand: Dispatch<SetStateAction<number[]>>;
  isMasterExpandTriggered: boolean;
  setIsMasterExpandTriggered: Dispatch<SetStateAction<boolean>>
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

export default function ResultDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const isFirstLoad = useRef(true);

  const [isMasterExpandTriggered, setIsMasterExpandTriggered] = useState(false);
  const [rowsToExpand, setRowsToExpand] = useState<number[]>([]);
  const [value, setValue] = useState(0);
  const [panel, setPanel] = useState([]);
  const [open, setOpen] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const [refetch, refetchData] = useState(false);
  const [searchValue, setSearchValue] = useState({});
  const [checkedAll, setCheckedAll] = useState(false);
  const [filterData, setFilterData] = useState<any>(intialValue);
  const [data, setData] = useState<any>({
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
  });
  const [selectedBox, setSelectedBox] = useState<any>({
    requisitionOrderId: [],
  });

  const getTabs = async () => {
    try {
      const response = await RequisitionType.viewRequisitionTabs();
      setData((preVal: any) => ({
        ...preVal,
        gridHeaders: response.data.data,
      }));
      const responseTabs = response?.data?.data.sort(
        (a: any, b: any) => a.sortOrder - b.sortOrder
      );
      if (isFirstLoad.current) {
        setValue(responseTabs[0]?.sortOrder - 1);
        isFirstLoad.current = false;
      }
    } catch (error) {
      return error;
    }
  };

  const loadGridData = async (shouldPageLoad = true) => {
    setLoading(shouldPageLoad);
    const cleanedFilters = filterData.filters?.map((filter: any) => ({
      ...filter,
      filterValue:
        typeof filter.filterValue === 'string'
          ? filter.filterValue.trim()
          : filter.filterValue,
    }));
    let searchParams = {
      tabId: filterData?.tabId,
      pageNumber: filterData?.pageNumber,
      pageSize: filterData?.pageSize,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: cleanedFilters,
      IsLoadExpand: false,
    };
    let response: any;
    try {
      response = await RequisitionType.getAllResultData(searchParams);
      setData((preVal: any) => {
        return {
          ...preVal,
          gridData: response,
        };
      });
      setTotal(response.data.total);
      return response;
    } catch (error) {
      setData((preVal: any) => {
        return {
          ...preVal,
          gridData: [],
        };
      });
      return error;
    } finally {
      setLoading(false);
    }
  };

  const apiCalls = async () => {
    await getTabs();
    await loadGridData();
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

  const getPanelLookup = async () => {
    let response: any;
    try {
      response = await RequisitionType.GetIDLISPanelLookup();
      setPanel(response?.data);
    } catch (error) {
      return error;
    }
  };
  return (
    <context.Provider
      value={{
        data,
        open,
        value,
        total,
        panel,
        refetch,
        setData,
        loading,
        setTotal,
        setOpen,
        setValue,
        apiCalls,
        checkedAll,
        filterData,
        selectedBox,
        searchValue,
        refetchData,
        loadGridData,
        rowsToExpand,
        setCheckedAll,
        setFilterData,
        setSearchValue,
        getPanelLookup,
        setSelectedBox,
        setRowsToExpand,
        getFacilityLookup,
        isMasterExpandTriggered, 
        setIsMasterExpandTriggered
      }}
    >
      {children}
    </context.Provider>
  );
}

export const useResultDataContext = () => useContext(context);
