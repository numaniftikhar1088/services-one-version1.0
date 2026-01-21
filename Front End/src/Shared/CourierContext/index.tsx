import moment from "moment";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import InsuranceService from "../../Services/InsuranceService/InsuranceService";
import { SortingTypeI } from "../../Utils/consts";
import usePagination from "../hooks/usePagination";

type Context = {
  loadData: any;
  loadDataShipment: any;
  setCourierName: Dispatch<SetStateAction<string>>;
  courierName: string;
  rows: any;
  setRows: any;
  shipment: any;
  setShipment: any;
  setSearchRequestShipment: any;
  setSearchRequestShipmentTracking: any;
  searchRequestShipment: any;
  searchRequestShipmentTracking: any;
  setSearchRequest: any;
  searchRequest: any;
  initialSearchQuery: any;
  initialSearchQueryShipment: any;
  initialSearchQueryShipmentTracking: any;
  setSorting: any;
  sortById: any;
  setPageSize: any;
  sort: any;
  searchRef: any;
  handleSort: any;
  pageSize: any;
  curPage: any;
  total: any;
  showPage: any;
  prevPage: any;
  pageNumbers: any;
  nextPage: any;
  totalPages: any;
  loading: boolean;
  loadDataShipmentTracking: any;
  setShipmentTracking: any;
  shipmentTracking: any;
  setTabs: any;
  tabs: any;
  setCurPage: any;

  openCancelModal: boolean;
  setOpenCancelModal: Dispatch<SetStateAction<boolean>>;
  selectedRowForCancel: any;
  handleOpenCancelModal: (row: any) => void;
  handleCloseCancelModal: () => void;
};

