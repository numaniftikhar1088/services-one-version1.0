import React from 'react';
import useLang from './../../../../../Shared/hooks/useLanguage';

const ReflexTests: React.FC<{}> = () => {
    const { t } = useLang();
    return (
        <div className="card shadow-sm mb-3 rounded border border-danger">
            <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-danger">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <h6 className="text-danger m-0">{t("Reflex Tests")}</h6>
                </div>
            </div>

            <div className="card-body py-md-4 py-3">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 ">
                        <label className="mb-2">{t("Select Test to Reflex:")}</label>
                        <div className="d-flex gap-3">
                            <select className="form-select" data-kt-select2="true" data-placeholder="Select option" data-dropdown-parent="#kt_menu_63b2e70320b73" data-allow-clear="true">
                                <option></option>
                                <option value="1">{t("option 1")}</option>
                                <option value="2">{t("option 2")}</option>
                                <option value="3">{t("option 3")}</option>
                                <option value="4">{t("option 4")}</option>
                            </select>
                            <button type="button" className="btn btn-icon btn-sm fw-bold btn-primary px-4">
                                <span className="bi bi-plus-lg"></span>
                            </button>
                        </div>
                    </div>
                    <div className="col-xl-8 col-lg-8 col-md-9 col-sm-12 offset-lg-1 offset-xl-1">
                        <table className="table table-bordered table-vertical" >
                            <thead className="bg-secondary">
                                <tr>
                                    <th className="text-center"></th>
                                    <th className="text-muted">{t("Tests Name")}</th>
                                    <th className="text-muted">{t("Performing Lab")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-icon btn-light-danger btn-sm mb-3 mb-lg-0"
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <a href="# " className="text-gray-800 p-3">
                                            {t("Test 1")}
                                        </a>
                                    </td>
                                    <td>
                                        <a href="# " className="text-gray-800 p-3">
                                            {t("Lab 1")}
                                        </a>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ReflexTests;