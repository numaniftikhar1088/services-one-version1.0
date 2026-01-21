import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import ManageUserRoleGrid from "./ManageUserRole";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import useLang from "Shared/hooks/useLanguage";

const ManageUserRoles = () => {
  const { t } = useLang();
  const [clicked, setClicked] = useState(false);
  const inputRef = useRef<any>("");
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  return (
    <>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-body py-md-4 py-3">
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                <div className="d-flex gap-2 responsive-flexed-actions">
                  <div className="d-flex align-items-center">
                    <PermissionComponent
                      moduleName="Admin"
                      pageName="User Role and Page Rights"
                      permissionIdentifier="AddNewUserRoles"
                    >
                      <Link
                        id={`AdminManageuserroleAddnew`}
                        to="/add-user-roles"
                        className="btn btn-primary btn-sm btn-primary--icon px-7"
                      >
                        <span>
                          <i style={{ fontSize: "15px" }} className="fa">
                            &#xf067;
                          </i>
                          <span>{t("Add New User Roles")}</span>
                        </span>
                      </Link>
                    </PermissionComponent>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`AdminManageuserroleSearch`}
                    type="button"
                    onClick={() => {
                      setClicked(!clicked);
                    }}
                    className="btn btn-info btn-sm  rounded fw-500"
                  >
                    {t("Search")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                    id={`AdminManageuserroleReset`}
                    onClick={() => {
                      setClicked(!clicked);
                      inputRef.current.value = "";
                      setSorting(sortById);
                    }}
                  >
                    <span>
                      <span>{t("Reset")}</span>
                    </span>
                  </button>
                </div>
              </div>
              <ManageUserRoleGrid
                clicked={clicked}
                inputRef={inputRef}
                setSorting={setSorting}
                sort={sort}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUserRoles;
