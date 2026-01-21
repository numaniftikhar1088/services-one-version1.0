import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { getAllData, getTabsConfiguration } from "Services/BloodLisResultData";
import RequisitionType from "Services/Requisition/RequisitionTypeService";

export interface FilterDataI {
  tabId: number;
  pageSize: number;
  pageNumber: number;
  sortColumn: string;
  sortDirection: string;
  filters: any[];
}

export interface DataI {
  gridHeaders: any[];
  gridColumns: any[];
  gridData: any[];
  printersInfo: any[];
}

export interface SelectedBoxI {
  requisitionId: any[];
}

type Context = {
  data: DataI;
  setData: React.Dispatch<React.SetStateAction<DataI>>;
  filterData: FilterDataI;
  setFilterData: React.Dispatch<React.SetStateAction<FilterDataI>>;
  searchValue: any;
  setSearchValue: React.Dispatch<React.SetStateAction<any>>;
  loadGridData: (shouldPageLoad?: boolean) => Promise<any>;
  selectedBox: SelectedBoxI;
  setSelectedBox: React.Dispatch<React.SetStateAction<SelectedBoxI>>;
  loading: boolean;
  apiCalls: () => Promise<void>;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  GetPrintersInfo: () => Promise<void>;
  setCheckedAll: React.Dispatch<React.SetStateAction<boolean>>;
  checkedAll: boolean;
  total: number;
  intialValue: FilterDataI;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  rowsToExpand: number[];
  setRowsToExpand: Dispatch<SetStateAction<number[]>>;
  isMasterExpandTriggered: any;
  setIsMasterExpandTriggered: any;
};

const context = createContext<Context>({} as Context);

export const intialValue: FilterDataI = {
  tabId: 1,
  pageSize: 50,
  pageNumber: 1,
  sortColumn: "",
  sortDirection: "",
  filters: [],
};

export default function BloodResultDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [rowsToExpand, setRowsToExpand] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [isMasterExpandTriggered, setIsMasterExpandTriggered] = useState(false);

  const [filterData, setFilterData] = useState<FilterDataI>(intialValue);
  const [searchValue, setSearchValue] = useState<any>({});
  const [total, setTotal] = useState<number>(0);
  const isFirstLoad = useRef(true);
  const [data, setData] = useState<any>({
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    printersInfo: [],
  });
  const [selectedBox, setSelectedBox] = useState<SelectedBoxI>({
    requisitionId: [],
  });

  const getTabs = async (): Promise<any> => {
    try {
      const response = await getTabsConfiguration();
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

  const loadGridData = async (shouldPageLoad = true): Promise<any> => {
    setLoading(shouldPageLoad);

    const cleanedFiltersData = filterData?.filters.map((item: any) => ({
      ...item,
      filterValue:
        typeof item.filterValue === "string"
          ? item.filterValue.trim()
          : item.filterValue,
    }));

    const searchParams = {
      tabId: filterData?.tabId,
      pageNumber: filterData?.pageNumber,
      pageSize: filterData?.pageSize,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: cleanedFiltersData,
      IsLoadExpand: false,
      selectedRow: null,
    };

    try {
      const response = await getAllData(searchParams);
      setData((prevVal: any) => ({
        ...prevVal,
        gridData: response.data.data,
      }));
      setTotal(response.data.total);
      return response;
    } catch (error) {
      console.error("Error loading grid data:", error);
      // Clear the grid data on error
      setData((prevVal: any) => ({
        ...prevVal,
        gridData: [],
      }));
      setTotal(0);
      return error;
    } finally {
      setLoading(false);
    }
  };

  const apiCalls = async (): Promise<void> => {
    await getTabs();
    await loadGridData();
  };

  const GetPrintersInfo = async (): Promise<void> => {
    const res = await RequisitionType.GetPrintersInfo();
    setData((preVal: any) => ({
      ...preVal,
      printersInfo: res?.data?.data,
    }));
  };

  return (
    <context.Provider
      value={{
        data,
        setData,
        filterData,
        total,
        setFilterData,
        searchValue,
        setSearchValue,
        loadGridData,
        selectedBox,
        setSelectedBox,
        loading,
        apiCalls,
        value,
        setValue,
        open,
        setOpen,
        GetPrintersInfo,
        setCheckedAll,
        checkedAll,
        intialValue,
        setLoading,
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

export const useBloodResultDataContext = () => useContext(context);
