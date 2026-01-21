import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearReduxStore } from "Redux/Actions/Index";
import store from "Redux/Store/AppStore";
import AccountService from "Services/Account/AccountService";

const useLogoutListener = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === "logout") {
        const externalLogin =
          sessionStorage.getItem("externalLogin") === "true";
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = externalLogin ? "/external-login" : "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate, dispatch]);

  const logout = async () => {
    // Get externalLogin flag BEFORE clearing sessionStorage
    const externalLogin = sessionStorage.getItem("externalLogin") === "true";

    try {
      await AccountService.userLogout();
    } catch (error) {
      navigate(externalLogin ? "/external-login" : "/login");
      navigate(0);
      return;
    }

    sessionStorage.clear();
    localStorage.clear();

    store.dispatch(clearReduxStore());

    localStorage.setItem("logout", Date.now().toString());

    navigate(externalLogin ? "/external-login" : "/login");
    navigate(0);
  };

  return logout;
};

export default useLogoutListener;
