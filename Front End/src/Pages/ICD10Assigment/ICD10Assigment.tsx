import React, { useState, useEffect, useRef } from "react";
import Collapse from "@mui/material/Collapse";
import AssigmentService from "../../Services/AssigmentService/AssigmentService";
import Requisition from "../../Services/Requisition/RequisitionTypeService";
import { AxiosResponse } from "axios";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { AutocompleteStyle } from "../../Utils/MuiStyles/AutocompleteStyles";
import { toast } from "react-toastify";
import LoadButton from "../../Shared/Common/LoadButton";
import Select from "react-select";
import AutoComplete from "../../Shared/AutoComplete";
import { styled } from "@mui/material/styles";
import { reactSelectStyle, styles } from "../../Utils/Common";
import AssignedICD10 from "./AssignedICD10";
import AllICD10s from "./AllICD10s";
import { Modal } from "react-bootstrap";
import { id } from "date-fns/locale";
import SpecimenTypeAssigmentService from "../../Services/Compendium/SpecimenTypeAssigmentService";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import useLang from "Shared/hooks/useLanguage";
interface Facility {
  value: number;
  label: string;
}
interface FacilityDetails {
  facilityId: number;
  facility: string;
}
interface ReferenceLab {
  value: number;
  label: string;
}
export interface RefLabDetails {
  labId: number;
  labDisplayName: string;
}
interface Requisition {
  value: number;
  label: string;
}
interface RequisitionDetails {
  requisitionTypeId: number;
  requisitionType: string;
}
interface Panel {
  value: number | string;
  label: string;
}
interface PanelDetails {
  panelId: number | string;
  panelName: string;
}
interface ICD10CodeAssigment {
  facilityId: number;
  icd10assignmentId: number;
  icd10id: any;
  icD10CodeDescription: string;
  refLabId: number;
  reqTypeId: number;
  panelId: number;
  status: boolean;
  icD10Code: string;
  icd10group: string;
}
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

const TOX_REQUISITION_TYPE_ID = 3;
const BLOOD_REQUISITION_TYPE_ID = 2;

