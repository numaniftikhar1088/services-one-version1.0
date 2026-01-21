import DocViewer from "@cyntler/react-doc-viewer";
import { Button, CircularProgress } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { PDFDocument } from "pdf-lib";
import "pdfjs-dist/web/pdf_viewer.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { useSelector } from "react-redux";
import { ShowBlobInViewerV2 } from "../../Services/Requisition/RequisitionTypeService";
import { Decrypt, Encrypt } from "../../Utils/Auth";

type FileData = {
  uri: string;
  fileType: string;
  fileName?: string;
};

type MergeStatus = "idle" | "merging" | "completed" | "error";

// Individual PDF Viewer Component with lazy loading
const LazyPDFViewer: React.FC<{
  fileData: FileData;
  index: number;
  currentScale: number;
}> = ({ fileData, index, currentScale }) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create individual zoom plugin for this viewer
  const zoomPluginInstance = zoomPlugin();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsInView(true);
          setIsLoaded(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before coming into view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded]);

  return (
    <div ref={containerRef} style={{ marginBottom: "20px" }}>
      {isInView ? (
        <div
          style={{
            border: "1px solid #ddd",
            overflow: "visible",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              defaultScale={currentScale}
              plugins={[zoomPluginInstance]}
              fileUrl={fileData.uri}
              onDocumentLoad={() => console.log(`PDF ${index + 1} loaded`)}
            />
          </Worker>
        </div>
      ) : (
        <div
          style={{
            height: "600px",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <CircularProgress size={24} />
            <p style={{ marginTop: "10px", color: "#666" }}>Loading PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const DocsViewer = () => {
  const [fileApiData, setFileApiData] = useState<FileData[]>([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergeStatus, setMergeStatus] = useState<MergeStatus>("idle");
  const [mergeProgress, setMergeProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [nonPdfFiles, setNonPdfFiles] = useState<any[]>([]);
  const [currentScale, setCurrentScale] = useState(1); // Add scale state
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Add initial loading state

  const urls = useSelector((state: any) => state.Reducer.pdfurls);
  // const xPortalKey = useSelector((state: any) => state.Reducer.labKey);

  const componentRef = useRef<any>();

  // Custom zoom functions
  const handleZoomIn = () => {
    setCurrentScale((prevScale) => Math.min(prevScale + 0.2, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setCurrentScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Min zoom 0.5x
  };

  // Background PDF merging function
  const mergePdfsInBackground = useCallback(async (pdfFiles: FileData[]) => {
    if (pdfFiles.length < 1) return;

    setMergeStatus("merging");
    setMergeProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < pdfFiles.length; i++) {
        try {
          const response = await fetch(pdfFiles[i].uri);
          const pdfBytes = await response.arrayBuffer();
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const copiedPages = await mergedPdf.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
          );
          copiedPages.forEach((page: any) => mergedPdf.addPage(page));

          // Update progress
          setMergeProgress(((i + 1) / pdfFiles.length) * 100);
        } catch (error) {
          console.error(`Error processing PDF ${i + 1}:`, error);
        }
      }

      const mergedPdfBytes: any = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      setMergeStatus("completed");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      setMergeStatus("error");
    }
  }, []);

  useEffect(() => {
    const showFileInViewer = async (fileUrl: string[]) => {
      try {
        const res = await ShowBlobInViewerV2(fileUrl);
        const fileData = res?.data?.Data;

        if (!fileData || fileData.length === 0) {
          setIsInitialLoading(false);
          return;
        }

        const pdfFiles = fileData.filter(
          (file: FileData) => file.fileType === "pdf"
        );
        const imageFiles = fileData.filter((file: FileData) =>
          file.fileType.match(/\.(jpg|jpeg|png)$/i)
        );
        const otherFiles = fileData.filter(
          (file: FileData) =>
            !file.fileType.match(/^pdf$/) &&
            !file.fileType.match(/\.(jpg|jpeg|png)$/i)
        );

        setFileApiData(fileData);

        // Handle different file types
        if (pdfFiles.length > 0) {
          // Start background merging if multiple PDFs
          if (pdfFiles.length >= 1) {
            mergePdfsInBackground(pdfFiles);
          }
        }

        if (imageFiles.length > 0) {
          setImageUrl(imageFiles[0]?.uri);
        }

        if (otherFiles.length > 0) {
          setNonPdfFiles(otherFiles);
        }

        setIsInitialLoading(false);
      } catch (error) {
        console.error("Error fetching file:", error);
        setIsInitialLoading(false);
      }
    };

    const PdfUriLink = sessionStorage.getItem("pdfUriLink");
    const uri = PdfUriLink && Decrypt(PdfUriLink);
    const urlParsed = JSON.parse(uri || "[]");
    const isArray = Array.isArray(urlParsed);

    const uriArray = uri ? (isArray ? urlParsed : [urlParsed]) : [];
    if (uri) {
      showFileInViewer(uriArray);
    } else {
      const stringifyUrls = JSON.stringify(urls);
      const encryptedUrls = Encrypt(stringifyUrls);

      sessionStorage.setItem("pdfUriLink", encryptedUrls);
      showFileInViewer(Array.isArray(urls) ? urls : [urls]);
    }
  }, [urls, mergePdfsInBackground]);

  const handleDownloadMerged = () => {
    if (!mergedPdfUrl) return;

    const link = document.createElement("a");
    link.href = mergedPdfUrl;

    const getFormattedDate = () => {
      const date = new Date();
      return date.toISOString().split("T")[0];
    };

    link.download = `merged_documents_${getFormattedDate()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadIndividual = (file: FileData, index: number) => {
    const link = document.createElement("a");
    link.href = file.uri;

    const getFormattedDate = () => {
      const date = new Date();
      return date.toISOString().split("T")[0];
    };

    const fileName = file.fileName || `document_${index + 1}`;
    const baseName = fileName.split(".")[0];
    link.download = `${baseName}_${getFormattedDate()}.${file.fileType}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pdfFiles = fileApiData.filter((file) => file.fileType === "pdf");
  const hasMultiplePdfs = pdfFiles.length > 1;

  const renderViewer = () => {
    // Show initial loader
    if (isInitialLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <CircularProgress size={40} />
            <p style={{ marginTop: "20px", color: "#666", fontSize: "16px" }}>
              Loading documents...
            </p>
          </div>
        </div>
      );
    }

    // Render PDFs
    if (pdfFiles.length > 0) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {pdfFiles.map((pdfFile, index) => (
            <LazyPDFViewer
              key={`pdf-${index}-${currentScale}`} // Add currentScale to key to force re-render
              fileData={pdfFile}
              index={index}
              currentScale={currentScale}
            />
          ))}
        </div>
      );
    }

    // Render single image
    if (imageUrl) {
      return (
        <div style={{ textAlign: "center" }}>
          <img
            src={imageUrl}
            alt="Document"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      );
    }

    // Render other file types (CSV, Excel, etc.)
    if (nonPdfFiles.length > 0) {
      return (
        <DocViewer
          documents={nonPdfFiles}
          style={{ minHeight: "inherit", marginTop: "30px" }}
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false,
            },
            csvDelimiter: ",",
            pdfZoom: {
              defaultZoom: 0.6,
              zoomJump: 0.2,
            },
            pdfVerticalScrollByDefault: true,
          }}
        />
      );
    }

    return <div>No documents to display</div>;
  };

  return (
    <div className="px-10 py-10">
      <div
        className="card card-body shadow position-relative"
        style={{ minHeight: "100vh" }}
        ref={componentRef}
      >
        {/* Action Buttons */}
        {/* Zoom Controls - only show for PDFs */}
        {pdfFiles.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                position: "sticky",
                top: "10px",
                zIndex: 1000,
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleZoomOut}
                size="small"
              >
                <AiOutlineZoomOut size={16} />
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleZoomIn}
                size="small"
              >
                <AiOutlineZoomIn size={16} />
              </Button>
              <span
                style={{
                  fontSize: "12px",
                  color: "#666",
                  alignSelf: "center",
                  marginLeft: "10px",
                }}
              >
                Zoom: {Math.round(currentScale * 100)}%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button
                variant="contained"
                // color="primary"
                onClick={handleDownloadMerged}
                disabled={mergeStatus !== "completed"}
                startIcon={
                  mergeStatus === "merging" ? (
                    <CircularProgress size={16} />
                  ) : null
                }
                sx={{
                  backgroundColor: "#5f9643",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#4d7c37", // Slightly darker green
                  },
                }}
              >
                {mergeStatus === "idle" && "Preparing Merged PDF..."}
                {mergeStatus === "merging" &&
                  `Merging... ${Math.round(mergeProgress)}%`}
                {mergeStatus === "completed" && "Print & download"}
                {mergeStatus === "error" && "Merge Failed"}
              </Button>
            </div>

            {/* Non-PDF file downloads */}
            {nonPdfFiles.map((file, index) => (
              <Button
                key={`download-other-${index}`}
                variant="outlined"
                color="secondary"
                onClick={() => handleDownloadIndividual(file, index)}
                size="small"
              >
                Download {file.fileType.toUpperCase()}
              </Button>
            ))}
          </div>
        )}

        {/* Document Viewer */}
        {renderViewer()}

        {/* Merge Progress Indicator */}
        {mergeStatus === "merging" && hasMultiplePdfs && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "white",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              minWidth: "200px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CircularProgress size={20} />
              <span style={{ fontSize: "14px" }}>
                Merging PDFs... {Math.round(mergeProgress)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DocsViewer);
