import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import PageNotFound from "../../Shared/Common/Pages/PageNotFound";
const AuthRoutes = ({ routesArr, menus }: any) => {
  const [extractedRoutes, setExtractedRoutes] = useState([]);

  const compareRoutes = (routesArr: any, menus: any) => {
    const extractPaths = (claims: any) => {
      return claims.flatMap((claim: any) => {
        const paths = [];
        if (claim.linkUrl) {
          let updatedUrl = claim.linkUrl.replace(/^\//, "");
          paths.push(updatedUrl);
        }
        if (claim.subClaims) {
          paths.push(...extractPaths(claim.subClaims));
        }
        return paths;
      });
    };

    const extractedPaths = extractPaths(menus);
    return routesArr.filter((route: any) =>
      extractedPaths.includes(route.path.replace(/^\//, ""))
    );
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const extractedRoutes = compareRoutes(routesArr, menus);
        setExtractedRoutes(extractedRoutes);
      } catch (error) {
        console.error("Error extracting routes:", error);
      }
    };

    fetchRoutes();
  }, [routesArr, menus]);

  return (
    <>
      {extractedRoutes.map((route: any, index: any) => {
        const Element = route.element;
        return <Route path={route.path} element={<Element />} key={index} />;
      })}
      <Route path="*" element={<PageNotFound />} />
    </>
  );
};

export default AuthRoutes;