const context = createContext<Context>({} as Context);
export default function CourierContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [courierName, setCourierName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState(0);
  const [rows, setRows] = useState<any>(() => []);
  const [shipment, setShipment] = useState<any>(() => []);
  const [shipmentTracking, setShipmentTracking] = useState<any>(() => []);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [selectedRowForCancel, setSelectedRowForCancel] = useState<any>(null);

  const initialSearchQuery = useMemo(
    () => ({
      courierName: courierName,
      contactName: "",
      companyName: "",
      address: "",
      address2: "",
      city: "",
      stateName: "",
      zipCode: "",
      phoneNumber: "",
      pickupDate: null,
      startPickupTime: null,
      endPickupTime: null,
      packagesCount: 0,
      packageWeight: null,
      remarks: "",
      dispatchConfirmationNo: "",
      location: "",
      labName: "",
      trackingNumber: "",
      logIdentifier: "",
      isDeleted: false,
      isCanceled: false,
    }),
    [courierName]
  );
  const initialSearchQueryShipment = useMemo(
    () => ({
      courierName: courierName,
      accountName: "",
      senderName: "",
      senderCompanyName: "",
      senderAddress: "",
      senderAddress2: "",
      senderCity: "",
      senderStateName: "",
      senderZipCode: "",
      senderPhoneNumber: "",
      recipentName: "",
      recipentCompanyName: "",
      recipentAddress: "",
      recipentAddress2: "",
      recipentCity: "",
      recipentStateName: "",
      recipentZipCode: "",
      recipentPhoneNumber: "",
      shipmentDate: null,
      packageType: "",
      serviceType: "",
      packagesCount: null,
      packageWeight: null,
      packageDescription: "",
      schedulePickup: false,
      pickupDate: null,
      startPickupTime: null,
      endPickupTime: null,
      remarks: "",
      trackingNumber: "",
      status: "",
      labName: "",
      isDeleted: false,
    }),
    [courierName]
  );
  const initialSearchQueryShipmentTracking = useMemo(
    () => ({
      facilityName: "",
      trackingNumber: "",
      dateofScan: null,
      status: "",
      isDeleted: false,
      courierName: courierName,
    }),
    [courierName]
  );
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [searchRequestShipment, setSearchRequestShipment] = useState(
    initialSearchQueryShipment
  );
  const [searchRequestShipmentTracking, setSearchRequestShipmentTracking] =
    useState(initialSearchQueryShipmentTracking);
  const sortById = {
    clickedIconData: "Id",
    sortingOrder: "desc",
  };
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
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
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
    setCurPage,
  } = usePagination();

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const loadData = (loader: boolean, reset: boolean, sortingState?: any) => {
    // Validate courierName - must be non-empty and valid
    if (
      !courierName ||
      courierName.trim() === "" ||
      (courierName !== "UPS" && courierName !== "FedEx")
    ) {
      return false;
    }
    setLoading(loader);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    // Build query model - ensure courierName is always explicitly set
    const queryModel: any = reset
      ? {
          ...initialSearchQuery,
          courierName: courierName, // Explicitly set to ensure it's always present
          isDeleted: tabs === 0 || tabs === 2 ? false : true,
          isCanceled: tabs === 2 ? true : false,
        }
      : {
          ...trimmedSearchRequest,
          pickupDate: searchRequest?.pickupDate
            ? moment(searchRequest?.pickupDate).format("YYYY-MM-DD")
            : null,
          courierName: trimmedSearchRequest.courierName || courierName, // Ensure courierName is set
          isDeleted: tabs === 0 || tabs === 2 ? false : true,
          isCanceled: tabs === 2 ? true : false,
        };

    // Final validation - ensure courierName is valid
    if (!queryModel.courierName || queryModel.courierName.trim() === "") {
      queryModel.courierName = courierName;
    }

    // Final validation before API call
    if (
      !queryModel.courierName ||
      queryModel.courierName.trim() === "" ||
      (queryModel.courierName !== "UPS" && queryModel.courierName !== "FedEx")
    ) {
      setLoading(false);
      return false;
    }

    InsuranceService.ShippingAndScheduleAllData({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: queryModel,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: any) => {
        setRows(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
        setRows([]);
      });
  };
  const loadDataShipment = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    // Validate courierName - must be non-empty and valid
    if (
      !courierName ||
      courierName.trim() === "" ||
      (courierName !== "UPS" && courierName !== "FedEx")
    ) {
      return false;
    }
    setLoading(loader);

    // Build query model - ensure courierName is always explicitly set
    const queryModel: any = reset
      ? {
          ...initialSearchQueryShipment,
          courierName: courierName, // Explicitly set to ensure it's always present
          isDeleted: tabs === 1 ? false : true,
        }
      : {
          ...searchRequestShipment,
          courierName: searchRequestShipment.courierName || courierName, // Ensure courierName is set
          isDeleted: tabs === 1 ? false : true,
        };

    // Final validation - ensure courierName is valid
    if (!queryModel.courierName || queryModel.courierName.trim() === "") {
      queryModel.courierName = courierName;
    }

    // Final validation before API call
    if (
      !queryModel.courierName ||
      queryModel.courierName.trim() === "" ||
      (queryModel.courierName !== "UPS" && queryModel.courierName !== "FedEx")
    ) {
      setLoading(false);
      return false;
    }

    InsuranceService.ShippingAndScheduleGetAllShipment({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: queryModel,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: any) => {
        setShipment(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  const loadDataShipmentTracking = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    // Validate courierName - must be non-empty and valid
    if (
      !courierName ||
      courierName.trim() === "" ||
      (courierName !== "UPS" && courierName !== "FedEx")
    ) {
      return false;
    }
    setLoading(loader);

    // Build query model - ensure courierName is always explicitly set
    const queryModel: any = reset
      ? {
          ...initialSearchQueryShipmentTracking,
          courierName: courierName, // Explicitly set to ensure it's always present
          isDeleted: tabs === 2 ? false : true,
        }
      : {
          ...searchRequestShipmentTracking,
          courierName: searchRequestShipmentTracking.courierName || courierName, // Ensure courierName is set
          isDeleted: tabs === 2 ? false : true,
        };

    // Final validation - ensure courierName is valid
    if (!queryModel.courierName || queryModel.courierName.trim() === "") {
      queryModel.courierName = courierName;
    }

    // Final validation before API call
    if (
      !queryModel.courierName ||
      queryModel.courierName.trim() === "" ||
      (queryModel.courierName !== "UPS" && queryModel.courierName !== "FedEx")
    ) {
      setLoading(false);
      return false;
    }

    InsuranceService.ShippingAndScheduleGetAllShipmentTracking({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: queryModel,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: any) => {
        setShipmentTracking(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  useEffect(() => {
    setSearchRequest(initialSearchQuery);
    setSearchRequestShipment(initialSearchQueryShipment);
    setSearchRequestShipmentTracking(initialSearchQueryShipmentTracking);
  }, [tabs]);

  // Update searchRequest when courierName changes to ensure it's always set
  useEffect(() => {
    if (courierName && (courierName === "UPS" || courierName === "FedEx")) {
      setSearchRequest((prev: any) => ({
        ...prev,
        courierName: courierName,
      }));
      setSearchRequestShipment((prev: any) => ({
        ...prev,
        courierName: courierName,
      }));
      setSearchRequestShipmentTracking((prev: any) => ({
        ...prev,
        courierName: courierName,
      }));
    }
  }, [courierName]);

  const handleOpenCancelModal = (row: any) => {
    setSelectedRowForCancel(row);
    setOpenCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
    setSelectedRowForCancel(null);
  };

  return (
    <context.Provider
      value={{
        setCurPage,
        loadData,
        loadDataShipment,
        setCourierName,
        courierName,
        shipment,
        setShipmentTracking,
        setSearchRequestShipmentTracking,
        shipmentTracking,
        setShipment,
        rows,
        setRows,
        setSearchRequest,
        setSearchRequestShipment,
        loadDataShipmentTracking,
        searchRequestShipment,
        searchRequestShipmentTracking,
        initialSearchQueryShipmentTracking,
        initialSearchQueryShipment,
        initialSearchQuery,
        searchRequest,
        setSorting,
        sortById,
        setPageSize,
        sort,
        searchRef,
        handleSort,
        pageSize,
        curPage,
        total,
        showPage,
        prevPage,
        pageNumbers,
        nextPage,
        totalPages,
        loading,
        setTabs,
        tabs,

        // ... your existing values
        openCancelModal,
        setOpenCancelModal,
        selectedRowForCancel,
        handleOpenCancelModal,
        handleCloseCancelModal,
      }}
    >
      {children}
    </context.Provider>
  );
}

export const useCourierContext = () => useContext(context);
