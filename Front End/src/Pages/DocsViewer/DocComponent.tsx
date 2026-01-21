import CircularProgress from "@mui/material/CircularProgress";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import React, { useEffect, useState } from "react";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";

const DocComponent = ({ pdfUrl }: any) => {
  const zoomPluginInstance = zoomPlugin();

  const [fileDataUrl, setFileDataUrl] = useState<any>(null);
  const [fileType, setFileType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFileData = async () => {
      setIsLoading(true);
      try {
        const response = await RequisitionType.ShowBlobInViewer(pdfUrl);
        const fileData = response?.data?.Data;
        const uri = fileData[0]?.uri;

        if (pdfUrl.endsWith(".pdf")) {
          setFileType("pdf");
        } else if (pdfUrl.match(/\.(jpg|jpeg|png)$/i)) {
          setFileType("image");
        }
        setFileDataUrl(uri);
      } catch (error) {
        console.error("Error fetching file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pdfUrl) {
      fetchFileData();
    }
  }, [pdfUrl]);

  if (!pdfUrl) return null;

  const renderViewer = () => {
    switch (fileType) {
      case "pdf":
        return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={fileDataUrl} plugins={[zoomPluginInstance]} />
          </Worker>
        );
      case "image":
        return (
          <img
            src={fileDataUrl}
            alt="Document"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );
      default:
        return <p>No document loaded</p>;
    }
  };

  return (
    <div style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      {isLoading ? (
        <div
          style={{ width: "300px", height: "200px" }}
          className="d-flex justify-content-center align-items-center"
        >
          <CircularProgress color="inherit" />;
        </div>
      ) : (
        <div style={{ width: "300px", height: "200px" }}>{renderViewer()}</div>
      )}
    </div>
  );
};

export default React.memo(DocComponent);
