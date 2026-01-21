import { Box, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
  default as SignatureCanvas,
  default as SignaturePad,
} from "react-signature-canvas";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";
import Status from "Shared/Common/Status";
import useIsMobile from "Shared/hooks/useIsMobile";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import CustomPagination from "Shared/JsxPagination";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { InputChangeEvent, StringRecord } from "../../../Shared/Type";

const queryDisplayTagNames: StringRecord = {
  status: "Status",
  firstName: "First Name",
  lastName: "Last Name",
  requisitionTypeId: "Requisition Type",
  requisitionType: "Requisition Type",
  physicianName: "Physician Name",
  dateOfCollection: "Date Of Collection",
  timeOfCollection: "Time Of Collection",
  order: "Order #",
  npinumber: "NPI",
};

interface SearchQuery {
  requisitionId: number;
  status: string;
  firstName: string;
  lastName: string;
  requisitionTypeId: number;
  requisitionType: string;
  physicianName: string;
  dateOfCollection: string;
  timeOfCollection: string;
  physicianId: string;
  order: string;
  npinumber: string;
}

const initialSearchQuery = {
  requisitionId: 0,
  status: "",
  firstName: "",
  lastName: "",
  requisitionTypeId: 0,
  requisitionType: "",
  physicianName: "",
  dateOfCollection: "",
  timeOfCollection: "",
  physicianId: "",
  order: "",
  npinumber: "",
};

