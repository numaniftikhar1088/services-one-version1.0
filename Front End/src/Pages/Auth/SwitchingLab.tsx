import { CSSProperties, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AccountService from "../../Services/Account/AccountService";
import useAuth from "../../Shared/hooks/useAuth";
import useLang from "../../Shared/hooks/useLanguage";
import { Decrypt } from "../../Utils/Auth";
import { getUrlParameters } from "../../Utils/Common";
import  useIsMobile from '../../Shared/hooks/useIsMobile'

const LabSwitching = () => {
  const { t } = useLang();
  const { LoginRoute }: any = useAuth();
  const [switching, setSwitching] = useState(true);

  const CheckForExistingSessionOrSwitch = async () => {
    try {
      const urlParams: URLSearchParams = getUrlParameters();
      const sessionData = sessionStorage.getItem("userinfo");

      if (urlParams.has("ot") && urlParams.has("sk") && urlParams.has("pi")) {
        const token = urlParams.get("ot") ?? "";
        const key = urlParams.get("sk") ?? "";
        const id = parseInt(urlParams.get("pi") ?? "0");

        const res = await AccountService.switchPortal(key, token, id);
        LoginRoute(res.data);
      } else if (sessionData) {
        const ParsedData = Decrypt(sessionData);
        LoginRoute(ParsedData);
      }
    } catch (err) {
      console.error("Error during lab switching:", err);
      toast.error(
        "Something went wrong while switching labs. Please try again later."
      );
    } finally {
      setSwitching(false);
    }
  };

  useEffect(() => {
    CheckForExistingSessionOrSwitch();
  }, []);

  return (
    <div style={style.container}>
      <span className="loader"></span>
      <h4 style={{ textAlign: useIsMobile() ? 'center' : undefined }}>
        {useIsMobile() ? (
          <>
            {t("Switching to your laboratory workspace...")}<br />
            {t("Please wait a moment.")}
          </>
        ) : (
          t("Switching to your laboratory workspace... Please wait a moment.")
        )}
      </h4>
    </div>
  );
};

export default LabSwitching;

const style = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
  } as CSSProperties,
};
