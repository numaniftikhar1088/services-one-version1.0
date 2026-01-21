import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ResultFileUploadGrid from "./ResultFileUploadGrid";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { LoaderIcon } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import { StringRecord } from "Shared/Type";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import { sortById, SortingTypeI } from "Utils/consts";

export default function CollapsibleTable() {
  const { t } = useLang();
  const searchRef = useRef<any>(null);

  const initialSearchQuery = {
    fileName: "",
    uploadedDate: "",
    status: "",
    uploadedBy: "",
    isArchived: false,
  };

  const queryDisplayTagNames: StringRecord = {
    fileName: "File Name",
    uploadedDate: "Date",
    status: "Status",
    uploadedBy: "Uploaded By",
  };

  const [value, setValue] = React.useState("1");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [resultFileUpload, setResultFileUpload] = useState([]);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [invalidFileFormat, setInvalidFileFormat] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string>("");
  const [fileCountError, setFileCountError] = useState<string>("");
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
  const MAX_FILE_COUNT = 10;
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

  useEffect(() => {
    if (initialRender) {
      loadGridData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }

  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    RequisitionType.getResultPdfFileUpload({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total);
        setResultFileUpload(res?.data?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  const ResultFileUpload = async () => {
    if (images.length === 0) return;

    setIsSubmitting(true);

    const formData = new FormData();

    // If multiple files, use PdfUploadMultiple endpoint
    if (images.length > 1) {
      images.forEach((file: File) => {
        formData.append("files", file);
      });
      formData.append("TemplateId", "1");

      try {
        const res: AxiosResponse =
          await RequisitionType.PdfUploadMultiple(formData);

        if (res?.data?.statusCode === 200) {
          toast.success(t(res.data.message));
        } else {
          toast.error(t(res.data.message));
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error(t("File upload failed."));
      } finally {
        setIsSubmitting(false);
        setImages([]);
        setInvalidFileFormat(false);
        setFileSizeError("");
        setFileCountError("");
        loadGridData(true, true);
      }
    } else {
      // Single file upload
      formData.append("file", images[0]);
      formData.append("TemplateId", "1");

      try {
        const res: AxiosResponse =
          await RequisitionType.PdfResultFileUpload(formData);

        if (res?.data?.statusCode === 200) {
          toast.success(t(res.data.message));
        } else {
          toast.error(t(res.data.message));
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(t("File upload failed."));
      } finally {
        setIsSubmitting(false);
        setImages([]);
        setInvalidFileFormat(false);
        setFileSizeError("");
        setFileCountError("");
        loadGridData(true, true);
      }
    }
  };

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  // *********** All Dropdown Function Show Hide ***********

  const allowedExtensions = ["pdf"];
  const handleFileSelect = (e: any) => {
    const selectedFiles = Array.from(e.target.files) as File[];
    if (selectedFiles.length === 0) return;

    let hasInvalidFormat = false;
    let hasSizeError = false;
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    // Check total file count
    const totalFilesAfterAdd = images.length + selectedFiles.length;
    if (totalFilesAfterAdd > MAX_FILE_COUNT) {
      setFileCountError(
        t(
          `Maximum ${MAX_FILE_COUNT} files allowed. You are trying to add ${selectedFiles.length} file(s).`
        )
      );
      e.target.value = "";
      return;
    } else {
      setFileCountError("");
    }

    // Validate each file
    selectedFiles.forEach((file: File) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isValidFormat = allowedExtensions.includes(fileExtension || "");
      const isValidSize = file.size <= MAX_FILE_SIZE;

      if (!isValidFormat) {
        hasInvalidFormat = true;
        invalidFiles.push(file);
      } else if (!isValidSize) {
        hasSizeError = true;
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    // Set error states
    setInvalidFileFormat(hasInvalidFormat);
    if (hasSizeError) {
      setFileSizeError(
        t(
          `File size exceeds the maximum limit of 10 MB. Please select smaller files.`
        )
      );
    } else {
      setFileSizeError("");
    }

    // Only add valid files
    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
    }

    // Show error messages for invalid files
    if (invalidFiles.length > 0) {
      if (hasInvalidFormat && !hasSizeError) {
        toast.error(t("Invalid file format. Please choose PDF files only."));
      } else if (hasSizeError) {
        toast.error(
          t(
            `Some files exceed the maximum size limit of 10 MB. Please select smaller files.`
          )
        );
      }
    }

    e.target.value = "";
  };

  const handleImageDeselect = (image: any) => {
    const _images = [...images];
    const index = _images.map((_) => _.name).indexOf(image.name);
    if (index > -1) {
      _images.splice(index, 1);
    }
    setImages([..._images]);
    setInvalidFileFormat(false);
    setFileSizeError("");
    setFileCountError("");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // ========================= tabs

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setSearchRequest(initialSearchQuery);
  };

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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  useEffect(() => {
    if (initialRender2) {
      loadGridData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  // Handling searchedTags
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest) => {
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
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
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
                  minHeight: "auto !important",
                  "& .MuiButtonBase-root": { textTransform: "capitalize" },
                  "& .Mui-selected": {
                    background: "#fff",
                    borderStartStartRadius: "8px",
                    borderStartEndRadius: "8px",
                    zIndex: 4,
                    color: "var(--bs-primary) !important",
                  },
                  "& .MuiTabs-indicator": { display: "none" },
                }}
              >
                <Tab data-test-id="Active" label={t("Active")} value="1" />
              </TabList>
              <div className="card shadow-sm mb-3 rounded-top-0">
                <div className="card-body py-2">
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Result Upload PDF"
                    permissionIdentifier="Upload"
                  >
                    <div className="align-items-center d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between px-4 py-3 bg-gray-100 mb-3 rounded">
                      <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <div className="d-flex gap-2">
                          <input
                            id={`IDResultFileUploadFileInput`}
                            type="file"
                            onChange={handleFileSelect}
                            className="d-none"
                            disabled={
                              images.length >= MAX_FILE_COUNT || isSubmitting
                            }
                            accept=".pdf"
                            multiple
                          />

                          <label
                            htmlFor="IDResultFileUploadFileInput"
                            className="dropzone pt-2 py-1 px-8 d-flex align-items-center"
                            style={{
                              opacity: isSubmitting ? 0.6 : 1,
                              cursor: isSubmitting ? "not-allowed" : "pointer",
                            }}
                          >
                            <div className="dz-message needsclick">
                              {t("Choose File")}
                            </div>
                          </label>
                          <div>
                            <button
                              id={`IDResultFileUploadFileButton`}
                              onClick={() => ResultFileUpload()}
                              disabled={
                                images.length > 0 &&
                                  !invalidFileFormat &&
                                  !fileSizeError &&
                                  !fileCountError
                                  ? isSubmitting
                                  : true
                              }
                              className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
                            >
                              {isSubmitting && (
                                <>
                                  <LoaderIcon />
                                </>
                              )}
                              {!isSubmitting && (
                                <i className="bi bi-upload"></i>
                              )}
                            </button>
                          </div>
                        </div>
                        {images.length > 0 ? (
                          <>
                            {images?.map((filesData: any, index: number) => (
                              <div
                                key={`${filesData?.name}-${index}`}
                                className="col-lg-12 col-sm-12 col-md-12"
                              >
                                <div className="border bg-light-secondary rounded p-2 my-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-dark-65">
                                      <div className="fw-bold">
                                        {filesData?.name}
                                      </div>
                                      <div className="text-muted small">
                                        {formatFileSize(filesData?.size || 0)}
                                      </div>
                                    </div>
                                    <div>
                                      <span
                                        style={{
                                          fontSize: "18px",
                                          cursor: isSubmitting
                                            ? "not-allowed"
                                            : "pointer",
                                          color: isSubmitting
                                            ? "#6c757d"
                                            : "#dc3545",
                                          opacity: isSubmitting ? 0.5 : 1,
                                        }}
                                        onClick={
                                          isSubmitting
                                            ? undefined
                                            : () =>
                                              handleImageDeselect(filesData)
                                        }
                                        title={
                                          isSubmitting
                                            ? t(
                                              "Cannot remove file during upload"
                                            )
                                            : t("Remove file")
                                        }
                                      >
                                        &#x2716;
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : null}
                        <span className="text-muted">
                          {t(
                            `Note! Please choose only PDF format files. Maximum ${MAX_FILE_COUNT} files allowed, each file size should not exceed 10 MB.`
                          )}
                        </span>
                        {invalidFileFormat && (
                          <div className="text-dark-65 form__error mt-2">
                            <span>
                              {t(
                                "Invalid file format. Please choose PDF files only."
                              )}
                            </span>
                          </div>
                        )}
                        {fileSizeError && (
                          <div className="text-dark-65 form__error mt-2">
                            <span>{fileSizeError}</span>
                          </div>
                        )}
                        {fileCountError && (
                          <div className="text-dark-65 form__error mt-2">
                            <span>{fileCountError}</span>
                          </div>
                        )}
                        {images.length > 0 && (
                          <div className="text-info mt-2">
                            <span>
                              {t(
                                `${images.length} of ${MAX_FILE_COUNT} files selected`
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </PermissionComponent>
                  <div className="d-flex gap-4 flex-wrap mb-1">
                    {searchedTags.map((tag) =>
                      tag === "isArchived" ? null : (
                        <div
                          className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                          onClick={() => handleTagRemoval(tag)}
                          key={tag + Math.random()}
                        >
                          <span className="fw-bold">
                            {t(queryDisplayTagNames[tag])}
                          </span>
                          <i className="bi bi-x"></i>
                        </div>
                      )
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="d-flex align-items-center">
                        <span className="fw-400 mr-2">{t("Records")}</span>
                        <select
                          id={`IdResultFileRecords`}
                          className="form-select w-125px h-33px rounded py-2"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          onChange={(e) => {
                            setPageSize(parseInt(e.target.value));
                          }}
                          value={pageSize}
                        >
                          <option value="5">5</option>
                          <option value="10" selected>
                            10
                          </option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        id={`IdResultFileSearch`}
                        onClick={() => {
                          setCurPage(1);
                          setTriggerSearchData((prev) => !prev);
                        }}
                        className="btn btn-linkedin btn-sm fw-500"
                        aria-controls="Search"
                      >
                        {t("Search")}
                      </button>
                      <button
                        onClick={resetSearch}
                        type="button"
                        className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                        id={`IdResultFileReset`}
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
                        // component={Paper}
                        className="shadow-none"
                      // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                      >
                        <Table
                          // stickyHeader
                          aria-label="sticky table collapsible"
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                        >
                          <ResultFileUploadGrid
                            sort={sort}
                            loading={loading}
                            ShowBlob={ShowBlob}
                            searchRef={searchRef}
                            handleSort={handleSort}
                            searchRequest={searchRequest}
                            handleKeyPress={handleKeyPress}
                            searchQuery={onInputChangeSearch}
                            ResultFileUploadList={resultFileUpload}
                          />
                        </Table>
                      </TableContainer>
                    </div>
                    {/* ==========================================================================================
                          //====================================  PAGINATION START =====================================
                          //============================================================================================ */}
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
                    {/* ==========================================================================================
                          //====================================  PAGINATION END =====================================
                          //============================================================================================ */}
                  </Box>
                  {/* </TabPanel> */}
                </div>
              </div>
            </TabContext>
          </Box>
        </div>
      </div>
    </>
  );
}
