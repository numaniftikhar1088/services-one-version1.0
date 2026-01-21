import React from 'react';
import useLang from './../../../../../Shared/hooks/useLanguage';

const ResultingRules: React.FC<{}> = () => {
    const { t } = useLang();
    return (
        <div className="card shadow-sm mb-3 rounded border border-warning">
            <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-warning">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <h6 className="text-warning m-0">{t("Resulting Rules")}</h6>
                </div>
            </div>

            <div className="card-body py-md-4 py-3">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 ">
                        <label className="mb-2">{t("Reference Value Type")}</label>
                        <div className="d-flex gap-3">
                            <select className="form-select" data-kt-select2="true" data-placeholder={t("Select option")} data-dropdown-parent="#kt_menu_63b2e70320b73" data-allow-clear="true">
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

                    <hr className="bg-secondary mt-7 mb-5 col-12 mx-3" />
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 col-md- col-sm-12">
                            <label>{t("Sex")}</label>
                            <select
                                className="form-select"
                                data-kt-select2="true"
                                data-placeholder={t("Select option")}
                                data-dropdown-parent="#kt_menu_63b2e70320b73"
                                data-allow-clear="true"
                            >
                                <option>--- {t("Select")} ---</option>
                                <option value="1">{t("option 1")}</option>
                                <option value="2">{t("option 2")}</option>
                                <option value="3">{t("option 3")}</option>
                                <option value="4">{t("option 4")}</option>
                            </select>
                        </div>

                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Age")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("To")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Low")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("High")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Critical Values: Low")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("High")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Low Flag")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("High Flag")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Weight Range Flag")}</label>
                            <input name="" className="form-control bg-transparent mb-3 mb-lg-0" placeholder="" value="" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12 d-flex align-items-end">
                            <button type="button" className="btn px-4 btn-icon btn-light-danger btn-sm mb-3 mb-lg-0">
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    </div>

                    <hr className="bg-secondary mt-10 mb-5 mx-3" />
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 col-md- col-sm-12">
                            <label>{t("Sex")}</label>
                            <select
                                className="form-select"
                                data-kt-select2="true"
                                data-placeholder={t("Select option")}
                                data-dropdown-parent="#kt_menu_63b2e70320b73"
                                data-allow-clear="true"
                            >
                                <option>--- {t("Select")} ---</option>
                                <option value="1">{t("option 1")}</option>
                                <option value="2">{t("option 2")}</option>
                                <option value="3">{t("option 3")}</option>
                                <option value="4">{t("option 4")}</option>
                            </select>
                        </div>

                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Age")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("To")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Less Than")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Greater Than")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Critical Values: Less Than")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Greater Than")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Lesser Than")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Greater Flag")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Lesser Flag")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12">
                            <label className="mb-2">{t("Weight Range Flag")}</label>
                            <input className="form-control bg-transparent mb-3 mb-lg-0" />
                        </div>
                        <div className="mt-2 col-xl-2 col-lg-2 col-md-2 col-sm-12 d-flex align-items-end">
                            <button type="button" className="btn px-4 btn-icon btn-light-danger btn-sm mb-3 mb-lg-0">
                                <i className="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ResultingRules;