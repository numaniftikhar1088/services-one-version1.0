import {
  Box,
  Collapse,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  getTestType,
  saveTestType,
  testTypeDelete,
} from "../../../Services/Compendium/TestTypeService";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import usePagination from "../../../Shared/hooks/usePagination";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { StringRecord } from "../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import AddTestType from "./AddTestType";
import Row from "./Row";
import useLang from "./../../../Shared/hooks/useLanguage";
import CustomPagination from "Shared/JsxPagination";

interface Rows {
  description: string;
  id: number;
  isActive: boolean;
  reqTypeId: number;
  reqTypeName: string;
  testType: string;
}
interface Requisition {
  value: number;
  label: string;
}
export interface FormData {
  id: number;
  testType: string;
  description: string;
  isActive: boolean;
  reqTypeId: number;
  reqTypeName: string;
}

export interface Item {
  id: number;
  testType: string;
  description: string;
  isActive: boolean;
  reqTypeId: number;
  reqTypeName: string;
}

interface SaveTestTypeObj {
  id: number;
  testType: string;
  description: string;
  reqTypeId: number;
  isActive: boolean;
  isDeleted?: boolean;
}
interface Headers {
  label: string;
  apiName: string;
}

interface QueryModel {
  id?: number;
  testType?: string;
  description?: string;
  reqTypeId?: number | null;
  reqTypeName?: string;
}

// sorting Interfaces
export interface SortingTypeI {
  sortingOrder: "asc" | "desc" | null;
  clickedIconData: string | null;
}
export const sortById: SortingTypeI = {
  clickedIconData: "id",
  sortingOrder: "desc",
};
export interface StatusChangeObject {
  id: number;
  isActive: boolean;
}

export interface CategoryChangeEvent {
  value: number;
}

