import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthTenantsEntity } from "../../Interface/Shared/ApiResponse";
import { setUserInfo } from "../../Redux/Actions/Index";
import Splash from "../../Shared/Common/Pages/Splash";
import { Decrypt, getTokenData } from "../../Utils/Auth";
import { logoutUtil } from "../../Utils/UserManagement/UserRoles";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

const SelectDefaultLab = ({ User }: any) => {
  const { t } = useLang();
 const isMobile = useIsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [displayLabs, setDisplayLabs] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // defined a state to handle user search

  useEffect(() => {
    navigateToHome();
  }, []);

  const [defaultLabList, setDefaultLabList] = useState<
    AuthTenantsEntity[] | null
  >();

  useEffect(() => {
    if (typeof User?.userInfo !== "string") return;
    let decryptedData = Decrypt(User?.userInfo);

    let parsedData: any = JSON.parse(decryptedData);
    setDefaultLabList(parsedData.authTenants);
  }, []);

  const navigateToHome = () => {
    if (User?.decryptionId) {
      setDisplayLabs(false);
      navigate("/MyFavorites");
    } else {
      setDisplayLabs(true);
    }
  };

  const selectDefaultLab = async (labId: number, uri: string, key: string) => {
    var tokenInfo = getTokenData();
    var t = tokenInfo.token;
    sessionStorage.clear();
    localStorage.clear();
    dispatch(setUserInfo({}));
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:3000/switching?ot=${t}&sk=${key}&pi=${labId}`;
    } else {
      window.location.href = `${uri}/switching?ot=${t}&sk=${key}&pi=${labId}`;
    }
  };

  if (!displayLabs) {
    return <Splash />;
  }

  return (
    <div className="d-flex flex-column flex-column-fluid position-x-center">
      <div className="d-flex flex-center flex-column flex-column-fluid">
        <div className="mx-auto px-6 w-100">
          <div className="card w-100 mt-8 ">
            <div className="card-header d-flex align-items-center p-6">
              <div className="w-100 d-flex align-items-center justify-content-between">
                {/* Left Side: Logo + Title */}
                <div className="d-flex align-items-center">
                  <img
                    src={process.env.PUBLIC_URL + "/media/menu-svg/lab.svg"}
                    alt="select-lab"
                  />
                  <h3 className="text-dark mx-4 mb-0">{t("Select a Lab")}</h3>
                </div>

                {/* Right Side: Search + Logout */}
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    name="searchVal"
                    className="form-control bg-white h-30px rounded-2 fs-8"
                    placeholder="Search ..."
                    style={{ width: `${isMobile ? "100px" : "200px"}` }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <button
                    className="btn btn-light-primary"
                    onClick={logoutUtil}
                  >
                    {t("Logout")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-7">
            {defaultLabList
              ?.filter((lab) =>
                lab.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((lab: AuthTenantsEntity, i: number) => (
                <div
                  key={i}
                  className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mt-10"
                >
                  <div className="card h-225px">
                    <div className="card-body d-flex flex-column justify-content-end align-items-center">
                      <img src={lab.logo} alt="" className="img-fluid h-55px" />
                      <div className="text-dark fs-2 text-center my-5">
                        {lab.name}
                      </div>
                      <div className="d-flex">
                        <button
                          onClick={() =>
                            selectDefaultLab(lab.tenantId, lab.url, lab.key)
                          }
                          className="btn btn-light-info mr-2"
                        >
                          <i className="bi bi-gear-fill"></i>
                          {t("Set As Default & Login")}
                        </button>

                        <button
                          type="button"
                          onClick={
                            () =>
                              selectDefaultLab(lab.tenantId, lab.url, lab.key)
                            // setDynamicLabsHeaderKey(
                            //   lab.key,
                            //   lab.logo,
                            //   lab.name,
                            //   lab.infomationOfLoggedUser
                            // )
                          }
                          className="btn btn-light-primary"
                        >
                          <i className="bi bi-box-arrow-in-right"></i>{" "}
                          {t("Login")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(SelectDefaultLab);