const Waiting = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setCurPage,
    setPageSize,
    setTotal,
  } = usePagination();

  const selectedTenat = useSelector(
    (state: any) => state.Reducer.selectedTenantInfo
  );

  const isFacilityUser =
    PortalTypeEnum.Facility === selectedTenat.infomationOfLoggedUser.portalType;

  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [loading, setLoading] = useState(true);
  const [physiciansList, setPhysicianList] = useState<any>([]);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [waitingSignature, setWaitingSignature] = useState<any>([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [selectedBox, setSelectedBox] = useState<number[]>([]);
  let [searchRequest, setSearchRequest] =
    useState<SearchQuery>(initialSearchQuery);

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangePhysicianID = (e: any) => {
    setSearchRequest((prev) => ({
      ...prev,
      physicianId: e?.value,
    }));

    LoadDataWaitingSignature(false, e?.value);
  };

  const LoadPhysicianLookup = async () => {
    await RequisitionType.PhysicianLookup().then((res: AxiosResponse) => {
      setPhysicianList(res?.data);

      if (res.data.length === 1) {
        setSearchRequest((prev) => ({
          ...prev,
          physicianId: res?.data?.[0]?.value,
        }));
      }
    });
  };

  function resetSearch() {
    setSearchRequest({
      requisitionId: 0,
      status: "",
      firstName: "",
      lastName: "",
      requisitionTypeId: 0,
      requisitionType: "",
      physicianName: "",
      dateOfCollection: "",
      timeOfCollection: "",
      order: "",
      npinumber: "",
      physicianId: isFacilityUser ? searchRequest.physicianId : "",
    });

    LoadDataWaitingSignature(true, searchRequest.physicianId);
  }

  const LoadDataWaitingSignature = (
    reset: boolean = false,
    physicianId?: string
  ) => {
    const cleanedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    RequisitionType.waitingRequisition({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset
        ? {
            ...initialSearchQuery,
            physicianId,
          }
        : {
            ...cleanedSearchRequest,
            physicianId,
          },
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          setWaitingSignature(
            res?.data?.data?.waitingForSignatures || res?.data?.data
          );
          setTotal(res?.data?.total);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isInitialRender2) {
      LoadDataWaitingSignature();
    } else {
      setIsInitialRender2(true);
    }
  }, [pageSize, curPage, triggerSearchData]);

  useEffect(() => {
    LoadPhysicianLookup();
  }, []);

  useEffect(() => {
    if (!isFacilityUser && searchRequest.physicianId === "") {
      LoadDataWaitingSignature();
    } else if (searchRequest.physicianId && isFacilityUser) {
      LoadDataWaitingSignature(false, searchRequest.physicianId);
    }
  }, [searchRequest.physicianId]);

  // Handling searchedTags
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
    if (isInitialRender) {
      if (searchedTags.length === 0) resetSearch();
    } else {
      setIsInitialRender(true);
    }
  }, [searchedTags.length]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };

  // const today = new Date();
  // const maxDate = today.toISOString().split("T")[0];

  const handleAllSelect = () => {
    setSelectedBox(
      waitingSignature.map((item: any) => item.requisitionOrderId)
    );
  };

  const handleChangeRequisitionIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox([...selectedBox, id]);
    } else {
      setSelectedBox(selectedBox.filter((item: any) => item !== id));
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const generateUniqueFilename = () => {
    const timestamp = new Date().getTime();
    return `signature_${timestamp}.png`;
  };

  const handleSave = async () => {
    if (!selectedBox.length) {
      toast.error("Please choose one or more records.");
      return;
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Please Provide Signature For Records.");
      return;
    }

    // Checks if orders has same physicians
    if (selectedBox.length > 1) {
      const selectedOrders = waitingSignature.filter((order: any) =>
        selectedBox.includes(order.requisitionOrderId)
      );

      const allSamePhysician = selectedOrders.every(
        (item: any) => item.physicianId === selectedOrders[0]?.physicianId
      );

      if (!allSamePhysician) {
        toast.error(t("Please select records with the same NPI numbers."));
        return;
      }
    }

    try {
      const imageBase64 = signatureRef.current.toDataURL();
      const contentArray = new Uint8Array(
        Array.from(atob(imageBase64.split(",")[1]), (char) =>
          char.charCodeAt(0)
        )
      );

      const data = {
        name: generateUniqueFilename(),
        portalKey: "demo-app",
        fileType: "image/png",
        extention: "png",
        content: Array.from(contentArray),
        isPublic: true,
      };

      const uploadResponse = await FacilityService.BlobUpload(data);

      const obj = {
        status: "Submit",
        requisitionIds: selectedBox,
        physicianSignatureUrl: uploadResponse?.data?.Data,
      };

      if (uploadResponse?.data?.Status) {
        const saveResponse = await RequisitionType.SavePendingRequisition(obj);

        if (saveResponse?.data?.httpStatusCode === 200) {
          toast.success(saveResponse?.data?.message);
          LoadDataWaitingSignature(false, searchRequest.physicianId);
          handleClear();
          setSelectedBox([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="mb-5 hover-scroll-x">
        <div className="card">
          <div className="card-header border-0 pt-6 d-flex justify-content-center justify-content-sm-start">
            <div className="d-flex gap-2 gap-lg-3" style={{ width: "400px" }}>
              <Select
                menuPortalTarget={document.body}
                styles={{
                  ...reactSelectSMStyle,
                  control: (base: any) => ({
                    ...base,
                    width: "230px",
                  }),
                }}
                placeholder={t("Select Physician")}
                isClearable
                theme={(theme: any) => styles(theme)}
                options={physiciansList}
                onChange={(event: any) => handleChangePhysicianID(event)}
                isDisabled={physiciansList.length === 1}
                value={physiciansList?.filter(function (option: any) {
                  return option.value === searchRequest?.physicianId;
                })}
              />
            </div>
          </div>

          <div className="card-body pt-4">
            <div className="d-flex gap-4 flex-wrap">
              {searchedTags.map((tag) =>
                tag === "isArchived" || tag === "physicianId" ? null : (
                  <div
                    className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                    onClick={() => handleTagRemoval(tag)}
                  >
                    <span className="fw-bold">{queryDisplayTagNames[tag]}</span>
                    <i className="bi bi-x"></i>
                  </div>
                )
              )}
            </div>
            <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mb-2 col-12">
              <div className="d-flex align-items-center mt-3">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  className="form-select w-125px h-33px rounded h-35px"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50" selected>
                    50
                  </option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  className="btn btn-linkedin btn-sm fw-500"
                  aria-controls="Search"
                  onClick={() => {
                    setCurPage(1);
                    setTriggerSearchData((prev: any) => !prev);
                  }}
                >
                  {t("Search")}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm fw-500"
                  id="kt_reset"
                  onClick={resetSearch}
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
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                  >
                    <TableHead>
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="firstName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.firstName}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="lastName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.lastName}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell className="min-w-150px w-150px">
                          <input
                            type="text"
                            name="requisitionType"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.requisitionType}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="order"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.order}
                            onChange={onInputChangeSearch}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="physicianName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.physicianName}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="npinumber"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.npinumber}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell className="min-w-150px w-150px">
                          <SearchDatePicker
                            name="dateOfCollection"
                            value={searchRequest.dateOfCollection}
                            onChange={onInputChangeSearch}
                          />
                        </TableCell>
                        <TableCell className="min-w-150px w-150px">
                          <input
                            type="time"
                            name="timeOfCollection"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder="Search ..."
                            value={searchRequest.timeOfCollection}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ width: "49px" }}>
                          <label className="form-check form-check-sm form-check-solid">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={handleAllSelect}
                              checked={
                                selectedBox.length === waitingSignature.length
                              }
                            />
                          </label>
                        </TableCell>
                        <TableCell className="min-w-50px w-50px">
                          {t("Actions")}
                        </TableCell>
                        <TableCell className="min-w-150px w-150px">
                          {t("Status")}
                        </TableCell>
                        <TableCell className="min-w-150px w-150px">
                          {t("First")}
                        </TableCell>
                        <TableCell className="min-w-150px w-150px">
                          {t("Last Name")}
                        </TableCell>
                        <TableCell className="min-w-125px w-125px">
                          {t("Requisition Type")}
                        </TableCell>
                        <TableCell className="min-w-125px w-125px">
                          {t("Record Id")}
                        </TableCell>
                        <TableCell className="min-w-150px w-150px max-w-150px">
                          {t("Physician Name")}
                        </TableCell>
                        <TableCell className="min-w-150px w-150px max-w-150px">
                          {t("NPI")}
                        </TableCell>
                        <TableCell className="min-w-125px w-125px">
                          {t("Date of Collection")}
                        </TableCell>
                        <TableCell className="min-w-125px w-125px">
                          {t("Time of Collection")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={12} className="p-20">
                          <Loader />
                        </TableCell>
                      ) : waitingSignature.length ? (
                        waitingSignature?.map((item: any) => (
                          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                            <TableCell>
                              <label className="form-check form-check-sm form-check-solid">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedBox?.includes(
                                    item?.requisitionOrderId
                                  )}
                                  onChange={(e) =>
                                    handleChangeRequisitionIds(
                                      e.target.checked,
                                      item.requisitionOrderId
                                    )
                                  }
                                />
                              </label>
                            </TableCell>
                            <TableCell>
                              <div className="d-flex justify-content-center">
                                <div className="rotatebtnn">
                                  <DropdownButton
                                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                    key="end"
                                    id="dropdown-button-drop-end"
                                    drop="end"
                                    title={
                                      <i className="bi bi-three-dots-vertical p-0"></i>
                                    }
                                  >
                                    <PermissionComponent
                                      moduleName="Requisition"
                                      pageName="Pending requisition"
                                      permissionIdentifier="View"
                                    >
                                      <Dropdown.Item eventKey="2">
                                        <span
                                          className="menu-item px-3"
                                          onClick={() =>
                                            window.open(
                                              `/OrderView/${btoa(
                                                item?.requisitionId
                                              )}/${btoa(
                                                item?.requisitionOrderId
                                              )}`,
                                              "_blank"
                                            )
                                          }
                                        >
                                          <i className="fa fa-eye text-success mr-2 w-20px"></i>
                                          {t("View")}
                                        </span>
                                      </Dropdown.Item>
                                    </PermissionComponent>
                                  </DropdownButton>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              id={`PendingRequisitionWaitingSignatureStatus_${item.RequisitionOrderId}`}
                              sx={{
                                width: "max-content",
                                textAlign: "center",
                              }}
                            >
                              <Status
                                cusText={item?.status}
                                cusClassName={
                                  item?.status === "Save For Signature"
                                    ? "badge-status-save-for-signature"
                                    : "badge-status-default"
                                }
                              />
                            </TableCell>
                            <TableCell>{item?.firstName}</TableCell>
                            <TableCell>{item?.lastName}</TableCell>
                            <TableCell>{item?.requisitionType}</TableCell>
                            <TableCell>{item?.order}</TableCell>
                            <TableCell>{item?.physicianName}</TableCell>
                            <TableCell>{item?.npinumber}</TableCell>
                            <TableCell>{item?.dateOfCollection}</TableCell>
                            <TableCell>
                              <div>{item?.timeOfCollection}</div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <NoRecord colSpan={12}/>
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
            <div className="col-lg-6 col-md-6 offset-md-3 col-sm-12 mt-5">
              <div style={{ backgroundColor: "#F3F6F9" }}>
                <SignaturePad
                  maxWidth={2}
                  penColor="black"
                  ref={signatureRef}
                  canvasProps={{
                    style: {
                      borderRadius: "4px",
                      width: "100%",
                      height: "170px",
                    },
                  }}
                />
              </div>
              <div className="d-flex align-items-center gap-2 gap-lg-3 mt-4">
                <PermissionComponent
                  moduleName="Requisition"
                  pageName="Pending requisition"
                  permissionIdentifier="Save"
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-sm fw-bold px-6 py-2"
                    onClick={handleSave}
                  >
                    {t("Save")}
                  </button>
                </PermissionComponent>

                <button
                  onClick={handleClear}
                  type="button"
                  className="btn btn-secondary btn-sm fw-bold px-6 py-2"
                >
                  {t("Clear")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Waiting;
