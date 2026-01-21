import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import ReferenceLabGrid from "./ReferenceLabGrid";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { Collapse } from "@mui/material";
import AddReferenceLab from "./AddReferenceLab";
import { textChangeRangeIsUnchanged } from "typescript";
import useLang from "Shared/hooks/useLanguage";
import CustomPagination from './../../../Shared/JsxPagination/index';

export default function CollapsibleTable(props: any) {
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const { t } = useLang();
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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
    loadGridData(true, false);
  }, [curPage]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [dropDownValues, setDropDownValues] = useState({
    UserGroupList: [],
    AdminTypeList: [],
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const [page, setPages] = useState(1);

  const handleChange = (name: string, value: string, id: string) => {
    setRows((curr: any[]) =>
      curr.map((x: any) =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };
  useEffect(() => {
    setCurPage(1);
    loadGridData(true, true);
  }, [pageSize]);

  let [searchRequest, setSearchRequest] = useState({
    referenceLab: "",
    labType: "",
    code: 0,
    requisitionType: "",
    testGroup: "",
    status: null,
  });
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {


    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    searchRequest = {
      referenceLab: "",
      labType: "",
      code: 0,
      requisitionType: "",
      testGroup: "",
      status: null,
    };
    setSearchRequest({
      referenceLab: "",
      labType: "",
      code: 0,
      requisitionType: "",
      testGroup: "",
      status: null,
    });
    loadGridData(true, true);
  }

  const loadGridData = (loader: boolean, reset: boolean) => {
    if (loader) {
      setLoading(true);
    }
    const nullObj = {
      id: 0,
      referenceLab: "",
      labType: "",
      code: 0,
      requisitionType: "",
      testGroup: "",
      status: null,
    };
    FacilityService.getAllAssignRefLabAndGroup({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : searchRequest,
    })
      .then((res: AxiosResponse) => {

        setTotal(res?.data?.total);
        setRows(res?.data?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  const [editGridHeader, setEditGridHeader] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    let objToSend = {
      facilityId: 0,
      refLabId: 0,
      labType: 0,
      reqTypeId: 0,
      groupId: 0,
      insuranceId: 0,
      insuranceOptionId: 0,
      gender: "",
    };

    if (!editGridHeader) {
      FacilityService.CreateAssignedReferenceLab(objToSend)
        .then((res: AxiosResponse) => {

          if (res?.data?.statusCode === 200) {
            toast.success(res?.data?.message);
            loadGridData(true, false);
          }
        })
        .catch((err: AxiosError) => {

        });
    }
    if (editGridHeader) {
      FacilityService.UpdateAssignedReferenceLab(objToSend)
        .then((res: AxiosResponse) => {

          if (res?.data?.statusCode === 200) {
            toast.success(res?.data?.message);
            loadGridData(true, false);
          }
        })
        .catch((err: AxiosError) => {

        });
    }
    setOpen(false);
  };
  const EditUser = (row: any) => {


    setEditGridHeader(true);

    setOpen(true);
  };
  const onClose = () => {
    setEditGridHeader(false);

    setOpen(false);
  };

  const deleteRecord = (id: number) => {
    FacilityService?.DeleteReferenceLab(id)
      .then((res: AxiosResponse) => {


        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {

      });
  };
  const StatusChange = (id: number, status: boolean) => {
    const obj = {
      id: id,
      status: status,
    };
    FacilityService?.statuschange(obj)
      .then((res: AxiosResponse) => {

        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {

      });
  };
  return (

    <div className="app-container container-fluid">
      <Collapse in={open}>
        <AddReferenceLab
          modalheader={editGridHeader ? "Edit Admin User" : "Add Admin User"}
          editGridHeader={editGridHeader}
          setDataAndErrors={0}
          errors={0}
          changeHandler={textChangeRangeIsUnchanged}
          formData={1}
          handleSubmit={handleSubmit}
          dropDownValues={dropDownValues}
          UserGroupList={dropDownValues?.UserGroupList}
          AdminTypeList={dropDownValues?.AdminTypeList}
          setIsOpen={setOpen}
          isOpen={open}
          onClose={onClose}
        />
      </Collapse>

      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="card-body py-md-4 py-3">
            <div className="d-flex justify-content-center justify-content-sm-start">
              <button
                className={`btn btn-primary btn-sm fw-bold search mb-3 ${open ? "d-none" : "d-block"
                  }`}
                onClick={() => setOpen(!open)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <span>
                  <i style={{ fontSize: "15px" }} className="fa">
                    &#xf067;
                  </i>
                  <span>{t("Add Admin User")}</span>
                </span>
              </button>
            </div>
            <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mb-2 col-12">
              <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  className="form-select w-125px h-33px rounded"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  onChange={(e) => {

                    setPageSize(parseInt(e.target.value));
                  }}
                >
                  <option value="5" selected>
                    5
                  </option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  onClick={() => loadGridData(true, false)}
                  className="btn btn-linkedin btn-sm fw-500"
                  aria-controls="Search"
                >
                  {t("Search")}{" "}
                </button>
                <button
                  onClick={resetSearch}
                  type="button"
                  className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  id="kt_reset"
                >
                  <span>
                    <span>{t("Reset")}</span>
                  </span>
                </button>
              </div>
            </div>
            <Box sx={{ height: "auto", width: "100%" }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={{
                    maxHeight: 'calc(100vh - 100px)',
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
                  // component={Paper}
                  className="shadow-none"
                // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                >
                  <Table
                    // stickyHeader
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                  >
                    <ReferenceLabGrid
                      deleteRecord={deleteRecord}
                      EditUser={EditUser}
                      rows={rows}
                      setRows={setRows}
                      dropDownValues={dropDownValues}
                      searchRequest={searchRequest}
                      searchQuery={onInputChangeSearch}
                      handleChange={handleChange}
                      loading={loading}
                      StatusChange={StatusChange}
                    />
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

  );
}
