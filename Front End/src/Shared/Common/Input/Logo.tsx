import { Avatar, IconButton, Tooltip } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
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

const BlobAvatar: React.FC<{
  fileUrl?: string;
  localPreview?: string | null;
  onAvatarClick: () => void;
}> = ({ fileUrl, localPreview, onAvatarClick }) => {
  const [preview, setPreview] = useState<string | null>(localPreview || null);

  useEffect(() => {
    if (!fileUrl && !localPreview) {
      setPreview(null);
      return;
    }

    if (localPreview) {
      setPreview(localPreview);
      return;
    }

    const fetchBlob = async () => {
      if (fileUrl) {
        try {
          const res = await RequisitionType.ShowBlob(fileUrl);
          setPreview(res?.data?.Data || null);
        } catch (err) {
          console.error("Failed to load blob preview", err);
          setPreview(null);
        }
      }
    };

    fetchBlob();
  }, [fileUrl, localPreview]);

  return (
    <div onClick={onAvatarClick} className="d-flex align-items-end">
      <Avatar
        src={preview || undefined}
        sx={{
          width: 64,
          height: 64,
          cursor: "pointer",
          bgcolor: "#e0e0e0",
          border: preview ? "1px solid black" : 0,
        }}
      />
      {preview ? null : (
        <div
          style={{
            zIndex: 100,
            marginLeft: -15,
            borderRadius: "50%",
            border: "3px solid white",
          }}
        >
          <FaCirclePlus size={20} />
        </div>
      )}
    </div>
  );
};

const LogoUpload: React.FC<any> = (props) => {
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<FileDetail | null>(() => {
    const parsed = isJson(props.defaultValue)
      ? JSON.parse(props.defaultValue)
      : props.defaultValue;
    return Array.isArray(parsed) && parsed.length ? parsed[0] : null;
  });

  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const uniqueControlId = useMemo(() => {
    return `${props?.controlId}-${Math.random().toString(36).substr(2, 9)}`;
  }, [props?.controlId]);

  const FindIndex = useCallback((arr: any[], rid: any) => {
    return arr.findIndex((i: any) => i.reqId === rid);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear any existing preview
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }

    const fileName = file.name;
    const fileType = file.type;

    if (!fileType.startsWith("image/")) {
      toast.error(t("Only image files (jpg, png, etc) are allowed"));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await FacilityService.UploadResultsToBlob(formData);
      const fileDetail: FileDetail = {
        fileUrl: res.data.Data,
        fileName,
        controlId: props?.controlId,
      };
      setImageFile(fileDetail);
    } catch (err) {
      console.error(err);
      toast.error(t("Upload failed"));
      // Clean up preview on failure
      URL.revokeObjectURL(previewUrl);
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setLocalPreview(null);
  };

  const downloadFile = async (filePath: string, filename: string) => {
    try {
      const response = await FacilityService.DownloadBlob({ path: filePath });
      const { Content, Extension } = response.data;
      const blob = base64ToBlob(Content, `application/octet-stream`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename.split(".")[0]}${Extension}`;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error.response?.status === 500) {
        toast.error("Internal Server Error");
      }
    }
  };

  useEffect(() => {
    let newInputs = assignFormValues(
      props?.Inputs,
      props?.index,
      props?.depControlIndex,
      props?.fieldIndex,
      imageFile ? [imageFile] : [],
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
      if (!location?.state?.reqId && props.ArrayReqId) {
        const infectiousDataCopy = [...props?.infectiousData];
        infectiousDataCopy[
          FindIndex(infectiousDataCopy, props?.ArrayReqId)
        ].sections = res;
        props?.setInfectiousData?.([...infectiousDataCopy]);
      } else {
        props?.setInputs(res);
      }
    });
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  return (
    <div
      className={
        props?.parentDivClassName
          ? `${props?.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <span className={props?.labelClassName}>{t(props?.label)}</span>
      <div className="mt-1 d-flex align-items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          ref={fileInputRef}
          className="d-none"
          id={uniqueControlId}
        />
        <BlobAvatar
          fileUrl={imageFile?.fileUrl}
          localPreview={localPreview}
          onAvatarClick={() => fileInputRef.current?.click()}
        />
        {imageFile && (
          <>
            <Tooltip title={t("Download")}>
              <IconButton
                color="success"
                onClick={() =>
                  downloadFile(imageFile.fileUrl, imageFile.fileName)
                }
              >
                <MdOutlineFileDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("Remove")}>
              <IconButton color="error" onClick={handleImageRemove}>
                <RxCross2 />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
      {uploading && <p className="text-muted mt-2">{t("Uploading...")}</p>}
    </div>
  );
};

export default React.memo(LogoUpload);
