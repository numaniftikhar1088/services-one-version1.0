import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { clearReduxStore } from "Redux/Actions/Index";
import store from "Redux/Store/AppStore";
import { getToken } from "../../Utils/Auth";

/**
 * Hook to handle logout when logged-in users navigate to unauthenticated routes
 * This ensures users are logged out before accessing routes like signature-request,
 * ResetPassword, InitializePassword, etc.
 * 
 * Uses useLayoutEffect to run synchronously before render, ensuring cleanup happens
 * before the routing decision is made.
 */
const useUnauthRouteHandler = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const handleUnauthRoute = () => {
      const currentPathname = location.pathname.toLowerCase();
      const search = location.search;

      // List of unauthenticated routes that require logout if user is logged in
      const unAuthRoutes = [
        "resetpassword",
        "initializepassword",
        "switching",
        "signature-request",
      ];

      // Check if current route is an unauthenticated route
      const isUnauthRoute = unAuthRoutes.some((route) =>
        currentPathname.includes(route)
      );

      if (isUnauthRoute) {
        // Check if user is actually logged in
        const token = getToken();

        // Only logout if user has a token (is logged in)
        if (token) {
          const urlToNavigateTo = location.pathname + search;

          // Clear Redux store first (before clearing localStorage)
          store.dispatch(clearReduxStore());

          // Clear all storage (this includes redux-persist's persist:root)
          sessionStorage.clear();
          localStorage.clear();

          // Set logout flag AFTER clearing (to trigger other tabs/windows)
          // This must be after clear() because clear() removes everything
          localStorage.setItem("logout", Date.now().toString());

          // Force a full page reload to ensure clean state
          // Using window.location.replace() instead of href to prevent back button issues
          // The small delay ensures localStorage.clear() completes before redirect
          requestAnimationFrame(() => {
            window.location.replace(urlToNavigateTo);
          });
        }
      }
    };

    handleUnauthRoute();
  }, [location.pathname, location.search]);
};

export default useUnauthRouteHandler;

