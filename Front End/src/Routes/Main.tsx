import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Fab } from "@mui/material";
import { AxiosResponse } from "axios";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import DocsViewer from "../Pages/DocsViewer/DocsViewer";
import SelectFacility from "../Pages/Lab/SelectFacility";
import SelectDefaultLab from "../Pages/Lab/SelectPortal";
import {
  setAdminUserId,
  setRefreshToken,
  setUserInfo
} from "../Redux/Actions/Index";
import FacilityService from "../Services/FacilityService/FacilityService";
import TrueMedDashboardLayout from "../Shared/Dashboard/TrueMedDashboardLayout";
import withPageConfiguration from "../Shared/HOC/withPageConfiguration";
import useAuth from "../Shared/hooks/useAuth";
import useUnauthRouteHandler from "../Shared/hooks/useUnauthRouteHandler";
import { Encrypt, getRoutes, getToken } from "../Utils/Auth";
import RoutesObj from "./Routes";

const AuthenticatedRoutes = () => {

  const validateUserToken = useCallback(() => {
    const token = getToken();
    if (token !== null) return token;
  }, []);

  return (
    <Routes>
      {validateUserToken() && window.location.pathname === "/login" && (
        <Route path="/login" element={<Navigate to={"/MyFavorites"} />} />
      )}
      <Route path="/" element={<TrueMedDashboardLayout />} />
      <Route path="/*" element={<TrueMedDashboardLayout />} />
      <Route path="*" element={<SelectDefaultLab />}></Route>
      <Route path="/SelectLab" element={<SelectDefaultLab />}></Route>
      <Route path="/SelectFacility" element={<SelectFacility />}></Route>
      <Route path="/docs-viewer" element={<DocsViewer />}></Route>
    </Routes>
  );
};

// Create a wrapper component that includes page configuration
const AuthenticatedRoutesWithPageConfiguration = withPageConfiguration(() => (
  <AuthenticatedRoutes />
));

const Main = () => {
  const [hover, setHover] = useState(false);
  const { LoginRoute }: any = useAuth();
  const dispatch = useDispatch();
  const adminId = useSelector((state: any) => state.Reducer?.adminId);

  // Handle logout when logged-in users navigate to unauthenticated routes
  // This runs before the routing decision, ensuring proper cleanup
  useUnauthRouteHandler();

  const handleReturnToAdminPortal = async () => {
    try {
      const res: AxiosResponse = await FacilityService.GoToPortal(adminId);
      dispatch(setAdminUserId(null));
      const data = res.data;
      const encryptData: any = Encrypt(JSON.stringify(res.data));
      sessionStorage.setItem("userinfo", encryptData);
      dispatch(setRefreshToken(data.refreshToken));
      dispatch(setUserInfo(encryptData));
      await LoginRoute(data);
    } catch (error) {
      console.error("Error navigating to admin portal:", error);
    }
  };

  const validateToken = () => {
    const token = getToken();
    if (token !== null) return token;
    return false;
  };

  const AdminPortalReturnButton = () => {
    return (
      <div className="position-fixed" style={{ right: "20px", bottom: "20px" }}>
        <Fab
          variant="extended"
          className={`bg-primary text-white ${hover ? "w-auto" : "circle-button"}`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleReturnToAdminPortal}
        >
          <KeyboardReturnIcon className="mr-1" />
          {hover && <span>Return to Portal</span>}
        </Fab>
      </div>
    );
  };

  return (
    <>
      {validateToken() ? (
        <AuthenticatedRoutesWithPageConfiguration />
      ) : (
        <Routes>{getRoutes(RoutesObj.UnAuthRoutes)}</Routes>
      )}
      {adminId ? <AdminPortalReturnButton /> : null}
    </>
  );
};

export default Main;
