import { AxiosResponse } from "axios";
import DocComponent from "Pages/DocsViewer/DocComponent";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { savePdfUrls } from "../../Redux/Actions/Index";
import FacilityService from "../../Services/FacilityService/FacilityService";
import { Loader } from "../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";
import { isJson } from "Utils/Common/Requisition";

const ViewSingleFacility = () => {
  const { t } = useLang();
  const [FacilityInfo, setFacilityInfo] = useState<any>();
  const dispatch = useDispatch();
  const params: any = useParams();

  const ViewFacilityDynamic = (id: number) => {
    const requestBody = {
      pageId: 138,
      id: id,
    };
    FacilityService.viewFacility(requestBody)
      .then((result: AxiosResponse) => {
        const data = result.data;
        setFacilityInfo(data);
      })
      .catch((error: any) => {
        console.error("ViewFacilityDynamic error", error);
      });
  };

  React.useEffect(() => {
    const id = parseInt(atob(params.id));
    ViewFacilityDynamic(id);
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
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

              <li className="breadcrumb-item text-muted">{t("Facility")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">
                {t("Manage Facility")}
              </li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("View")}</li>
            </ul>
          </div>
        </div>
      </div>

      {typeof FacilityInfo !== "undefined" ? (
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <Link to="/facilitylist" className="">
                  <div className="text-muted mt-2">
                    <i className="bi bi-arrow-left fs-2qx"></i>
                  </div>
                </Link>
              </div>
              <div className="card-body py-md-4 py-3">
                {Array.isArray(FacilityInfo) ? (
                  FacilityInfo.map((section: any, sectionIndex: number) => (
                    <React.Fragment key={sectionIndex}>
                      {sectionIndex > 0 && <hr className="text-muted" />}
                      <h2 className="fw-bold mb-4 text-primary fs-2">
                        {section.sectionName
                          ? t(section.sectionName)
                          : t("Section")}
                      </h2>
                      <div className="row">
                        {section.fields &&
                          Array.isArray(section.fields) &&
                          section.fields.map(
                            (field: any, fieldIndex: number) => {
                              if (!field.visible) return null;

                              const isBase64Image =
                                typeof field.defaultValue === "string" &&
                                field.defaultValue.startsWith("data:image/");

                              // Check if this is a URL field (MAP Collection URL or any URL)
                              const isUrl =
                                typeof field.defaultValue === "string" &&
                                !isBase64Image &&
                                (field.defaultValue.startsWith("http://") ||
                                  field.defaultValue.startsWith("https://"));

                              // Check if this is a JSON array field (Sales Rep, Lab Profile, Result Report Template)
                              const isJsonArray =
                                typeof field.defaultValue === "string" &&
                                !isBase64Image &&
                                isJson(field.defaultValue);

                              let parsedArray: any[] = [];
                              let isReportTemplate = false;

                              if (isJsonArray) {
                                try {
                                  parsedArray = JSON.parse(field.defaultValue);
                                  if (
                                    Array.isArray(parsedArray) &&
                                    parsedArray.length > 0
                                  ) {
                                    const firstItem = parsedArray[0];
                                    isReportTemplate =
                                      (firstItem.value &&
                                        typeof firstItem.value === "string" &&
                                        (firstItem.value.startsWith("http://") ||
                                          firstItem.value.startsWith(
                                            "https://"
                                          ))) ||
                                      (firstItem.fileUrl &&
                                        typeof firstItem.fileUrl === "string" &&
                                        (firstItem.fileUrl.startsWith(
                                          "http://"
                                        ) ||
                                          firstItem.fileUrl.startsWith(
                                            "https://"
                                          )));
                                  }
                                } catch (e) {
                                  parsedArray = [];
                                }
                              }

                              if (
                                isJsonArray &&
                                Array.isArray(parsedArray) &&
                                parsedArray.length > 0 &&
                                isReportTemplate
                              ) {
                                return (
                                  <div
                                    key={fieldIndex}
                                    className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-3"
                                  >
                                    <div className="fw-semibold text-dark fs-12px d-block lh-1 mb-2">
                                      {t(field.displayFieldName)}:
                                    </div>
                                    <div className="d-flex flex-wrap gap-3">
                                      {parsedArray.map(
                                        (template: any, idx: number) => (
                                          <div
                                            key={idx}
                                            className="d-flex flex-column align-items-center"
                                          >
                                            <a
                                              href="/docs-viewer"
                                              target="_blank"
                                              onClick={() => {
                                                dispatch(
                                                  savePdfUrls(
                                                    template.fileUrl ??
                                                      template.value
                                                  )
                                                );
                                              }}
                                            >
                                              <DocComponent
                                                pdfUrl={
                                                  template.fileUrl ??
                                                  template.value
                                                }
                                              />
                                            </a>
                                            <span className="fw-semibold text-muted fs-12px mt-1">
                                              {template.label || template.name}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              if (
                                isJsonArray &&
                                Array.isArray(parsedArray) &&
                                parsedArray.length > 0
                              ) {
                                const labels = parsedArray
                                  .map((item: any) => item.label)
                                  .filter(Boolean)
                                  .join(", ");

                                return (
                                  <div
                                    key={fieldIndex}
                                    className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3"
                                  >
                                    <div className="row">
                                      <div className="col-4">
                                        <div className="fw-semibold text-dark fs-12px d-block lh-1">
                                          {t(field.displayFieldName)}:
                                        </div>
                                      </div>
                                      <div className="col-8">
                                        <div className="fw-semibold text-muted fs-12px d-block lh-1">
                                          {labels || "-"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              // For base64 images, render as image
                              if (isBase64Image) {
                                return (
                                  <div
                                    key={fieldIndex}
                                    className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3"
                                  >
                                    <div className="row">
                                      <div className="col-4">
                                        <div className="fw-semibold text-dark fs-12px d-block lh-1">
                                          {t(field.displayFieldName)}:
                                        </div>
                                      </div>
                                      <div className="col-8">
                                        <img
                                          src={field.defaultValue}
                                          alt={t(field.displayFieldName)}
                                          className="img-fluid"
                                          style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            objectFit: "contain",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={fieldIndex}
                                  className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3"
                                >
                                  <div className="row">
                                    <div className="col-4">
                                      <div className="fw-semibold text-dark fs-12px d-block lh-1">
                                        {t(field.displayFieldName)}:
                                      </div>
                                    </div>
                                    <div className="col-8">
                                      <div className="fw-semibold text-muted fs-12px d-block lh-1">
                                        {isUrl ? (
                                          <div className="d-flex gap-2 justify-content-start">
                                            <a
                                              href={field.defaultValue}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-primary text-decoration-underline text-truncate"
                                              style={{ wordBreak: "break-all" }}
                                            >
                                              {field.defaultValue}
                                            </a>
                                          </div>
                                        ) : (
                                          field.defaultValue || "-"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </div>
                      {/* Handle files section separately if it exists */}
                      {section.files &&
                        Array.isArray(section.files) &&
                        section.files.length > 0 && (
                          <>
                            <hr className="text-muted" />
                            <h2 className="fw-bold my-4 text-primary fs-2">
                              {t("Files")}
                            </h2>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-3">
                              <div className="row">
                                {section.files.map(
                                  (file: any, fileIndex: number) => (
                                    <div
                                      key={fileIndex}
                                      className="col-xl-2 col-lg-2 col-md-3 col-sm-4 mb-3"
                                    >
                                      <div className="px-5">
                                        <Link
                                          className="h-100"
                                          to={`/docs-viewer`}
                                          target="_blank"
                                          onClick={() => {
                                            dispatch(
                                              savePdfUrls(file.filePath)
                                            );
                                          }}
                                        >
                                          <i
                                            className="fa fa-file text-light-primary"
                                            style={{ fontSize: "48px" }}
                                          ></i>
                                        </Link>
                                      </div>
                                      <span className="fw-semibold text-dark px-3 mt-3">
                                        {file.name}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </>
                        )}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <div className="text-muted fs-6">
                      {t("No facility information available")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ViewSingleFacility;
