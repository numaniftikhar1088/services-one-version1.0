import * as React from "react";
//import TreeView, { flattenTree } from "react-accessible-treeview";
import useLang from "../../../../Shared/hooks/useLanguage";
import { GetElementsFromArray } from "../../../../Utils/Common/CommonMethods";

interface Props {
  checkboxes: any;
  setCheckboxes: any;
}

const AdditionalUserRole: React.FC<Props> = ({ checkboxes, setCheckboxes }) => {
  const { t } = useLang();
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
    var CopieduserPermissions = [...checkboxes];
    CopieduserPermissions[moduleIndex].pages[pageIndex].permissions[
      permissionIndex
    ].isSelected = checked;
    if (checked) {
      CopieduserPermissions[moduleIndex].pages[pageIndex].isSelected = true;
      CopieduserPermissions[moduleIndex].isSelected = true;
    } else {
      let selectedItems: any = GetElementsFromArray(
        CopieduserPermissions[moduleIndex].pages[pageIndex].permissions,
        (item: any) => item.isSelected == true
      );
      if (selectedItems.length === 0) {
        CopieduserPermissions[moduleIndex].pages[pageIndex].isSelected = false;
        if (
          CopieduserPermissions[moduleIndex].pages.filter(
            (page: any) => page.isSelected
          ).length === 0
        ) {
          CopieduserPermissions[moduleIndex].isSelected = false;
        }
      }
    }
    setCheckboxes(CopieduserPermissions);
  };
  //========== onchange for single page select ==========
  const handleAllSinglePage = (
    checked: boolean,
    moduleId: number,
    pageId: number,
    moduleIndex: number,
    pageIndex: number
  ) => {
    let updatedUserPermissions = checkboxes.map((module: any) => {
      if (module.moduleId === moduleId) {
        let updatedModule = { ...module };
        updatedModule.isSelected = true;
        updatedModule.pages = updatedModule.pages.map((page: any) => {
          if (page.pageId === pageId) {
            let updatedPage = { ...page };
            updatedPage.isSelected = checked;
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
    setCheckboxes(updatedUserPermissions);
  };
  // ===== select handle module checkboxes
  const handleModuleCheckbox = (checked: boolean, moduleId: number) => {
    let updatedUserPermissions = checkboxes.map((module: any) => {
      if (module.moduleId === moduleId) {
        let updatedModule = { ...module };
        updatedModule.isSelected = checked;
        updatedModule.pages = updatedModule.pages.map((page: any) => {
          let updatedPage = { ...page };
          updatedPage.isSelected = checked;
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
    setCheckboxes(updatedUserPermissions);
  };

  return (
    <>
      {checkboxes?.length > 0 ? (
        <h4 className="mb-5">{t("User Rights")}</h4>
      ) : null}
      {/* <h4 className="mb-5">User Rights</h4> */}
      {checkboxes?.map(
        (
          { moduleId, moduleName, pages, isSelected }: any,
          moduleIndex: number
        ) => (
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
                      id={`module_checkbox_${moduleId}`}
                      onChange={(e) =>
                        handleModuleCheckbox(e.target.checked, moduleId)
                      }
                      checked={isSelected}
                    />
                    <span className="form-check-label ms-1 fw-600 fs-7">
                      {t(moduleName)}
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
                      data-kt-scroll-max-height="auto"
                      data-kt-scroll-dependencies="#kt_modal_add_role_header"
                      data-kt-scroll-wrappers="#kt_modal_add_role_scroll"
                      data-kt-scroll-offset="300px"
                    >
                      {pages.map(
                        (
                          { pageName, pageId, permissions, isSelected }: any,
                          pageIndex: number
                        ) => (
                          <>
                            <div className="row py-2 border-bottom mx-md-9 mx-5">
                              <div className="text-gray-800 col-xxl-2 col-xl-3 col-lg-3 col-12 border-0">
                                <label
                                  htmlFor={`page_checkbox_${pageId}`}
                                  className="form-check form-check-custom align-items-start"
                                >
                                  <input
                                    className="form-check-input w-15px h-15px rounded-01 "
                                    type="checkbox"
                                    value=""
                                    id={`page_checkbox_${pageId}`}
                                    checked={isSelected}
                                    onChange={(e) =>
                                      handleAllSinglePage(
                                        e.target.checked,
                                        moduleId,
                                        pageId,
                                        moduleIndex,
                                        pageIndex
                                      )
                                    }
                                  />
                                  <span className="form-check-label text-primary ms-1 fw-600 fs-7 ">
                                    {t(pageName)}
                                    <i className="bi bi-chevron-double-right fs-8 text-primary ms-1"></i>
                                  </span>
                                </label>
                              </div>
                              <div className="col-xxl-10 col-xl-9 col-lg-9">
                                <div className="row">
                                  {permissions.map(
                                    (
                                      {
                                        permissionName,
                                        isSelected,
                                        pagePermissionId,
                                      }: any,
                                      permissionIndex: number
                                    ) => (
                                      <>
                                        <div className="col-xl-2 col-lg-4 col-md-3 col-sm-4 col-6 border-0">
                                          <label
                                            htmlFor={`single_page_checkbox_${pagePermissionId}`}
                                            className="form-check form-check-custom align-items-start"
                                          >
                                            <input
                                              className="form-check-input w-15px h-15px rounded-01"
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
                                            <span className="form-check-label text-gray-900 ms-1 fw-600 fs-9">
                                              {t(permissionName)}
                                            </span>
                                          </label>
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </>
  );
};

export default AdditionalUserRole;
