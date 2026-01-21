import React from 'react';
import useLang from './../../../Shared/hooks/useLanguage';

export const BloodCompendiumDataNav: React.FC<{}> = () => {
    const { t } = useLang()
    return (
        <div className="app-toolbar py-3 py-lg-6">
            <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">

                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">

                    <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">

                        <li className="breadcrumb-item text-muted">
                            <a href="" className="text-muted text-hover-primary">{t("Home")}</a>
                        </li>

                        <li className="breadcrumb-item">
                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                        </li>

                        <li className="breadcrumb-item text-muted">{t("LIS Setup")}</li>

                        <li className="breadcrumb-item">
                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                        </li>

                        <li className="breadcrumb-item text-muted">{t("Compendium Data")}</li>

                    </ul>
                </div>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                    <button className='btn btn-icon btn-sm fw-bold btn-upload btn-icon-light'><i className="bi bi-download"></i></button>
                    <button className='btn btn-icon btn-sm fw-bold btn-warning '><i className="bi bi-cloud-upload"></i></button>
                    <button className="fade btn btn-info btn-sm fw-bold search show btn btn-primary" ><i className="fa fa-search"></i>{t("Search")}</button>
                </div>
            </div>
        </div>
    );
}
