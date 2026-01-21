import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, IconButton, Button as MuiButton, Paper } from "@mui/material";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaRecycle } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { LoaderIcon } from "Shared/Icons";
import { savePdfUrls } from "../../../../Redux/Actions/Index";
import { isJson } from "../../../../Utils/Common/Requisition";
import { ConvertUTCTimeToLocal } from "../../../Facility/FacilityApproval/FacilityListExpandableTable";

const Files = (props: any) => {
  const xlabKey = useSelector((state: any) => state?.Reducer?.labKey);
  const [images, setImages] = useState<any>([]);
  const [path, setPath] = React.useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidFileFormat, setInvalidFileFormat] = useState(false);
  const allowedExtensions = ["csv", "xls", "xlsx", "pdf"];
  const dispatch = useDispatch();
  const [value, setValue] = React.useState("0");
  const { fieldsInfo } = props;
  const result = isJson(fieldsInfo.fieldName);
  let filesData = fieldsInfo.fieldName;
  if (result) {
    filesData = JSON.parse(filesData);
  }
  const parsedFieldValue = JSON.parse(fieldsInfo.fieldValue);

  // State for confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [currentTabId, setCurrentTabId] = useState(null);
  const [isDeleteAction, setIsDeleteAction] = useState(true);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleFileSelect = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setInvalidFileFormat(true);
        setImages([...images, ...e.target.files]);
      } else {
        setInvalidFileFormat(false);
        setImages([...images, ...e.target.files]);
      }
      e.target.value = "";
    }
  };

  const handleImageDeselect = (image: any) => {
    const _images = [...images];
    const index = _images.map((_) => _.name).indexOf(image.name);
    if (index > -1) {
      _images.splice(index, 1);
    }
    setImages([..._images]);
    setInvalidFileFormat(false);
  };
  const ShowBlob = (Url: string, fileName: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      const fileUrl = res?.data?.Data?.replace("}", "");

      if (!fileUrl) {
        console.error("No file URL found");
        return;
      }

      // Optional: Add extension if not present
      const urlParts = fileUrl.split("?");
      const path = urlParts[0]; // strip query params
      const extMatch = path.match(/\.(\w+)$/); // get extension like .pdf, .docx, etc.

      const extension = extMatch ? `.${extMatch[1]}` : "";
      const fullFileName = fileName.endsWith(extension)
        ? fileName
        : `${fileName}${extension}`;

      // Fetch and download with correct type and name
      fetch(fileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = fullFileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error("Download error:", error);
        });
    });
  };

  const handleFileDelete = async (fileId: any, tabId: any) => {
    setCurrentFileId(fileId);
    setCurrentTabId(tabId);
    setIsDeleteAction(true);
    setOpenDialog(true);
  };

  const handleFileRestore = async (fileId: any, tabId: any) => {
    setCurrentFileId(fileId);
    setCurrentTabId(tabId);
    setIsDeleteAction(false);
    setOpenDialog(true);
  };
  function handleClose() {
    setOpenDialog(false);
  }
  const confirmActionDelete = async () => {
    let obj = {
      requisitionId: props.RequisitionId,
      requisitionOrderId: props.RequisitionOrderId,
      files: [
        {
          fileId: currentFileId,
          note: "",
        },
      ],
    };
    await FacilityService.DeleteUploadedFile(obj)
      .then((res: AxiosResponse) => {
        if (res.data.status === 200) {
          toast.success(res.data.message);
          setOpenDialog(false);
          props.loadData();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const confirmActionRestore = async () => {
    let obj = {
      requisitionId: props.RequisitionId,
      requisitionOrderId: props.RequisitionOrderId,
      files: [
        {
          fileId: currentFileId,
          note: "",
        },
      ],
    };
    await FacilityService.RestoreUploadedFile(obj)
      .then((res: AxiosResponse) => {
        if (res.data.status === 200) {
          toast.success(res.data.message);
          setOpenDialog(false);
          props.loadData();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  const handleUpload = async () => {
    let obj: any = {};
    // Convert the FileList into an array and iterate
    let files = Array.from(images).map((file: any) => {
      // Define a new file reader
      let reader = new FileReader();
      // Create a new promise
      return new Promise((resolve) => {
        // Resolve the promise after reading file
        reader.onload = (event: any) => {
          const content = event.target.result;
          const byteArray = new Uint8Array(content);
          const byteRepresentation = Array.from(byteArray);
          const filename = file.name;
          const extension = filename.split(".").pop();
          obj = {
            name: filename,
            portalKey: xlabKey,
            fileType: file.type,
            extention: extension,
            content: byteRepresentation,
            isPublic: true,
          };
          resolve(obj);
        };
        reader.readAsArrayBuffer(file);
      });
    });
    // At this point you'll have an array of results
    let res = await Promise.all(files);
    await FacilityService.UploadFilesToBlobFormModel(res)
      .then((res: AxiosResponse) => {
        setPath(res?.data?.Data);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  const HandleUploadAll = async (fileSelectionType: string) => {
    let arrayMaker: any = [];
    const updatedImagesObjects = images.map((file: File, index: number) => ({
      fileName: file.name,
      file: file,
      fileURL: path[index],
    }));
    if (updatedImagesObjects) {
      updatedImagesObjects.forEach((file: any) => {
        let Obj = {
          fileName:
            file.fileName.substring(0, file.fileName.lastIndexOf(".")) ||
            file.fileName,
          fileURL: file.fileURL,
          requisitionId: props.RequisitionId,
          requisitionOrderId: props.RequisitionOrderId,
          typeOfFile: fileSelectionType,
          requisitionType: props.RequisitionType,
        };
        arrayMaker.push(Obj);
      });
      setIsSubmitting(true);
      await FacilityService.UploadFilesToOrderRequisition(arrayMaker)
        .then((res: AxiosResponse) => {
          if (res.data.status === 200) {
            toast.success(res.data.message);
            setIsSubmitting(false);
            props.loadData();
          }
        })
        .catch((err: AxiosError) => {
          console.error(err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const [otherDetail, setOtherDetail] = useState("");
  const [fileSelectionType, setFileSelectionType] = useState<
    "Result" | "Others"
  >("Result");
  const handleRadioSelection = (e: any, selection: "Result" | "Others") => {
    if (selection === "Result") {
      setFileSelectionType("Result");
    } else {
      setFileSelectionType("Others");
    }
  };

  const handleButtonClick = async () => {
    if (otherDetail === "" && fileSelectionType === "Others") {
      toast.error(t("Enter document type"));
      return;
    }
    await handleUpload();
  };

  const handleResendFax = async () => {
    await RequisitionType.resendFax(props.RequisitionOrderId)
      .then((res: AxiosResponse) => {
        if (res.data.httpStatusCode === 200) {
          toast.success(res.data.message);
          props.loadData();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (images.length) {
      HandleUploadAll(fileSelectionType);
    }
  }, [path]);

  return (
    <>
      {/* Confirmation Dialog */}
      <Modal
        show={openDialog}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            {isDeleteAction ? "Confirm Delete" : "Confirm Restore"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isDeleteAction
            ? "Are you sure to delete this file ?"
            : "Are you sure to restore this file ?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={
              isDeleteAction ? confirmActionDelete : confirmActionRestore
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="align-items-center d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between px-4 py-3 bg-gray-100 mb-3 rounded">
        <div className="page-title d-flex flex-column justify-content-end flex-wrap me-3">
          <div className="w-100">
            <label className="mb-2">Document Type:</label>
          </div>
          <div className="d-flex align-items-center mb-2">
            <input
              type="radio"
              className="form-check-input"
              id="file"
              name="uploadType"
              value="Result"
              onClick={(e) => handleRadioSelection(e, "Result")}
              defaultChecked
            />
            <label htmlFor="Result" className="ms-2 me-4">
              {t("Result")}
            </label>
            <input
              type="radio"
              className="form-check-input"
              id="Others"
              name="uploadType"
              value="Others"
              onClick={(e) => handleRadioSelection(e, "Others")}
            />
            <label htmlFor="Others" className="ms-2">
              {t("Others")}
            </label>
          </div>
          {fileSelectionType === "Others" ? (
            <input
              type="text"
              id="other-input"
              className="form-control mb-2"
              onChange={(e) => setOtherDetail(e.target.value)}
              placeholder={t("Enter document Type")}
            />
          ) : null}
          <div className="d-flex gap-2">
            <input
              type="file"
              onChange={handleFileSelect}
              id="upload-file"
              className="d-none"
              multiple
              // accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />

            <label
              htmlFor="upload-file"
              className="dropzone pt-2 py-1 px-8 d-flex align-items-center"
            >
              <div className="dz-message needsclick">{t("Choose File")}</div>
            </label>
            <div>
              <button
                onClick={handleButtonClick}
                disabled={images.length > 0 ? isSubmitting : true}
                className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
              >
                {isSubmitting && (
                  <>
                    <LoaderIcon />
                  </>
                )}
                {!isSubmitting && <i className="bi bi-upload"></i>}
              </button>
            </div>
          </div>
          {images.length > 0 ? (
            <>
              {images?.map((filesData: any) => (
                <>
                  <div className="col-lg-12 col-sm-12 col-md-12">
                    <div className="border bg-light-secondary rounded p-2 my-3">
                      <div className="d-flex justify-content-between">
                        <>
                          <div className="text-dark-65">
                            <span>{filesData?.name} & </span>
                            <br />
                          </div>
                          <div>
                            <span
                              style={{
                                fontSize: "13px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleImageDeselect(filesData)}
                            >
                              &#x2716;
                            </span>
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : null}
        </div>
      </div>
      <div className="mb-5 hover-scroll-x">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label={t("lab API tabs example")}
              className="min-h-auto"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons": {
                  width: 0,
                  transition: "width .7s ease",
                  "&:not(.Mui-disabled)": {
                    width: "48px",
                  },
                },
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
              <Tab label="Uploaded Files" value={"0"} />
              <Tab label="Deleted Files" value={"1"} />
            </TabList>
            <div className="card shadow-sm mb-3 rounded-top-0">
              <TabPanel value={"0"} sx={{ p: 0 }}>
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
                        <TableHead className="h-40px">
                          <TableRow>
                            <TableCell className="min-w-300px w-300px">
                              {t("File")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Document Type")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Date & Time")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Resend Result Fax")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Delete")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Download File")}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(parsedFieldValue) &&
                            parsedFieldValue?.map(
                              (p: any) =>
                                !p.IsDeleted && (
                                  <TableRow
                                    sx={{ "& > *": { borderBottom: "unset" } }}
                                  >
                                    <TableCell>
                                      <Link
                                        to={`/docs-viewer`}
                                        target="_blank"
                                        onClick={() => {
                                          dispatch(savePdfUrls(p.FileUrl));
                                        }}
                                      >
                                        {p.FileName}
                                      </Link>
                                    </TableCell>
                                    <TableCell>{p.TypeOfFile}</TableCell>
                                    <TableCell>
                                      {ConvertUTCTimeToLocal(p.CreatedDate)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {p.ResendFax ? (
                                        <MuiButton
                                          onClick={handleResendFax}
                                          variant="contained"
                                          sx={{
                                            backgroundColor: "green",
                                            "&:hover": {
                                              backgroundColor: "#006400",
                                            },
                                          }}
                                        >
                                          <FaRecycle size={18} />
                                        </MuiButton>
                                      ) : null}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <IconButton
                                        onClick={() =>
                                          handleFileDelete(p.FileId, 0)
                                        }
                                        aria-label="delete"
                                      >
                                        <MdDelete color="red" size={25} />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <IconButton
                                        onClick={() =>
                                          ShowBlob(p.FileUrl, p.FileName)
                                        }
                                        aria-label="download"
                                      >
                                        <IoMdDownload color="green" size={25} />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                )
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
              </TabPanel>
              <TabPanel value={"1"} sx={{ p: 0 }}>
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
                        <TableHead className="h-40px">
                          <TableRow>
                            <TableCell className="min-w-300px w-300px">
                              {t("File")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Document Type")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Date & Time")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Email")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Resend Result")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("SMS")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Restore")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Download File")}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Array.isArray(parsedFieldValue) &&
                            parsedFieldValue?.map(
                              (p: any) =>
                                p.IsDeleted && (
                                  <TableRow
                                    sx={{ "& > *": { borderBottom: "unset" } }}
                                  >
                                    <TableCell>
                                      <Link
                                        to={`/docs-viewer`}
                                        target="_blank"
                                        onClick={() => {
                                          dispatch(savePdfUrls(p.FileUrl));
                                        }}
                                      >
                                        {p.FileName}
                                      </Link>
                                    </TableCell>
                                    <TableCell>{p.TypeOfFile}</TableCell>
                                    <TableCell>
                                      {ConvertUTCTimeToLocal(p.CreatedDate)}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-center">
                                      <IconButton
                                        onClick={() =>
                                          handleFileRestore(p.FileId, 1)
                                        }
                                        aria-label="restore"
                                      >
                                        <TbRestore color="grey" size={25} />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <IconButton
                                        onClick={() =>
                                          ShowBlob(p.FileUrl, p.FileName)
                                        }
                                        aria-label="download"
                                      >
                                        <IoMdDownload color="green" size={25} />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                )
                            )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
              </TabPanel>
            </div>
          </TabContext>
        </Box>
      </div>
    </>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(Files);
