import { Fade, IconButton, Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { assignFormValues } from "Utils/Auth";
import { FindIndex } from "Utils/Common/CommonMethods";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import useLang from "./../../hooks/useLanguage";

interface FileDetail {
  fileUrl: string;
  fileName: string;
  controlId: string;
}

const Document: React.FC<any> = (props) => {
  const { t } = useLang();
  const [uploading, setUploading] = useState(false);
  const [imagesArray, setImagesArray] = useState<FileDetail[]>(() => {
    try {
      return JSON.parse(props.defaultValue || "[]");
    } catch (error) {
      console.error("Failed to parse defaultValue:", error);
      return [];
    }
  });

  const location = useLocation();
  const uniqueControlId = useMemo(
    () => `${props.controlId}-${Math.random().toString(36).substr(2, 9)}`,
    [props.controlId]
  );
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      if (imagesArray.length + files.length > 10) {
        toast.error(t("You can upload up to 10 files."))
        return;
      }

      // Updated allowed extensions including PNG
      const allowedExtensions = [
        ".pdf",
        ".docx",
        ".docm",
        ".csv",
        ".xlsx",
        ".jpg",
        ".jpeg",
        ".png", // ← Added PNG
      ];

      for (const file of files) {
        // File size check
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size should not exceed 10 MB.");
          continue;
        }

        // Get extension safely
        const fileExtension = file.name.lastIndexOf(".") !== -1
          ? "." + file.name.split(".").pop()?.toLowerCase()
          : "";

        if (!allowedExtensions.includes(fileExtension)) {
          toast.error(
            "Valid file types: PDF, DOCX, CSV, XLSX, JPG, JPEG, PNG only."
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
          const res = await FacilityService.UploadResultsToBlob(formData);
          const newFileDetail: FileDetail = {
            fileUrl: res.data.Data,
            fileName: file.name,
            controlId: uniqueControlId,
          };
          setImagesArray((prev) => [...prev, newFileDetail]);
        } catch (err) {
          console.error("Upload error:", err);
          toast.error("Failed to upload " + file.name);
        } finally {
          setUploading(false);
        }
      }
      e.target.value = ""; // Reset input
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

  useEffect(() => {
    let newInputs = assignFormValues(
      props?.Inputs,
      props?.index,
      props?.depControlIndex,
      props?.fieldIndex,
      imagesArray,
      props?.isDependency,
      props?.repeatFieldSection,
      props?.isDependencyRepeatFields,
      props?.repeatFieldIndex,
      props?.repeatDependencySectionIndex,
      props?.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );
    newInputs.then((res: any) => {
      if (!location?.state?.reqId) {
        if (!location?.state?.reqId && props.ArrayReqId) {
          const infectiousDataCopy = [...props?.infectiousData];
          infectiousDataCopy[
            FindIndex(infectiousDataCopy, props?.ArrayReqId)
          ].sections = res;
          props?.setInfectiousData &&
            props?.setInfectiousData([...infectiousDataCopy]);
        } else {
          props?.setInputs(res);
        }
      }
    });
  }, [imagesArray]);

  const RenderedImages = ({
    imagesArray,
    setImagesArray,
    downloadFile,
  }: any) => {
    const [deletingFile, setDeletingFile] = useState<FileDetail | null>(null);

    const handleImageDeselect = (fileToRemove: FileDetail) => {
      setDeletingFile(fileToRemove);
      setTimeout(() => {
        setImagesArray((prev: FileDetail[]) =>
          prev.filter(
            (image) =>
              image.fileName !== fileToRemove.fileName ||
              image.fileUrl !== fileToRemove.fileUrl
          )
        );
        setDeletingFile(null);
      }, 500);
    };

    return imagesArray.map((file: any, index: number) => (
      <Fade
        in={!deletingFile || deletingFile.fileUrl !== file.fileUrl}
        timeout={{ enter: 300, exit: 500 }}
        key={index}
      >
        <div key={index} className="border bg-light-secondary rounded mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-dark-65">{file.fileName}</div>
            <div className="d-flex gap-2">
              <Tooltip title="Download File">
                <IconButton
                  aria-label="download"
                  color="success"
                  onClick={() => downloadFile(file.fileUrl, file?.fileName)}
                >
                  <MdOutlineFileDownload />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deselect File">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleImageDeselect(file)}
                >
                  <RxCross2 />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Fade>
    ));
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        onChange={handleUpload}
        multiple
        id="upload-file"
        className="d-none"
        accept=".pdf,.docx,.docm,.csv,.xlsx,.jpg,.jpeg,.png"
        disabled={uploading}
      />
      <label
        htmlFor="upload-file"
        className="dropzone"
        style={{
          pointerEvents: uploading ? "none" : "all",
          opacity: uploading ? "0.5" : "1",
        }}
      >
        <div className="dz-message needsclick">
          <i className="bi bi-file-earmark-arrow-up text-primary fs-3x"></i>
          <div className="ms-4">
            <h3 className="fs-5 fw-bold text-gray-900 mb-1">
              {t("Drop files here or click to upload.")}
            </h3>
            <span className="fs-7 text-gray-400">
              {t("Upload up to 10 files.")}
            </span>
          </div>
        </div>
      </label>
      {uploading ? (
        <Skeleton
          className="border bg-light-secondary rounded mt-2 d-flex justify-content-center align-items-center"
          variant="rectangular"
          animation="pulse"
          height={40}
          width={"100%"}
          style={{ fontWeight: "bold" }}
        >
          Uploading...
        </Skeleton>
      ) : null}
      <RenderedImages
        imagesArray={imagesArray}
        setImagesArray={setImagesArray}
        downloadFile={downloadFile}
      />
    </div>
  );
};

export default Document;

export function base64ToBlob(base64: string, contentType = "") {
  const sliceSize = 512;
  const byteCharacters = atob(base64);
  const byteArrays = [];
  let offset = 0;
  while (offset < byteCharacters.length) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
    offset += sliceSize;
  }
  return new Blob(byteArrays, { type: contentType });
}