const ICD10Assigment = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  //============================================================================================
  //====================================  ICD10 ASSIGMENT PAGINATION START =====================
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
  //====================================  ICD10 ASSIGMENT PAGINATION END =======================
  //============================================================================================

  //============================================================================================
  //====================================  ICD10 CODE START =====================================
  //============================================================================================
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

  useEffect(() => {
    // setCurPage1(1)
    loadData1();
  }, [curPage1, curPage1, triggerSearchData]);
  //============================================================================================
  //====================================  ICD10 CODE PAGINATION END ============================
  //============================================================================================
  useEffect(() => {
    //setCurPage1(1);
    loadData1();
  }, [pageSize1]);
  useEffect(() => {
    //setCurPage1(1);
    loadData();
  }, [pageSize]);
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      setPageSize(50);
      setCurPage(1);
      loadData();
      setOpen1(false);
      setCheck(false);
    }
    if (newValue === 1) {
      loadData1();
      setOpen(false);
      setAddOpen(false);
      setPageSize1(50);
    }
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);
  const [Addopen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ICD10AssigmentList, setICD10AssigmentList] = useState([
    {
      icd10assignmentId: 0,
      icd10id: 0,
      refLabId: 0,
      reqTypeId: 0,
      facilityId: 0,
      icD10Code: "",
      icD10CodeDescription: "",
      referenceLab: "",
      labType: "",
      requisitionType: "",
      facility: "",
      panelId: 0,
      panelName: "",
      status: true,
    },
  ]);
  const [ICD10CodeError, setICD10CodeError] = useState(false);
  const [ICD10DescriptionError, setICD10DescriptionError] = useState(false);
  const [errors, setErrors] = useState({
    IcdCode: "",
    icD10CodeDescription: "",
    requisition: "",
    panel: "",
    lab: "",
  });

  // Panel is only mandatory when Requisition Type is Infectious Disease
  function isPanelRequired() {
    return (
      ICD10CodeAssigment?.reqTypeId !== BLOOD_REQUISITION_TYPE_ID &&
      ICD10CodeAssigment?.reqTypeId !== TOX_REQUISITION_TYPE_ID
    );
  }

  const validateForm = () => {
    let formIsValid = true;
    const newErrors: any = {};

    if (ICD10CodeAssigment.icD10Code.trim() === "") {
      newErrors.IcdCode = "Please Select ICD Code";
      formIsValid = false;
    }

    if (ICD10CodeAssigment.icD10CodeDescription.trim() === "") {
      newErrors.icD10CodeDescription = "Please Add ICD Description";
      formIsValid = false;
    }

    if (!ICD10CodeAssigment.reqTypeId) {
      newErrors.requisition = "Please Select Requisition";
      formIsValid = false;
    }

    const itemFound = PanelList.filter(
      (item) => item.value === ICD10CodeAssigment.panelId
    );

    if (isPanelRequired()) {
      if (!ICD10CodeAssigment.panelId || itemFound.length === 0) {
        newErrors.panel = "Please Select Panel";
        formIsValid = false;
      }
    }

    if (!ICD10CodeAssigment.refLabId) {
      newErrors.lab = "Please Select Lab Field";
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };

  const addAssigment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (ICD10CodeAssigment.icd10assignmentId === 0) {
        setIsSubmitting(true);
        AssigmentService.AddICD10Assigmnet(ICD10CodeAssigment)
          .then((res: any) => {
            if (res?.data?.httpStatusCode === 200) {
              toast.success(t(res?.data?.message));
              reset();
              setPanelList([]);
              loadData();
              setIsSubmitting(false);
              setErrors((pre: any) => ({
                IcdCode: "",
                requisition: "",
                icD10CodeDescription: "",
                panel: "",
                lab: "",
              }));
            }
          })
          .catch((err: any) => {
            setIsSubmitting(false);
          });
      } else {
        setIsSubmitting(true);
        AssigmentService.AddICD10Assigmnet(ICD10CodeAssigment)
          .then((res: any) => {
            if (res?.data?.httpStatusCode === 200) {
              toast.success(t(res?.data?.message));
              reset();
              loadData();
              setIsSubmitting(false);
              setErrors((pre: any) => ({
                IcdCode: "",
                icD10CodeDescription: "",
                requisition: "",
                panel: "",
                lab: "",
              }));
            }
          })
          .catch((err: any) => {});
      }
      loadData();
    }
  };

  const [ICD10CodeAssigment, setICD10CodeAssigment] =
    useState<ICD10CodeAssigment>({
      icd10assignmentId: 0,
      icd10id: 0,
      icD10CodeDescription: "",
      refLabId: 0,
      reqTypeId: 0,
      facilityId: 0,
      panelId: 0,
      status: true,
      icD10Code: "",
      icd10group: "",
    });
  let {
    icd10assignmentId,
    icD10CodeDescription,
    icd10id,
    refLabId,
    reqTypeId,
    facilityId,
  } = ICD10CodeAssigment;
  const onInputChange = (e: any) => {
    if (e.currentTarget.name === "status") {
      setICD10CodeAssigment({
        ...ICD10CodeAssigment,
        [e.currentTarget.name]: e.currentTarget.checked,
      });
    } else {
      setICD10CodeAssigment({
        ...ICD10CodeAssigment,
        [e.currentTarget.name]: e.currentTarget.value,
      });
      if (
        e.currentTarget.name === "icd10id" &&
        e.currentTarget.value.length > 0
      ) {
        setErrors((pre: any) => ({
          ...pre,
          IcdCode: "",
        }));
        setICD10CodeError(false);
      }
    }
  };
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
      sortColumn: reset ? initialSorting?.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    };
    AssigmentService.getICD10AssigmnetList(search).then(
      (res: AxiosResponse) => {
        setLoading(false);
        setICD10AssigmentList(res.data.data);
        setTotal(res?.data?.total);
      }
    );
  };
  React.useEffect(() => {
    setCurPage(1);
    GetICD10Code(0);
    GetReferenceLab();
    GetFacilities();
    GetRequsition();

    loadData();
  }, [pageSize]);
  const AddNew = () => {
    GetICD10Code(0);
    GetReferenceLab();
    GetFacilities();
    GetRequsition();

    setOpen(false);
    setAddOpen(true);
  };

  function reset() {
    setICD10CodeAssigment({
      icd10assignmentId: 0,
      icd10id: null,
      icD10CodeDescription: "",
      refLabId: 0,
      reqTypeId: 0,
      facilityId: 0,
      panelId: 0,
      status: true,
      icD10Code: "",
      icd10group: "",
    });
    setICD10CodeError(false);
    setICD10DescriptionError(false);
    setAddOpen(false);
  }
  let [searchRequest, setSearchRequest] = useState({
    icD10Code: "",
    requisitionType: "",
    facility: "",
    icD10CodeDescription: "",
    referenceLab: "",
    panelName: "",
    status: null,
    icd10group: "",
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
      icD10Code: "",
      requisitionType: "",
      facility: "",
      icD10CodeDescription: "",
      referenceLab: "",
      panelName: "",
      status: null,
      icd10group: "",
    };
    setSearchRequest({
      icD10Code: "",
      requisitionType: "",
      facility: "",
      icD10CodeDescription: "",
      referenceLab: "",
      panelName: "",
      status: null,
      icd10group: "",
    });
    setSorting(initialSorting);
    loadData(true);
  }
  const changeStatus = (id: any, status: any) => {
    AssigmentService.ChangeStatusICD10Assigment({
      icD10CodeAssignmentId: id,
      newStatus: status,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          loadData();
        }
      })
      .catch((err: string) => {});
  };
  const [ICD10CodeList, setICD10CodeList] = useState([]);
  const GetICD10Code = (id: number) => {
    AssigmentService.ICD10CodeLookUp(id).then((res: AxiosResponse) => {
      setICD10CodeList(res?.data?.data);
    });
  };
  const [ReferenceLabList, setReferenceLabList] = useState<ReferenceLab[]>([]);
  const GetReferenceLab = () => {
    AssigmentService.ReferenceLabLookUp().then((res: any) => {
      let RefLabArray: ReferenceLab[] = [];
      res?.data?.data?.map(({ labId, labDisplayName }: RefLabDetails) => {
        let RefLabDetails: ReferenceLab = {
          value: labId,
          label: labDisplayName,
        };
        RefLabArray.push(RefLabDetails);
      });

      setReferenceLabList(RefLabArray);
    });
  };
  const [FacilityList, setFacilityList] = useState<Facility[]>([]);
  // const GetFacilities = () => {
  //   Requisition.GetFacilityLookup().then((res: any) => {
  //     let FacilityArray: Facility[] = [];
  //     res?.data?.data.forEach(({ facilityId, facility }: FacilityDetails) => {
  //       let FacilityDetails: Facility = {
  //         value: facilityId,
  //         label: facility,
  //       };
  //       FacilityArray.push(FacilityDetails);
  //     });
  //     setFacilityList(FacilityArray);
  //   });
  // };
  const GetFacilities = () => {
    Requisition.GetFacilityLookup()
      .then((res: AxiosResponse) => {
        const transformedFac = res?.data.map((item: any) => ({
          value: item.facilityId,
          label: item.facilityName,
        }));
        setFacilityList(transformedFac);
      })
      .catch((err: string) => {});
  };
  const [RequsitionList, setRequsitionList] = useState<Requisition[]>([]);
  const GetRequsition = () => {
    AssigmentService.RequsitionLookUp().then((res: any) => {
      let RequisitionArray: Requisition[] = [];
      res?.data?.data?.forEach(
        ({ requisitionTypeId, requisitionType }: RequisitionDetails) => {
          let RequisitionDetails: Requisition = {
            value: requisitionTypeId,
            label: requisitionType,
          };
          RequisitionArray.push(RequisitionDetails);
        }
      );
      setRequsitionList(RequisitionArray);
    });
  };
  const [PanelList, setPanelList] = useState<Panel[]>([]);

  const onPanelSelect = (e: any) => {
    setErrors((pre: any) => ({
      ...pre,
      panel: "",
    }));
    setICD10CodeAssigment((preVal: any) => {
      return {
        ...preVal,
        panelId: e?.value,
      };
    });
  };
  const onRequisitionSelect = async () => {
    setErrors((pre: any) => ({
      ...pre,
      requisition: "",
    }));

    if (ICD10CodeAssigment.reqTypeId === 0 || ICD10CodeAssigment.refLabId === 0)
      return;

    try {
      const res =
        await SpecimenTypeAssigmentService.getPanelsByReqTypeIdAndLabId(
          ICD10CodeAssigment.reqTypeId,
          ICD10CodeAssigment.refLabId
        );
      const copiedPanelList = res.data.data.map((obj: any) => ({
        value: obj.panelId,
        label: obj.panelDisplayName,
      }));
      setPanelList(copiedPanelList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onReferenceSelect = (e: any) => {
    setErrors((pre: any) => ({
      ...pre,
      lab: "",
    }));
    setICD10CodeAssigment((preVal) => ({
      ...preVal,
      refLabId: e?.value || "",
    }));
  };
  const onFacilitySelect = (e: any) => {
    setICD10CodeAssigment((preVal) => {
      return {
        ...preVal,
        facilityId: e.value,
      };
    });
  };

  const [value1, setValue1] = useState<any>(null);
  const [show1, setShow1] = useState(false);

  const ModalhandleClose1 = () => setShow1(false);

  const handleClickOpen1 = (id: any, status: any) => {
    setValue1({ id, status });
    setShow1(true);
  };

  let [searchRequest1, setSearchRequest1] = useState({
    icD10Code: "",
    description: "",
    icd10status: null,
  });
  const [open1, setOpen1] = useState(false);
  const [check, setCheck] = useState(false);
  const [ICD10CodeError1, setICD10CodeError1] = useState(false);
  const [UserList, setUserList] = useState([]);
  const addICD10 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (icd10code === "") {
      setICD10CodeError(true);
    }
    if (description === "") {
      setICD10DescriptionError(true);
    }
    if (icd10code === "" || description === "") return;
    setIsSubmitting(true);
    if (ICD10.icd10id === 0) {
      AssigmentService.saveICD10Codes(ICD10)
        .then((res: any) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            setCheck(false);
            setIsSubmitting(false);
            setICD10({
              icd10id: 0,
              icd10code: "",
              description: "",
              icd10status: true,
            });
            loadData1();
          }
        })
        .catch((err: any) => {});
    } else {
      setIsSubmitting(true);
      AssigmentService.saveICD10Codes(ICD10)
        .then((res: any) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            setCheck(false);
            setIsSubmitting(false);
            setICD10({
              icd10id: 0,
              icd10code: "",
              description: "",
              icd10status: true,
            });
            loadData1();
          }
        })
        .catch((err: any) => {});
    }
  };
  const [ICD10, setICD10] = useState({
    icd10id: 0,
    icd10code: "",
    description: "",
    icd10status: true,
  });
  let { icd10code, description, icd10status } = ICD10;
  const onInputChange1 = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === "icd10status") {
      setICD10({
        ...ICD10,
        [e.currentTarget.name]: e.currentTarget.checked,
      });
    } else {
      setICD10({
        ...ICD10,
        [e.currentTarget.name]: e.currentTarget.value,
      });
      setICD10CodeError(false);
      if (
        e.currentTarget.name === "icd10code" &&
        e.currentTarget.value.length > 0
      ) {
        setICD10CodeError1(false);
      }
      if (
        e.currentTarget.name === "description" &&
        e.currentTarget.value.length > 0
      ) {
        setICD10DescriptionError(false);
      }
    }
  };
  const loadData1 = (reset: boolean = false) => {
    setLoading2(true);

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest1).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    var search = {
      pageNumber: curPage1,
      pageSize: pageSize1,
      queryModel: trimmedSearchRequest,
      sortColumn: reset ? initialSorting1.sortColumn : sort1?.sortColumn,
      sortDirection: reset
        ? initialSorting1.sortDirection
        : sort1?.sortDirection,
    };
    AssigmentService.GetICD10Codes(search).then((res: AxiosResponse) => {
      setLoading2(false);

      setUserList(res.data.data);
      setTotal1(res?.data?.total);
    });
  };
  const AddNew1 = () => {
    setCheck(true);
    setOpen1(false);
  };
  const EditICD10Code = (row: any) => {
    setICD10({
      icd10id: row.icd10id,
      icd10code: row.icd10code,
      description: row.description,
      icd10status: row.icd10status,
    });
    setCheck(true);
  };
  const EditAssigment = (row: any) => {
    GetICD10Code(0);
    GetReferenceLab();
    GetFacilities();
    GetRequsition();

    setICD10CodeAssigment({
      icd10assignmentId: row.icd10assignmentId,
      icd10id: row.icd10id,
      icD10Code: row.icD10Code,
      icD10CodeDescription: row.icD10CodeDescription,
      refLabId: row.refLabId,
      reqTypeId: row.reqTypeId,
      facilityId: row.facilityId,
      panelId: row.panelId,
      status: row.status,
      icd10group: row.icd10group,
    });

    setAddOpen(true);
  };
  const changeStatus1 = (id: number, status: boolean) => {
    AssigmentService.changeStatusICD10Code({
      icD10CodeId: id,
      newStatus: status,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          loadData1();
        }
      })
      .catch((err: string) => {});
  };
  const onInputChangeSearch1 = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.name === "icd10status") {
      setSearchRequest1((pre) => {
        return {
          ...pre,
          [e.target.name]: str2bool(e.target.value),
        };
      });
    } else {
      setSearchRequest1({ ...searchRequest1, [e.target.name]: e.target.value });
    }
  };
  function reset1() {
    setICD10({
      icd10id: 0,
      icd10code: "",
      description: "",
      icd10status: true,
    });
    setICD10CodeError(false);
    setICD10DescriptionError(false);
    setCheck(false);
    setIsSubmitting(false);
  }
  function resetSearch1() {
    searchRequest1 = {
      icD10Code: "",
      description: "",
      icd10status: null,
    };
    setSearchRequest1({
      icD10Code: "",
      description: "",
      icd10status: null,
    });
    setSorting1(initialSorting1);
    loadData1(true);
  }
  const checkcollapse = () => {
    setAddOpen(false);
    setOpen(true);
  };
  const handleKeyPressForAssigned = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };
  const handleKeyPressForICD10 = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setCurPage1(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  ////////////-----------------Sorting 1-------------------///////////////////
  const initialSorting1 = {
    sortColumn: "icd10id",
    sortDirection: "desc",
  };
  const [sort1, setSorting1] = useState<any>(initialSorting1);
  const searchRef1 = useRef<any>(null);

  const handleSort1 = async (columnName: any) => {
    searchRef1.current.id = searchRef1.current.id
      ? searchRef1.current.id === "asc"
        ? (searchRef1.current.id = "desc")
        : (searchRef1.current.id = "asc")
      : (searchRef1.current.id = "asc");
    sort1.sortColumn = columnName;
    sort1.sortDirection = searchRef1.current.id;
    setSorting1((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef1?.current?.id,
        clickedIconData: columnName,
      };
    });
    loadData1();
  };

  ////////////-----------------Sorting 1-------------------///////////////////

  ////////////-----------------Sorting -------------------///////////////////
  const initialSorting = {
    sortColumn: "icd10assignmentId",
    sortDirection: "desc",
  };
  const [sort, setSorting] = useState<any>(initialSorting);
  const searchRef = useRef<any>(null);

  const handleSort = async (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    sort.sortColumn = columnName;
    sort.sortDirection = searchRef.current.id;
    setSorting((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef?.current?.id,
        clickedIconData: columnName,
      };
    });
    loadData();
  };
  const [value2, setValue2] = useState<any>(null);
  const ModalhandleClose2 = () => setShow2(false);
  const [show2, setShow2] = useState(false);

  const handleClickOpen2 = (id: any, status: any) => {
    setValue2({ id, status });
    setShow2(true);
  };

  ////////////-----------------Sorting -------------------///////////////////
  useEffect(() => {
    console.log(ICD10CodeAssigment, "ICD10CodeAssigment");

    onRequisitionSelect();
  }, [ICD10CodeAssigment.reqTypeId, ICD10CodeAssigment.refLabId]);

  console.log(errors.IcdCode, "errors.IcdCode===");

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
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
          {t("Are you sure you want to Inactive this record?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AssignedICD10InactiveModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AssignedICD10InactiveModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              changeStatus(value1.id, value1.status);
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
            <div className="card mb-5">
              <div className="card-body px-3 px-md-8">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4 z-index-4">
                      <label className="mb-2 fw-500">{t("ICD10 Code")}</label>
                      <input
                        id={`AssignedICD10CodesSearch`}
                        type="text"
                        name="icD10Code"
                        value={searchRequest.icD10Code}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD10 Code")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("ICD10 Description")}
                      </label>
                      <input
                        id={`AssignedICD10DescriptionSearch`}
                        type="text"
                        name="icD10CodeDescription"
                        value={searchRequest.icD10CodeDescription}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD10 Description")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("ICD10 Group")}</label>
                      <input
                        id={`AssignedICD10GroupSearch`}
                        type="text"
                        name="icd10group"
                        value={searchRequest.icd10group}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD10 Group")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Facility")}</label>
                      <input
                        id={`AssignedICD10FacilitySearch`}
                        type="text"
                        name="facility"
                        value={searchRequest.facility}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Facility")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("Reference Lab")}
                      </label>
                      <input
                        id={`AssignedICD10ReferenceLabSearch`}
                        type="text"
                        name="referenceLab"
                        value={searchRequest.referenceLab}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Reference Lab")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("Requisition Type")}
                      </label>
                      <input
                        id={`AssignedICD10RequisitionTypeSearch`}
                        type="text"
                        name="requisitionType"
                        value={searchRequest.requisitionType}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Requisition Type")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Panel Name")}</label>
                      <input
                        id={`AssignedICD10PanelNameSearch`}
                        type="text"
                        name="panelName"
                        value={searchRequest.panelName}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Panel Name")}
                        onKeyDown={handleKeyPressForAssigned}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="status" className="mb-2 fw-500">
                        {t("Inactive/Active")}
                      </label>
                      <select
                        id={`AssignedICD10StatusSearch`}
                        name="status"
                        onChange={(e) => onInputChangeSearch(e)}
                        // value={searchRequest?.status}
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
                  <div className="d-flex justify-content-end gap-2 gap-lg-3">
                    <button
                      id={`AssignedICD10Search`}
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData((prev) => !prev);
                      }}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      type="reset"
                      onClick={() => resetSearch()}
                      className="btn btn-secondary btn-sm btn-secondary--icon"
                      id={`AssignedICD10Reset`}
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
          <Collapse in={Addopen}>
            <div className="card mb-5">
              <div className="card-header d-flex justify-content-sm-between justify-content-center gap-1 align-items-center bg-light-warning minh-42px">
                {icd10assignmentId === 0 ? (
                  <h5 className="m-1"> {t("Add Assigned ICD10s Code")}</h5>
                ) : (
                  <h5 className="m-1">{t("Update Assigned ICD10s Code")} </h5>
                )}
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`AssignedICD10Cancel`}
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={(e) => {
                      reset();
                      setIsSubmitting(false);
                      setPanelList([]);
                      setErrors((pre: any) => ({
                        IcdCode: "",
                        requisition: "",
                        facility: "",
                        panel: "",
                        lab: "",
                        icD10CodeDescription: "",
                      }));
                    }}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>
                  <LoadButton
                    id={`AssignedICD10Save`}
                    className="btn btn-sm fw-bold btn-primary"
                    loading={isSubmitting}
                    btnText={t("Save")}
                    loadingText={t("Saving")}
                    onClick={(e: any) => addAssigment(e)}
                  />
                </div>
              </div>
              <div className="card-body py-3">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <AutoComplete
                        required
                        label="ICD10 Code"
                        setValues={setICD10CodeAssigment}
                        placeholder="Search ICD10 Code"
                        value={
                          ICD10CodeAssigment.icD10Code
                            ? ICD10CodeAssigment.icD10Code
                            : ""
                        }
                        className="z-index-3"
                        disabled={
                          ICD10CodeAssigment?.icd10assignmentId != 0
                            ? true
                            : false
                        }
                      />
                      {errors.IcdCode ? (
                        <span style={{ color: "red" }}>{errors.IcdCode}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <label className="required mb-2 fw-500">
                        {t("ICD10 Description")}
                      </label>
                      <input
                        id={`AssignedICD10Description`}
                        disabled={true}
                        name="icD10CodeDescriptionvar"
                        onChange={(e: any) => onInputChange(e)}
                        className="form-control bg-light-secondary"
                        placeholder={t("ICD10 Description")}
                        value={ICD10CodeAssigment?.icD10CodeDescription}
                      />
                      {errors.icD10CodeDescription ? (
                        <span style={{ color: "red" }}>
                          {errors.icD10CodeDescription}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("ICD10 Group")}</label>
                      <input
                        id={`AssignedICD10Group`}
                        name="icd10group"
                        onChange={(e: any) => onInputChange(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD10 Group")}
                        value={ICD10CodeAssigment?.icd10group}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500 required">
                        {t("Requisition Type")}
                      </label>
                      <Select
                        inputId={`AssignedICD10RequisitionType`}
                        menuPortalTarget={document.body}
                        styles={reactSelectStyle}
                        theme={(theme: any) => styles(theme)}
                        className="z-index-3"
                        options={RequsitionList}
                        name="reqTypeId"
                        placeholder={t("Select Requisition")}
                        value={RequsitionList.filter(function (option: any) {
                          return option.value === ICD10CodeAssigment.reqTypeId;
                        })}
                        onChange={(e: any) => {
                          setICD10CodeAssigment((preVal: any) => {
                            return {
                              ...preVal,
                              reqTypeId: e?.value,
                            };
                          });
                        }}
                        isSearchable={true}
                      />
                      {errors.requisition ? (
                        <span style={{ color: "red" }}>
                          {errors.requisition}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <label className="mb-2 fw-500 required">
                      {t("Reference Lab")}
                    </label>
                    <Select
                      inputId={`AssignedICD10ReferenceLab`}
                      menuPortalTarget={document.body}
                      className="z-index-3"
                      styles={reactSelectStyle}
                      theme={(theme: any) => styles(theme)}
                      options={ReferenceLabList}
                      name="refLabId"
                      placeholder={t("Select Reference Lab")}
                      value={ReferenceLabList.filter(function (option: any) {
                        return option.value === ICD10CodeAssigment.refLabId;
                      })}
                      onChange={(e: any) => onReferenceSelect(e)}
                      isSearchable={true}
                      //isClearable={true}
                    />
                    {errors.lab ? (
                      <span style={{ color: "red" }}>{errors.lab}</span>
                    ) : null}
                  </div>

                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("Facility")}</label>
                      <Select
                        inputId={`AssignedICD10Facility`}
                        menuPortalTarget={document.body}
                        className="z-index-3"
                        styles={reactSelectStyle}
                        theme={(theme: any) => styles(theme)}
                        options={FacilityList}
                        name="facilityId"
                        placeholder={t("Select Facility")}
                        value={FacilityList.filter(function (option: any) {
                          return option.value === ICD10CodeAssigment.facilityId;
                        })}
                        onChange={(e: any) => onFacilitySelect(e)}
                        isSearchable={true}
                        // isClearable={true}
                      />
                      {/* {errors.facility ? (
                        <span style={{ color: "red" }}>{errors.facility}</span>
                      ) : null} */}
                    </div>
                  </div>
                  {isPanelRequired() && (
                    <div className="col-lg-3 col-md-3 col-sm-6">
                      <div className="fv-row mb-4">
                        <label
                          className={`mb-2 fw-500 ${isPanelRequired() ? "required" : ""}`}
                        >
                          {t("Panel")}
                        </label>
                        <Select
                          inputId={`AssignedICD10Panel`}
                          menuPortalTarget={document.body}
                          className="z-index-3"
                          styles={reactSelectStyle}
                          theme={(theme: any) => styles(theme)}
                          options={PanelList}
                          name="panelId"
                          placeholder={t("Select Panel")}
                          value={PanelList.filter(function (option: any) {
                            return option.value === ICD10CodeAssigment.panelId;
                          })}
                          onChange={(e: any) => onPanelSelect(e)}
                          isSearchable={true}
                        />
                        {errors.panel ? (
                          <span style={{ color: "red" }}>{errors.panel}</span>
                        ) : null}
                      </div>
                    </div>
                  )}
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <label className="required mb-2 fw-500">
                      {t("Inactive/Active")}
                    </label>
                    <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                      <input
                        id={`AssignedICD10SwaitchButton`}
                        className="form-check-input"
                        onChange={(e) => onInputChange(e)}
                        name="status"
                        type="checkbox"
                        checked={ICD10CodeAssigment.status ? true : false}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>

          <Modal
            show={show2}
            onHide={ModalhandleClose2}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-light-primary m-0 p-5">
              <h4>{t("Inactive Record")}</h4>
            </Modal.Header>
            <Modal.Body>
              {t("Are you sure you want to Inactive this record?")}
            </Modal.Body>
            <Modal.Footer className="p-0">
              <button
                id={`AllICD10InactiveModalCancel`}
                type="button"
                className="btn btn-secondary"
                onClick={ModalhandleClose2}
              >
                {t("Cancel")}
              </button>
              <button
                id={`AllICD10InactiveModalConfirm`}
                type="button"
                className="btn btn-danger m-2"
                onClick={() => {
                  changeStatus1(value2.id, value2.status);
                  ModalhandleClose2();
                }}
              >
                {t("Inactive")}
              </button>
            </Modal.Footer>
          </Modal>
          {/* 2nd tab collapse */}
          <Collapse in={open1}>
            <div className="card mb-5">
              <div className=" card-body">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">{t("ICD10 Code")}</label>
                      <input
                        id={`AllICD10CodeSearch`}
                        type="text"
                        name="icD10Code"
                        value={searchRequest1.icD10Code}
                        onChange={(e) => onInputChangeSearch1(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD10 Code")}
                        onKeyDown={handleKeyPressForICD10}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500">
                        {t("ICD10 Description")}
                      </label>
                      <input
                        id={`AllICD10DescriptionSearch`}
                        type="text"
                        name="description"
                        value={searchRequest1.description}
                        onChange={(e) => onInputChangeSearch1(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD 10 Description")}
                        onKeyDown={handleKeyPressForICD10}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="status" className="mb-2 fw-500">
                        {t("Inactive/Active")}
                      </label>
                      <select
                        id={`AllICD10StatusSearch`}
                        name="icd10status"
                        onChange={(e) => onInputChangeSearch1(e)}
                        className="form-select bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder="Status"
                        value={
                          searchRequest1.icd10status
                            ? "true"
                            : searchRequest1.icd10status === false
                              ? "false"
                              : ""
                        }
                      >
                        <option value="">{t("---Select ---")}</option>
                        <option value="true">{t("Active")}</option>
                        <option value="false">{t("Inactive")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 gap-lg-3">
                    <button
                      id={`AllICD10Search`}
                      onClick={() => {
                        setCurPage1(1);
                        setTriggerSearchData((prev) => !prev);
                      }}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      type="reset"
                      onClick={() => resetSearch1()}
                      className="btn btn-secondary btn-sm btn-secondary--icon"
                      id={`AllICD10Reset`}
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
          <Collapse in={check}>
            <div className="card mb-5">
              <div className="card-header d-flex justify-content-sm-between justify-content-center align-items-center bg-light-warning minh-42px">
                {ICD10.icd10id === 0 ? (
                  <h5 className="m-1">{t("Add ICD10s Code")} </h5>
                ) : (
                  <h5 className="m-1"> {t("Update ICD10s Code")}</h5>
                )}
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`AllICD10Cancel`}
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={(e) => reset1()}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>
                  <LoadButton
                    id={`AllICD10Save`}
                    className="btn btn-sm fw-bold btn-primary"
                    loading={isSubmitting}
                    btnText={t("Save")}
                    loadingText={t("Saving")}
                    onClick={(e: any) => addICD10(e)}
                  />
                </div>
              </div>
              <div className="card-body py-3">
                <div className="row">
                  <div className="col-lg-3 col-xxl-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <label className="required mb-2 fw-500">
                        {t("ICD10 Code")}
                      </label>
                      <input
                        id={`AllICD10Code`}
                        type="text"
                        name="icd10code"
                        onChange={(e) => onInputChange1(e)}
                        className={
                          ICD10.icd10id != 0
                            ? "form-control bg-secondary"
                            : "form-control bg-transparent"
                        }
                        placeholder={t("ICD10 Code")}
                        value={icd10code}
                        disabled={ICD10.icd10id === 0 ? false : true}
                      />
                      {ICD10CodeError ? (
                        <span style={{ color: "red" }}>
                          {t("ICD10 Code is Required!")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-3 col-xxl-3 col-sm-6">
                    <div className="fv-row mb-4">
                      <label className="required mb-2 fw-500">
                        {t("ICD10 Description")}
                      </label>
                      <input
                        id={`AllICD10Description`}
                        type="text"
                        name="description"
                        onChange={(e) => onInputChange1(e)}
                        className="form-control bg-transparent"
                        placeholder={t("ICD10 Description")}
                        value={description}
                      />
                      {ICD10DescriptionError ? (
                        <span style={{ color: "red" }}>
                          {t("ICD10 Description is Required!")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-lg-3 col-xxl-3 col-sm-6">
                    <label className="required mb-2 fw-500">
                      {t("Inactive/Active")}
                    </label>
                    <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                      <input
                        id={`AllICD10SwitchButton`}
                        className="form-check-input"
                        onChange={(e) => onInputChange1(e)}
                        name="icd10status"
                        type="checkbox"
                        checked={icd10status}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
          <div className="mb-5 hover-scroll-x">
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
                label={t("Assigned ICD10s")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`AssignedICD10`}
              />
              <TabSelected
                label={t("All ICD10s")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`AllICD10`}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="tab-pane" id="activetab" role="tabpanel">
                <AssignedICD10
                  setPageSize={setPageSize}
                  checkcollapse={checkcollapse}
                  open={open}
                  Addopen={Addopen}
                  setOpen={setOpen}
                  AddNew={AddNew}
                  loading={loading}
                  ICD10AssigmentList={ICD10AssigmentList}
                  pageSize={pageSize}
                  curPage={curPage}
                  nextPage={nextPage}
                  totalPages={totalPages}
                  showPage={showPage}
                  total={total}
                  pageNumbers={pageNumbers}
                  prevPage={prevPage}
                  changeStatus={changeStatus}
                  EditAssigment={EditAssigment}
                  searchRef={searchRef}
                  handleSort={handleSort}
                  sort={sort}
                  handleClickOpen1={handleClickOpen1}
                />
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="tab-pane" id="activetab" role="tabpanel">
                <AllICD10s
                  setPageSize1={setPageSize1}
                  open1={open1}
                  check={check}
                  setOpen1={setOpen1}
                  setCheck={setCheck}
                  AddNew1={AddNew1}
                  loading2={loading2}
                  UserList={UserList}
                  pageSize1={pageSize1}
                  EditICD10Code={EditICD10Code}
                  changeStatus1={changeStatus1}
                  curPage1={curPage1}
                  total1={total1}
                  showPage1={showPage1}
                  prevPage1={prevPage1}
                  pageNumbers1={pageNumbers1}
                  totalPages1={totalPages1}
                  nextPage1={nextPage1}
                  searchRef1={searchRef1}
                  handleSort1={handleSort1}
                  sort1={sort1}
                  handleClickOpen2={handleClickOpen2}
                />
              </div>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICD10Assigment;
