import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PatientService from "../../Services/PatientService/PatientService";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import usePagination from "../../Shared/hooks/usePagination";
import { ArrowDown, ArrowUp } from "../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

interface InsuranceHistoryRecord {
  InsuranceType: string;
  InsuranceName: string;
  PolicyId: string;
  GroupId: string;
  InsurancePhone: string;
  UpdatedDate: string;
  UpdatedBy: string;
  EffectiveDate: string;
}

interface SearchFilters {
  InsuranceType: string;
  InsuranceName: string;
  PolicyId: string;
  GroupId: string;
  InsurancePhone: string;
  EffectiveDate: string;
  UpdatedDate: string;
  UpdatedBy: string;
}

const PatientInsuranceHistory: React.FC = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [insuranceHistory, setInsuranceHistory] = useState<
    InsuranceHistoryRecord[]
  >([]);

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

  const [isInitialRender, setIsInitialRender] = useState(false);
  const searchRef = useRef<any>(null);

  const initalSortingObj = {
    clickedIconData: "UpdatedDate",
    sortingOrder: "desc",
  };

  const queryDisplayTagNames: Record<keyof SearchFilters, string> = {
    InsuranceType: "Insurance Type",
    InsuranceName: "Insurance Name",
    PolicyId: "Policy ID",
    GroupId: "Group ID",
    InsurancePhone: "Insurance Phone",
    EffectiveDate: "Effective Date",
    UpdatedDate: "Updated Date",
    UpdatedBy: "Updated By",
  };

  const [sort, setSorting] = useState(initalSortingObj);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    InsuranceType: "",
    InsuranceName: "",
    PolicyId: "",
    GroupId: "",
    InsurancePhone: "",
    EffectiveDate: "",
    UpdatedDate: "",
    UpdatedBy: "",
  });
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  useEffect(() => {
    if (isInitialRender && id) {
      loadInsuranceHistory();
    } else {
      setIsInitialRender(true);
    }
  }, [pageSize, curPage, sort]);

  useEffect(() => {
    if (id) {
      loadInsuranceHistory();
    }
  }, [id]);

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchFilters)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchFilters]);

  useEffect(() => {
    if (searchedTags.length === 0 && isInitialRender) {
      const hasAnyFilter = Object.values(searchFilters).some((v) => v !== "");
      if (!hasAnyFilter) {
        loadInsuranceHistory();
      }
    }
  }, [searchedTags.length]);

  const loadInsuranceHistory = async () => {
    try {
      setLoading(true);
      const decodedId = atob(id || "");

      // Build filter JSON from search filters
      const filters: any = {};
      Object.keys(searchFilters).forEach((key) => {
        const value = searchFilters[key as keyof SearchFilters];
        if (value) {
          filters[key] = value;
        }
      });

      const payload = {
        patientId: parseInt(decodedId),
        pageNumber: curPage,
        pageSize: pageSize,
        filterJson: JSON.stringify(filters),
        sortColumn: sort.clickedIconData,
        sortOrder: sort.sortingOrder,
      };

      const response: AxiosResponse =
        await PatientService.getPatientInsuranceHistory(payload);

      // Use backend response as-is without case transformation
      if (response.data && Array.isArray(response.data)) {
        setInsuranceHistory(response.data);
        setTotal(response.data.length);
      } else if (
        response.data?.responseModel &&
        Array.isArray(response.data.responseModel)
      ) {
        setInsuranceHistory(response.data.responseModel);
        setTotal(response.data?.total || response.data.responseModel.length);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setInsuranceHistory(response.data.data);
        setTotal(response.data?.total || response.data.data.length);
      } else {
        setInsuranceHistory([]);
        setTotal(0);
      }
    } catch (err: any) {
      console.error("Error loading insurance history:", err);
      toast.error(
        err?.response?.data?.message ||
          t("Failed to load patient insurance history")
      );
      setInsuranceHistory([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (columnName: string) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
    setCurPage(1);
  };

  const handleSearchInputChange = (
    field: keyof SearchFilters,
    value: string
  ) => {
    setSearchFilters({
      ...searchFilters,
      [field]: value,
    });
  };

  const formatPhoneInput = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format as (XXX) XXX XXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
  };

  const handlePhoneInputChange = (value: string) => {
    const formatted = formatPhoneInput(value);
    setSearchFilters({
      ...searchFilters,
      InsurancePhone: formatted,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurPage(1);
      loadInsuranceHistory();
    }
  };

  const resetSearch = () => {
    const emptyFilters = {
      InsuranceType: "",
      InsuranceName: "",
      PolicyId: "",
      GroupId: "",
      InsurancePhone: "",
      EffectiveDate: "",
      UpdatedDate: "",
      UpdatedBy: "",
    };
    setSearchFilters(emptyFilters);
    setSorting(initalSortingObj);
    setCurPage(1);
  };

  const handleTagRemoval = (clickedTag: string) => {
    setSearchFilters((prevSearchFilters) => {
      return {
        ...prevSearchFilters,
        [clickedTag]: "",
      };
    });
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-3 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">{t("Home")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Patient")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">
                {t("Patient Insurance History")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="card">
            <div className="card-header border-0 pt-5">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold fs-3 mb-1">
                  {t("Patient Insurance History")}
                </span>
              </h3>
            </div>
            <div className="card-body py-3">
              <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-2">{t("Records")}</span>
                    <select
                      className="form-select w-125px h-33px rounded py-2"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(parseInt(e.target.value));
                        setCurPage(1);
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2 gap-2 ps-3">
                  <button
                    onClick={() => {
                      setCurPage(1);
                      loadInsuranceHistory();
                    }}
                    className="btn btn-info btn-sm fw-500"
                    aria-controls="Search"
                  >
                    {t("Search")}
                  </button>
                  <button
                    onClick={resetSearch}
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  >
                    <span>
                      <span>{t("Reset")}</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Searched Tags */}
              <div className="d-flex gap-4 flex-wrap mb-2">
                {searchedTags.map((tag) => (
                  <div
                    key={tag}
                    className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                    onClick={() => handleTagRemoval(tag)}
                  >
                    <span className="fw-bold">
                      {t(queryDisplayTagNames[tag as keyof SearchFilters])}
                    </span>
                    <i className="bi bi-x"></i>
                  </div>
                ))}
              </div>

              <Box sx={{ height: "auto", width: "100%" }}>
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={
                      isMobile
                        ? {}
                        : {
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
                          }
                    }
                    component={Paper}
                    className="shadow-none"
                  >
                    <Table
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead className="h-40px">
                        <TableRow>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="text"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder={t("Search...")}
                              value={searchFilters.InsuranceType}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "InsuranceType",
                                  e.target.value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="text"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder={t("Search...")}
                              value={searchFilters.InsuranceName}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "InsuranceName",
                                  e.target.value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="text"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder={t("Search...")}
                              value={searchFilters.PolicyId}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "PolicyId",
                                  e.target.value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="text"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder={t("Search...")}
                              value={searchFilters.GroupId}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "GroupId",
                                  e.target.value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="text"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder={t("Search...")}
                              value={searchFilters.InsurancePhone}
                              onChange={(e) =>
                                handlePhoneInputChange(e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="date"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder="mm/dd/yyyy"
                              value={searchFilters.EffectiveDate}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "EffectiveDate",
                                  e.target.value
                                )
                              }
                              onInput={(e) =>
                                handleSearchInputChange(
                                  "EffectiveDate",
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="date"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder="mm/dd/yyyy"
                              value={searchFilters.UpdatedDate}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "UpdatedDate",
                                  e.target.value
                                )
                              }
                              onInput={(e) =>
                                handleSearchInputChange(
                                  "UpdatedDate",
                                  (e.target as HTMLInputElement).value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: "8px" }}>
                            <input
                              type="text"
                              className="form-control bg-white rounded-2 fs-8 h-30px"
                              placeholder={t("Search...")}
                              value={searchFilters.UpdatedBy}
                              onChange={(e) =>
                                handleSearchInputChange(
                                  "UpdatedBy",
                                  e.target.value
                                )
                              }
                              onKeyDown={handleKeyDown}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="h-30px">
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("InsuranceType")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Insurance Type")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "InsuranceType"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "InsuranceType"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("InsuranceName")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Insurance Name")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "InsuranceName"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "InsuranceName"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("PolicyId")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Policy ID")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "PolicyId"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "PolicyId"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("GroupId")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Group ID")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "GroupId"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "GroupId"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("InsurancePhone")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Insurance Phone")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "InsurancePhone"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "InsurancePhone"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("EffectiveDate")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Effective Date")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "EffectiveDate"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "EffectiveDate"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("UpdatedDate")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Updated Date")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "UpdatedDate"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "UpdatedDate"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                              onClick={() => handleSort("UpdatedBy")}
                            >
                              <span style={{ minWidth: "100px" }}>
                                {t("Updated By")}
                              </span>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "UpdatedBy"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "UpdatedBy"
                                      ? "text-danger fs-6"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow className="h-30px">
                            <TableCell colSpan={8} sx={{ textAlign: "center" }}>
                              <Loader />
                            </TableCell>
                          </TableRow>
                        ) : !insuranceHistory?.length ? (
                          <TableRow>
                            <NoRecord message="No insurance history records found for this patient" colSpan={8} />
                          </TableRow>
                        ) : (
                          insuranceHistory.map((record, index) => (
                            <TableRow key={index} className="h-30px">
                              <TableCell>{record.InsuranceType}</TableCell>
                              <TableCell>{record.InsuranceName}</TableCell>
                              <TableCell>{record.PolicyId}</TableCell>
                              <TableCell>{record.GroupId}</TableCell>
                              <TableCell>{record.InsurancePhone}</TableCell>
                              <TableCell>{record.EffectiveDate}</TableCell>
                              <TableCell>{record.UpdatedDate}</TableCell>
                              <TableCell>{record.UpdatedBy}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {/* Pagination */}
                {insuranceHistory.length > 0 && (
                  <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                    <p className="pagination-total-record mb-0">
                      <span>
                        Showing {pageSize * (curPage - 1) + 1} to{" "}
                        {Math.min(pageSize * curPage, total)} of Total{" "}
                        <span> {total} </span> entries{" "}
                      </span>
                    </p>
                    <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                      <li
                        className="btn btn-lg p-2 h-33px"
                        onClick={() => showPage(1)}
                      >
                        <i className="fa fa-angle-double-left"></i>
                      </li>
                      <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                        <i className="fa fa-angle-left"></i>
                      </li>

                      {pageNumbers.map((page) => (
                        <li
                          key={page}
                          className={`px-2 ${
                            page === curPage
                              ? "font-weight-bold bg-primary text-white h-33px"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => showPage(page)}
                        >
                          {page}
                        </li>
                      ))}

                      <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
                        <i className="fa fa-angle-right"></i>
                      </li>
                      <li
                        className="btn btn-lg p-2 h-33px"
                        onClick={() => {
                          if (totalPages === 0) {
                            showPage(curPage);
                          } else {
                            showPage(totalPages);
                          }
                        }}
                      >
                        <i className="fa fa-angle-double-right"></i>
                      </li>
                    </ul>
                  </div>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInsuranceHistory;
