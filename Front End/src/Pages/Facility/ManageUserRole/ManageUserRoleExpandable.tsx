import useLang from "Shared/hooks/useLanguage";

const ManageUserRoleExpandable = ({ row }: any) => {
  const { t } = useLang();
  return (
    <div className="app-container container-fluid">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="card-header d-flex justify-content-between align-items-center bg-secondary min-h-35px">
            <h5 className="m-0 ">{t("Page & Rights")}</h5>
          </div>
          <div className="card-body py-md-4 py-3">
            {row?.modules.map((items: any) => (
              <>
                {items?.isSelected ? (
                  <div className="mb-1 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                    <div className="form__group form__group--checkbox bg-light px-2 py-1">
                      <span
                        id={`AdminUserRole_${items?.moduleName.replace(
                          /\s/g,
                          ""
                        )}`}
                        className="form-check-label ms-1 fw-600 fs-7"
                      >
                        {t(items?.moduleName)}
                        <i className="bi bi-arrow-right fs-8 text-primary ms-1"></i>
                      </span>
                    </div>
                    <div className="row px-15 py-2">
                      {items?.pages.map((page: any) => (
                        <>
                          {page?.isSelected ? (
                            <div className="row py-2 border-bottom mx-md-9 mx-5 ">
                              <div className="text-primary ms-1 fw-600 fs-8 col-xxl-2 col-xl-3 col-lg-3 col-12 border-0">
                                <span
                                  id={`AdminUserRole_${page?.pageName.replace(
                                    /\s/g,
                                    ""
                                  )}`}
                                >
                                  {t(page?.pageName)}
                                </span>
                                <i className="bi bi-chevron-double-right fs-8 text-primary ms-1"></i>
                              </div>
                              <div className="col-xxl-10 col-xl-8 col-lg-9">
                                <div className="row">
                                  {page.permissions.map(
                                    ({ permissionName, isSelected }: any) => (
                                      <>
                                        {isSelected ? (
                                          <>
                                            <div className="col-xl-3 col-lg-4 col-md-3 col-sm-4 col-6 border-0">
                                              <span
                                                id={`AdminManageuserRole${permissionName}`}
                                                className="form-check-label text-gray-900 ms-1 fw-600 fs-9"
                                              >
                                                {t(permissionName)}
                                              </span>
                                            </div>
                                          </>
                                        ) : null}
                                      </>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUserRoleExpandable;
