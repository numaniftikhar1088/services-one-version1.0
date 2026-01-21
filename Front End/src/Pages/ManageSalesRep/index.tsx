import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { RouteSlice } from "../../Utils/Compendium/RouteSlicer";
import { NavigatorsArray } from "../../Utils/Compendium/NavigatorsDetail";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import SpecimenTypeAssigmentService from "../../Services/Compendium/SpecimenTypeAssigmentService";
import ManageSalesRepGrid from "./ManageSalesRep";
import ManageSalesRepServices from "../../Services/ManageSalesRep/ManageSalesRepServices";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
import { IAdminType } from "../Admin/UserManagement/UserList";
import { PortalTypeEnum } from "../../Utils/Common/Enums/Enums";
import { StringRecord } from "../../Shared/Type";
import useLang from "Shared/hooks/useLanguage";

interface PanelSetup {
  value: number | string;
  label: string;
}
const ManageSales = () => {
  const { t } = useLang();

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const [request, setRequest] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [status, setStatus] = useState<any>(false);
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
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!isFirstRender.current) {
      loadData(true);
    } else {
      isFirstRender.current = false;
    }
  }, [curPage]);
  const [val, setVal] = useState<any>(0);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [selectedPanels, setSelectedPanels] = useState<any>([]);
  const initialSearchQuery = {
    id: "",
    firstName: "",
    lastName: "",
    salesRepEmail: "",
    salesRepPhone: "",
    salesGroupName: "",
    status: null,
    isArchived: false,
  };
  const initialSorting = {
    sortColumn: "",
    sortDirection: "",
  };
  const [salesrepList, setSalesRepList] = useState<any>({
    id: "",
    positionTitle: "",
    firstName: "",
    lastName: "",
    salesRepPhone: "",
    salesEmail: "",
    salesRepNumber: "",
    salesGroupName: "",
    adminType: 0,
  });
  const [archivesalesrepList, setArchiveSalesRepList] = useState<any>({
    id: "",
    positionTitle: "",
    firstName: "",
    lastName: "",
    salesRepPhone: "",
    salesEmail: "",
    salesRepNumber: "",
    adminType: 0,
  });
  const [values, setValues] = useState<any>({
    id: "",
    positionTitle: "",
    firstName: "",
    lastName: "",
    salesRepPhone: "",
    salesEmail: "",
    salesRepNumber: "",
    adminType: "",
    salesGroupId: "",
  });
  const [valFacility, setValFacility] = useState<any>({
    id: "",
    positionTitle: "",
    firstName: "",
    lastName: "",
    salesRepPhone: "",
    salesEmail: "",
    salesRepNumber: "",
    adminType: 0,
  });
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [searchRequest, setSearchRequest] = useState<any>(initialSearchQuery);

  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    loadData(false);
  }, [pageSize, curPage, triggerSearchData]);
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);

  // Search Tags code start

  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSeachQuery();
  }, [searchedTags.length]);

  const queryDisplayTagNames: StringRecord = {
    firstName: "First Name",
    lastName: "Last Name",
    salesRepEmail: "Email",
    salesRepPhone: "Phone",
    salesGroupName: "Sales Group",
  };

  //Searched tags End

  const loadData = (reset: boolean) => {
    setLoading(true);

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    ManageSalesRepServices.ManageSalesRepData({
      pageIndex: curPage,
      pageSize: pageSize,
      requestModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? initialSorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setSalesRepList(res?.data?.result);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  const resetSeachQuery = () => {
    setSorting(initialSorting);
    setSearchRequest(initialSearchQuery);
    loadData(true);
  };
  const [facilities, setFacilities] = useState([]);

  const loadFacilities = () => {
    setLoading1(true);
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setFacilities(res?.data);
        setSports2(res?.data?.data.facilities);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => setLoading1(false));
  };

  ////////////-----------------Sorting-------------------///////////////////

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
    loadData(false);
  };
  const [checkboxes, setCheckboxes] = useState([]);
  ////////////-----------------Get Data Against Roles-------------------///////////////////
  const GetDataAgainstRoles = async (RoleId: number) => {
    await UserManagementService?.getByIdAllUserRolesAndPermissions(RoleId)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          setCheckboxes(res?.data?.data.modules);
        } else if (res?.data?.status === 400) {
          toast.error(res?.data?.message);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  const [roletype, setRoleType] = useState<any>([]);
  const RoleTypeLookup = () => {
    UserManagementService.GetAllUserRoleList(PortalTypeEnum.Sales)
      .then((res: any) => {
        let AdminTypeArray: any = [];
        res?.data?.data?.forEach((val: IAdminType) => {
          let adminTypeDetails = {
            value: val?.value,
            label: val?.label,
          };
          AdminTypeArray.push(adminTypeDetails);
        });
        setRoleType(AdminTypeArray);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  useEffect(() => {
    loadFacilities();
    RoleTypeLookup();
  }, []);

  ////////////-----------------Sorting-------------------///////////////////
  const [check, setCheck] = useState(false);
  const [PanelSetupList, setPanelSetupList] = useState<PanelSetup[]>([]);
  const [sports2, setSports2] = useState<any>([]);
  const [panels, setPanels] = useState<any>([]);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    if (type === "checkbox") {
      setValues((preVal: any) => {
        return {
          ...preVal,
          isActive: e.target.checked,
        };
      });
    } else {
      setValues((preVal: any) => {
        return {
          ...preVal,
          [name]: value,
        };
      });
    }
  };
  const statusChange = async (id: 0, isactive: boolean) => {
    const objToSend = {
      id: id,
      isactive: isactive ? false : true,
    };
    await SpecimenTypeAssigmentService.changeSpecimenTypeAssigmentStatus(
      objToSend
    )
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);

          loadData(true);
        }
      })
      .catch((err: string) => {});
  };
  const DeleteSpecimenTypeAssignmentById = async (id: number) => {
    setCheck(true);
    await SpecimenTypeAssigmentService.DeleteSpecimenTypeAssignmentById(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          loadData(true);
          setCheck(false);
        }
      })
      .catch((err: string) => {
        setCheck(false);
      });
  };

  //===================================  SECTION ERRORS====================
  const [errors, setErrors] = useState({
    panelError: "",
    requisitionError: "",
    specimenError: "",
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      if (sports2.length) {
        setRequest(true);
        let obj = {
          id: values.id,
          positionTitle: values.positionTitle,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          salesEmail: values.salesEmail,
          salesRepNumber: values.salesRepNumber,
          adminType: parseInt(values.adminType),
          salesGroupId: values.salesGroupId ? parseInt(values.salesGroupId) : 0,
          modules: checkboxes,
          facilities: valFacility.facilitiesIds,
        };
        try {
          const res: AxiosResponse =
            await ManageSalesRepServices.SaveManageSalesRepData(obj);
          if (res?.data?.responseStatus === "Success") {
            toast.success(res?.data?.responseMessage);
            setOpenModal(false);
            setSports2([]);
            setCheckboxes([]);
            setRequest(false);
            resetForm();
            loadData(true);
            setValues({
              id: "",
              positionTitle: "",
              firstName: "",
              lastName: "",
              salesRepPhone: "",
              salesEmail: "",
              salesRepNumber: "",
              adminType: 0,
              salesGroupId: "",
            });
            setEditGridHeader(false);
          } else {
            setRequest(false);
            toast.error(res?.data?.responseMessage || "An error occurred");
          }
        } catch (err) {
          setRequest(false);
          toast.error(t("An error occurred while saving data"));
        }
      } else {
        setRequest(false);
        toast.error(t("Select At least One Facility"));
      }
    } catch (err) {
      setRequest(false);
      toast.error(t("An unexpected error occurred"));
    } finally {
      setSubmitting(false); // Ensure setSubmitting is called to end the form submission
    }
  };

  const Edit = async (item: any) => {
    setOpenModal(true);
    try {
      const res = await ManageSalesRepServices.GetSalesInfo(item.id);

      if (res.data.statusCode === 200) {
        setValues((preVal: any) => {
          return {
            ...preVal,
            id: res.data.data.id,
            positionTitle: res.data.data.positionTitle,
            firstName: res.data.data.firstName,
            lastName: res.data.data.lastName,
            phone: res.data.data.phone,
            salesEmail: res.data.data.salesEmail,
            salesRepNumber: res.data.data.salesRepNumber,
            adminType: parseInt(res.data.data.adminType),
            salesGroupId: res.data.data.salesGroupId || "",
          };
        });
        setCheckboxes(res.data.data.modules);
        setSports2(res.data.data.facilities);
      } else {
        toast.error(res.data.responseMessage);
      }
    } catch {
      console.error("error");
    }
    setEditGridHeader(true);
  };

  const handleOpen = () => {
    setValues((preVal: any) => {
      return {
        id: null,
        positionTitle: "",
        firstName: "",
        lastName: "",
        salesRepPhone: "",
        salesEmail: "",
        salesRepNumber: "",
        adminType: 0,
        salesGroupId: "",
      };
    });

    setEditGridHeader(false);
    setOpenModal(true);
  };

  return (
    <>
      <ManageSalesRepGrid
        rows={
          salesrepList?.length > 0
            ? salesrepList?.map((val: any, index: any) => ({
                ...val,
                id: val.id,
                positionTitle: val.positionTitle,
                firstName: val.firstName,
                lastName: val.lastName,
                salesRepPhone: val.salesRepPhone,
                salesRepEmail: val.salesRepEmail,
                salesRepNumber: val.salesRepNumber,
                adminType: val.adminType,
              }))
            : []
        }
        NavigatorsArray={updatedNavigatorsArray}
        setOpenModal={setOpenModal}
        setEditGridHeader={setEditGridHeader}
        values={values}
        setValues={setValues}
        statusChange={statusChange}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        DeleteSpecimenTypeAssignmentById={DeleteSpecimenTypeAssignmentById}
        loading={loading}
        curPage={curPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        nextPage={nextPage}
        showPage={showPage}
        prevPage={prevPage}
        Edit={Edit}
        editGridHeader={editGridHeader}
        handleOpen={handleOpen}
        handleOnChange={handleOnChange}
        errors={errors}
        setErrors={setErrors}
        PanelSetupList={PanelSetupList}
        setPanelSetupList={setPanelSetupList}
        openModal={openModal}
        modalheader={
          editGridHeader
            ? `${t("Edit Sales Rep")}`
            : `${t("Add New Sales Rep")}`
        }
        handleSubmit={handleSubmit}
        setRequest={setRequest}
        request={request}
        panels={panels}
        setPanels={setPanels}
        sports2={sports2}
        setSports2={setSports2}
        loadData={loadData}
        selectedPanels={selectedPanels}
        setSelectedPanels={setSelectedPanels}
        check={check}
        sort={sort}
        handleSort={handleSort}
        searchRef={searchRef}
        facilities={facilities}
        GetDataAgainstRoles={GetDataAgainstRoles}
        checkboxes={checkboxes}
        setCheckboxes={setCheckboxes}
        roletype={roletype}
        val={val}
        setVal={setVal}
        setStatus={setStatus}
        status={status}
        archivesalesrepList={archivesalesrepList}
        setArchiveSalesRepList={setArchiveSalesRepList}
        resetSeachQuery={resetSeachQuery}
        valFacility={valFacility}
        setValFacility={setValFacility}
        queryDisplayTagNames={queryDisplayTagNames}
        searchedTags={searchedTags}
        handleTagRemoval={handleTagRemoval}
        setCurPage={setCurPage}
        setTriggerSearchData={setTriggerSearchData}
      />
    </>
  );
};
export default ManageSales;
