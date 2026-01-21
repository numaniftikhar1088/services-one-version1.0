import React, { useEffect, useState } from "react";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import useLang from "Shared/hooks/useLanguage";

interface DocsViewerProps {
  pdfLink: string;
}

const PDFView: React.FC<DocsViewerProps> = ({ pdfLink }) => {
  const {t} = useLang()
  const [pdfBlobURL, setPdfBlobURL] = useState<IDocument[]>([]);

  const showPdfInNewTab = (fileUrl: string) => {
    RequisitionType.ShowBlobInViewer(fileUrl).then((res: any) => {
      const pdfUrl = res?.data?.Data;
      setPdfBlobURL([{ uri: pdfUrl, fileType: "pdf" }]);
    });
  };
  useEffect(() => {
    showPdfInNewTab(pdfLink);
  }, [pdfLink]);
  return (
    <div className="px-20 py-10">
      <div
        className="card card-body"
        style={{ minHeight: "calc(100vh - 100px)" }}
      >
        {pdfBlobURL.length === 0 ? (
          <p>{t("Loading...")}</p>
        ) : (
          <DocViewer
            documents={pdfBlobURL}
            pluginRenderers={DocViewerRenderers}
            style={{ minHeight: "inherit" }}
          />
        )}
      </div>
    </div>
  );
};

export default PDFView;
