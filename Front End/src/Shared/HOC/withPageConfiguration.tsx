import { ComponentType, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";
import {
  getValueFromSessionStorage,
  setFaviconAndTitle,
  setValueIntoSessionStorage,
} from "../../Utils/Common/CommonMethods";
import useLang from "../hooks/useLanguage";

interface MenuItem {
  id: number;
  name: string;
}

interface Module {
  module: string;
  claims: MenuItem[];
}

interface PageLink {
  id: number;
  linkUrl: string;
}

interface WebInfo {
  smartLogoUrl: string;
  title: string;
}

interface ReduxState {
  Reducer: {
    links: PageLink[];
    Menus: Module[];
    webInfo: WebInfo;
  };
  LoadingIndicatorReducer: {
    loaderVisible: boolean;
  };
}

const withPageConfiguration = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const PageConfigurationWrapper = (props: P) => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const pageLinks = useSelector((state: ReduxState) => state.Reducer?.links);
    const menus = useSelector((state: ReduxState) => state.Reducer?.Menus);
    const webInfo = useSelector((state: ReduxState) => state.Reducer?.webInfo);
    const loadingState = useSelector((state: ReduxState) => state);
    const reducer = useSelector((state: any) => state.Reducer);

    console.log(reducer, "reducer");

    const { changeLanguage, i18n } = useLang();

    // Extract page ID from dynamic routes
    const extractPageIdFromDynamicRoutes = (
      pathname: string
    ): number | null => {
      const regexPatterns = [
        /\/dynamic-form\/(.+)/,
        /\/dynamic-grid\/(.+)/,
        /\/dynamic-one-ui\/(.+)/,
        /\/dynamic-split-pane\/(.+)/,
      ];

      for (const pattern of regexPatterns) {
        const match = pathname.match(pattern);
        if (match && match[1]) {
          try {
            return parseInt(window.atob(match[1]), 10);
          } catch (error) {
            console.error("Error decoding page ID from URL:", error);
            return null;
          }
        }
      }

      return null;
    };

    // Build breadcrumb from page ID
    const buildBreadcrumbFromPageId = (pageId: number | null): any[] => {
      const breadCrumb: any[] = [];
      if (Array.isArray(menus) && menus.length > 0 && pageId) {
        menus.forEach((module: Module) => {
          const moduleFind = module.claims.find((claim: MenuItem) => {
            return claim.id === pageId;
          });

          if (moduleFind) {
            breadCrumb.push(
              {
                name: module.module,
              },
              {
                name: moduleFind.name,
              }
            );
          }
        });
      }
      return breadCrumb;
    };

    // Handle page configuration - run synchronously before component renders
    const updatePageConfiguration = () => {
      const pageIdFromDynamicRoute = extractPageIdFromDynamicRoutes(pathname);

      if (pageIdFromDynamicRoute !== null) {
        setValueIntoSessionStorage("pageId", pageIdFromDynamicRoute);
        const breadCrumb = buildBreadcrumbFromPageId(pageIdFromDynamicRoute);
        setValueIntoSessionStorage("currentBreadcrumb", breadCrumb);
        window.dispatchEvent(new Event("storage"));
        return;
      }

      if (pageLinks && Array.isArray(pageLinks) && pageLinks.length > 0) {
        // First, check for an exact match
        let pageIdFromStaticRoute = pageLinks.find((link: PageLink) => {
          if (link.linkUrl) {
            return pathname === link.linkUrl;
          }
        })?.id;

        // If no exact match, check for a partial match
        if (!pageIdFromStaticRoute) {
          pageIdFromStaticRoute = pageLinks.find((link: PageLink) => {
            if (link.linkUrl) {
              return pathname.includes(link.linkUrl);
            }
          })?.id;
        }

        const breadCrumb = buildBreadcrumbFromPageId(
          pageIdFromStaticRoute || null
        );
        console.log(pageIdFromStaticRoute, "pageIdFromStaticRoute");

        setValueIntoSessionStorage("pageId", pageIdFromStaticRoute);
        setValueIntoSessionStorage("currentBreadcrumb", breadCrumb);
        window.dispatchEvent(new Event("storage"));
      }
    };

    // This is triggered if user hasn't selected a facility yet.
    useEffect(() => {
      if (!reducer?.facilityData && reducer?.selectedTenantInfo?.infomationOfLoggedUser?.adminType === PortalTypeEnum.Facility) {
        return navigate("/SelectFacility");
      }
    }, [reducer]);

    // Update configuration synchronously before component paints
    useLayoutEffect(() => {
      updatePageConfiguration();
    }, [pathname, pageLinks, menus]);

    // Handle web info (favicon and title)
    useLayoutEffect(() => {
      const smartLogo = webInfo?.smartLogoUrl;
      const title = webInfo?.title;
      if (smartLogo && title) {
        setFaviconAndTitle(smartLogo, title);
      }
    }, [webInfo]);

    // Handle language configuration
    useEffect(() => {
      changeLanguage(getValueFromSessionStorage("lng"));
      const dir = i18n.dir(getValueFromSessionStorage("lng"));
      document.documentElement.dir = dir;
    }, [changeLanguage, i18n]);

    // Handle loading indicator
    useEffect(() => {
      const collection = document.getElementsByClassName(
        "MuiLinearProgress-root"
      );
      if ((loadingState as any)?.LoadingIndicatorReducer?.loaderVisible) {
        if (collection[0]) collection[0]?.classList.remove("d-none");
      } else {
        if (collection[0]) collection[0]?.classList.add("d-none");
      }
    }, [loadingState]);

    // Clean up userinfo if token data exists
    useEffect(() => {
      const existingUserInfo = localStorage?.getItem("userinfo");
      const tokenFromUrl = new URLSearchParams(window.location.search).get(
        "key"
      );

      if (existingUserInfo && tokenFromUrl) {
        localStorage.removeItem("userinfo");
      }
    }, [location.pathname]);

    return <WrappedComponent {...props} />;
  };

  PageConfigurationWrapper.displayName = `withPageConfiguration(${WrappedComponent.displayName || WrappedComponent.name})`;

  return PageConfigurationWrapper;
};

export default withPageConfiguration;
