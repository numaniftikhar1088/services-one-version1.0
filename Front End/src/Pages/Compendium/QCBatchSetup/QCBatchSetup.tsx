import React from 'react'
import CollapsibleTable from '.'
import useLang from "Shared/hooks/useLanguage";

const QCBatchSetup: React.FC<{}> = () => {
  const { t } = useLang()
  return (
    <>
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

              <li className="breadcrumb-item text-muted">{t("Setup")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">{t("QC Batch Setup")}</li>
            </ul>
          </div>
        </div>
      </div>
      <CollapsibleTable />
    </>
  )
}

export default QCBatchSetup;