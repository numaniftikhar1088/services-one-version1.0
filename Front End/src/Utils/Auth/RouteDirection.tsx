import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { compareRoutes } from ".";
import PageNotFound from "../../Shared/Common/Pages/PageNotFound";
import Splash from "../../Shared/Common/Pages/Splash";

interface RouteConfig {
  path: string;
  element: React.ElementType;
}

interface Props {
  routesArr: any;
  menus: any;
}

const AuthRoutes: React.FC<Props> = ({ routesArr, menus }) => {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Assume compareRoutes is synchronous. If it's not, adapt this logic accordingly.
    const extractedRoutes = compareRoutes(routesArr, menus);
    const routeElements = extractedRoutes?.map(
      (route: RouteConfig, index: number) => {
        const Element = route?.element;
        return <Route path={route?.path} element={<Element />} key={index} />;
      }
    );

    // Add the catch-all route for "PageNotFound"
    routeElements.push(
      <Route path="*" element={<PageNotFound />} key="not-found" />
    );

    setRoutes(routeElements);
    setLoading(false);
  }, [routesArr, menus]);

  // Show a loader or some fallback content while routes are loading
  if (loading) {
    return <Splash />; // Adjust this as necessary
  }

  return <Routes>{routes}</Routes>;
};

export default AuthRoutes;
