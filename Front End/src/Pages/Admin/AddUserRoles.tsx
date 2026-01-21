import type { AxiosError, AxiosResponse } from "axios";
import type React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
import CheckBoxDuplicate from "../../Shared/Common/Input/CheckBoxDuplicate";
import Input2 from "../../Shared/Common/Input/Input2";
import Radio from "../../Shared/Common/Input/Radio";
import LoadButton from "../../Shared/Common/LoadButton";
import useForm from "../../Shared/hooks/useForm";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { GetElementsFromArray } from "../../Utils/Common/CommonMethods";
import { PortalTypeEnum } from "../../Utils/Common/Enums/Enums";
import { checkUncheckAllRolesAndPermissions } from "../../Utils/UserManagement/UserRoles";
import validate from "../../Utils/validate";
import useLang from "./../../Shared/hooks/useLanguage";
import { InitialState, setFormName } from "./InitialState";
import { reactSelectSMStyle } from "Utils/Common";

const AddUserRoles: React.FC = () => {
  const { t } = useLang();

  const [userPermissions, setUserPermissions] = useState<any>([]);
  const [selectAll, setSelectAll] = useState<any>(false);
  const [isHideSideMenu, setIsHideMenu] = useState<boolean>(true); // New state for side menu
  const [selectedLandingPage, setSelectedLandingPage] = useState<{
    value: string;
    label: string;
  } | null>(null); // New state for landing page dropdown

  const [rolesAndPermissionsLoading, setRolesAndPermissionsLoading] =
    useState(false);
  const { formData, setFormData, errors, changeHandler, setErrors }: any =
    useForm(InitialState, validate);
  const location = useLocation();

  useEffect(() => {
    getPreFilledUserName();
    if (formData?.roleType?.value) {
      getUSerRolesAndPermissions(formData.roleType.value);
    }
    // Pre-fill isHideSideMenu if editing
    if (location?.state?.isHideSideMenu !== undefined) {
      setIsHideMenu(location.state.isHideSideMenu);
    }
  }, [formData.roleType.value]);

  // Get all available pages for landing page dropdown
  const getAllAvailablePages = () => {
    const allPages: any[] = [];
    userPermissions.forEach((module: any) => {
      module.pages.forEach((page: any) => {
        allPages.push({
          value: `${module.moduleId}-${page.pageId}`,
          label: `${module.moduleName} - ${page.pageName}`,
          moduleId: module.moduleId,
          pageId: page.pageId,
        });
      });
    });
    return allPages;
  };

  // Handle landing page dropdown change
  const handleLandingPageChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedLandingPage(selectedOption);

    if (selectedOption) {
      const [moduleId, pageId] = selectedOption.value.split("-").map(Number);

      // Update userPermissions to mark selected page and its module as selected
      const updatedPermissions = userPermissions.map((module: any) => {
        if (module.moduleId === moduleId) {
          const updatedModule = { ...module };
          updatedModule.isSelected = true;

          updatedModule.pages = updatedModule.pages.map((page: any) => {
            if (page.pageId === pageId) {
              return {
                ...page,
                isSelected: true,
                isLandingPage: true,
                permissions: page.permissions.map((permission: any) => ({
                  ...permission,
                  isSelected: true,
                })),
              };
            }
            return { ...page, isLandingPage: false };
          });

          return updatedModule;
        }

        // Remove landing page flag from other modules' pages
        return {
          ...module,
          pages: module.pages.map((page: any) => ({
            ...page,
            isLandingPage: false,
          })),
        };
      });

      setUserPermissions(updatedPermissions);
    } else {
      // Clear all landing page flags
      const updatedPermissions = userPermissions.map((module: any) => ({
        ...module,
        pages: module.pages.map((page: any) => ({
          ...page,
          isLandingPage: false,
        })),
      }));
      setUserPermissions(updatedPermissions);
    }
  };

  const getPreFilledUserName = () => {
    if (location?.state) {
      const roleName = setFormName(InitialState, location?.state);
      setFormData(roleName);
    }
  };

  const [isSubmitting, setisSubmitting] = useState(false);
  const navigate = useNavigate();

  //========== onchange for all select ==========
  const handleAllSelect = (checked: boolean) => {
    if (checked) {
      const permissionsChecked = checkUncheckAllRolesAndPermissions(
        userPermissions,
        true
      );
      setUserPermissions(permissionsChecked);
    } else {
      const permissionsUnChecked = checkUncheckAllRolesAndPermissions(
        userPermissions,
        false
      );

      // Clear all landing page flags when unchecking all
      const permissionsWithoutLandingPage = permissionsUnChecked.map(
        (module: any) => ({
          ...module,
          pages: module.pages.map((page: any) => ({
            ...page,
            isLandingPage: false,
          })),
        })
      );

      setUserPermissions(permissionsWithoutLandingPage);
      // Clear landing page selection when unchecking all
      setSelectedLandingPage(null);
    }
    setSelectAll(!selectAll);
  };

  //========== onchange for single page select ==========
  const handleSinglePage = (
    checked: boolean,
    moduleId: number,
    pageId: number,
    pagePermissionId: number,
    moduleIndex: number,
    pageIndex: number,
    permissionIndex: number
  ) => {
    const CopieduserPermissions = [...userPermissions];
    CopieduserPermissions[moduleIndex].pages[pageIndex].permissions[
      permissionIndex
    ].isSelected = checked;
    if (checked) {
      CopieduserPermissions[moduleIndex].pages[pageIndex].isSelected = true;
      CopieduserPermissions[moduleIndex].isSelected = true;
    } else {
      const selectedItems: any = GetElementsFromArray(
        CopieduserPermissions[moduleIndex].pages[pageIndex].permissions,
        (item: any) => item.isSelected === true
      );
      if (selectedItems.length === 0) {
        CopieduserPermissions[moduleIndex].pages[pageIndex].isSelected = false;

        // If this was the landing page, clear the landing page selection
        if (CopieduserPermissions[moduleIndex].pages[pageIndex].isLandingPage) {
          CopieduserPermissions[moduleIndex].pages[pageIndex].isLandingPage =
            false;
          setSelectedLandingPage(null);
        }

        if (
          CopieduserPermissions[moduleIndex].pages.filter(
            (page: any) => page.isSelected
          ).length === 0
        ) {
          CopieduserPermissions[moduleIndex].isSelected = false;
        }
      }
    }
    setUserPermissions(CopieduserPermissions);
  };

  //========== onchange for all page select ==========
  const handleAllSinglePage = (
    checked: boolean,
    moduleId: number,
    pageId: number
  ) => {
    const updatedUserPermissions = userPermissions.map((module: any) => {
      if (module.moduleId === moduleId) {
        const updatedModule = { ...module };
        updatedModule.isSelected = true;
        updatedModule.pages = updatedModule.pages.map((page: any) => {
          if (page.pageId === pageId) {
            const updatedPage = { ...page };
            updatedPage.isSelected = checked;

            // If unchecking and this was the landing page, clear landing page selection
            if (!checked && updatedPage.isLandingPage) {
              updatedPage.isLandingPage = false;
              setSelectedLandingPage(null);
            }

            updatedPage.permissions = updatedPage.permissions.map(
              (permession: any) => {
                return { ...permession, isSelected: checked };
              }
            );
            return updatedPage;
          }
          return page;
        });
        if (
          updatedModule.pages.length === 0 ||
          updatedModule.pages.every((page: any) => !page.isSelected)
        ) {
          updatedModule.isSelected = false;
        }
        return updatedModule;
      }
      return module;
    });
    setUserPermissions(updatedUserPermissions);
  };

  // ===== onchange for module select checkboxes
  const handleModuleCheckbox = (checked: boolean, moduleId: number) => {
    const updatedUserPermissions = userPermissions.map((module: any) => {
      if (module.moduleId === moduleId) {
        const updatedModule = { ...module };
        updatedModule.isSelected = checked;
        updatedModule.pages = updatedModule.pages.map((page: any) => {
          const updatedPage = { ...page };
          updatedPage.isSelected = checked;

          // If unchecking module and it contains the landing page, clear landing page selection
          if (!checked && updatedPage.isLandingPage) {
            updatedPage.isLandingPage = false;
            setSelectedLandingPage(null);
          }

          updatedPage.permissions = updatedPage.permissions.map(
            (permession: any) => {
              return { ...permession, isSelected: checked };
            }
          );
          return updatedPage;
        });
        return updatedModule;
      }
      return module;
    });
    setUserPermissions(updatedUserPermissions);
  };

  // ===== Handle side menu visibility checkbox
  const handleSideMenuCheckbox = (checked: boolean) => {
    setIsHideMenu(checked);
  };

  //========== Submit & save data ==========
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const formErrors = validate(formData, true);
    setErrors(formErrors);

    const size = Object.keys(formErrors).length;
    if (size !== 0) {
      toast.error(t("Please fill the required fields!"));
      return;
    }

    // Check if at least one landing page is selected when pages are selected
    const selectedPages = userPermissions.flatMap((module: any) =>
      module.pages.filter((page: any) => page.isSelected)
    );
    const hasLandingPage = selectedPages.some(
      (page: any) => page.isLandingPage
    );

    if (selectedPages.length > 0 && !hasLandingPage) {
      toast.error(t("Please select at least one landing page"));
      return;
    }

    const queryModel = {
      roleId: location?.state?.roleId ?? 0,
      roleName: formData.roleName.value,
      roleType: Number.parseInt(formData.roleType.value, 10),
      isHideSideMenu: isHideSideMenu,
      modules: userPermissions,
    };

    const isAtLeastOneModuleSelected = queryModel.modules.some(
      (module: any) => module.isSelected
    );

    if (location?.state?.roleId === undefined) {
      if (isAtLeastOneModuleSelected) {
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
            console.error(err);
            toast.error(t("error"));
            setisSubmitting(false);
          });
      } else {
        toast.error(t("Select at least one role"));
      }
    }
    if (location?.state?.roleId > 0) {
      if (isAtLeastOneModuleSelected) {
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
            console.error(err);
            toast.error(t("error"));
            setisSubmitting(false);
          });
      } else {
        toast.error(t("Select at least one role"));
      }
    }
  };

  //========== new api to get userRoles And Permisisions ==========
  const getUSerRolesAndPermissions = async (ptype: any) => {
    let response;
    try {
      setRolesAndPermissionsLoading(true);
      if (location?.state) {
        if (location.state.modules === null) {
          response =
            await UserManagementService.getAllUserRolesAndPermissions(ptype);
          setUserPermissions(response?.data?.data);
        } else {
          const selectedModules = location.state.modules;
          response =
            await UserManagementService.getAllUserRolesAndPermissions(ptype);

          // Update isSelected and isLandingPage property in response based on selectedModules
          const updatedResponse = response?.data?.data.map(
            (moduleFromAPI: any) => {
              const selectedModule = selectedModules?.find(
                (selectedModule: any) =>
                  selectedModule.moduleId === moduleFromAPI.moduleId
              );

              if (selectedModule) {
                return {
                  ...moduleFromAPI,
                  isSelected: selectedModule.isSelected,
                  pages: moduleFromAPI.pages.map((pageFromAPI: any) => {
                    const selectedPage = selectedModule.pages.find(
                      (selectedPage: any) =>
                        selectedPage.pageId === pageFromAPI.pageId
                    );

                    if (selectedPage) {
                      const isLandingPage = selectedPage.isLandingPage || false;

                      // Set the landing page dropdown value if this page is landing page
                      if (isLandingPage) {
                        setSelectedLandingPage({
                          value: `${moduleFromAPI.moduleId}-${pageFromAPI.pageId}`,
                          label: `${moduleFromAPI.moduleName} - ${pageFromAPI.pageName}`,
                        });
                      }

                      return {
                        ...pageFromAPI,
                        isSelected: selectedPage.isSelected,
                        isLandingPage: isLandingPage,
                        permissions: pageFromAPI.permissions.map(
                          (permissionFromAPI: any) => {
                            const selectedPermission =
                              selectedPage.permissions.find(
                                (selectedPermission: any) =>
                                  selectedPermission.pagePermissionId ===
                                  permissionFromAPI.pagePermissionId
                              );

                            if (selectedPermission) {
                              return {
                                ...permissionFromAPI,
                                isSelected: selectedPermission.isSelected,
                              };
                            }

                            return permissionFromAPI;
                          }
                        ),
                      };
                    }

                    return { ...pageFromAPI, isLandingPage: false };
                  }),
                };
              }

              return { ...moduleFromAPI, isLandingPage: false };
            }
          );

          setUserPermissions(updatedResponse);
        }
      } else {
        response =
          await UserManagementService.getAllUserRolesAndPermissions(ptype);
        // Initialize isLandingPage property for new data
        const initializedResponse = response?.data?.data.map((module: any) => ({
          ...module,
          pages: module.pages.map((page: any) => ({
            ...page,
            isLandingPage: false,
          })),
        }));
        setUserPermissions(initializedResponse);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRolesAndPermissionsLoading(false);
    }
  };

  const facilityId = useSelector(
    (state: any) => state?.Reducer?.facilityData?.facilityId
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location?.state?.roleId > 0) return false;
        else {
          const response =
            await UserManagementService.getAllUserRolesAndPermissions(2);
          if (facilityId && response?.data?.data) {
            // Initialize isLandingPage property for new data
            const initializedResponse = response.data.data.map(
              (module: any) => ({
                ...module,
                pages: module.pages.map((page: any) => ({
                  ...page,
                  isLandingPage: false,
                })),
              })
            );
            setUserPermissions(initializedResponse);
          }
        }
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching user roles and permissions:", error);
      }
    };

    fetchData(); // Call the async function immediately
  }, []);

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
              <div className="card-header d-flex justify-content-sm-between justify-content-center minh-42px align-items-center">
                <h5 className="m-2 ">
                  {location?.state?.roleId
                    ? t("Edit User Roles")
                    : t("Add User Roles")}
                </h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <Link
                    id={`AdminUserRoleCancel`}
                    to="/manageuserrole"
                    className="fw-bold btn btn-secondary btn-sm btn-secondary--icon rounded "
                  >
                    <span>
                      <span>{t("Cancel")}</span>
                    </span>
                  </Link>
                  {location?.state?.roleId > 0 ? (
                    <LoadButton
                      id={`AdminUserRoleUpdating`}
                      className="btn btn-sm fw-bold btn-primary"
                      loading={isSubmitting}
                      btnText={t("Update")}
                      loadingText={t("Updating")}
                    />
                  ) : (
                    <LoadButton
                      id={`AdminUserRoleSave`}
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
                  id={`AdminUserRoleUserRoleName`}
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
                {/* Role Type Section */}
                <div className="fv-row mb-4">
                  <Radio
                    label={t("Role Type:")}
                    name="roleType"
                    onChange={(event) => {
                      setSelectAll(false);
                      setSelectedLandingPage(null); // Clear landing page when role type changes
                      changeHandler(event);
                    }}
                    choices={[
                      {
                        id: "Admin",
                        label: t("Admin"),
                        value: String(PortalTypeEnum.Admin),
                      },
                      {
                        id: "Facility",
                        label: t("Facility"),
                        value: String(PortalTypeEnum.Facility),
                      },
                      {
                        id: "Sales",
                        label: t("Sales"),
                        value: String(PortalTypeEnum.Sales),
                      },
                    ]}
                    error={errors?.roleType}
                    checked={formData?.roleType?.value.toString()}
                    disabled={
                      location?.state?.roleId || facilityId ? true : false
                    }
                  />
                </div>

                {/* Configuration Options Row */}
                <div className="row mb-4">
                  {/* Landing Page Dropdown */}
                  <div className="col-md-8 col-12 mb-3 mb-md-0">
                    <label className="form-label fw-600 fs-7">
                      {t("Landing Page")}
                    </label>
                    <Select
                      value={selectedLandingPage}
                      onChange={handleLandingPageChange}
                      options={getAllAvailablePages()}
                      isClearable
                      placeholder={t("Select Landing Page")}
                      classNamePrefix="react-select"
                      styles={reactSelectSMStyle}
                    />
                  </div>

                  {/* Hide Side Menu Checkbox */}
                  <div className="col-md-4 col-12 d-flex align-items-end">
                    <div className="w-100">
                      <CheckBoxDuplicate
                        name="isHideSideMenu"
                        checked={isHideSideMenu}
                        onChange={(e) =>
                          handleSideMenuCheckbox(e.target.checked)
                        }
                        label={t("Hide Side Menu")}
                        labelClassName="form-check form-check-sm form-check-solid mb-2"
                        spanClassName="form-check-label ms-1 fw-600 fs-7"
                      />
                    </div>
                  </div>
                </div>

                <hr />
                <div style={{ width: "fit-content" }}>
                  <CheckBoxDuplicate
                    id="AdminUserRoleCheckBox"
                    name="allcheckbox"
                    checked={selectAll}
                    onChange={(e) => handleAllSelect(e.target.checked)}
                    label={t("All")}
                    labelClassName="form-check form-check-sm form-check-solid col-12 mb-2 mt-2"
                    spanClassName="form-check-label ms-1 fw-600 fs-7"
                    parentDivClassName="col-12"
                  />
                </div>

                {rolesAndPermissionsLoading ? (
                  <span>{t("Loading...")}</span>
                ) : (
                  userPermissions.map(
                    (
                      { moduleId, moduleName, pages, isSelected }: any,
                      moduleIndex: number
                    ) => (
                      <div
                        key={moduleId}
                        className="mb-2 col-xl-12 col-lg-12 col-md-12 col-sm-12 "
                      >
                        <div className="modal-content">
                          <div className="form__group form__group--checkbox bg-light px-2 py-1 d-flex justify-content-between">
                            <label
                              htmlFor="kt_roles_select_all"
                              className="form-check form-check-custom"
                            >
                              <input
                                className="form-check-input w-15px h-15px rounded-01 "
                                type="checkbox"
                                value=""
                                id={`module_checkbox_${moduleId}`}
                                onChange={(e) =>
                                  handleModuleCheckbox(
                                    e.target.checked,
                                    moduleId
                                  )
                                }
                                checked={isSelected}
                              />
                              <span className="form-check-label ms-1 fw-600 fs-7">
                                {moduleName}
                                <i className="bi bi-arrow-right fs-8 text-primary ms-1"></i>
                              </span>
                            </label>
                          </div>

                          <div className="modal-body ">
                            <form
                              id={`kt_modal_add_role_form_${moduleId}`}
                              className="form"
                              action="#"
                            >
                              <div
                                className="d-flex flex-column scroll-y me-n7 pe-7"
                                id="kt_modal_add_role_scroll"
                                data-kt-scroll="true"
                                data-kt-scroll-activate="{default: false, lg: true}"
                                data-kt-scroll-maxHeight="auto"
                                data-kt-scroll-dependencies="#kt_modal_add_role_header"
                                data-kt-scroll-wrappers="#kt_modal_add_role_scroll"
                                data-kt-scroll-offset="300px"
                              >
                                {pages.map(
                                  (
                                    {
                                      pageName,
                                      pageId,
                                      permissions,
                                      isSelected,
                                      isLandingPage: pageIsLandingPage,
                                    }: any,
                                    pageIndex: number
                                  ) => (
                                    <div
                                      key={pageId}
                                      className="row py-2 border-bottom mx-md-9 mx-5"
                                    >
                                      <div className="row align-items-start">
                                        {/* Page Name Section */}
                                        <div className="col-12 col-lg-3 mb-2 mb-lg-0">
                                          <label
                                            htmlFor={`page_checkbox_${pageId}`}
                                            className="form-check form-check-custom d-flex align-items-center"
                                          >
                                            <input
                                              className="form-check-input w-15px h-15px rounded-01 me-2"
                                              type="checkbox"
                                              value=""
                                              id={`page_checkbox_${pageId}`}
                                              checked={isSelected}
                                              onChange={(e) =>
                                                handleAllSinglePage(
                                                  e.target.checked,
                                                  moduleId,
                                                  pageId
                                                )
                                              }
                                            />
                                            <span className="form-check-label text-primary fw-600 fs-7">
                                              {pageName}
                                              {pageIsLandingPage && (
                                                <span className="badge badge-sm badge-primary ms-2">
                                                  {t("Landing")}
                                                </span>
                                              )}
                                            </span>
                                          </label>
                                        </div>

                                        {/* Permissions Section */}
                                        <div className="col-12 col-lg-9">
                                          <div className="row g-2">
                                            {permissions.map(
                                              (
                                                {
                                                  permissionName,
                                                  isSelected,
                                                  pagePermissionId,
                                                }: any,
                                                permissionIndex: number
                                              ) => (
                                                <div
                                                  key={pagePermissionId}
                                                  className="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3"
                                                >
                                                  <label
                                                    htmlFor={`single_page_checkbox_${pagePermissionId}`}
                                                    className="form-check form-check-custom d-flex align-items-center w-100"
                                                  >
                                                    <input
                                                      className="form-check-input w-15px h-15px rounded-01 me-2 flex-shrink-0"
                                                      type="checkbox"
                                                      value=""
                                                      id={`single_page_checkbox_${pagePermissionId}`}
                                                      onChange={(e) =>
                                                        handleSinglePage(
                                                          e.target.checked,
                                                          moduleId,
                                                          pageId,
                                                          pagePermissionId,
                                                          moduleIndex,
                                                          pageIndex,
                                                          permissionIndex
                                                        )
                                                      }
                                                      checked={isSelected}
                                                    />
                                                    <span className="form-check-label text-gray-900 fw-600 fs-8 text-truncate">
                                                      {permissionName}
                                                    </span>
                                                  </label>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddUserRoles;
