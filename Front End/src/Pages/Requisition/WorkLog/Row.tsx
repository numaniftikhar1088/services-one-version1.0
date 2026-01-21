import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { Dropdown, DropdownButton, Modal } from "react-bootstrap";
import Select from "react-select";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { savePhlebotomistsyAssignment } from "Services/Requisition/WorkLog";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon, CrossIcon, DoneIcon, RemoveICon } from "Shared/Icons";
import { reactSelectStyle, styles } from "Utils/Common";
import AddNewInputs from "./AddNewInputs";
import ExpandInfo from "./ExpandInfo";
import NoRecord from "Shared/Common/NoRecord";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface SpecimenType {
  specimenTypeId: number;
  specimenTypeName: string;
}

interface Test {
  requisitionTestID: number;
  testId: number;
  testName: string;
  specimenType: string;
  rejectReasonId: number | null;
}

interface DataRecollect {
  specimenTypes: SpecimenType[];
  tests: Test[];
}

interface Option {
  value: number;
  label: string;
}

function Row({
  item,
  columnsHeader,
  setBulkIds,
  bulkIds,
  inputFields,
  setRows,
  delayedCall,
  tabId,
  searchQuery,
}: any) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [openRecollect, setOpenRecollect] = useState(false);
  const [openReDraw, setOpenReDraw] = useState(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedBox, setSelectedBox] = useState<any>({
    ids: [],
  });
  const [cancellationReasonLookup, setCancellationReasonLookup] = useState<
    Option[]
  >([]);
  const [rejectedReasonLookup, setRejectedReasonLookup] = useState<Option[]>(
    []
  );
  const [dataRecollect, setDataRecollect] = useState<DataRecollect | undefined>(
    undefined
  );

  const handleIdsSelections = (id: number) => {
    setBulkIds((prevIds: number[]) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((existingId) => existingId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleRowRemove = () => {
    delayedCall();
  };

  // const getReCollectDataByReqOrderId = async () => {
  //   let response = await RequisitionType.getReCollectDataByReqOrderId(
  //     item.requisitionOrderId
  //   );
  //   if (response?.data?.data) {
  //     setDataRecollect(response?.data?.data);
  //   }
  // };

  const getCancellationReasonsLookup = async () => {
    let response = await RequisitionType.getCancellationReasonsLookup();
    setCancellationReasonLookup(response?.data);
  };
  const getRejectReasonTypesLookup = async () => {
    let response = await RequisitionType.getRejectReasonTypesLookup();
    setRejectedReasonLookup(response?.data);
  };

  const handleChange = (name: string, value: string, id: number) => {
    setRows((curr: any) =>
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

  const handleAllSelect = (checked: boolean, rows: any) => {
    setSelectAll(checked);
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.testId);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: [],
        };
      });
    }
  };

  const handleChangeSelectedIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: [...selectedBox.ids, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: selectedBox.ids.filter((item: any) => item !== id),
        };
      });
    }
  };

  const makeAPICALL = async () => {
    try {
      savePhlebotomistsyAssignment(item?.rowStatus ? item : searchQuery);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpen = () => {
    setOpenRecollect(true);
    // getReCollectDataByReqOrderId();
    getCancellationReasonsLookup();
    getRejectReasonTypesLookup();
  };

  const handleClickOpenReDrwaModal = () => {
    setOpenReDraw(true);
    // getReCollectDataByReqOrderId();
    getCancellationReasonsLookup();
    // getRejectReasonTypesLookup();
  };

  const handleClose = () => {
    setOpenRecollect(false);
  };

  const handleCloseReDrawModal = () => {
    setOpenReDraw(false);
  };

  return (
    <>
      <TableRow>
        {tabId === 0 || tabId === 1 ? (
          <TableCell className="w-20px min-w-20px">
            <span onClick={() => setOpen(!open)}>
              {open ? (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                  <RemoveICon />
                </button>
              ) : (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                  <AddIcon />
                </button>
              )}
            </span>
          </TableCell>
        ) : null}
        {tabId === 0 || tabId === 1 ? (
          <TableCell>
            <label className="form-check form-check-sm form-check-solid">
              <input
                type="checkbox"
                className="form-check-input"
                checked={bulkIds.includes(item.Id)}
                onChange={() => handleIdsSelections(item.Id)}
              />
            </label>
          </TableCell>
        ) : null}
        {!item.rowStatus ? (
          tabId === 0 || tabId === 1 || tabId === 2 || tabId === 4 ? (
            <TableCell className="min-w-50px w-50px">
              <div className="d-flex justify-content-center rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id="dropdown-button-drop-end"
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    {tabId === 0 || tabId === 1 ? (
                      <Dropdown.Item eventKey="1">
                        <button
                          role="link"
                          className="px-0 border-0 bg-transparent "
                        >
                          <i className="fa fa-eye text-success mr-2 w-20px"></i>
                          View
                        </button>
                      </Dropdown.Item>
                    ) : null}
                    {tabId === 0 ? (
                      <>
                        <Dropdown.Item
                          eventKey="2"
                          onClick={() => handleClickOpen()}
                        >
                          <div>
                            <i
                              className="fa fa-briefcase mr-2 w-20px"
                              style={{ color: "#2596be" }}
                            ></i>
                            Re-Collect
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey="3"
                          onClick={() => handleClickOpenReDrwaModal()}
                        >
                          <div>
                            <i className="fa fa-pen text-primary mr-2 w-20px"></i>
                            Re-Draw
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="4">
                          <div>
                            <i className="fa fa-times text-danger mr-2 w-20px"></i>
                            Cancel
                          </div>
                        </Dropdown.Item>
                      </>
                    ) : null}
                    {tabId === 2 || tabId === 4 ? (
                      <>
                        <Dropdown.Item eventKey="5">
                          <div>
                            {/* <i className="fa fa-edit text-warning mr-2 w-20px"></i> */}
                            Edit
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="6">
                          <div>
                            {/* <i className="fa fa-edit text-warning mr-2 w-20px"></i> */}
                            Delete
                          </div>
                        </Dropdown.Item>
                      </>
                    ) : null}
                  </>
                </DropdownButton>
              </div>
            </TableCell>
          ) : null
        ) : (
          <div className="gap-2 d-flex">
            <button
              onClick={() => makeAPICALL()}
              className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
            >
              <DoneIcon />
            </button>
            <button
              onClick={() => handleRowRemove()}
              className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
            >
              <CrossIcon />
            </button>
          </div>
        )}
        {columnsHeader?.map((column: any, columnHeaderIndex: number) =>
          column?.isShowOnUi && !column?.isExpandData && column.isShow ? (
            item.rowStatus ? (
              <AddNewInputs
                item={item}
                column={column}
                columnHeaderIndex={columnHeaderIndex}
                inputFields={inputFields}
                handleInputsChange={handleChange}
              />
            ) : (
              <TableCell>
                {column?.columnKey === "createdDate"
                  ? moment(item?.[column?.columnKey], "YYYY-MM-DD").format(
                      "MM-DD-YYYY"
                    )
                  : item?.[column?.columnKey] || ""}
              </TableCell>
            )
          ) : null
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                    <ExpandInfo reqOrderId={item.requisitionOrderId} />
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal
        show={openRecollect}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton className="m-0 p-5">
          <h4>{t("Re-Collect Sample")}</h4>
        </Modal.Header>
        <Modal.Body>
          <div style={{ backgroundColor: "#FAFAD2" }} className="rounded">
            <p className="px-4 py-2 fw-bold">
              {t(
                "Note: Please select the specimen(s) you have collected and leave the specimen(s) you have NOT collected blank."
              )}
            </p>
          </div>
          <p className="fw-bold">{t("Speciment Type")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <label className="d-flex justify-content-start align-items-start flex-wrap gap-3">
              {dataRecollect?.specimenTypes.map((specimenType: any) => (
                <div key={specimenType.specimenTypeId}>
                  <input
                    className="form-check-input"
                    type="radio"
                    // value={resultType}
                    name="specimenTypeId"
                    // onChange={(e: any) => handleonChange(specimenType.specimenTypeId)}
                  />
                  <span className="ps-2 mr-2">
                    {specimenType.specimenTypeName}
                  </span>
                </div>
              ))}
            </label>
          </div>
          <p className="fw-bold">{t("Cancellation Reason For All")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <Select
              menuPortalTarget={document.body}
              theme={(theme: any) => styles(theme)}
              options={cancellationReasonLookup}
              styles={reactSelectStyle}
              name="cancellationReason"
              placeholder="--- Select ---"
              // onChange={(event: any) =>
              //   handleChange(index, "gender", "" + event.value)
              // }
              // value={genderOptions.filter(
              //   (gender: any) => gender.value == section.gender
              // )}
              isSearchable={true}
              className="w-100"
            />
          </div>
          <p className="fw-bold">{t("Add Comments")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <input
              type="text"
              className="form-control bg-transparent"
              name="cancellationComment"
              // value={section.comments}
              // onChange={(event: any) =>
              //   handleChange(index, "comments", event.target.value)
              // }
            />
          </div>
          <p className="fw-bold">{t("Select Date")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <input
              type="date"
              className="form-control bg-transparent"
              name="cancellationComment"
              // value={section.comments}
              // onChange={(event: any) =>
              //   handleChange(index, "comments", event.target.value)
              // }
            />
          </div>
          <div className="align-items-center card-header d-flex justify-content-center justify-content-sm-between gap-1 mt-5 pb-5">
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
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header plate-mapping-table table-bg table-head-custom table-vertical-center border-0 mb-0 "
                  >
                    <TableHead style={{ zIndex: 0 }}>
                      <TableRow className="h-40px">
                        <TableCell className="w-20px min-w-20px">
                          <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={(e: any) =>
                                handleAllSelect(
                                  e.target.checked,
                                  dataRecollect?.tests
                                )
                              }
                              checked={selectAll}
                            />
                          </label>
                        </TableCell>
                        <TableCell className="w-50">{t("Test Name")}</TableCell>
                        <TableCell>{t("Specimen Type")}</TableCell>
                        <TableCell>{t("Rejected Reason")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataRecollect?.tests?.length ? (
                        dataRecollect?.tests?.map((item: any) => (
                          <TableRow className="h-40px">
                            <TableCell>
                              <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedBox?.ids?.includes(
                                    item?.testId
                                  )}
                                  onChange={(e) =>
                                    handleChangeSelectedIds(
                                      e.target.checked,
                                      item.testId
                                    )
                                  }
                                />
                              </label>
                            </TableCell>
                            <TableCell>{item?.testName}</TableCell>
                            <TableCell>{item?.specimenType}</TableCell>
                            <TableCell>
                              <Select
                                menuPortalTarget={document.body}
                                theme={(theme: any) => styles(theme)}
                                options={rejectedReasonLookup}
                                styles={reactSelectStyle}
                                name="cancellationReason"
                                placeholder="--- Select ---"
                                // onChange={(event: any) =>
                                //   handleChange(index, "gender", "" + event.value)
                                // }
                                // value={genderOptions.filter(
                                //   (gender: any) => gender.value == section.gender
                                // )}
                                isSearchable={true}
                                className="w-100"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <NoRecord />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              handleClose();
              // DeletebyId(value);
            }}
          >
            {t("Save")}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={openReDraw}
        onHide={handleCloseReDrawModal}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton className="m-0 p-5">
          <h4>{t("Re-Draw Sample")}</h4>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold">{t("Re-Draw Reason For All")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <Select
              menuPortalTarget={document.body}
              theme={(theme: any) => styles(theme)}
              options={cancellationReasonLookup}
              styles={reactSelectStyle}
              name="cancellationReason"
              placeholder="--- Select ---"
              // onChange={(event: any) =>
              //   handleChange(index, "gender", "" + event.value)
              // }
              // value={genderOptions.filter(
              //   (gender: any) => gender.value == section.gender
              // )}
              isSearchable={true}
              className="w-100"
            />
          </div>
          <p className="fw-bold">{t("Add Comments")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <input
              type="text"
              className="form-control bg-transparent"
              name="cancellationComment"
              placeholder="..."
              // value={section.comments}
              // onChange={(event: any) =>
              //   handleChange(index, "comments", event.target.value)
              // }
            />
          </div>
          <p className="fw-bold">{t("Select Date")}</p>
          <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
            <input
              type="date"
              className="form-control bg-transparent"
              name="cancellationComment"
              // value={section.comments}
              // onChange={(event: any) =>
              //   handleChange(index, "comments", event.target.value)
              // }
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleCloseReDrawModal}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              handleCloseReDrawModal();
              // DeletebyId(value);
            }}
          >
            {t("Save")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Row;
