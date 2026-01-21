import { styled, Tab, Tabs, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import {
  InsuranceStatusChange,
} from "Services/AllInsuranceProvider/InsuranceProvider";
import useLang from "Shared/hooks/useLanguage";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { sortById, sortByIPId, SortingTypeI } from "Utils/consts";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import InsuranceService from "../../Services/InsuranceService/InsuranceService";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import AssigmentService from "Services/AssigmentService/AssigmentService";
import SpecimenTypeAssigmentService from "Services/Compendium/SpecimenTypeAssigmentService";
import AddNewComorbidity from "./AssignComorbidity/AddNewComorbidity";
import SearchAssignComor from "./AssignComorbidity/SearchAssignComor";
import AddNewAllComorbidities from "./AllComorbidity/AddNew";
import SearchAllComorbidities from "./AllComorbidity/Search";
import AssignedComorIndex from "./AssignComorbidity";
import AllComorbidities from "./AllComorbidity";

interface Provider {
  value: string | number;
  label: string;
  // providerCode: string | number;
}

interface Lookups {
  value: number;
  label: string;
}
interface reqLookups {
  requisitionTypeId: number;
  requisitionType: string;
}
interface refLookups {
  labId: number;
  labDisplayName: string;
}
interface facLookups {
  facilityId: number;
  facility: string;
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
const ComorbidityAssignment = () => {
  const { t } = useLang();
  const [value, setValue] = useState<any>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setAddAssignComor(false);
    setSearchAssignComor(false);
    setAddTab2(false);
    setTab2Search(false);
  };
  ////////////-----------------Sorting-------------------///////////////////

  const [addAssignComor, setAddAssignComor] = useState(false);
  const [searchAssignComor, setSearchAssignComor] = useState(false);
  const [assignloadingComor, setAssignLoadingComor] = useState(true);
  const [editDisableComor, setEditDisableComor] = useState(false);
  const [PanelList, setPanelList] = useState<
    { value: number; label: string }[]
  >([]);
  const AssignComorinitialPostData = {
    id: 0,
    comorId: 0,
    code: "",
    description: "",
    group: "",
    requisition: "",
    referenceLab: "",
    facility: "",
    panel: null,
    comorStatus: true,
  };
  const [AssignComorpostData, setAssignComorpostData] = useState<any>(
    AssignComorinitialPostData
  );
  const AssignComorSearchCriteria = {
    code: "",
    description: "",
    group: "",
    requisition: "",
    referenceLab: "",
    facility: "",
    panel: "",
  };
  const [searchCriteriaAssignComor, setsearchCriteriaAssignComor] = useState(
    AssignComorSearchCriteria
  );
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [reset, setReset] = useState(false);
  const [requisitionLookup, setRequisitionlookup] = useState<Lookups[]>([]);
  const [referenceLabLookup, setReferenceLabLookup] = useState<Lookups[]>([]);
  const [facilityLookup, setFacilityLookup] = useState<Lookups[]>([]);

  ////////////-----------------Facility Lookup-------------------///////////////////

  const GetFacilityLookup = async () => {
    const facRes = await AssigmentService.ComorFacilityLookup();
    const formattedData: Lookups[] = facRes.data.data.map(
      (item: facLookups) => ({
        label: item.facility,
        value: item.facilityId,
      })
    );
    setFacilityLookup(formattedData);
  };

  const handleFacilityLookup = (e: any) => {
    setAssignComorpostData((oldData: any) => ({
      ...oldData,
      facility: e.value,
    }));
  };

  ////////////-----------------Requisition Lookup-------------------///////////////////

  const GetRequisitionLookup = async () => {
    const reqRes = await AssigmentService.ComorRequsitionTypeLookup();
    const formattedData: Lookups[] = reqRes.data.data.map(
      (item: reqLookups) => ({
        label: item.requisitionType,
        value: item.requisitionTypeId,
      })
    );
    setRequisitionlookup(formattedData);
  };

  const handleRequisitionLookup = (e: any) => {
    setAssignComorpostData((oldData: any) => ({
      ...oldData,
      requisition: e.value,
    }));
  };

  ////////////-----------------Requisition Lookup End-------------------///////////////////

  ////////////-----------------Reference Lab Lookup-------------------///////////////////

  const GetReferenceLabLookup = async () => {
    const refRes = await AssigmentService.ComorReferenceLabLookup();
    const formattedData: Lookups[] = refRes.data.data.map(
      (item: refLookups) => ({
        label: item.labDisplayName,
        value: item.labId,
      })
    );
    setReferenceLabLookup(formattedData);
  };

  ////////////-----------------Reference Lab Lookup End-------------------///////////////////

  useEffect(() => {
    GetRequisitionLookup();
    GetReferenceLabLookup();
    GetFacilityLookup();
  }, []);

  const handleReferenceLookup = (e: any) => {
    setAssignComorpostData((oldData: any) => ({
      ...oldData,
      referenceLab: e.value,
    }));
  };

  ////////////-----------------Fetch Panels Start-------------------///////////////////

  const fetchPanels = async (reqTypeId: number, refLabId: number) => {
    if (reqTypeId === 0 || refLabId === 0) return;
    try {
      const res =
        await SpecimenTypeAssigmentService.getPanelsByReqTypeIdAndLabId(
          reqTypeId,
          refLabId
        );
      const formattedPanelList = res.data.data.map((panel: any) => ({
        value: panel.panelId,
        label: panel.panelDisplayName,
      }));

      setPanelList(formattedPanelList);
    } catch (error) {
      console.error("Error fetching panels:", error);
    }
  };

  useEffect(() => {
    if (AssignComorpostData.requisition && AssignComorpostData.referenceLab) {
      fetchPanels(
        AssignComorpostData.requisition,
        AssignComorpostData.referenceLab
      );
    }
  }, [AssignComorpostData.requisition, AssignComorpostData.referenceLab]);

  ////////////-----------------Fetch Panels End-------------------///////////////////

  ////////////-----------------  Post API Start-------------------///////////////////
  const ApidataPostComor = async () => {
    const data = {
      id: AssignComorpostData.id,
      masterComorbidityId: AssignComorpostData.comorId,
      comorbidityCode: AssignComorpostData.code,
      comorbidityDescription: AssignComorpostData.description,
      comorbidityGroup: AssignComorpostData.group,
      facilityId: AssignComorpostData.facility,
      refLabId: AssignComorpostData.referenceLab,
      reqTypeId: AssignComorpostData.requisition,
      panelId: AssignComorpostData.panel,
      status: AssignComorpostData.comorStatus,
    };
    let resp = await AssigmentService.SaveComorbidity(data);
    if (resp.data.httpStatusCode === 200) {
      toast.success(t(resp.data.message));
      setAssignComorpostData(AssignComorinitialPostData);
      setAddAssignComor(false);
      setPanelList([]);
      ComorGetAllData();
    } else {
      toast.error(t(resp?.data?.message));
    }
  };
  const isInfectiousDisease = 
  AssignComorpostData.requisition !== 2 &&
  AssignComorpostData.requisition !== 3;

  const handlesaveComor = async () => {
    if (AssignComorpostData.code.trim().length === 0) {
      toast.error(t(`Please Enter Comorbidities Code.`));
      return;
    }
    if (AssignComorpostData.requisition.length === 0) {
      toast.error(t(`Please Enter Requisition.`));
      return;
    }

    if (AssignComorpostData.referenceLab.length === 0) {
      toast.error(t(`Please Enter Reference Lab.`));
      return;
    }
    if (AssignComorpostData.facility.length === 0) {
      toast.error(t(`Please Enter Facility.`));
      return;
    }
   if (
  AssignComorpostData.requisition !== 2 &&
  AssignComorpostData.requisition !== 3 &&
  !AssignComorpostData.panel
) {
  toast.error(t(`Please Select Panel.`));
  return;
}

    try {
      await ApidataPostComor();
    } catch (error) {
      console.error(t("Error in saving data:"), error);
    }
  };

  const handleCancelComor = () => {
    setAddAssignComor(false);
    setPanelList([]);
    setAssignComorpostData(AssignComorinitialPostData);
    setEditDisableComor(false);
  };

  ////////////-----------------  Post API End-------------------///////////////////

  /*##############################-----PAGINATION Start-----#################*/

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
    const pgNumbers1 = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers1.push(i);
      }
    }
    setPageNumbers(pgNumbers1);
  }, [total, curPage, pageSize, totalPages]);

  /*##############################-----PAGINATION End-----#################*/
  ////////////-----------------  Get API Start-------------------///////////////////

  const [apiGetDataComor, setApiGetDataComor] = useState([]);
  const ComorGetAllData = async () => {
    setAssignLoadingComor(true);
    let obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: {
        comorbidityCode: searchCriteriaAssignComor.code || "",
        requisitionType: searchCriteriaAssignComor.requisition || "",
        facility: searchCriteriaAssignComor.facility || "",
        comorbidityCodeDescription: searchCriteriaAssignComor.description || "",
        referenceLab: searchCriteriaAssignComor.referenceLab || "",
        status: null,
        panelName: searchCriteriaAssignComor.panel || "",
        comorbidityGroup: searchCriteriaAssignComor.group || "",
      },
      sortColumn: sort.clickedIconData || "Id",
      sortDirection: sort.sortingOrder || "Desc",
    };

    try {
      let res = await AssigmentService.getComorAssigmnetList(obj);
      if (res && res.data) {
        setApiGetDataComor(res?.data?.data);
        setTotal(res.data.total);
      } else {
        console.error(t("No data received"), res);
      }
    } catch (error) {
      console.error(t("API call failed"), error);
    } finally {
      setAssignLoadingComor(false);
    }
  };

  const handleEditComor = (row: any) => {
    setAssignComorpostData({
      id: row.id,
      comorId: row.masterComorbidityId ?? 0,
      code: row.comorbidityCode ?? "",
      description: row.comorbidityCodeDescription ?? "",
      group: row.comorbidityGroup ?? "",
      requisition: row.reqTypeId ?? "",
      referenceLab: row.refLabId ?? "",
      facility: row.facilityId ?? "",
      panel: row.panelId ?? "",
      comorStatus: row.comorbidityStatus ?? true,
    });
    setEditDisableComor(true);
    setAddAssignComor(true);
  };

  /*#########################----Search Function Start------########################## */

  const handleInputChangeComor = (e: any) => {
    setsearchCriteriaAssignComor({
      ...searchCriteriaAssignComor,
      [e.target.name]: e.target.value,
    });
  };
  const handleSearchComor = () => {
    setCurPage(1);
    setTriggerSearchData((prev) => !prev);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchComor();
    }
  };
  /*#########################----Search Function End------########################## */
  /*#########################----SORT STARTS------########################## */

  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [firstRenderComor, setFirstRenderComor] = useState(true);
  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    const newSortOrder = searchRef.current.id === "asc" ? "desc" : "asc";
    searchRef.current.id = newSortOrder;

    setSorting((prevSort: any) => ({
      ...prevSort,
      sortingOrder: newSortOrder,
      clickedIconData: columnName,
    }));
  };

  useEffect(() => {
    if (firstRenderComor) {
      setFirstRenderComor(false);
      return;
    } else {
      ComorGetAllData();
    }
  }, [sort]);

  /*#########################----SORT ENDS------########################## */
  /*##############################-----status Change-----##############################*/

  const handleStatusChangeComor = async (id: number) => {
    try {
      await InsuranceStatusChange(id);
      ComorGetAllData();
    } catch (error) {
      console.error(t("Error Changing record:"), error);
    }
  };

  /*##############################-----status Change-----##############################*/

  const handleResetComor = () => {
    setsearchCriteriaAssignComor(AssignComorSearchCriteria);
    setReset(!reset);
    setAssignComorpostData(AssignComorinitialPostData);
    setCurPage(1);
    setPageSize(50);
    setSorting(sortById);
  };

  //==========================================================================================
  //=================================  Tab 2 functions start =================================
  //==========================================================================================

  const [addTab2, setAddTab2] = useState(false);
  const [tab2Search, setTab2Search] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [editDisable, setEditDisable] = useState(false);

  const initialPostData = {
    AllComorbidityCode: "",
    AllComorbidityDescription: "",
    AllComorbidityStatus: true,
    AllComorbidityId: 0,
  };
  const [postData, setpostData] = useState<any>(initialPostData);
  const initialSearchCriteria = {
    AllComorbidityCode: "",
    AllComorbidityDescription: "",
    AllComorbidityStatus: true,
    AllComorbidityId: 0,
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

  const ApidataPost = async () => {
    const data = {
      id: postData.AllComorbidityId,
      comorbiditycode: postData.AllComorbidityCode,
      description: postData.AllComorbidityDescription,
      comorbidityStatus: postData.AllComorbidityStatus,
    };

    let resp = await AssigmentService.SaveAllComorbidity(data);
    console.log("API Response:", resp);

    if (resp.data.httpStatusCode === 200) {
      toast.success(t(resp.data.message));
      setEditDisable(false);
      setpostData(initialPostData);
      setAddTab2(false);
      setStatelookup([]);
      showData();
    } else {
      toast.error(t(resp?.data?.message));
    }
  };

  const handlesave = async () => {
    if (postData.AllComorbidityCode.trim().length === 0) {
      toast.error(t(`Please Enter Comorbidities Code.`));
      return;
    }

    if (postData.AllComorbidityDescription.trim().length === 0) {
      toast.error(t(`Please Enter Comorbidities Description.`));
      return;
    }

    try {
      await ApidataPost();
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
    setLoading2(true);
    let obj = {
      pageNumber: curPage1,
      pageSize: pageSize1,
      queryModel: {
        comorbidityCode: searchCriteria.AllComorbidityCode || "",
        description: searchCriteria.AllComorbidityDescription || "",
        comorbidityStatus: null,
      },
      sortColumn: sort1.clickedIconData || "Id",
      sortDirection: sort1.sortingOrder || "Desc",
    };

    try {
      let res = await AssigmentService.getAllComorAssigmnetList(obj);
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

  const handleEdit = (row: any) => {
    setpostData({
      AllComorbidityCode: row.comorbidityCode || "",
      AllComorbidityDescription: row.description || "",
      AllComorbidityStatus: row.comorbidityStatus ?? true,
      AllComorbidityId: row.id || 0,
    });

    setAddTab2(true);
    setEditDisable(true);
  };

  /*#########################----Search Function Start------########################## */

  const handleInputChange = (e: any, selectName?: string) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
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

  const [sort1, setSorting1] = useState<SortingTypeI>(sortById);
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

  const handleReset = () => {
    setSearchCriteria(initialSearchCriteria);
    setReset1(!reset1);
    setpostData(initialPostData);
    setCurPage1(1);
    setPageSize1(50);
    setSorting1(sortById);
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <>
            <AddNewComorbidity
              AssignComorpostData={AssignComorpostData}
              PanelList={PanelList}
              handlesaveComor={handlesaveComor}
              setAssignComorpostData={setAssignComorpostData}
              editDisableComor={editDisableComor}
              handleCancelComor={handleCancelComor}
              facilityLookup={facilityLookup}
              addAssignComor={addAssignComor}
              isInfectiousDisease={isInfectiousDisease}
              requisitionLookup={requisitionLookup}
              referenceLabLookup={referenceLabLookup}
              handleFacilityLookup={handleFacilityLookup}
              handleReferenceLookup={handleReferenceLookup}
              handleRequisitionLookup={handleRequisitionLookup}
            />
            <SearchAssignComor
              AssignComorpostData={AssignComorpostData}
              setAssignComorpostData={setAssignComorpostData}
              handleResetComor={handleResetComor}
              handleSearchComor={handleSearchComor}
              searchCriteriaAssignComor={searchCriteriaAssignComor}
              handleKeyPress={handleKeyPress}
              searchAssignComor={searchAssignComor}
              handleInputChangeComor={handleInputChangeComor}
              setSearchAssignComor={setSearchAssignComor}
            />

            <AddNewAllComorbidities
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
            <SearchAllComorbidities
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
                      label={t("Assignment Comorbidities")}
                      {...a11yProps(0)}
                      className="fw-bold text-capitalize"
                      id={`AssignmentComorbidities`}
                    />
                    <TabSelected
                      label={t("All Comorbidities")}
                      {...a11yProps(1)}
                      className="fw-bold text-capitalize"
                      id={`All Comorbidities`}
                    />
                  </Tabs>
                  <div className="card rounded-top-0 shadow-none tab-content-card">
                    <div className="card-body py-2">
                      <TabPanel value={value} index={0}>
                        <AssignedComorIndex
                          sort={sort}
                          reset={reset}
                          total={total}
                          ComorGetAllData={ComorGetAllData}
                          curPage={curPage}
                          nextPage={nextPage}
                          pageSize={pageSize}
                          prevPage={prevPage}
                          showPage={showPage}
                          searchRef={searchRef}
                          handleEditComor={handleEditComor}
                          apiGetDataComor={apiGetDataComor}
                          handleSort={handleSort}
                          totalPages={totalPages}
                          pageNumbers={pageNumbers}
                          setPageSize={setPageSize}
                          setApiGetDataComor={setApiGetDataComor}
                          assignloadingComor={assignloadingComor}
                          addAssignComor={addAssignComor}
                          setAssignLoadingComor={setAssignLoadingComor}
                          searchAssignComor={searchAssignComor}
                          setAddAssignComor={setAddAssignComor}
                          handleStatusChangeComor={handleStatusChangeComor}
                          triggerSearchData={triggerSearchData}
                          setSearchAssignComor={setSearchAssignComor}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <AllComorbidities
                          sort1={sort1}
                          reset1={reset1}
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

export default ComorbidityAssignment;
