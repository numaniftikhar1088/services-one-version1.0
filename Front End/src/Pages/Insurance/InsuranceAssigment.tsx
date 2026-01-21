import { styled, Tab, Tabs, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import {
  InsuranceProviderDelete,
  InsuranceProviderGetAll,
  InsuranceProviderSave,
  InsuranceStatusChange,
} from "Services/AllInsuranceProvider/InsuranceProvider";
import UserManagementService from "Services/UserManagement/UserManagementService";
import useLang from "Shared/hooks/useLanguage";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { sortById, sortByIPId, SortingTypeI } from "Utils/consts";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Provider } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import InsuranceService from "../../Services/InsuranceService/InsuranceService";
import Requisition from "../../Services/Requisition/RequisitionTypeService";
import LoadButton from "../../Shared/Common/LoadButton";
import { reactSelectStyle, styles } from "../../Utils/Common";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import AddNewProvider from "./AddNewInsuranceProvider";
import AddNewInsuranceProvider from "./AddNewInsuranceProvider/AddNewInsuranceProvider";
import SearchInsurance from "./AddNewInsuranceProvider/SearchInsurance";
import InsuranceTab1Table from "./insuranceTab1Table";

interface Provider {
  value: string | number;
  label: string;
  // providerCode: string | number;
}

interface Lookups {
  value: number;
  label: string;
}
interface ProviderDetails {
  inuranceProviderId: string | number;
  providerName: string;
  // providerCode: string | number;
}
interface Insurance {
  value: string | number;
  label: string;
  insuranceType: string | number;
}

