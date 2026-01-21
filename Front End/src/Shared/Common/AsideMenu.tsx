import { Tooltip } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { connect } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setValueIntoSessionStorage } from "../../Utils/Common/CommonMethods";
import useLang from "./../hooks/useLanguage";
import UserDropdown from "./UserDropdown";
import useIsMobile from "Shared/hooks/useIsMobile";

declare global {
  interface Window {
    KTDrawer?: any;
  }
}

const dummyIcon =
  process.env.REACT_APP_PUBLIC_URL + "/media/menu-svg/dummy-icon.svg";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(() => ({
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  "& .css-1betqn-MuiAccordionSummary-content": {
    margin: 0,
  },
  "& .MuiButtonBase-root-MuiAccordionSummary-root": {
    minHeight: "auto !important",
    background: "red !important",
  },
}));

const AsideMenu = (props: any) => {
  const isMobile = useIsMobile();

  const handleMobileClose = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };



  const handleMobileClosedraw = () => {
  if (isMobile) {
    setIsOpen(false);
    document.body.classList.remove("data-kt-app-sidebar-minimize-on");
    localStorage.setItem("isHideSideMenu", "false"); // prevent reopening
 
 
                     
    // ✅ Also close Metronic's internal drawer
    const sidebarEl = document.querySelector("#kt_app_sidebar");
    if (sidebarEl && sidebarEl.classList.contains("drawer-on")) {
      sidebarEl.classList.remove("drawer-on");
    }

    // ✅ Also trigger KTDrawer close if available
    if (window.KTDrawer) {
      const drawerInstance = window.KTDrawer.getInstance(sidebarEl);
      if (drawerInstance) drawerInstance.hide();
    }



// ✅ Also remove leftover Metronic overlay (the gray shadow)
const overlayEl = document.querySelector(".drawer-overlay, .app-drawer-overlay");
if (overlayEl && overlayEl.parentNode) {
  overlayEl.parentNode.removeChild(overlayEl);
}

 
 
 
  }
};




  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [expandable, setExpandable] = React.useState<string | false>("");

  const handleMenuChange =
    (panelw: string) => (_: React.SyntheticEvent, moduleExpanded: boolean) => {
      setExpandable(moduleExpanded ? panelw : false);
    };

  const clearLocationState = () => {
    navigate("/requisition", { replace: true, state: null });
  };

  useEffect(() => {
    document.body.classList.toggle("data-kt-app-sidebar-minimize-on", isOpen);
  }, [isOpen]);

  const checkForActiveMenuItem = (link: string, pageId: string) => {
    if (!pageId || !link) return false;
    const encodedPageId = window.btoa(pageId).trim();
    const normalizedPath = location.pathname.replace(/\/+$/, "");

    // Exact match
    if (normalizedPath === link) {
      return true;
    }

    // Match with encoded PageId
    if (normalizedPath === `${link}/${encodedPageId}`) {
      return true;
    }

    // Partial match for dynamic routes
    if (normalizedPath.startsWith(link)) {
      const remainingPath = normalizedPath
        .slice(link.length)
        .replace(/^\//, "");
      return remainingPath === encodedPageId || remainingPath === "";
    }

    return false;
  };

  const handleDynamicPages = (link: string) => {
    const pages = [
      "/dynamic-form",
      "/dynamic-grid",
      "/dynamic-one-ui",
      "/dynamic-split-pane",
    ];

    return pages.includes(link);
  };

  const isHideSideMenu = JSON.parse(
    localStorage.getItem("isHideSideMenu") || "false"
  );

  // useLayoutEffect(() => {
  //   if (isHideSideMenu) {
  //     setIsOpen(true);
  //     document.body.classList.add("data-kt-app-sidebar-minimize-on");
  //   } else {
  //     setIsOpen(false);
  //     document.body.classList.remove("data-kt-app-sidebar-minimize-on");
  //   }
  // }, [isHideSideMenu]);



  useLayoutEffect(() => {
  // Only apply persistent sidebar logic on desktop
  if (!isMobile) {
    if (isHideSideMenu) {
      setIsOpen(true);
      document.body.classList.add("data-kt-app-sidebar-minimize-on");
    } else {
      setIsOpen(false);
      document.body.classList.remove("data-kt-app-sidebar-minimize-on");
    }
  }
}, [isHideSideMenu, isMobile]);

  return (
    <div
      id="kt_app_sidebar"
      className={`app-sidebar flex-column ${props.data}`}
    >
      <div className="app-sidebar-logo" id="kt_app_sidebar_logo">
        {!isHideSideMenu ? (
          <Link to="/" className="w-100 overflow-hidden">
            <div className="d-flex justify-content-center">
              <img
                alt={t("Logo")}
                src={props?.User?.labinfo?.logo}
                className="h-40px app-sidebar-logo-default"
              />
              <img
                alt={t("Logo")}
                src={props?.User?.labinfo?.smartLogo}
                className="app-sidebar-logo-minimize h-40px"
              />
            </div>
          </Link>
        ) : (
          <div className="w-100 overflow-hidden d-flex justify-content-center">
            <img
              alt={t("Logo")}
              src={props?.User?.labinfo?.logo}
              className="h-40px app-sidebar-logo-default"
            />
            <img
              alt={t("Logo")}
              src={props?.User?.labinfo?.smartLogo}
              className="app-sidebar-logo-minimize h-40px"
            />
          </div>
        )}
        {!isHideSideMenu ? (
          <div
            id="kt_app_sidebar_toggle"
            onClick={() => setIsOpen(!isOpen)}
            className={`app-sidebar-toggle btn btn-icon
                    btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute top-50
                    start-100 translate-middle rotate ${
                      isOpen ? "active" : null
                    }`}
            data-kt-toggle="true"
            data-kt-toggle-state="active"
            data-kt-toggle-target="body"
            data-kt-toggle-name="app-sidebar-minimize"
          >
            <span className="svg-icon svg-icon-2 rotate-180">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
                  fill="currentColor"
                />
                <path
                  d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        ) : null}
      </div>

      {!isHideSideMenu ? (
        <div className="app-sidebar-menu overflow-hidden flex-column-fluid">
          <div
            id="kt_app_sidebar_menu_wrapper"
            className="app-sidebar-wrapper hover-scroll-overlay-y mt-5 bg-white"
            data-kt-scroll="true"
            data-kt-scroll-activate="true"
            data-kt-scroll-height="auto"
            data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
            data-kt-scroll-wrappers="#kt_app_sidebar_menu"
            data-kt-scroll-offset="10px"
            data-kt-scroll-save-state="true"
          >
            <div
              className="menu menu-column menu-rounded menu-sub-indention scroll menu-scroll-height"
              id="#kt_app_sidebar_menu"
              data-kt-menu="true"
              data-kt-menu-expand="false"
            >
              {props.User?.Menus?.map((module: any, index: number) => (
                <Accordion
                  className="menu-item menu-accordion border-0"
                  key={index}
                  expanded={expandable === `${index}`}
                  onChange={handleMenuChange(`${index}`)}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                    className="p-0 hover-menu-pointer"
                    expandIcon={
                      <div className="py-2 pe-2">
                        <RxCaretDown size={20} />
                      </div>
                    }
                  >
                    <div
                      className="menu-link"
                      data-test-id={t(module?.module) + "-module"}
                    >
                      <span
                        className="menu-bullet"
                        data-test-id={t(module?.module) + "-module-icon"}
                      >
                        <img
                          src={
                            module?.moduleIcon ??
                            process.env.REACT_APP_PUBLIC_URL +
                              "/media/menu-svg/dummy-icon.svg"
                          }
                          alt=""
                          className="img-fluid"
                        />
                      </span>
                      <span
                        className="menu-title"
                        data-test-id={t(module?.module) + "-module-title"}
                      >
                        {t(module?.module)}
                      </span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="p-0 aside-menu-body">
                    <div className="module-title">
                      <span
                        className="menu-bullet"
                        data-test-id={t(module?.module) + "-module-icon"}
                      >
                        <img
                          src={
                            module?.moduleIcon ??
                            process.env.REACT_APP_PUBLIC_URL +
                              "/media/menu-svg/dummy-icon.svg"
                          }
                          alt=""
                          className="img-fluid h-20px"
                        />
                      </span>
                      <span
                        className="menu-title fs-5"
                        data-test-id={t(module?.module) + "-module-title"}
                      >
                        {t(module?.module)}
                      </span>
                    </div>
                    {module?.claims?.length > 0
                      ? // 1st level
                        Array.isArray(module?.claims) &&
                        module?.claims?.map((n1items: any) => (
                          <>
                            <Accordion
                              expanded={expandable === n1items?.id}
                              onChange={handleMenuChange(n1items?.id)}
                              className="menu-item menu-accordion border-0 mid-accord"
                            >
                              <AccordionSummary
                                aria-controls="panel1d-content"
                                id="panel1d-header"
                                className="p-0"
                                onClick={handleMobileClose}
                              >
                                <div
                                  className="align-items-center d-flex justify-content-between w-100"
                                  style={{ width: "272px" }}
                                >
                                  <Link
                                    to={
                                      handleDynamicPages(n1items?.linkUrl)
                                        ? `${n1items?.linkUrl}/${window.btoa(
                                            n1items.id
                                          )}`
                                        : (n1items?.linkUrl ?? "#")
                                    }
                                    onClick={(e) => {
                                      console.log(e, "e.target");
                                       handleMobileClosedraw()

     

                                      e.stopPropagation();
                                      setValueIntoSessionStorage(
                                        "pageId",
                                        n1items?.id
                                      );
                                    }}
                                    state={{
                                      data: {
                                        id: n1items?.id,
                                        obj: { n1items },
                                      },
                                    }}
                                    className="menu-link"
                                    style={{
                                      paddingLeft: "2rem",
                                    }}
                                    data-test-id={
                                      t(n1items?.linkUrl)?.replace(/^\/+/, "") +
                                      "-page-link"
                                    }
                                  >
                                    <span
                                      className="menu-bullet"
                                      data-test-id={
                                        t(n1items?.linkUrl)?.replace(
                                          /^\/+/,
                                          ""
                                        ) + "-page-icon"
                                      }
                                    >
                                      <Tooltip
                                        title={t(n1items?.name)}
                                        arrow
                                        placement="right"
                                      >
                                        <img
                                          src={n1items?.iCon ?? dummyIcon}
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </Tooltip>
                                    </span>
                                    <span
                                      className="menu-title"
                                      style={{
                                        color: checkForActiveMenuItem(
                                          n1items?.linkUrl,
                                          n1items.id
                                        )
                                          ? "#69A54B"
                                          : "",
                                      }}
                                      data-test-id={
                                        t(n1items?.linkUrl)?.replace(
                                          /^\/+/,
                                          ""
                                        ) + "-page-title"
                                      }
                                    >
                                      {n1items?.name === "New Requisition" ? (
                                        <span onClick={clearLocationState}>
                                          {t(n1items?.name)}
                                        </span>
                                      ) : (
                                        t(n1items?.name)
                                      )}
                                    </span>
                                    {n1items?.claims?.length > 0 ? (
                                      <span className="menu-arrow"></span>
                                    ) : null}
                                  </Link>

                                  {Array.isArray(n1items?.subClaims) &&
                                    n1items?.subClaims.map(
                                      (subItemsForAdd: any) => (
                                        <>
                                          <Link
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setValueIntoSessionStorage(
                                                "pageId",
                                                n1items?.id
                                              );
                                            }}
                                            className="bg-primary text-white h-20px px-2 d-flex align-items-center rounded-4 fs-8 fw-300"
                                            to={subItemsForAdd?.linkUrl ?? "#"}
                                            state={{
                                              data: {
                                                id: subItemsForAdd?.id,
                                              },
                                            }}
                                          >
                                            {t("Add")}
                                          </Link>
                                        </>
                                      )
                                    )}
                                </div>
                              </AccordionSummary>
                            </Accordion>
                          </>
                        ))
                      : Array.isArray(module?.children)
                        ? module?.children.map(
                            (n1items: any, index: number) => (
                              <div
                                className="menu-item"
                                key={index + n1items.label}
                              >
                                <Link
                                  to={n1items?.navigationLink}
                                  state={{ data: { id: module?.id } }}
                                  className="menu-link"
                                >
                                  <span className="menu-bullet">
                                    <Tooltip
                                      title={n1items?.label}
                                      arrow
                                      placement="right"
                                    >
                                      <img
                                        src={n1items?.icon ?? dummyIcon}
                                        alt=""
                                        className="img-fluid"
                                      />
                                    </Tooltip>
                                  </span>
                                  <span className="menu-title">
                                    {t(n1items?.label)}
                                  </span>
                                </Link>
                                <span
                                  className="menu-label position-absolute end-0 bottom-0 top-0 w-40px h-20px mr-2"
                                  style={{
                                    margin: "auto",
                                  }}
                                >
                                  <Link
                                    to={n1items?.navigationLinkAdd}
                                    state={{ data: { id: module?.moduleId } }}
                                    className="cursor-pointer badge badge-primary fs-7"
                                  >
                                    {t(n1items?.labelAdd)}
                                  </Link>
                                </span>
                              </div>
                            )
                          )
                        : null}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="position-fixed bottom-0 ms-3 mb-3 d-lg-block d-none">
        <UserDropdown isOpen={isOpen} />
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}

export default connect(mapStateToProps)(AsideMenu);
