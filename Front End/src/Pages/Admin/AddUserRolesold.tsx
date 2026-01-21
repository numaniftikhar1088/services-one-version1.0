import Box from "@mui/material/Box";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
import CheckBoxDuplicate from "../../Shared/Common/Input/CheckBoxDuplicate";
import Input2 from "../../Shared/Common/Input/Input2";
import LoadButton from "../../Shared/Common/LoadButton";
import useForm from "../../Shared/hooks/useForm";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { checkUncheckAllRolesAndPermissions } from "../../Utils/UserManagement/UserRoles";
import validate from "../../Utils/validate";
import { InitialState, setFormName, setFormState } from "./InitialState";
// import useLang from "Shared/hooks/useLanguage";
import useLang from "./../../Shared/hooks/useLanguage";

const AddUserRoles = () => {
  const { t } = useLang();

  const [selectedBox, setSelectedBox] = useState<any>({
    claimsIds: [],
    moduleIds: [],
  });

  const [userPermissions, setUserPermissions] = useState<any>([]);
  const [rolesAndPermissionsLoading, setRolesAndPermissionsLoading] =
    useState(false);
  const { formData, setFormData, errors, changeHandler, setErrors }: any =
    useForm(InitialState, validate);
  let location = useLocation();
  useEffect(() => {
    getPreFilledIds();
    getPreFilledUserName();
    getUSerRolesAndPermissions();
  }, []);

  const getPreFilledUserName = () => {
    if (location?.state) {
      const roleName = setFormName(InitialState, location?.state?.roleName);
      setFormData(roleName);
    }
  };
  const getPreFilledIds = () => {
    if (location?.state) {
      const Arr = setFormState(location.state);
      setSelectedBox((preVal: any) => {
        return {
          ...preVal,
          claimsIds: Arr?.claimsArr,
          moduleIds: Arr?.modulesArr,
        };
      });
    }
  };
  const [isSubmitting, setisSubmitting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    refetch();
  }, []);
  const loadData = () => {
    try {
      let response = UserManagementService.getAddUserRoles();
      return response;
    } catch (error) {
      return error;
    }
  };

  const { isLoading, data, refetch } = useQuery("userRolesData", loadData, {
    enabled: false,
  });

  ////onchange for allselect
  const handleAllSelect = (checked: boolean) => {
    if (checked) {
      let permissionsChecked = checkUncheckAllRolesAndPermissions(
        userPermissions,
        checked
      );
      setUserPermissions(permissionsChecked);
    }
    if (!checked) {
      let permissionsUnChecked = checkUncheckAllRolesAndPermissions(
        userPermissions,
        checked
      );
      setUserPermissions(permissionsUnChecked);
    }
  };

  /////onchange for claimids
  const handleChangeClaimIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          claimsIds: [...selectedBox.claimsIds, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          claimsIds: selectedBox.claimsIds.filter((item: any) => item !== id),
        };
      });
    }
  };
  const handleChangeModuleIds = (checked: boolean, id: number, claims: any) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          moduleIds: [...selectedBox.moduleIds, id],
          claimsIds: [
            ...new Set(
              selectedBox.claimsIds.concat(
                claims?.map((items: any) => items.id)
              )
            ),
          ],
        };
      });
    }
    if (!checked) {
      let arrCopyClaims = [...selectedBox?.claimsIds];
      for (let index = 0; index < claims.length; index++) {
        arrCopyClaims = arrCopyClaims.filter(
          (items: any) => items !== claims[index].id
        );
      }
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          moduleIds: selectedBox.moduleIds.filter((item: any) => item !== id),
          claimsIds: arrCopyClaims,
        };
      });
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let size;
    let formErrors: any;
    formErrors = validate(formData, true);
    setErrors(formErrors);
    size = Object.keys(formErrors).length;
    if (size !== 0) {
      toast.error(t("Please fill the required fields!"));
      return;
    }
    const queryModel = {
      roleId: location?.state?.roleId ?? 0,
      roleName: formData.roleName.value,
      claimsIds: selectedBox?.claimsIds,
    };
    if (location?.state?.roleId === undefined) {
      if (selectedBox?.claimsIds.length > 0) {
        setisSubmitting(true);
        await UserManagementService.saveUserRoles(queryModel)
          .then((res: AxiosResponse) => {
            if (res?.data?.data?.status === 200) {
              toast.success(res?.data?.data?.message);

              setisSubmitting(false);
              setTimeout(() => {
                navigate("/manageuserrole");
              }, 1000);
            }
          })
          .catch((err?: AxiosError) => {
            toast.error(t("error"));
            setisSubmitting(false);
          });
      } else {
        toast.error(t("Select at least one role"));
      }
    }
    if (location?.state?.roleId > 0) {
      if (selectedBox?.claimsIds.length > 0) {
        setisSubmitting(true);
        await UserManagementService.updateUserRoles(queryModel)
          .then((res: AxiosResponse) => {
            if (res?.data?.data?.status === 200) {
              toast.success(res?.data?.data?.message);
              setisSubmitting(false);
              setTimeout(() => {
                navigate("/manageuserrole");
              }, 1000);
            }
          })
          .catch((err?: AxiosError) => {
            toast.error(t("error"));
            setisSubmitting(false);
          });
      } else {
        toast.error(t("Select at least one role"));
      }
    }
  };
  // new api to get userRoles And Permisisions
  const getUSerRolesAndPermissions = async () => {
    let response;
    try {
      setRolesAndPermissionsLoading(true);
      response = await UserManagementService.getAllUserRolesAndPermissions();
      setUserPermissions(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRolesAndPermissionsLoading(false);
    }
  };

  // BreadCrumb Array
  const breadcrumb: any[] = [
    { name: "Home", url: "/" },
    { name: "Admin", url: "#!" },
    { name: "Add User Roles", url: "#!" },
  ];
  return (
    <>
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0 ">{t("Add User Roles")}</h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <Link
                    to="/manageuserrole"
                    className="fw-bold btn btn-secondary btn-sm btn-secondary--icon rounded"
                  >
                    <span>
                      <span>{t("Cancel")}</span>
                    </span>
                  </Link>
                  {location?.state?.roleId > 0 ? (
                    <LoadButton
                      className="btn btn-sm fw-bold btn-primary"
                      loading={isSubmitting}
                      btnText={t("Update")}
                      loadingText={t("Updating")}
                    />
                  ) : (
                    <LoadButton
                      className="btn btn-sm fw-bold btn-primary"
                      loading={isSubmitting}
                      btnText={t("Save")}
                      loadingText={t("Saving")}
                    />
                  )}
                </div>
              </div>
              <div className="card-body py-4">
                <Input2
                  type="text"
                  name="roleName"
                  label={t("User Role Name")}
                  className="form-control bg-transparent"
                  placeholder={t("User Role Name")}
                  onChange={changeHandler}
                  parentDivClassName="col-12"
                  value={formData?.roleName?.value}
                  error={errors?.roleName}
                  disabled={location?.state?.roleId > 0 ? true : false}
                />
                <div className="mb-2">
                  <label className="form-label fw-semibold">
                    {t("Role Type:")}
                  </label>
                  <div className="d-flex">
                    <label className="form-check form-check-sm form-check-custom me-5">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="1"
                      />
                      <span className="form-check-label">{t("Admin")}</span>
                    </label>

                    <label className="form-check form-check-sm form-check-custom">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="2"
                      />
                      <span className="form-check-label">{t("Facility")}</span>
                    </label>
                  </div>
                </div>
                <hr />

                <CheckBoxDuplicate
                  id="all001"
                  name="allcheckbox"
                  onChange={(e) => handleAllSelect(e.target.checked)}
                  label={t("All")}
                  labelClassName="form-check form-check-sm form-check-solid col-12 mb-2 mt-2"
                  spanClassName="form-check-label ms-1 fw-600 fs-7"
                  loading={isLoading}
                  parentDivClassName="col-12"
                />
                {rolesAndPermissionsLoading ? (
                  <span>{t("Loading...")}</span>
                ) : (
                  userPermissions.map(
                    ({ moduleName, pages, isSelected }: any) => (
                      <>
                        <div className="mb-2 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                          <div className="modal-content">
                            <div className="form__group form__group--checkbox bg-light px-2 py-1">
                              <label
                                htmlFor="kt_roles_select_all"
                                className="form-check form-check-custom"
                              >
                                <input
                                  className="form-check-input w-15px h-15px rounded-01 "
                                  type="checkbox"
                                  value=""
                                  id="kt_roles_select_all"
                                  checked={isSelected}
                                />
                                <span className="form-check-label ms-1 fw-600 fs-7">
                                  {moduleName}
                                  <i className="bi bi-arrow-right fs-8 text-primary ms-1"></i>
                                </span>
                              </label>

                              {/* <div
                              className="btn btn-icon btn-sm btn-active-icon-primary"
                              data-kt-roles-modal-action="close"
                            >
                              <i className="ki-duotone ki-cross fs-1">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>{" "}
                            </div> */}
                            </div>

                            <div className="modal-body">
                              <form
                                id="kt_modal_add_role_form"
                                className="form"
                                action="#"
                              >
                                <div
                                  className="d-flex flex-column scroll-y me-n7 pe-7"
                                  id="kt_modal_add_role_scroll"
                                  data-kt-scroll="true"
                                  data-kt-scroll-activate="{default: false, lg: true}"
                                  data-kt-scroll-max-height="auto"
                                  data-kt-scroll-dependencies="#kt_modal_add_role_header"
                                  data-kt-scroll-wrappers="#kt_modal_add_role_scroll"
                                  data-kt-scroll-offset="300px"
                                >
                                  {/* <div className="fv-row mb-10">
                                        <label className="fs-5 fw-bold form-label mb-2">
                                          <span className="required">
                                            Role name
                                          </span>
                                        </label>

                                        <input
                                          className="form-control form-control-solid"
                                          placeholder="Enter a role name"
                                          name="role_name"
                                        />
                                      </div> */}

                                  <div className="fv-row">
                                    {/* <label className="fs-5 fw-bold form-label mb-2">
                                  Role Permissions
                                </label> */}

                                    <div className="table-responsive ms-4">
                                      <table className="table align-middle fs-6 gy-5">
                                        <tbody className="text-gray-600 fw-semibold d-inline-block">
                                          {pages.map(
                                            ({
                                              pageName,
                                              permissions,
                                              isSelected,
                                            }: any) => (
                                              <>
                                                <tr>
                                                  <td className="text-gray-800 table-fit-content-td border-0">
                                                    <label
                                                      htmlFor="kt_roles_select_all"
                                                      className="form-check form-check-custom"
                                                    >
                                                      <input
                                                        className="form-check-input w-15px h-15px rounded-01 "
                                                        type="checkbox"
                                                        value=""
                                                        id="kt_roles_select_all"
                                                        checked={isSelected}
                                                      />
                                                      <span className="form-check-label text-primary ms-1 fw-600 fs-7 ">
                                                        {pageName}
                                                        <i className="bi bi-chevron-double-right fs-8 text-primary ms-1"></i>
                                                      </span>
                                                    </label>
                                                  </td>

                                                  {permissions.map(
                                                    ({
                                                      permissionName,
                                                      isSelected,
                                                    }: any) => (
                                                      <>
                                                        <td className="table-fit-content-td border-0">
                                                          <label
                                                            htmlFor="kt_roles_select_all"
                                                            className="form-check form-check-custom"
                                                          >
                                                            <input
                                                              className="form-check-input w-15px h-15px rounded-01"
                                                              type="checkbox"
                                                              value=""
                                                              id="kt_roles_select_all"
                                                              checked={
                                                                isSelected
                                                              }
                                                            />
                                                            <span className="form-check-label text-gray-900 ms-1 fw-600 fs-9">
                                                              {permissionName}
                                                            </span>
                                                          </label>
                                                        </td>
                                                      </>
                                                    )
                                                  )}
                                                </tr>
                                              </>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="text-center pt-15">
                              <button
                                type="reset"
                                className="btn btn-light me-3"
                                data-kt-roles-modal-action="cancel"
                              >
                                Discard
                              </button>

                              <button
                                type="submit"
                                className="btn btn-primary"
                                data-kt-roles-modal-action="submit"
                              >
                                <span className="indicator-label">Submit</span>
                                <span className="indicator-progress">
                                  Please wait...{" "}
                                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                </span>
                              </button>
                            </div> */}
                              </form>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )
                )}
                {data?.data?.data?.map((items: any) => (
                  <>
                    <div className="mb-2 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                      {/* <CheckBoxDuplicate
                        id={items.moduleId}
                        name={items.moduleName}
                        value={items.moduleId}
                        checked={selectedBox.moduleIds.includes(items.moduleId)}
                        parentDivClassName="col-12 mb-2"
                        onChange={(e) =>
                          handleChangeModuleIds(
                            e.target.checked,
                            items?.moduleId,
                            items?.claims
                          )
                        }
                        label={items.moduleName}
                        labelClassName="form-check form-check-sm form-check-solid col-12 my-1 mb-5 mt-5"
                        spanClassName="form-check-label ms-1 fw-600 "
                        loading={isLoading}
                      /> */}
                      <div className="row mx-8 mr-0">
                        {items?.claims.map((subItems: any) => (
                          <div className="col-lg-3 col-md-3 col-sm-6">
                            <Box
                              sx={{
                                minHeight: "auto",
                                flexGrow: 1,
                                maxWidth: 300,
                              }}
                            >
                              {/* <MultiSelectCheckbox /> */}
                            </Box>
                            {/*treeview*/}
                            {/* <MultiSelectCheckbox /> */}
                            {/* <CheckBoxDuplicate
                              id={subItems.id}
                              name={subItems.name}
                              value={subItems.id}
                              parentDivClassName="col-12"
                              checked={selectedBox.claimsIds.includes(
                                subItems.id
                              )}
                              onChange={(e) =>
                                handleChangeClaimIds(
                                  e.target.checked,
                                  subItems?.id
                                )
                              }
                              label={subItems.name}
                              labelClassName="form-check form-check-sm form-check-solid"
                              spanClassName="form-check-label ms-1 fw-400"
                              // disabled={selectedBox.moduleIds.includes(
                              //   items.moduleId
                              // )}
                              loading={isLoading}
                            /> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUserRoles;