interface InsuranceDetails {
  insuranceId: string | number;
  insuranceName: string;
  insuranceType: string | number;
}
// import "select2/dist/css/select2.css";
const ITEM_HEIGHT = 48;
const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const InsuranceProviderAssignment = () => {
  const { t } = useLang();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setAddTab2(false);
    setTab2Search(false);
    setOpen(false);
    setModalShow(false);
    handleReset();
    resetSearch();
  };
  const [triggerSearchData, setTriggerSearchData] = useState(false);

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };

  const showPage = (i: number) => {
    setCurPage(i);
  };

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    loadData();
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);
  const [insuranceData, setInsuranceData] = useState<any>("");
  const [isChecked, setIsChecked] = useState(true);
  const open1 = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>, data: any) => {
    setAnchorEl(event.currentTarget);
    setInsuranceData(data);
  };

  const [ProviderInsuranceAssignmentList, setProviderInsuranceAssignmentList] =
    useState<any>([
      {
        providerID: 0,
        insuranceAssignmentId: 0,
        insuranceId: 0,
        providerName: "",
        displayName: "",
        tmitCode: "",
        insuranceName: "",
        insuranceType: "",
        status: true,
      },
    ]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };
  const [loading, setLoading] = useState(false);
  const loadData = (reset: boolean = false) => {
    setLoading(true);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    var search = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: trimmedSearchRequest,
      sortColumn: reset ? initialSorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    };
    InsuranceService.getInsuranceAssigment(search).then((res: any) => {
      setTotal(res?.data?.total);
      setLoading(false);
      setProviderInsuranceAssignmentList(res.data.data);
    });
  };

  React.useEffect(() => {
    loadData();
  }, []);

  let [searchRequest, setSearchRequest] = useState({
    providerID: 0,
    insuranceAssignmentId: 0,
    providerName: "",
    displayName: "",
    tmitCode: "",
    insuranceName: "",
    insuranceType: "",
    status: null,
  });
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.name === "status") {
      setSearchRequest((pre) => {
        return {
          ...pre,
          [e.target.name]: str2bool(e.target.value),
        };
      });
    } else {
      setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
    }
  };
  var str2bool = (value: string) => {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      if (value.toLowerCase() === "null") return null;
    }
  };
  function resetSearch() {
    searchRequest = {
      providerID: 0,
      insuranceAssignmentId: 0,
      providerName: "",
      displayName: "",
      tmitCode: "",
      insuranceName: "",
      insuranceType: "",
      status: null,
    };
    setSearchRequest({
      providerID: 0,
      insuranceAssignmentId: 0,
      providerName: "",
      displayName: "",
      tmitCode: "",
      insuranceName: "",
      insuranceType: "",
      status: null,
    });
    setSorting(initialSorting);
    loadData(true);
  }
  const [open, setOpen] = useState(false);

  // Using an object to track the open state for each row
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  // Toggle function to handle expansion of a specific row
  const handleRowExpand = (rowIndex: string) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [rowIndex]: !prevState[rowIndex], // Toggle the open state for the clicked row
    }));
  };
  const [show, setShow] = React.useState(false);

  const [modalShow, setModalShow] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ProviderNameError, setProviderNameError] = useState(false);
  const [InsuranceNameError, setInsuranceNameError] = useState(false);
  const [DisplayNameError, setDisplayNameError] = useState(false);
  const [referenceOptions, setReferenceOptions] = useState<any>([]);
  const [referenceLabError, setReferenceLabError] = useState(false);
  const [ProviderList, setProviderList] = useState<Provider[]>([]);

  interface Iarr {
    providerArray: providerArray[] | null;
  }
  interface providerArray {
    value: number | string;
    label: string;
    // providerCode: string;
  }
  const GetProviders = () => {
    InsuranceService.getProvidersForDropDown().then((res: any) => {
      let providerArray: Provider[] = [];
      res?.data?.data.forEach(
        ({
          inuranceProviderId,
          providerName,
        }: // providerCode,
        ProviderDetails) => {
          let providerDetails: Provider = {
            value: inuranceProviderId,
            label: providerName,
            // providerCode: providerCode,
          };
          providerArray.push(providerDetails);
        }
      );
      setProviderList(providerArray);
    });
  };

  const [InsuranceList, setInsuranceList] = useState<Insurance[]>([]);
  const GetInsurance = () => {
    // e.preventDefault()
    InsuranceService.getInsuranceForDropDown().then((res: any) => {
      let insuranceArray: Insurance[] = [];
      res?.data?.data.forEach(
        ({ insuranceId, insuranceName, insuranceType }: InsuranceDetails) => {
          let insuranceDetails: Insurance = {
            value: insuranceId,
            label: insuranceName,
            insuranceType: insuranceType,
          };
          insuranceArray.push(insuranceDetails);
        }
      );
      setInsuranceList(
        insuranceArray.filter(
          (item) =>
            item.label.trim().toUpperCase() !== "SELFPAY" &&
            item.label.trim().toUpperCase() !== "TEST INSURANCES" &&
            item.label.trim().toUpperCase() !== "CLIENT BILL"
        )
      );
    });
  };
  const [ProviderInsuranceAssignment, setProviderInsuranceAssignment] =
    useState({
      insuranceAssignmentId: 0,
      providerId: 0,
      providerDisplayName: "",
      // providerCode: "",
      insuranceId: 0,
      insuranceType: "",
      status: true,
      referenceLabId: 0,
      facilityId: 0,
    });
  let {
    insuranceAssignmentId,
    providerId,
    providerDisplayName,
    // providerCode,
    insuranceId,
    insuranceType,
    status,
  } = ProviderInsuranceAssignment;

  let pdn = providerDisplayName;

  function reset() {
    setProviderInsuranceAssignment({
      insuranceAssignmentId: 0,
      providerId: 0,
      providerDisplayName: "",
      // providerCode: "",
      insuranceId: 0,
      insuranceType: "",
      status: true,
      referenceLabId: 0,
      facilityId: 0,
    });
    setInsuranceNameError(false);
    setReferenceLabError(false);
    setProviderNameError(false);
    setDisplayNameError(false);
    setModalShow(false);
  }
  const validateForm = () => {
    let formIsValid = true;
    if (providerId === 0 || providerId === undefined) {
      setProviderNameError(true);
      formIsValid = false;
    }
    if (providerDisplayName === "") {
      setDisplayNameError(true);
      formIsValid = false;
    }
    // if (providerCode === "") {
    //   // setTmitCodeError(true);
    //   formIsValid = false;
    // }
    if (insuranceId === 0 || insuranceId === undefined) {
      setInsuranceNameError(true);
      formIsValid = false;
    }
    if (
      ProviderInsuranceAssignment.referenceLabId === 0 ||
      ProviderInsuranceAssignment.referenceLabId === undefined
    ) {
      setReferenceLabError(true);
      formIsValid = false;
    }

    return formIsValid;
  };
  const addInsurance = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (ProviderInsuranceAssignment.insuranceAssignmentId === 0) {
        setIsSubmitting(true);
        InsuranceService.AddInsuranceAssigment(ProviderInsuranceAssignment)
          .then((res: any) => {
            if (res?.data?.httpStatusCode === 200) {
              toast.success(t(res?.data?.message));
              reset();
              loadData();
              setIsSubmitting(false);
            } else if (res?.data?.httpStatusCode === 400) {
              setIsSubmitting(false);
              toast.info(t(res?.data?.error));
            }
          })
          .catch((err: any) => {
            setIsSubmitting(false);
          });
      } else {
        setIsSubmitting(true);
        InsuranceService.AddInsuranceAssigment(ProviderInsuranceAssignment)
          .then((res: any) => {
            if (res?.data?.httpStatusCode === 200) {
              toast.success(t(res?.data?.message));
              reset();
              loadData();
              setIsSubmitting(false);
            } else if (res?.data?.httpStatusCode === 400) {
              setIsSubmitting(false);
              toast.info(t(res?.data?.error));
            }
          })
          .catch((err: any) => {
            setIsSubmitting(false);
          });
      }
    }
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === "status") {
      setProviderInsuranceAssignment({
        ...ProviderInsuranceAssignment,
        [e.currentTarget.name]: e.currentTarget.checked,
      });
    } else {
      setProviderInsuranceAssignment({
        ...ProviderInsuranceAssignment,
        [e.currentTarget.name]: e.currentTarget.value,
      });

      if (
        e.currentTarget.name === "providerId" &&
        e.currentTarget.value.length > 0
      ) {
        setProviderNameError(false);
      }
      if (
        e.currentTarget.name === "providerDisplayName" &&
        e.currentTarget.value.length > 0
      ) {
        setDisplayNameError(false);
      }
      // if (
      //   e.currentTarget.name === "providerCode" &&
      //   e.currentTarget.value.length > 0
      // ) {
      // }
      if (
        e.currentTarget.name === "insuranceId" &&
        e.currentTarget.value.length > 0
      ) {
        setInsuranceType(e.currentTarget.value);
        setInsuranceNameError(false);
      }
    }
    setIsChecked(e.target.checked);
  };

  const AddNew = () => {
    GetProviders();
    GetInsurance();
    if (open) {
      setOpen(!open);
    }
    setModalShow(true);
    setEditGridHeader(false);
  };
  const EditInsurance = (row: any) => {
    GetProviders();
    GetInsurance();
    setProviderInsuranceAssignment({
      insuranceAssignmentId: row.insuranceAssignmentId,
      providerId: row.providerID,
      providerDisplayName: row.displayName,
      // providerCode: row.tmitCode,
      insuranceId: row.insuranceId,
      insuranceType: row.insuranceType,
      status: row.status,
      referenceLabId: row.referenceLabId,
      facilityId: row.facilityId,
    });
    setModalShow(true);
    setEditGridHeader(true);
    loadData();
  };

  const changeStatus = (data: any) => {
    InsuranceService.ChangeStatusAssigment({
      insuranceAssignmentId: data.insuranceAssignmentId,
      newStatus: !data.status,
    }).then((res: any) => {
      toast.success(t(res.data.message));
      loadData();
    });
  };

  const setInsuranceType = (id: any) => {
    let a: any = InsuranceList.filter(
      (insurance: any) => insurance.insuranceId == id
    );
    setProviderInsuranceAssignment((pre) => {
      return {
        ...pre,
        insuranceType: a[0].insuranceType,
      };
    });
  };

  const onProviderSelect = (e: any) => {
    setProviderInsuranceAssignment((preVal) => {
      return {
        ...preVal,
        providerId: e?.value,
        // providerCode: e?.providerCode,
        providerDisplayName: e?.label,
      };
    });
    setProviderNameError(false);
    setDisplayNameError(false);
  };

  const onInsuranceSelect = (e: any) => {
    setProviderInsuranceAssignment((preVal) => {
      return {
        ...preVal,
        insuranceId: e?.value,
        insuranceType: e?.insuranceType,
      };
    });
    setInsuranceNameError(false);
  };

  const referenceLabSelection = (e: any) => {
    setProviderInsuranceAssignment((preVal) => {
      return {
        ...preVal,
        referenceLabId: e?.value,
      };
    });
    setReferenceLabError(false);
  };
  function isOptionEqualToValue(option: any, value: any) {
    return option.insuranceId === value;
  }
  const selectedOption = ProviderList.find(
    (option: any) => option.value === pdn
  );
  const [editGridHeader, setEditGridHeader] = useState(false);
  ////////////-----------------Sorting-------------------///////////////////
  const initialSorting = {
    sortColumn: "insuranceAssignmentId",
    sortDirection: "desc",
  };
  const [sort, setSorting] = useState<any>(initialSorting);
  const searchRef = useRef<any>(null);

  const handleSort = (columnName: string) => {
    // Toggle sort order based on current state
    const newSortOrder = searchRef.current.id === "asc" ? "desc" : "asc";
    searchRef.current.id = newSortOrder;

    setSorting((prevSort: any) => ({
      ...prevSort,
      sortingOrder: newSortOrder,
      clickedIconData: columnName,
    }));

    // Make sure sort data reflects the column and direction
    sort.sortColumn = columnName;
    sort.sortDirection = newSortOrder;

    loadData(); // Re-load the data based on the new sort
  };
  const [value, setValue] = useState<any>(0);
  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);

  const handleClickOpen = (insuranceData: any) => {
    if (insuranceData.status) {
      setShow1(true);
      // setValue(insuranceData);
    } else {
      setShow1(false);
      changeStatus(insuranceData);
    }
  };

  const ReferenceLabLookup = () => {
    Requisition.GetReferenceLabLookup()
      .then((res: AxiosResponse) => {
        setReferenceOptions(res?.data);
      })
      .catch((err: string) => {
        console.error(err);
      });
  };

  const FacilityLookup = () => {
    Requisition.GetFacilityLookup()
      .then((res: AxiosResponse) => {
        const transformedFac = res?.data.map((item: any) => ({
          value: item.facilityId,
          label: item.facilityName,
        }));
      })
      .catch((err: string) => {
        console.error(err);
      });
  };

  useEffect(() => {
    ReferenceLabLookup();
    FacilityLookup();
  }, []);

  const columns = [
    { key: "providerName", label: t("Insurance Provider Name") },
    { key: "displayName", label: t("Insurance Provider Display Name") },
    { key: "insuranceType", label: t("Insurance Type") },
    { key: "referenceLabName", label: t("Reference Lab") },
    { key: "status", label: t("Inactive/Active") },
  ];

  ////////////-----------------Sorting-------------------///////////////////
  //==========================================================================================
  //=================================  Tab 2 functions start =================================
  //==========================================================================================

  const [addTab2, setAddTab2] = useState(false);
  const [tab2Search, setTab2Search] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [editDisable, setEditDisable] = useState(false);

  const initialPostData = {
    city: "",
    state: "",
    zipCode: "",
    address2: "",
    address1: "",
    landPhone: "",
    providerCode: "",
    providerName: "",
    providerStatus: true,
    insuranceProviderId: 0,
  };
  const [postData, setpostData] = useState<any>(initialPostData);
  const initialSearchCriteria = {
    city: "",
    state: "",
    stateId: 0,
    zipCode: "",
    landPhone: "",
    providerCode: "",
    providerName: "",
    providerStatus: null,
    insuranceProviderId: 0,
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  const [triggerSearchData1, setTriggerSearchData1] = useState(false);
  const [reset1, setReset1] = useState(false);
  const [stateLookup, setStatelookup] = useState<Lookups[]>([]);

  const GetStatelookup = async () => {
    let res = await InsuranceService.GetStatesLookup();
    setStatelookup(res.data);
  };

  const handleStatelookup = (e: any) => {
    setpostData((oldData: any) => ({
      ...oldData,
      state: e.label,
    }));
  };
  ////////////-----------------Tab2 Post API Start-------------------///////////////////
  const validatePhoneNumber = (phoneNumber: any) => {
    // Regular expression for validating phone number in the format (898) 998-____
    const regex = /^\(\d{3}\) \d{3}-\d{4}$/;

    // Test the phone number against the regex
    return regex.test(phoneNumber);
  };

  const ApidataPost = async () => {
    const data = {
      insuranceProviderId: postData.insuranceProviderId,
      providerName: postData.providerName,
      address1: postData.address1,
      address2: postData.address2,
      city: postData.city,
      state: postData.state,
      zipCode: postData.zipCode,
      landPhone: postData.landPhone,
      providerCode: postData.providerCode,
      providerStatus: postData.providerStatus,
    };

    let resp = await InsuranceProviderSave(data);
    if (resp.data.httpStatusCode === 200) {
      toast.success(t(resp.data.message));
      setEditDisable(false);
    } else {
      toast.error(t(resp?.data?.error));
    }
  };
  const handlesave = async () => {
    // Validation rules
    const validations = [
      { field: "providerName", message: t("Please Enter Provider Name.") },
      { field: "address1", message: t("Please Enter Address1.") },
      { field: "city", message: t("Please Enter City.") },
      { field: "state", message: t("Please Enter State.") },
      { field: "zipCode", message: t("Please Enter Zip Code.") },
    ];

    // Loop through the validations and check if any field is empty
    for (const validation of validations) {
      if (postData[validation.field].length === 0) {
        toast.error(t(validation.message));
        return;
      }
    }

    // Validate zip code length
    if (postData.zipCode.length < 5) {
      toast.error(t("Please Enter a valid zip code (minimum 5 characters)."));
      return;
    }

    // Validate phone number if present
    if (postData.landPhone && !validatePhoneNumber(postData.landPhone)) {
      toast.error(t("Please Enter a valid Phone Number."));
      return;
    }

    // Proceed to API call only if no validation errors
    try {
      await ApidataPost();
      setpostData(initialPostData);
      setAddTab2(false);
      setStatelookup([]);
      showData();
    } catch (error) {
      console.error(t("Error in saving data:"), error);
    }
  };

  const handleCancel = () => {
    setAddTab2(false);
    setpostData(initialPostData);
    setEditDisable(false);
  };
  ////////////-----------------Tab2 Post API End-------------------///////////////////
  /*##############################-----PAGINATION Start-----#################*/
  const [curPage1, setCurPage1] = useState(1);
  const [pageSize1, setPageSize1] = useState(50);
  const [total1, setTotal1] = useState<number>(0);
  const [totalPages1, setTotalPages1] = useState(0);
  const [pageNumbers1, setPageNumbers1] = useState<number[]>([]);
  const nextPage1 = () => {
    if (curPage1 < Math.ceil(total1 / pageSize1)) {
      setCurPage1(curPage1 + 1);
    }
  };

  const showPage1 = (i: number) => {
    setCurPage1(i);
  };

  const prevPage1 = () => {
    if (curPage1 > 1) {
      setCurPage1(curPage1 - 1);
    }
  };

  useEffect(() => {
    setTotalPages1(Math.ceil(total1 / pageSize1));
    const pgNumbers1 = [];
    for (let i = curPage1 - 2; i <= curPage1 + 2; i++) {
      if (i > 0 && i <= totalPages1) {
        pgNumbers1.push(i);
      }
    }
    setPageNumbers1(pgNumbers1);
  }, [total1, curPage1, pageSize1, totalPages1]);
  /*##############################-----PAGINATION End-----#################*/
  ////////////-----------------Tab2 Get API Start-------------------///////////////////
  const [apiGetData, setApiGetData] = useState([]);
  const showData = async () => {
    setLoading2(true); // Start loading before the API call
    let obj = {
      pageNumber: curPage1,
      pageSize: pageSize1,
      queryModel: {
        insuranceProviderId: 0,
        providerName: (searchCriteria.providerName || "").trim(),
        providerCode: (searchCriteria.providerCode || "").trim(),
        city: (searchCriteria.city || "").trim(),
        state: (searchCriteria.state || "").trim(),
        zipCode: (searchCriteria.zipCode || "").trim(),
        phone: (searchCriteria.landPhone || "").trim(),
        status: searchCriteria.providerStatus || null,
      },
      sortColumn: sort1.clickedIconData || "InsuranceProviderId",
      sortDirection: sort1.sortingOrder || "Desc",
    };

    try {
      let res = await InsuranceProviderGetAll(obj);

      if (res && res.data) {
        setApiGetData(res?.data?.data);
        setTotal1(res.data.total);
      } else {
        console.error(t("No data received"), res);
      }
    } catch (error) {
      console.error(t("API call failed"), error);
    } finally {
      console.log(t("Finally block executed"));
      setLoading2(false);
    }
  };

  /*##############################-----Delete Api Start-----##############################*/
  const handleDelete = async (id: number) => {
    try {
      await InsuranceProviderDelete(id);
      showData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  /*##############################-----Delete Api End-----##############################*/

  const handleEdit = (row: any) => {
    console.log(row, "IN EDIT");
    setpostData(() => ({
      ...row,
      insuranceProviderId: row.insuranceProviderId,
    }));
    setAddTab2(true);
    setEditDisable(true);
  };

  /*#########################----Search Function Start------########################## */

  const handleInputChange = (e: any, selectName?: string) => {
    if (selectName === "state") {
      const filteredCategories = stateLookup.find(
        (category) => category.value === e.value
      );

      setSearchCriteria({
        ...searchCriteria,
        state: filteredCategories?.label as string,
        stateId: filteredCategories?.value as number,
      });
    } else {
      setSearchCriteria({
        ...searchCriteria,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSearch = () => {
    setCurPage1(1);
    setTriggerSearchData1((prev) => !prev);
  };
  const handleKeyPress1 = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  /*#########################----Search Function End------########################## */
  /*#########################----SORT STARTS------########################## */
  const [sort1, setSorting1] = useState<SortingTypeI>(sortByIPId);
  const [firstRender, setFirstRender] = useState(true);
  const searchRef1 = useRef<any>(null);
  /////////////
  const handleSort1 = (columnName1: any) => {
    const newSortOrder = searchRef1.current.id === "asc" ? "desc" : "asc";
    searchRef1.current.id = newSortOrder;

    setSorting1((prevSort: any) => ({
      ...prevSort,
      sortingOrder: newSortOrder,
      clickedIconData: columnName1,
    }));
  };

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    } else {
      showData();
    }
  }, [sort1]);

  /*#########################----SORT ENDS------########################## */
  /*##############################-----status Change-----##############################*/
  const handleStatusChange = async (id: number) => {
    try {
      await InsuranceStatusChange(id);
      showData();
    } catch (error) {
      console.error(t("Error Changing record:"), error);
    }
  };
  /*##############################-----status Change-----##############################*/
  const handleReset = () => {
    setSearchCriteria(initialSearchCriteria);
    setReset1(!reset1);
    setpostData(initialPostData);
    setCurPage1(1);
    setPageSize1(50);
    setSorting1(sortByIPId);
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Inactive Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to Inactive this record ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AssignInsuranceProviderModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AssignInsuranceProviderModalInactive`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              changeStatus(insuranceData);
              ModalhandleClose1();
            }}
          >
            {t("Inactive")}
          </button>
        </Modal.Footer>
      </Modal>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <Collapse in={open}>
            <div id="SearchCollapse" className="card mb-5">
              <div id="form-search" className=" card-body">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("Insurance Provider Name")}
                      </label>

                      <input
                        id={`AssignInsuranceProviderNameSearch`}
                        type="text"
                        name="providerName"
                        value={searchRequest.providerName}
                        onChange={onInputChangeSearch}
                        className="form-control bg-transparent"
                        placeholder={t("Insurance Provider Name")}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Display Name")}</label>
                      <input
                        id={`AssignInsuranceUserNameSearch`}
                        type="text"
                        name="displayName"
                        value={searchRequest.displayName}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Display Name")}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("Insurance Type")}
                      </label>
                      <input
                        id={`AssignInsuranceInsuranceTypeSearch`}
                        type="text"
                        name="insuranceType"
                        value={searchRequest.insuranceType}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Insurance Type Name")}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="status" className="mb-2 fw-500">
                        {t("Inactive/Active")}
                      </label>
                      <select
                        id={`AssignInsuranceStatusSearch`}
                        name="status"
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-select bg-transparent z-index-3"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder="Status"
                        value={
                          searchRequest.status
                            ? "true"
                            : searchRequest.status === false
                              ? "false"
                              : ""
                        }
                      >
                        <option value="">{t("--- Select ---")}</option>
                        <option value="true">{t("Active")}</option>
                        <option value="false">{t("Inactive")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                    <button
                      id={`AssignInsuranceSearch`}
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData((prev) => !prev);
                      }}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <i className="fa fa-search"></i>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      type="reset"
                      onClick={(e) => resetSearch()}
                      className="btn btn-secondary btn-sm btn-secondary--icon"
                      id={`AssignInsuranceReset`}
                    >
                      <span>
                        <i className="fa fa-times"></i>
                        <span>{t("Reset")}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
          <Collapse in={modalShow}>
            <div id="ModalCollapse" className="card mb-5">
              <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-1 minh-42px">
                <h4 className="m-1">
                  {editGridHeader
                    ? "Edit Insurance Provider Assignment"
                    : "Add Insurance Provider Assignment"}
                </h4>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`AssignInsuranceCancel`}
                    className="btn btn-secondary btn-sm btn-secondary--icon"
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => reset()}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>

                  {insuranceAssignmentId === 0 ? (
                    <LoadButton
                      id={`AssignInsuranceSave`}
                      className="btn btn-sm fw-bold btn-primary"
                      loading={isSubmitting}
                      btnText={t("Save")}
                      loadingText={t("Saving")}
                      onClick={(e: any) => addInsurance(e)}
                    />
                  ) : (
                    <LoadButton
                      id={`AssignInsuranceUpdate`}
                      className="btn btn-sm fw-bold btn-primary"
                      loading={isSubmitting}
                      btnText="Update"
                      loadingText="Updating..."
                      onClick={(e: any) => addInsurance(e)}
                    />
                  )}
                </div>
              </div>

              <div id="form-search" className=" card-body py-3">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="required mb-2 fw-500">
                        {t("Insurance Provider Name")}
                      </label>
                      {editGridHeader ? (
                        <input
                          id={`AssignInsuranceProviderName`}
                          type="text"
                          name="providerDisplayName"
                          value={
                            ProviderInsuranceAssignmentList?.find(
                              (item: any) =>
                                item.providerID ===
                                ProviderInsuranceAssignment?.providerId
                            )?.providerName
                          }
                          className="form-control"
                          disabled={true}
                        />
                      ) : (
                        <Select
                          inputId={`AssignInsuranceProviderName`}
                          menuPortalTarget={document.body}
                          styles={reactSelectStyle}
                          theme={(theme: any) => styles(theme)}
                          options={ProviderList}
                          name="providerId"
                          placeholder={t("Select Provider Name")}
                          value={ProviderList.filter(function (option: any) {
                            return (
                              option.value ===
                              ProviderInsuranceAssignment.providerId
                            );
                          })}
                          onChange={(e: any) => onProviderSelect(e)}
                          isSearchable={true}
                          isClearable={true}
                          className="z-index-3"
                        />
                      )}
                      {ProviderNameError ? (
                        <span style={{ color: "red" }}>
                          {t("Provider Name is Required!")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="required mb-2 fw-500">
                        {t("Display Name")}
                      </label>
                      <input
                        id={`AssignInsuranceDisplayName`}
                        type="text"
                        name="providerDisplayName"
                        onChange={(e) => onInputChange(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Display Name")}
                        value={providerDisplayName}
                      />
                      {DisplayNameError ? (
                        <span style={{ color: "red" }}>
                          {t("Display Name is Required!")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500 required">
                        {t("Insurance Type")}
                      </label>
                      <Select
                        inputId={`AssignInsuranceInsuranceType`}
                        menuPortalTarget={document.body}
                        styles={reactSelectStyle}
                        theme={(theme: any) => styles(theme)}
                        options={InsuranceList}
                        name="insuranceId"
                        placeholder={t("Select Insurance Type")}
                        value={InsuranceList.filter(function (option: any) {
                          return (
                            option.value ===
                            ProviderInsuranceAssignment.insuranceId
                          );
                        })}
                        onChange={(e: any) => onInsuranceSelect(e)}
                        isSearchable={true}
                        isClearable={true}
                        className="z-index-3"
                      />
                      {InsuranceNameError ? (
                        <span style={{ color: "red" }}>
                          {t("Insurence Type Required!")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2 fw-500 required">
                      {t("Reference Lab")}
                    </label>
                    <Select
                      inputId={`AssignInsuranceReferenceLab`}
                      menuPortalTarget={document.body}
                      className="z-index-3"
                      name="referenceLab"
                      placeholder={t("Select Refernce Lab")}
                      value={referenceOptions.filter(
                        (option: any) =>
                          option.value ===
                          ProviderInsuranceAssignment.referenceLabId
                      )}
                      onChange={referenceLabSelection}
                      options={referenceOptions}
                      styles={reactSelectStyle}
                      theme={(theme: any) => styles(theme)}
                      isSearchable={true}
                      isClearable={true}
                    />
                    {referenceLabError ? (
                      <span style={{ color: "red" }}>
                        {t("Reference Lab is Required!")}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="required mb-2 fw-500">
                      {t("Inactive/Active")}
                    </label>
                    <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                      <input
                        id={`AssignInsuranceSwitchButton`}
                        className="form-check-input"
                        onChange={(e) => onInputChange(e)}
                        name="status"
                        type="checkbox"
                        checked={
                          ProviderInsuranceAssignment.status ? true : false
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
          <>
            <AddNewInsuranceProvider
              setTabOpen2={setAddTab2}
              GetStatelookup={GetStatelookup}
              setEditDisable={setEditDisable}
              addTab2={addTab2}
              setpostData={setpostData}
              postData={postData}
              stateLookup={stateLookup}
              handlesave={handlesave}
              editDisable={editDisable}
              handleStatelookup={handleStatelookup}
              handleCancel={handleCancel}
              showData={showData}
            />
            <SearchInsurance
              setTab2Search={setTab2Search}
              GetStatelookup={GetStatelookup}
              tab2Search={tab2Search}
              stateLookup={stateLookup}
              postData={postData}
              searchCriteria={searchCriteria}
              setpostData={setpostData}
              handleReset={handleReset}
              handleSearch={handleSearch}
              handleKeyPress1={handleKeyPress1}
              handleStatelookup={handleStatelookup}
              handleInputChange={handleInputChange}
            />
            <div className="d-flex flex-column flex-column-fluid">
              <div className="app-content flex-column-fluid">
                <div>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    TabIndicatorProps={{ style: { background: "transparent" } }}
                    className="min-h-auto"
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
                    <TabSelected
                      label={t("Assigned Insurance Provider")}
                      {...a11yProps(0)}
                      className="fw-bold text-capitalize"
                      id={`AssignedInsuranceProvider`}
                    />
                    <TabSelected
                      label={t("All Insurance Provider")}
                      {...a11yProps(1)}
                      className="fw-bold text-capitalize"
                      id={`AllInsuranceProvider`}
                    />
                  </Tabs>
                  <div className="card rounded-top-0 shadow-none tab-content-card">
                    <div className="card-body py-2">
                      <TabPanel value={value} index={0}>
                        <InsuranceTab1Table
                          sort={sort}
                          setPageSize={setPageSize}
                          open={open}
                          pageNumbers={pageNumbers}
                          nextPage={nextPage}
                          curPage={curPage}
                          AddNew={AddNew}
                          loading={loading}
                          show={show}
                          totalPages={totalPages}
                          total={total}
                          showPage={showPage}
                          prevPage={prevPage}
                          pageSize={pageSize}
                          columns={columns}
                          setOpen={setOpen}
                          searchRef={searchRef}
                          handleSort={handleSort}
                          modalShow={modalShow}
                          openRows={openRows}
                          handleClickOpen={handleClickOpen}
                          insuranceData={insuranceData}
                          handleClick={handleClick}
                          setOpenRows={setOpenRows}
                          setModalShow={setModalShow}
                          EditInsurance={EditInsurance}
                          loadData={loadData}
                          ProviderInsuranceAssignmentList={
                            ProviderInsuranceAssignmentList
                          }
                        />
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <AddNewProvider
                          sort1={sort1}
                          reset1={reset1}
                          handleStatusChange={handleStatusChange}
                          handleSort1={handleSort1}
                          searchRef1={searchRef1}
                          setAddTab2={setAddTab2}
                          addTab2={addTab2}
                          setTab2Search={setTab2Search}
                          tab2Search={tab2Search}
                          setApiGetData={setApiGetData}
                          apiGetData={apiGetData}
                          setLoading2={setLoading2}
                          loading2={loading2}
                          handleDelete={handleDelete}
                          handleEdit={handleEdit}
                          curPage1={curPage1}
                          nextPage1={nextPage1}
                          pageSize1={pageSize1}
                          prevPage1={prevPage1}
                          pageNumbers1={pageNumbers1}
                          showPage1={showPage1}
                          total1={total1}
                          totalPages1={totalPages1}
                          setPageSize1={setPageSize1}
                          showData={showData}
                          triggerSearchData1={triggerSearchData1}
                        />
                      </TabPanel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default InsuranceProviderAssignment;