const Index = () => {
  const { t } = useLang();
  const initialSearchQuery: QueryModel = {
    id: 0,
    testType: "",
    description: "",
    reqTypeId: 0,
    reqTypeName: "",
  };

  let [searchRequest, setSearchRequest] =
    useState<QueryModel>(initialSearchQuery);

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch: (
    e: React.ChangeEvent<InputChangeEvent>
  ) => void = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const [addBtn, setAddBtn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [freezeInput, setFreezeInput] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<Requisition[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [rows, setRows] = useState<Rows[]>([]);

  const initialFormData: FormData = {
    id: 0,
    testType: "",
    description: "",
    reqTypeName: "",
    reqTypeId: 0,
    isActive: true,
  };

  // Add Data
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const reqTypeLookup: () => Promise<void> = async () => {
    const res = await RequisitionType.GetRequisitionTypeLookup();
    setDropdown(res.data);
  };

  useEffect(() => {
    reqTypeLookup();
  }, []);

  const handleSave: () => Promise<boolean> = async () => {
    const { id, testType, description, reqTypeId, isActive } = formData;
    // Validate the form data
    if (!reqTypeId || testType.length === 0) {
      toast.error(t("Please fill in all required fields."));
      return false;
    }

    let obj: SaveTestTypeObj = {
      id: id,
      testType: testType,
      description: description,
      reqTypeId: reqTypeId,
      isActive: isActive,
      isDeleted: false,
    };

    try {
      const resp = await saveTestType(obj);
      toast.success(resp.data.message);
      setAddBtn(false);
      return true;
    } catch (err) {
      toast.error(t("Error saving data."));
      console.error("Error saving data:", err);
      return false;
    } finally {
      loadRowsData();
      setFormData(initialFormData);
    }
  };

  const Headers: Headers[] = [
    { label: "Test Type", apiName: "testType" },
    { label: "Description", apiName: "description" },
    { label: "Requisition Type", apiName: "reqTypeName" },
    { label: "Status", apiName: "isActive" },
  ];

  /*#########################----SORT STARTS------########################## */
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const handleSort: (columnName: string) => void = (columnName: string) => {
    const newSortingOrder = sort.sortingOrder === "asc" ? "desc" : "asc";
    setSorting({
      sortingOrder: newSortingOrder,
      clickedIconData: columnName,
    });
    loadRowsData();
  };

  // * Pagination Hooks
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

  const loadRowsData: (queryModel?: {}) => Promise<void> = async (
    queryModel = {}
  ) => {
    setLoading(true);
    try {
      const obj = {
        pageNumber: curPage,
        pageSize: pageSize,
        queryModel: {
          ...initialSearchQuery,
          ...queryModel,
        },
        sortColumn: sort.clickedIconData || "Id",
        sortDirection: sort.sortingOrder || "Desc",
      };

      const res = await getTestType(obj);
      setRows(res?.data?.result);
      setTotal(res?.data?.totalRecord);
    } catch (error) {
      console.error("Error fetching Test Type table data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData: () => Promise<void> = async () => {
      await loadRowsData();
    };
    fetchData();
  }, [pageSize, curPage]);

  const handleSearch: () => void = () => {
    const queryModel = {
      ...initialSearchQuery,
      testType: searchRequest.testType || "",
      description: searchRequest.description || "",
      reqTypeId: searchRequest.reqTypeId || 0,
      reqTypeName: searchRequest.reqTypeName || "",
    };
    loadRowsData(queryModel);
  };

  const handleReset: () => void = () => {
    setSearchRequest(initialSearchQuery);
    const queryModel = {
      initialSearchQuery,
    };
    loadRowsData(queryModel);
  };

  const [edit, setEdit] = useState<boolean>(false);
  const handleEdit: (item: Item) => void = (item: Item) => {
    setEdit(true);
    setFormData(() => ({
      ...item,
      id: item.id,
    }));
  };
  const handleChangeCategory: (e: CategoryChangeEvent) => void = (
    e: CategoryChangeEvent
  ) => {
    setFormData((prevData: FormData) => ({
      ...prevData,
      reqTypeId: +e.value,
    }));
  };

  const handleCheckChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDelete: (id: number) => Promise<void> = async (id: number) => {
    try {
      setDeleting(true); // * Set deleting to true when delete operation starts
      const res = await testTypeDelete(id); // ! Delete the record with the specified ID
      loadRowsData(); // After successful deletion, fetch the updated physician table data
      toast.success(res.data.message);
    } catch (error) {
      toast.error(t("Error deleting record."));
      console.error("Error deleting record:", error);
    } finally {
      setDeleting(false); // Set deleting to false when delete operation finishes
    }
  };

  // Handling searchedTags
  const queryDisplayTagNames: StringRecord = {
    testType: t("Test Type"),
    description: t("Description"),
    reqTypeName: t("Requisition Type"),
  };
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((searchRequest) => {
      return {
        ...searchRequest,
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
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid">
        <Collapse in={addBtn} timeout="auto" unmountOnExit>
          <AddTestType
            setAddBtn={setAddBtn}
            formData={formData}
            setFormData={setFormData}
            dropdown={dropdown}
            handleSave={handleSave}
            handleChangeCategory={handleChangeCategory}
            handleCheckChange={handleCheckChange}
            freezeInput={freezeInput}
            initialFormData={initialFormData}
          />
        </Collapse>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card rounded-top-0 shadow-none">
            <div className="card-body px-3 px-md-8 py-4">
              <div className="d-flex gap-4 flex-wrap mb-2">
                {searchedTags.map((tag) => (
                  <div
                    className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                    onClick={() => handleTagRemoval(tag)}
                  >
                    <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
                    <i className="bi bi-x"></i>
                  </div>
                ))}
              </div>
              <div className="align-items-center d-flex flex-wrap justify-content-center justify-content-sm-between">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-3">{t("Records")}</span>
                    <select
                      className="form-select w-125px h-33px rounded py-2"
                      data-kt-select2="true"
                      data-placeholder={t("Select option")}
                      data-dropdown-parent="#kt_menu_63b2e70320b73"
                      data-allow-clear="true"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  {addBtn ? null : (
                    <div className="d-flex align-items-center gap-2">
                      <PermissionComponent
                        moduleName=""
                        pageName="Test Type"
                        permissionIdentifier="Add"
                      >
                        <Button
                          onClick={() => setAddBtn(true)}
                          variant="contained"
                          color="success"
                          className="btn btn-primary btn-sm text-capitalize fw-400"
                        >
                          <i className="bi bi-plus-lg"></i>
                          <span>{t("Add Test Type")}</span>
                        </Button>
                      </PermissionComponent>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2 px-2">
                  <button
                    className="btn btn-info btn-sm fw-500"
                    aria-controls="Search"
                    onClick={handleSearch}
                  >
                    {t("Search")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                    id="kt_reset"
                    onClick={handleReset}
                  >
                    <span>{t("Reset")}</span>
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <Box sx={{ height: "auto", width: "100%" }}>
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
                    component={Paper}
                    className="shadow-none"
                  >
                    <Table
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                    >
                      <TableHead>
                        <TableRow className="h-40px">
                          <TableCell></TableCell>
                          <TableCell>
                            <input
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              value={searchRequest.testType}
                              onChange={onInputChangeSearch}
                              name="testType"
                              placeholder={t("Search ...")}
                              type="text"
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Last Name")}
                              name="description"
                              value={searchRequest.description}
                              onChange={onInputChangeSearch}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              menuPortalTarget={document.body}
                              theme={(theme: any) => styles(theme)}
                              name="itemType"
                              placeholder={t("Select Item Type")}
                              styles={reactSelectSMStyle}
                              options={dropdown}
                              value={
                                dropdown.find(
                                  (option) =>
                                    option.label === searchRequest.reqTypeName
                                ) || null
                              }
                              onChange={(event: any) => {
                                setSearchRequest({
                                  ...searchRequest,
                                  // reqTypeId: event.value,
                                  reqTypeName: event?.label as string,
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className="min-w-50px d-flex justify-content-center">
                            {t("Actions")}
                          </TableCell>

                          {Headers.map((header, index) => (
                            <TableCell
                              align="left"
                              key={index}
                              sx={{ width: "max-content" }}
                            >
                              <div
                                className="d-flex justify-content-between cursor-pointer"
                                onClick={() => handleSort(header.apiName)}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t(header.label)}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.clickedIconData === header.apiName &&
                                      sort.sortingOrder === "asc"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    } p-0 m-0`}
                                  />
                                  {/* Arrow Down Icon */}
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.clickedIconData === header.apiName &&
                                      sort.sortingOrder === "desc"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    } p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="">
                              <Loader />
                            </TableCell>
                          </TableRow>
                        ) : rows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              {t("No data available.")}
                            </TableCell>
                          </TableRow>
                        ) : (
                          rows.map((item: Item) => (
                            <Row
                              item={item}
                              setAddBtn={setAddBtn}
                              handleEdit={handleEdit}
                              onDelete={handleDelete}
                              deleting={deleting}
                              // setIsActive={setIsActive}
                              loadRowsData={loadRowsData}
                              setFreezeInput={setFreezeInput}
                            />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Box>

              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ###############<-----PAGINATION START----->>############### */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
