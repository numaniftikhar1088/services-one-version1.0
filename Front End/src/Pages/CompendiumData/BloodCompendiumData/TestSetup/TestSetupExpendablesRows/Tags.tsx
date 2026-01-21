import React from 'react';
import useLang from './../../../../../Shared/hooks/useLanguage';

const Tags: React.FC<{}> = () => {
    const { t } = useLang();

    return (
        <>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <h4 className="text-primary p-3">{t("Tags")}</h4>
            </div>
            <div className="row m-0">
                {Array(3).fill(null).map((_, index) => (
                    <div key={index} className="col-xl-2 col-lg-2 col-md-2 col-sm-12 mb-3">
                        <input
                            name={`tag-${index}`}
                            className="form-control bg-transparent mb-lg-0"
                            placeholder={t("Tag")}
                            value=""
                        />
                    </div>
                ))}
                <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 mb-3">
                    <button type="button" className="btn px-4 btn-icon btn-light-danger btn-sm mb-3 mb-lg-0">
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Tags;
