import { AxiosResponse } from "axios";
import { t } from "i18next";
import Masonry from "masonry-layout";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import localStorage from "redux-persist/es/storage";
import PatientService from "../../../Services/PatientService/PatientService";
import Splash from "../../../Shared/Common/Pages/Splash";
import SectionsCard from "./SectionsCard";
import { Tooltip } from "@mui/material";

const ViewPatientDemographics = () => {
  const [shown, setShown] = useState(false);
  const [display, setDisplay] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const masonryRef = useRef<any | null>(null);

  useEffect(() => {
    getLocalStorageData();
  }, []);

  useEffect(() => {
    masonryRef.current = new Masonry(".ViewGrid", {
      itemSelector: ".ViewGrid-item",
      columnWidth: ".ViewGrid-sizer",
      percentPosition: true,
    });
  }, []);

  const location = useLocation();
  const parts = location.pathname.split("/view-patient-demographics-patient/");
  const InnerParts = parts[1].split("/");
  const patient_id = atob(InnerParts[0]);

  const getLocalStorageData = () => {
    let tokenData: any = localStorage.getItem("userinfo");
    tokenData.then((res: any) => {
      if (!res) return;
      sessionStorage.setItem("userinfo", res);
    });
    localStorage.removeItem("userinfo");
  };
  const loadData = () => {
    setLoading(true);
    const obj = {
      pageId: 19,
      id: patient_id,
    };
    PatientService.ViewPatientDemoGraphics(obj)
      .then((res: AxiosResponse) => {
        setDisplay(res.data);
        setShown(true);
      })
      .catch((err: any) => {
        console.trace(err);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (masonryRef.current) {
      masonryRef.current.layout();
    }
  }, [shown]);

  const handleDownload = async () => {
    const response = await PatientService.downloadPatientReport(display);
    if (response.data.base64Pdf) {
      downloadPDF(
        response.data.base64Pdf,
        display?.[0]?.fields?.[0]?.defaultValue
      );
    }
  };

  function downloadPDF(
    base64String: string,
    fileName: string = "_patient_report"
  ): void {
    // Convert Base64 string to a byte array
    const byteCharacters: string = window.atob(base64String);
    const byteNumbers: number[] = new Array(byteCharacters.length);

    // Convert byteCharacters into byteNumbers
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray: Uint8Array = new Uint8Array(byteNumbers);

    // Create a Blob from the byteArray
    const blob: Blob = new Blob([byteArray], { type: "application/pdf" });

    // Create a temporary anchor element to trigger the download
    const link: HTMLAnchorElement = document.createElement("a");
    const url: string = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName + "_patient_report"; // Provide a default filename
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <div className="d-flex flex-column flex-column-fluid">
          <div
            id="kt_app_content"
            className="app-content flex-column-fluid app-toolbar py-3 py-lg-6"
          >
            <div className="app-container container-fluid">
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                  <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                    <li className="breadcrumb-item text-muted">
                      <a href="" className="text-muted text-hover-primary">
                        {t("Home")}
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <span className="bullet bg-gray-400 w-5px h-2px"></span>
                    </li>
                    <li className="breadcrumb-item text-muted">
                      {t("Patient")}
                    </li>
                    <li className="breadcrumb-item">
                      <span className="bullet bg-gray-400 w-5px h-2px"></span>
                    </li>
                    <li className="breadcrumb-item text-muted">
                      {t("View Patient Demographic")}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3"></div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 py-5 pt-3">
                <div className="ViewGrid row">
                  <div className="card p-0">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <Link to="/patient-demographics-list">
                        <div className="text-muted mt-2">
                          <i className="bi bi-arrow-left fs-2qx"></i>
                        </div>
                      </Link>
                      <Tooltip title="Download Patient Report">
                        <button
                          className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                          onClick={handleDownload}
                        >
                          <i className="bi bi-download"></i>
                        </button>
                      </Tooltip>
                    </div>
                    {Array.isArray(display) &&
                      display?.map((sectionData: any, sectionIndex: number) => (
                        <SectionsCard
                          key={sectionData.id}
                          sectionData={sectionData}
                          sectionIndex={sectionIndex}
                          displayData={display}
                          setDisplay={setDisplay}
                          loadData={loadData}
                        />
                      ))}
                    <div className="col-12 col-sm-6 pb-4 ViewGrid-item ViewGrid-sizer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewPatientDemographics;
