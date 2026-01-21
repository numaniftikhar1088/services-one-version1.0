import {
  Fade,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { IoTrash } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { savePdfUrls } from "Redux/Actions/Index";
import FacilityService from "Services/FacilityService/FacilityService";
import PatientService from "Services/PatientService/PatientService";
import { base64ToBlob } from "Shared/Common/Input/Document";
import useLang from "Shared/hooks/useLanguage";
import { LoaderIcon } from "Shared/Icons";
import { assignFormValues } from "Utils/Auth";
import { isJson } from "Utils/Common/Requisition";
// import { base64ToBlob } from "../"

function ChooseFileUpload(props: any) {
  const { data } = props;

  const { t } = useLang();
  const dispatch = useDispatch();

  const location = useLocation();
  const parts = location.pathname.split("/view-patient-demographics-patient/");
  const InnerParts = parts[1].split("/");
  const patient_id = atob(InnerParts[0]);

  const [uploading, setUploading] = useState<Boolean>(false);
  const [deletingFile, setDeletingFile] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [filesArray, setFilesArray] = useState<any>(() => {
    try {
      return JSON.parse(data?.defaultValue || "[]");
    } catch (error) {
      console.error("Failed to parse defaultValue:", error);
      return [];
    }
  });

  const xlabKey = useSelector((state: any) => state?.Reducer?.labKey);

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // setDisabled(true);
    if (e.target.files && e.target.files.length > 0) {
      // setDisabled(false);
      const files = Array.from(e.target.files);

      // Check max number of files
      if (filesArray.length + files.length > 10) {
        toast.error(t("You can upload up to 10 files."));
        return;
      }

      for (const file of files) {
        // Check file size
        if (file.size > 10 * 1024 * 1024) {
          toast.error(t("File size should not exceed 10 MB."));
          continue;
        }

        // Check file extension
        const allowedExtensions = [".pdf", ".png", ".jpeg"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (!allowedExtensions.includes(`.${fileExtension}`)) {
          toast.error(
            t("Valid file extensions are *.pdf, .png, and .jpeg* only.")
          );
          continue;
        }
        setSelectedFiles((prevFiles: any) => [...prevFiles, file]);
      }
      e.target.value = "";
    }
  };

  const FileUpload = async () => {
    try {
      // Step 1: Read all files and prepare data
      const filePromises = Array.from(selectedFiles).map((file: any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (event: any) => {
            const content = event.target.result;
            const byteArray = new Uint8Array(content);
            const byteRepresentation = Array.from(byteArray);
            const filename = file.name;
            const extension = filename.split(".").pop();

            resolve({
              name: filename,
              portalKey: xlabKey,
              fileType: file.type,
              extention: extension,
              content: byteRepresentation,
              isPublic: true,
            });
          };

          reader.onerror = () =>
            reject(new Error(`Failed to read file: ${file.name}`));
          reader.readAsArrayBuffer(file);
        });
      });

      const filesData = await Promise.all(filePromises);

      // Step 2: Upload files to blob storage
      const uploadResponse =
        await FacilityService.UploadFilesToBlobFormModel(filesData);

      if (uploadResponse.data.Status !== 200) {
        throw new Error("Failed to upload files to blob storage");
      }

      // Step 3: Prepare patient files data
      const patientFiles = selectedFiles.map((file: File, index: number) => ({
        id: "",
        name: file.name,
        fileType: "General",
        filePath: uploadResponse.data.Data[index],
        parentID: parseInt(patient_id),
        length: null,
        contentType: file.type, // Use actual file type instead of hardcoded
        status: "Active",
      }));

      // Step 4: Upload to patient view
      const patientResponse =
        await PatientService.UploadFilesPatientView(patientFiles);

      if (patientResponse.data.statusCode === 201) {
        toast.success(patientResponse.data.message);
        props.loadData(); // Uncomment if needed
      } else {
        toast.error("Failed to save files to patient records");
      }
    } catch (err) {
      console.error("File upload error:", err);
      toast.error("An error occurred during file upload");
    }
  };

  const downloadFile = async (filePath: any, filename: any) => {
    let name = filename.split(".");

    try {
      const response = await FacilityService.DownloadBlob({
        path: filePath,
      });
      const { Content, Extension, FileName } = response.data;
      const blob = base64ToBlob(Content, `application/octet-stream`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name[0]}${Extension}`;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error.response.status === 500) {
        toast.error(`Interval Server Error`);
      }
    }
  };

  const handleDelete = async (fileToDelete: any) => {
    let obj = {
      id: fileToDelete.id,
      fileType: fileToDelete.fileType,
      action: "Delete",
    };
    await PatientService.DeleteUploadedFile(obj)
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.message);
          props.loadData();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  const handleSelectedFilesDeselected = (fileToRemove: any) => {
    setDeletingFile(fileToRemove);
    setTimeout(() => {
      setSelectedFiles((prev: any) =>
        prev.filter((image: any) => image.name !== fileToRemove.name)
      );
      setDeletingFile(null);
    }, 500);
  };

  return (
    <>
      <div className="d-flex gap-2 mb-5">
        <input
          id={`IDResultFileUploadFileInput`}
          multiple
          type="file"
          onChange={handleChangeFile}
          className="d-none"
          accept=".pdf, .png, .jpeg"
        />

        <label
          htmlFor="IDResultFileUploadFileInput"
          className="dropzone pt-2 py-1 px-8 d-flex align-items-center"
        >
          <div className="dz-message needsclick">{t("Choose File")}</div>
        </label>
        <div>
          <button
            id={`IDResultFileUploadFileButton`}
            onClick={() => FileUpload()}
            disabled={selectedFiles.length > 0 ? false : true}
            className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
          >
            {uploading && (
              <>
                <LoaderIcon />
              </>
            )}
            {!uploading && <i className="bi bi-upload"></i>}
          </button>
        </div>
      </div>
      {selectedFiles.map((file: any, index: number) => (
        <Fade
          in={!deletingFile || deletingFile.fileUrl !== file.fileUrl}
          timeout={{ enter: 300, exit: 500 }}
          key={index}
        >
          <div key={index} className="border bg-light-secondary rounded mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-dark-65 px-2">{file.name}</div>
              <div className="d-flex gap-2">
                <Tooltip title="Delete File">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleSelectedFilesDeselected(file)}
                  >
                    <RxCross2 />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </Fade>
      ))}
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
            className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
          >
            <TableHead style={{ zIndex: 0 }}>
              <TableRow className="h-45px">
                {isJson(data?.fieldConfiguration)
                  ? JSON.parse(data?.fieldConfiguration)?.PatientDocument?.map(
                      (item: any) => (
                        <TableCell key={item?.SortOrder}>
                          {t(item?.FieldHeader)}
                        </TableCell>
                      )
                    )
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {filesArray?.map((row: any) => (
                <TableRow key={row?.id} className="h-40px">
                  {JSON.parse(data.fieldConfiguration).PatientDocument.map(
                    (col: any) => {
                      const value = row[col.FieldName];

                      // 👉 Handle special field types
                      if (col.FieldType === "Clickable") {
                        return (
                          <TableCell key={col.SortOrder}>
                            <Link to={`/docs-viewer`} target="_blank">
                              <span
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  dispatch(savePdfUrls(row.fileUrl));
                                }}
                              >
                                {value}
                              </span>
                            </Link>
                          </TableCell>
                        );
                      }

                      if (col.FieldType === "DeleteButton") {
                        return (
                          <TableCell
                            key={col.SortOrder}
                            className="d-flex justify-content-center align-items-center"
                          >
                            <Tooltip title="Deselect File">
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => handleDelete(row)}
                              >
                                <IoTrash />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      }

                      if (col.FieldType === "DownloadButton") {
                        return (
                          <TableCell
                            key={col.SortOrder}
                            className="text-center"
                          >
                            <Tooltip title="Download File">
                              <IconButton
                                aria-label="download"
                                color="success"
                                onClick={() =>
                                  downloadFile(row.fileUrl, row?.fileName)
                                }
                              >
                                <MdOutlineFileDownload />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      }

                      // 👉 Default cell
                      return <TableCell key={col.SortOrder}>{value}</TableCell>;
                    }
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ChooseFileUpload;
