import {
  Box,
  Collapse,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  getPanelType,
  panelTypeDelete,
  postPanelType,
} from "../../../Services/Compendium/PanelTypeService";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "../../../Shared/hooks/usePagination";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import CustomPagination from "../../../Shared/JsxPagination";
import { StringRecord } from "../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import AddPanelType from "./AddPanelType";
import PanelTypeRow from "./PanelTypeRow";

interface Lookups {
  value: number;
  label: string;
}
const PanelType = () => {
  const { t } = useLang();
  const [reset, setReset] = useState(false);
  const [postTable, setPosttable] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialPostData = {
    id: 0,
    panelType: "",
    reqTypeId: 0,
    description: "",
    isActive: true,
  };
  const [postData, setPostData] = useState<any>(initialPostData);

  /*#########################----SORT STARTS------########################## */
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  /////////////
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

    showData();
  };
  /*#########################----SORT ENDS------########################## */

  /*##############################-----Post Api start-----#################*/

  const ApidataPost = async () => {
    const data = {
      id: postData.id,
      panelType: postData.panelType,
      description: postData.description,
      reqTypeId: postData.reqTypeId,
      isActive: postData.isActive,
      isDeleted: false,
    };
    let resp = await postPanelType(data);
    console.log(resp, "checkdata");
  };
  const handlesave = async () => {
    if (!postData.panelType || postData.reqTypeId === 0) {
      toast.error(t("Please fill in all required fields."));
      return false;
    }
    await ApidataPost();
    setPostData(initialPostData);
    showData();
    setPosttable(false);
  };
  /*##############################-----Post Api End-----###################*/
  /*##############################-----PAGINATION Start-----###############*/
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

  /*##############################-----PAGINATION End-----################*/

  /*##############################-----Start Get Api-----#################*/

  const [apiGetData, setApiGetData] = useState([]);
  const showData = async () => {
    let obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: {
        panelType: searchCriteria.panelType || "",
        description: searchCriteria.description || "",
        reqTypeId: searchCriteria.reqTypeId || 0,
        reqTypeName: searchCriteria.reqTypeName || "",
        isActive: true,
      },
      sortColumn: sort.clickedIconData || "Id",
      sortDirection: sort.sortingOrder || "Desc",
    };
    let res = await getPanelType(obj);
    // console.log(res.data.result, "res")
    setApiGetData(res.data.result);
    setTotal(res?.data?.totalRecord);
    setLoading(false);
  };
  useEffect(() => {
    showData();
  }, [pageSize, curPage]);

  /*##############################-----Get Api End-----#################*/

  /*##############################-----Requisition Type lookup-----#################*/

  const [dropdown, setDropdown] = useState<Lookups[]>([]);
  const reqTypeLookup = async () => {
    const res = await RequisitionType.GetRequisitionTypeLookup();
    setDropdown(res.data);
    // console.log(dropdown, "dropdown")
  };

  useEffect(() => {
    reqTypeLookup();
  }, []);

  /*##############################-----Requisition Type lookup End-----#################*/

  const handleChangeCategory = (e: any) => {
    setPostData((prevData: any) => ({
      ...prevData,
      reqTypeId: +e.value,
    }));
  };

  /*##############################-----Edit Request Start-----#################*/

  const handleEdit = (row: any) => {
    setPostData(() => ({
      ...row,
      id: row.id,
    }));
  };
  /*##############################-----Edit Request End-----#################*/

  /*##############################-----Delete Api Start-----##############################*/
  const handleDelete = async (id: number) => {
    try {
      await panelTypeDelete(id);
      showData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  /*##############################-----Delete Api End-----##############################*/
  /*#########################----Search Function Start------########################## */

  const handleInputChange = (e: any, selectName?: string) => {
    if (selectName === "itemType") {
      const filtereddropdown = dropdown.find(
        (category) => category.value === e.value
      );

      setSearchCriteria({
        ...searchCriteria,
        reqTypeName: filtereddropdown?.label as string,
        reqTypeId: filtereddropdown?.value as number,
      });
    } else {
      setSearchCriteria({
        ...searchCriteria,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSearchClick = () => {
    showData();
  };

  /*#########################----Search Function End------########################## */

  /*##############################-----Search Function And Show Tags-----##############################*/
  const initialSearchCriteria = {
    panelType: "",
    description: "",
    reqTypeId: 0,
    reqTypeName: "",
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  const queryDisplayTagNames: StringRecord = {
    panelType: "Panel Type",
    description: "Description",
    reqTypeName: "Requisition Type",
  };
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchCriteria((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchCriteria as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchCriteria)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchCriteria]);

  useEffect(() => {
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);
  /*##############################-----Search function End-----##############################*/

  const handleCancel = () => {
    setPosttable(false);
    setPostData(initialPostData);
  };
  const handleReset = async () => {
    setSearchCriteria(initialSearchCriteria);
    setReset(!reset);
    setPostData(initialPostData);
    setCurPage(1);
    setPageSize(50);
  };

  useEffect(() => {
    showData();
  }, [reset]);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPostData({
      ...postData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [freezeInput, setFreezeInput] = useState<boolean>(false);
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
          </div>
        </div>
        <div className="app-container container-fluid">
          <Collapse in={postTable} timeout="auto" unmountOnExit>
            <AddPanelType
              setPosttable={setPosttable}
              setPostData={setPostData}
              postData={postData}
              handlesave={handlesave}
              dropdown={dropdown}
              handleCancel={handleCancel}
              handleChangeCategory={handleChangeCategory}
              handleCheckChange={handleCheckChange}
              freezeInput={freezeInput}
              setFreezeInput={setFreezeInput}
            />
          </Collapse>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="card shadow-sm mb-3 rounded">
              <div className="d-flex gap-4 flex-wrap mx-4 my-2">
                {searchedTags.map((tag) =>
                  tag === "status" || tag === "reqTypeId" ? (
                    ""
                  ) : (
                    <div
                      className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                      onClick={() => handleTagRemoval(tag)}
                    >
                      <span className="fw-bold">
                        {t(queryDisplayTagNames[tag])}
                      </span>
                      <i className="bi bi-x"></i>
                    </div>
                  )
                )}
              </div>
              <div className="px-5 d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-2">{t("Records")}</span>
                    <select
                      className="form-select w-80px h-33px rounded"
                      data-allow-clear="true"
                      data-dropdown-parent="#kt_menu_63b2e70320b73"
                      data-kt-select2="true"
                      data-placeholder={t("Select option")}
                      value={pageSize}
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  {postTable ? null : (
                    <div className="d-flex align-items-center gap-2">
                      <PermissionComponent
                        moduleName=""
                        pageName="Panel Type"
                        permissionIdentifier="Add"
                      >
                        <button
                          className="btn btn-primary btn-sm btn-primary--icon px-7"
                          onClick={() => setPosttable(true)}
                        >
                          <i className="fa" style={{ fontSize: 11 }}>
                            
                          </i>
                          <span style={{ fontSize: 11 }}>
                            {t("Add panel Type")}
                          </span>
                        </button>
                      </PermissionComponent>
                    </div>
                  )}
                </div>
                <div className="d-flex align-items-center mb-2 gap-2">
                  <button
                    className="btn btn-linkedin btn-sm fw-500"
                    aria-controls="Search"
                    onClick={handleSearchClick}
                  >
                    {t("Search")}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                    id="kt_reset"
                    type="button"
                    onClick={handleReset}
                  >
                    <span>{t("Reset")}</span>
                  </button>
                </div>
              </div>

              <Box
                sx={{
                  height: "auto",
                  width: "100%",
                  padding: "12px",
                  paddingTop: "0",
                }}
              >
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={{
                      maxHeight: "calc(100vh - 100px)",
                      "&::-webkit-scrollbar": {
                        width: 7,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#fff",
                      },
                      "&:hover": {
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "var(--kt-gray-400)",
                          borderRadius: 2,
                        },
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--kt-gray-400)",
                        borderRadius: 2,
                      },
                    }}
                    className="shadow-none"
                  >
                    <Table
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead>
                        <TableRow className="h-40px">
                          <TableCell></TableCell>
                          <TableCell>
                            <input
                              type="text"
                              name="panelType"
                              value={searchCriteria.panelType}
                              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                              placeholder={t("Search ...")}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              name="description"
                              value={searchCriteria.description}
                              className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-30px"
                              placeholder={t("Search ...")}
                              onChange={handleInputChange}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              menuPortalTarget={document.body}
                              theme={(theme: any) => styles(theme)}
                              name="itemType"
                              placeholder={t("Select Item Type")}
                              options={dropdown}
                              styles={reactSelectSMStyle}
                              onChange={(e) => {
                                handleChangeCategory(e);
                                handleInputChange(e, "itemType");
                              }}
                              value={dropdown.filter(function (option: any) {
                                return option.value === postData.reqTypeId;
                              })}
                            />
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>

                        <TableRow className="h-30px">
                          <TableCell className="d-flex justify-content-center align-items-center">
                            {t("Action")}
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              onClick={() => handleSort("panelType")}
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Panel Type")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "panelType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "panelType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between align-items-center min-w-80px"
                              onClick={() => handleSort("description")}
                              ref={searchRef}
                            >
                              <div>{t("Description")}</div>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "description"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "description"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div
                              className="d-flex justify-content-between align-items-center min-w-80px"
                              onClick={() => handleSort("reqTypeId")}
                              ref={searchRef}
                            >
                              <div>{t("Requisition Type")}</div>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "reqTypeId"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "reqTypeId"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div className="d-flex justify-content-between cursor-pointer ">
                              <div style={{ width: "max-content" }}>
                                {t("Status")}
                              </div>
                              <div
                                className="d-flex justify-content-center align-items-center mx-4 mr-0"
                                onClick={() => handleSort("isActive")}
                                ref={searchRef}
                              >
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "isActive"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "isActive"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* <PanelTypeRow /> */}
                        {loading ? (
                          <TableCell colSpan={9}>{<Loader />}</TableCell>
                        ) : apiGetData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} align="center">
                              {t("No data available.")}
                            </TableCell>
                          </TableRow>
                        ) : (
                          apiGetData.map((row: any) => (
                            <PanelTypeRow
                              row={row}
                              key={row.id}
                              onEdit={handleEdit}
                              setPosttable={setPosttable}
                              onDelete={handleDelete}
                              freezeInput={freezeInput}
                              setFreezeInput={setFreezeInput}
                              showData={showData}
                            />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <CustomPagination
                  curPage={curPage}
                  nextPage={nextPage}
                  pageNumbers={pageNumbers}
                  pageSize={pageSize}
                  prevPage={prevPage}
                  showPage={showPage}
                  total={total}
                  totalPages={totalPages}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanelType;
