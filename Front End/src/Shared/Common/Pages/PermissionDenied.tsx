import { Link } from "react-router-dom";
import { getToken } from "../../../Utils/Auth";
import useLang from "./../../hooks/useLanguage";

const PermissionDenied = () => {
  const { t } = useLang();
  const token = getToken();
  function goToPreviousRoute() {
    window.history.back();
  }
  return (
    <>
      <div
        id="kt_app_toolbar_container"
        className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center p-5"
      >
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
          <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
            <li className="breadcrumb-item text-muted">{t("Home")}</li>
            <li className="breadcrumb-item">
              <span className="bullet bg-gray-400 w-5px h-2px"></span>
            </li>
            <li className="breadcrumb-item text-muted">
              {t("(Permission Denied)")}
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex flex-column flex-center flex-column-fluid">
        <div className="d-flex flex-column flex-center text-center p-10">
          <div className="card card-flush w-lg-650px py-5">
            <div className="card-body py-15 py-lg-15">
              <div className="mb-1">
                {/* <img
                  src={`${process.env.PUBLIC_URL + "/media/auth/18-dark.png"}`}
                  className="mw-100 mh-300px"
                  alt=""
                /> */}
                <h1>Permission Denied</h1>
              </div>
              <div className="fw-semibold fs-6 text-gray-500 mt-5 mb-5">
                {t("We can't show that page, without permission.")}
              </div>
              <div className="mb-0 d-flex justify-content-center gap-2">
                <div
                  className="btn btn-sm btn-light"
                  onClick={goToPreviousRoute}
                >
                  {t("Return")}
                </div>
                <Link to="/MyFavorites" className="btn btn-sm btn-primary">
                  {t("Go back to home")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionDenied;
