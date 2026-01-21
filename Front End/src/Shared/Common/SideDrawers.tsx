import Drawer from "@mui/material/Drawer";
import * as React from "react";
import { useSelector } from "react-redux";
import { PortalTypeEnum } from "../../Utils/Common/Enums/Enums";
import useLang from "./../hooks/useLanguage";
import SelectLab from "./SwitchPortalOrFacility";

// type Anchor = "Demo" | "Support" | "SelectLab";

export const SideDrawers = (props: any) => {
  const { t } = useLang();
  const [state, setState] = React.useState({
    // Demo: false,
    Support: false,
    // SelectLab: false,
  });

  const toggleDrawer =
    (anchor: any, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const User = useSelector((state: any) => state?.Reducer);
  const anchors = [];

  if (
    User?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ==
      PortalTypeEnum.Facility
  ) {
    if (User?.facilityInfo?.length > 1) {
      anchors.push("Select Facility");
    }
  } else {
    if (User?.token?.authTenants?.length > 1) {
      anchors.push(t("Select Lab"));
    }
  }

  return (
    <div className=" engage-toolbar d-flex position-fixed px-5 fw-bold zindex-2 top-50 end-0 transform-90 mt-5 mt-lg-20 gap-2">
      {anchors.map((anchor) => (
        <React.Fragment key={anchor}>
          <button
            onClick={toggleDrawer(anchor, true)}
            className={`engage-demos-toggle btn btn-flex h-35px bg-body btn-color-gray-700 btn-active-color-gray-900 shadow-sm  px-4 rounded-top-0
            ${anchor == "Select Lab" ? "d-lg-block d-none" : null}
            `}
          >
            <span>{anchor}</span>
          </button>
          <Drawer
            anchor={"right"}
            open={(state as any)[anchor]}
            onClose={toggleDrawer(anchor, false)}
          
          >
            {/* ************************** Drawer Body Content *********************** */}
            {anchor == "Demo" ? (
              <div className="card shadow-none rounded-0 w-350px w-md-475px">
                {/* ************************** Demo Body *********************** */}
                <div className="card-header" id="kt_engage_demos_header">
                  <h3 className="card-title fw-bold text-gray-700">
                    {t("Demos")}
                  </h3>
                  <div className="card-toolbar">
                    <button
                      type="button"
                      className="btn btn-sm btn-icon btn-active-color-primary h-40px w-40px me-n6"
                      onClick={toggleDrawer(anchor, false)}
                    >
                      {/*begin::Svg Icon | path: icons/duotune/arrows/arr061.svg*/}
                      <span className="svg-icon svg-icon-2">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.5"
                            x={6}
                            y="17.3137"
                            width={16}
                            height={2}
                            rx={1}
                            transform="rotate(-45 6 17.3137)"
                            fill="currentColor"
                          />
                          <rect
                            x="7.41422"
                            y={6}
                            width={16}
                            height={2}
                            rx={1}
                            transform="rotate(45 7.41422 6)"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      {/*end::Svg Icon*/}
                    </button>
                  </div>
                </div>
              </div>
            ) : anchor == "Support" ? (
              <div className="card shadow-none rounded-0 w-350px w-md-475px">
                {/* ************************** Support Body  *********************** */}
                <div className="card-header" id="kt_help_header">
                  <h5 className="card-title fw-bold text-gray-700">
                    {t("Support Guidelines")}
                  </h5>
                  <div className="card-toolbar">
                    <button
                      type="button"
                      className="btn btn-sm btn-icon explore-btn-dismiss me-n5"
                      onClick={toggleDrawer(anchor, false)}
                    >
                      {/*begin::Svg Icon | path: icons/duotune/arrows/arr061.svg*/}
                      <span className="svg-icon svg-icon-2">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.5"
                            x={6}
                            y="17.3137"
                            width={16}
                            height={2}
                            rx={1}
                            transform="rotate(-45 6 17.3137)"
                            fill="currentColor"
                          />
                          <rect
                            x="7.41422"
                            y={6}
                            width={16}
                            height={2}
                            rx={1}
                            transform="rotate(45 7.41422 6)"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      {/*end::Svg Icon*/}
                    </button>
                  </div>
                </div>
                <div className="card-body px-3 px-md-8">
                  <div
                    id="kt_help_scroll"
                    className="hover-scroll-overlay-y"
                    data-kt-scroll="true"
                    data-kt-scroll-height="auto"
                    data-kt-scroll-wrappers="#kt_help_body"
                    data-kt-scroll-dependencies="#kt_help_header"
                    data-kt-scroll-offset="5px"
                  >
                    <form
                      id="kt_modal_new_ticket_form"
                      className="form"
                      action="#"
                    >
                      <div className="d-flex flex-column mb-8 fv-row">
                        <label className="d-flex align-items-center fs-6 fw-semibold mb-2">
                          <span className="required">{t("Subject")}</span>
                          <i
                            className="fas fa-exclamation-circle ms-2 fs-7"
                            data-bs-toggle="tooltip"
                            title="Specify a subject for your issue"
                          ></i>
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder="Enter your ticket subject"
                          name="subject"
                        />
                      </div>

                      <div className="d-flex flex-column mb-8 fv-row">
                        <label className="fs-6 fw-semibold mb-2">
                          {t("Description")}
                        </label>
                        <textarea
                          className="form-control form-control-solid"
                          rows={4}
                          name="description"
                          placeholder="Type your ticket description"
                        ></textarea>
                      </div>

                      <div className="fv-row mb-8">
                        <label className="fs-6 fw-semibold mb-2">
                          {t("Attachments")}
                        </label>

                        <div
                          className="dropzone"
                          id="kt_modal_create_ticket_attachments"
                        >
                          <div className="dz-message needsclick align-items-center">
                            <span className="svg-icon svg-icon-3hx svg-icon-primary">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  opacity="0.3"
                                  d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM14.5 12L12.7 9.3C12.3 8.9 11.7 8.9 11.3 9.3L10 12H11.5V17C11.5 17.6 11.4 18 12 18C12.6 18 12.5 17.6 12.5 17V12H14.5Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M13 11.5V17.9355C13 18.2742 12.6 19 12 19C11.4 19 11 18.2742 11 17.9355V11.5H13Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M8.2575 11.4411C7.82942 11.8015 8.08434 12.5 8.64398 12.5H15.356C15.9157 12.5 16.1706 11.8015 15.7425 11.4411L12.4375 8.65789C12.1875 8.44737 11.8125 8.44737 11.5625 8.65789L8.2575 11.4411Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>

                            <div className="ms-4">
                              <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                                {t("Drop files here or click to upload.")}
                              </h3>
                              <span className="fw-semibold fs-7 text-gray-400">
                                {t("Upload up to 10 files")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="">
                        <button
                          type="reset"
                          onClick={toggleDrawer(anchor, false)}
                          className="btn btn-light me-3"
                        >
                          {t("Cancel")}
                        </button>
                        <button
                          onClick={toggleDrawer(anchor, false)}
                          className="btn btn-primary"
                        >
                          <span className="indicator-label">{t("Submit")}</span>
                          <span className="indicator-progress">
                            {t("Please wait...")}
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-none rounded-0 w-350px w-md-475px">
                {/* ************************** Demo Body *********************** */}
                <div className="card-header" id="kt_engage_demos_header">
                  <h3 className="card-title fw-bold text-gray-700">
                    {User?.selectedTenantInfo?.infomationOfLoggedUser
                      ?.adminType == PortalTypeEnum.Facility
                      ? t("Select Facility")
                      : t("Select Lab")}
                  </h3>
                  <div className="card-toolbar">
                    <button
                      type="button"
                      className="btn btn-sm btn-icon btn-active-color-primary h-40px w-40px me-n6"
                      onClick={toggleDrawer(anchor, false)}
                    >
                      {/*begin::Svg Icon | path: icons/duotune/arrows/arr061.svg*/}
                      <span className="svg-icon svg-icon-2">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.5"
                            x={6}
                            y="17.3137"
                            width={16}
                            height={2}
                            rx={1}
                            transform="rotate(-45 6 17.3137)"
                            fill="currentColor"
                          />
                          <rect
                            x="7.41422"
                            y={6}
                            width={16}
                            height={2}
                            rx={1}
                            transform="rotate(45 7.41422 6)"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      {/*end::Svg Icon*/}
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <SelectLab />
                </div>
              </div>
            )}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};
