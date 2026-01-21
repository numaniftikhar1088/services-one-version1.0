import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TabConfiguration } from "..";

type ContextType = {
  handleSelectAll: any;
  setBulkIds: any;
  setRows: any;
  setTabPanels: any;
  setColumnsActions: any;
  setColumnDataActions: any;
  setBulkActions: any;
  setBulkExportActions: any;
  setTopButtonActions: any;
  setExpandableColumnsHeader: any;
  setIsBulkEdit: any;
  searchRef: any;
  value: any;
  setValue: any;
  tabPanels: any;
  columnDataActions: any;
  bulkActions: any;
  bulkExportActions: any;
  topButtonActions: any;
  bulkIds: any;
  isBulkEdit: any;
  columnActions: any;
  inputFields: any;
  setInputFields: any;
  apiData: any;
  setApiData: any;
  tabIdToSend: any;
  setTabIdToSend: any;
  expandableColumnsHeader: any;
  tabData: any;
  setTabData: any;
  rows: any;
  isExpandable: () => boolean;
  columnsHeader: any;
};

const Context = createContext<ContextType>({} as ContextType);

export default function DynamicGridProvider({
  children,
}: {
  children: ReactNode;
}) {
  const initialTableData = {
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
  };

  const [bulkIds, setBulkIds] = useState([]);
  const [value, setValue] = useState<number>(0);
  const [tabIdToSend, setTabIdToSend] = useState<null | number>(null);
  const [apiData, setApiData] = useState<any>({});
  const [inputFields, setInputFields] = useState([]);
  const [bulkActions, setBulkActions] = useState([]);
  const [columnActions, setColumnsActions] = useState([]);
  const [columnDataActions, setColumnDataActions] = useState([]);
  const [topButtonActions, setTopButtonActions] = useState([]);
  const [bulkExportActions, setBulkExportActions] = useState([]);
  const [tabData, setTabData] = useState<any>(initialTableData);
  const [tabPanels, setTabPanels] = useState<TabConfiguration[] | []>([]);
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const searchRef = useRef<any>(null);
  const [rows, setRows] = useState<any>([]);
  const [expandableColumnsHeader, setExpandableColumnsHeader] = useState<any>(
    []
  );

  let columnsHeader = tabData?.gridHeaders?.[value]?.tabHeaders;
  const isExpandable = () =>
    columnsHeader?.some((column: any) => column.isExpandData);

  useEffect(() => {
    if (columnsHeader?.length) {
      setExpandableColumnsHeader(
        columnsHeader
          .map((item: any) => {
            if (item.isShowOnUi && item.isExpandData) {
              return item;
            } else return null;
          })
          .filter((item: any) => item !== null)
      );
    }
  }, [columnsHeader]);

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setBulkIds([]);
    } else {
      setBulkIds(rows.map((row: any) => row.Id));
    }
  };
  

  return (
    <Context.Provider
      value={{
        tabData,
        setTabData,
        inputFields,
        handleSelectAll,
        isExpandable,
        setBulkIds,
        setRows,
        setTabPanels,
        setColumnsActions,
        setColumnDataActions,
        setBulkActions,
        setBulkExportActions,
        setInputFields,
        setTopButtonActions,
        setExpandableColumnsHeader,
        setIsBulkEdit,
        searchRef,
        value,
        setValue,
        tabPanels,
        columnDataActions,
        bulkActions,
        bulkExportActions,
        topButtonActions,
        bulkIds,
        isBulkEdit,
        columnActions,
        apiData,
        setApiData,
        tabIdToSend,
        setTabIdToSend,
        expandableColumnsHeader,
        rows,
        columnsHeader,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDynamicGrid = () => useContext(Context);
