import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import RequisitionType from '../../Services/Requisition/RequisitionTypeService';
import UserManagementService from '../../Services/UserManagement/UserManagementService';

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
  refetchData: any;
  refetch: any;
  setData: any;
  filterData: FilterDataI;
  setFilterData: any;
  searchValue: any;
  setSearchValue: any;
  loadAllResultData: any;
  selectedBox: any;
  setSelectedBox: any;
  loading: any;
  isSubmittingNextStepAction: any;
  apiCalls: any;
  value: any;
  setValue: any;
  open: boolean;
  setOpen: any;
  getFacilityLookup: any;
  getPanelLookup: any;
  panel: any;
  total: number;
  setTotal: any;
  getLisStatus: any;
  lisstatus: any;
  setCheckedAll: any;
  checkedAll: boolean;
  rowsToExpand: number[];
  setRowsToExpand: Dispatch<SetStateAction<number[]>>;
  isMasterExpandTriggered: any;
  setIsMasterExpandTriggered: any;
};

const context = createContext<Context>({} as Context);
export const intialValue = {
  tabId: 1,
  pageSize: 50,
  pageNumber: 1,
  sortColumn: '',
  sortDirection: '',
  filters: [],
};

export default function ToxResultDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [rowsToExpand, setRowsToExpand] = useState<number[]>([]);
  const [isMasterExpandTriggered, setIsMasterExpandTriggered] = useState(false);

  const [refetch, refetchData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<any>(false);
  const [value, setValue] = useState(0);
  const [checkedAll, setCheckedAll] = useState(false);
  const [filterData, setFilterData] = useState<any>(intialValue);
  const [searchValue, setSearchValue] = useState({});
  const [total, setTotal] = useState<number>(50);
  const [data, setData] = useState<any>({
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
    total: 0,
  });
  const [selectedBox, setSelectedBox] = useState<any>({
    requisitionId: [],
  });
  const [isSubmittingNextStepAction, setisSubmittingNextStepAction] =
    useState(false);

  const loadData = async () => {
    let response;
    try {
      response = await RequisitionType.viewRequisitionTabs();
      return response?.data?.data;
    } catch (error) {
      return error;
    }
  };
  const loadAllResultData = async (shouldPageLoad = true) => {
    console.log(
      'loadAllResultDataloadAllResultDataloadAllResultDat==>',
      filterData?.filters
    );
    const cleanedFiltersData = filterData?.filters.map((item: any) => ({
      ...item,
      filterValue:
        typeof item.filterValue === 'string'
          ? item.filterValue.trim()
          : item.filterValue,
    }));
    shouldPageLoad && setLoading(true);
    let searchParams = {
      tabId: filterData?.tabId,
      pageNumber: filterData?.pageNumber,
      pageSize: filterData?.pageSize,
      sortColumn: filterData?.sortColumn,
      sortDirection: filterData?.sortDirection,
      filters: cleanedFiltersData,
      IsLoadExpand: false,
      selectedRow: null,
    };
    let response: any;
    try {
      response = await RequisitionType.getToxicologyAllResultData(searchParams);
      setData((preVal: any) => {
        return {
          ...preVal,
          gridData: response?.data?.data,
        };
      });
      setTotal(response?.data?.total);
      data.gridHeaders[0]?.tabHeaders && setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      return error;
    }
  };
  const apiCalls = async () => {
    let gridHeadersArr = await loadData();
    let gridData = await loadAllResultData();
    setData((preVal: any) => {
      return {
        ...preVal,
        gridHeaders: gridHeadersArr,
        gridData: gridData?.data?.data,
      };
    });
    setLoading(false);
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

  const [panel, setPanel] = useState([]);
  const getPanelLookup = async () => {
    let response: any;
    try {
      response = await RequisitionType.GetIDLISPanelLookup();
      setPanel(response?.data);
    } catch (error) {
      return error;
    }
  };
  const [lisstatus, setLisstatus] = useState([]);
  const getLisStatus = async () => {
    let response: any;
    try {
      response = await RequisitionType.GetToxLISPanelLookup();
      setLisstatus(response?.data);
    } catch (error) {
      return error;
    }
  };

  return (
    <context.Provider
      value={{
        data,
        total,
        setData,
        refetch,
        setTotal,
        refetchData,
        filterData,
        setFilterData,
        searchValue,
        setSearchValue,
        loadAllResultData,
        selectedBox,
        setSelectedBox,
        loading,
        isSubmittingNextStepAction,
        apiCalls,
        value,
        setValue,
        open,
        setOpen,
        getFacilityLookup,
        getPanelLookup,
        panel,
        getLisStatus,
        lisstatus,
        checkedAll,
        setCheckedAll,
        rowsToExpand,
        setRowsToExpand,
        isMasterExpandTriggered,
        setIsMasterExpandTriggered,
      }}
    >
      {children}
    </context.Provider>
  );
}
export const useToxResultDataContext = () => useContext(context);
