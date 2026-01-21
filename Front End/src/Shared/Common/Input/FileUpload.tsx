import { IconButton, Tooltip } from "@mui/material";
import { AxiosResponse } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { assignFormValues } from "../../../Utils/Auth";
import { isJson } from "../../../Utils/Common/Requisition";
import useLang from "./../../hooks/useLanguage";
import { base64ToBlob } from "./Document";

interface FileDetail {
  fileUrl: string;
  fileName: string;
  controlId: string;
}

const FileUpload: React.FC<any> = (props) => {
  const { t } = useLang();
  const [uploading, setUploading] = useState(false);
  
  // Transform API data to match component interface
  const transformFileData = (data: any[]): FileDetail[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      fileUrl: item.fileUrl || item.FileURL || "",
      fileName: item.fileName || item.FileName || "",
      controlId: item.controlId || props?.controlId || "",
    }));
  };
  
  const [imagesArray, setImagesArray] = useState<FileDetail[]>(
    isJson(props.defaultValue)
      ? transformFileData(JSON.parse(props.defaultValue))
      : transformFileData(props.defaultValue || [])
  );
  const location = useLocation();

  const uniqueControlId = useMemo(() => {
    return `${props?.controlId}-${Math.random().toString(36).substr(2, 9)}`;
  }, [props?.controlId]);

  const FindIndex = useCallback((arr: any[], rid: any) => {
    return arr.findIndex((i: any) => i.reqId === rid);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileName = file.name;
    const fileType = file.type;
    if (imagesArray.some((image) => image.fileName === fileName)) {
      toast.error(t("File with the same name already exists"));
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(fileType)) {
      toast.error(t("You can only upload PDF, JPG, PNG file types"));
      return;
    }
    const fileDetail: FileDetail = {
      fileUrl: "",
      fileName: fileName,
      controlId: props?.controlId,
    };

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res: AxiosResponse = await FacilityService.UploadResultsToBlob(
        formData
      );
      fileDetail.fileUrl = res.data.Data;
      setImagesArray((prev) => [...prev, fileDetail]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleImageDeselect = (fileName: string) => {
    setImagesArray((prev) =>
      prev.filter((image) => image.fileName !== fileName)
    );
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

  const renderedImages = useMemo(
    () =>
      Array.isArray(imagesArray) &&
      imagesArray?.map((filesData, index) => (
        <div key={index} className="border bg-light-secondary rounded p-2 my-3">
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div 
              id="DynamicFacilityFileUpload" 
              className="text-dark-65 flex-grow-1"
              style={{ 
                minWidth: 0,
                wordBreak: "break-word",
                overflowWrap: "break-word"
              }}
            >
              <span>{filesData?.fileName}</span>
            </div>
            <div className="d-flex align-items-center flex-shrink-0">
              <Tooltip title="Download File">
                <IconButton
                  id="DynamicFacilityDownloadButton"
                  aria-label="download"
                  color="success"
                  onClick={() =>
                    downloadFile(filesData.fileUrl, filesData?.fileName)
                  }
                >
                  <MdOutlineFileDownload />
                </IconButton>
              </Tooltip>
              <Tooltip title="Deselect File">
                <IconButton
                  id="DynamicFacilityCancelButton"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleImageDeselect(filesData?.fileName)}
                >
                  <RxCross2 />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      )),
    [imagesArray]
  );

  return (
    <>
      <div className="mt-3">
        <span className="fw-bold">{t(props?.label)}</span>
      </div>
      <div className="mt-3">
        <input
          type="file"
          multiple
          onChange={(e: any) => handleUpload(e)}
          id={uniqueControlId} // Use dynamically generated unique ID
          className="d-none"
        />
        <label
          htmlFor={uniqueControlId}
          id="kt_ecommerce_add_product_media"
          className="bg-light-primary px-4 py-2 rounded d-inline-flex align-items-center cursor-pointer"
        >
          <MdOutlineFileUpload style={{ fontSize: "25px", color: "green" }} />
          <span className="">{t("Upload File")}</span>
        </label>
      </div>

      {uploading ? (
        <h1>{t("Uploading ...")}</h1>
      ) : imagesArray.length > 0 ? (
        <>{renderedImages}</>
      ) : null}
    </>
  );
};

export default FileUpload;
