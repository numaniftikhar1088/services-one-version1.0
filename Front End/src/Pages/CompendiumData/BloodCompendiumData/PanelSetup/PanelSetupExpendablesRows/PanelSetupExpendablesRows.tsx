import React from 'react';
import TestAssignment from './TestAssignment';
import useLang from './../../../../../Shared/hooks/useLanguage';

const PanelSetupExpendablesRows: React.FC<{}> = () => {
    const {t} = useLang()
        return (
        <div className="row">
            <div className="col-lg-12 bg-white px-lg-14 pb-6">
                <div className="row mb-3 mt-6">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-3">
                    <label className="fw-bold mb-2 required">{t("Order Method")}</label>
                    <div className="row m-0">
                        <label className="form-check form-check-sm form-check-solid col-6 my-1">
                            <input className="form-check-input" type="radio" name="Individual"/>
                            <span className="form-check-label">{t("Individual")}</span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-6 my-1">
                            <input className="form-check-input" type="radio" name="Group"/>
                            <span className="form-check-label">{t("Group")}</span>
                        </label>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-3">
                    <label className="fw-bold mb-2 required">{t("Display Type On Requisition")}</label>
                    <div className="row m-0">
                        <label className="form-check form-check-sm form-check-solid col-6 my-1">
                            <input className="form-check-input" type="radio" name="Individual"/>
                            <span className="form-check-label">{t("As Test")}</span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-6 my-1">
                            <input className="form-check-input" type="radio" name="Group"/>
                            <span className="form-check-label">{t("As Panel")}</span>
                        </label>
                    </div>
                </div>
                </div>
                <TestAssignment />
            </div>
        </div>
        );
}
export default PanelSetupExpendablesRows;