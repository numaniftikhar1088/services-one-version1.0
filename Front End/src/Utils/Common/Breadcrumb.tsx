import React, { useEffect, useState } from "react";
import useLang from "./../../Shared/hooks/useLanguage";
import { getValueFromSessionStorage } from "./CommonMethods";
import { useSelector } from "react-redux";

interface BreadcrumbItem {
  name: string;
}

interface PageBreadCrumbsProps {
  breadcrumb: BreadcrumbItem[];
  isLoading: boolean;
}

const PageBreadCrumbs: React.FC<PageBreadCrumbsProps> = React.memo(
  ({ breadcrumb, isLoading }) => {
    const { t } = useLang();
    return (
      <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
        <ul className="breadcrumb breadcrumb-separatorless fs-7 my-0 pt-1">
          {isLoading ? (
            <CustomSkeleton />
          ) : (
            breadcrumb.map((item, index) => (
              <React.Fragment key={item.name}>
                <li className="breadcrumb-item text-muted">
                  {t(item.name) || item.name}
                </li>
                {index < breadcrumb.length - 1 && (
                  <li className="breadcrumb-item">
                    <span className="bullet bg-gray-400 w-5px h-2px"></span>
                  </li>
                )}
              </React.Fragment>
            ))
          )}
        </ul>
      </div>
    );
  }
);

const BreadCrumbs = () => {
  const { t } = useLang();

  const isHideSideMenu = JSON.parse(
    localStorage.getItem("isHideSideMenu") || "false"
  );

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: t("Home") || "Home" },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const webInfo = useSelector((state: any) => state?.Reducer?.webInfo);

  useEffect(() => {
    const updateBreadcrumbs = () => {
      const selectedBreadCrumbs =
        getValueFromSessionStorage("currentBreadcrumb");
      setBreadcrumbs([
        { name: t("Home") || "Home" },
        ...(selectedBreadCrumbs ?? []),
      ]);
      setIsLoading(false);
    };

    updateBreadcrumbs();

    window.addEventListener("storage", updateBreadcrumbs);

    return () => {
      window.removeEventListener("storage", updateBreadcrumbs);
    };
  }, [t]);

  useEffect(() => {
    const nameToShow = breadcrumbs[breadcrumbs.length - 1].name;
    if (nameToShow !== "Home") {
      document.title = `${nameToShow} ${
        webInfo?.title ? `| ${webInfo?.title}` : ""
      }`;
    }
  }, [breadcrumbs]);

  // Hide breadcrumbs if side menu is hidden
  if (isHideSideMenu) {
    return null;
  }

  return <PageBreadCrumbs breadcrumb={breadcrumbs} isLoading={isLoading} />;
};

const CustomSkeleton: React.FC = React.memo(() => {
  return (
    <div className="d-flex gap-2" style={{ width: "200px" }}>
      <div
        className="bg-secondary w-50 rounded"
        style={{ height: "15px" }}
      ></div>
      -
      <div
        className="bg-secondary w-100 rounded"
        style={{ height: "15px" }}
      ></div>
      -
      <div
        className="bg-secondary w-75 rounded"
        style={{ height: "15px" }}
      ></div>
    </div>
  );
});

export default BreadCrumbs;
