import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearReduxStore,
  setFacility,
  setFacilityClaims,
} from "../../Redux/Actions/Index";
import store from "Redux/Store/AppStore";
import useLang from "Shared/hooks/useLanguage";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";

const SelectFacility = (props: any) => {
  const { t } = useLang();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const selectedTenantInfo = useSelector(
    (state: any) => state.Reducer.selectedTenantInfo
  );

  const facilityData = useSelector((state: any) => state.Reducer.facilityData);

  useEffect(() => {
    // Push a dummy state to the history when the component mounts
    window.history.pushState(null, "", window.location.pathname);

    const handlePopState = () => {
      if (
        !facilityData &&
        selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
          PortalTypeEnum.Facility
      ) {
        setShowLogoutConfirm(true);
        // Push the state back to prevent navigation
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [facilityData, selectedTenantInfo]);

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);

    // Clear all storage and Redux state
    store.dispatch(clearReduxStore());
    sessionStorage.clear();
    localStorage.clear();

    // Set logout flag to notify other tabs
    localStorage.setItem("logout", Date.now().toString());

    window.location.href = "/login";
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const SetFacilityInfoAndNavigateToFavourite = (facilityInfo: any) => {
    dispatch(setFacility(facilityInfo));
    dispatch(
      setFacilityClaims(selectedTenantInfo?.infomationOfLoggedUser.claims)
    );
    SetPortalInfoAndNavigateToFavourite(selectedTenantInfo, true);
  };

  const SetPortalInfoAndNavigateToFavourite = (
    selectedPortal: any,
    isNavigate = true
  ) => {
    let navigated = false;

    if (isNavigate) {
      const claimsModules = selectedPortal?.infomationOfLoggedUser?.claims;

      if (Array.isArray(claimsModules)) {
        for (const module of claimsModules) {
          if (!Array.isArray(module.claims)) continue;

          for (const claim of module.claims) {
            if (claim?.isDefaultSelect) {
              navigate(claim.linkUrl);
              navigated = true;
              break;
            }
          }
          if (navigated) break; // stop outer loop too
        }
      }

      // fallback if no landing page found
      if (!navigated) {
        navigate("/MyFavorites");
      }
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid position-x-center">
        <div className="d-flex flex-center flex-column flex-column-fluid">
          <div className="mx-auto px-6 w-100">
            <div className="card w-100 mt-8 ">
              <div className="card-header d-flex align-items-center p-6">
                <div className=" d-flex align-items-center justify-content-start">
                  <img
                    src={process.env.PUBLIC_URL + "/media/menu-svg/lab.svg"}
                    alt="select-lab"
                  />
                  <h3 className="text-dark mx-4 mb-0">
                    {t("Select a Facility")}
                  </h3>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="text"
                    name="searchVal"
                    className="form-control bg-white h-30px rounded-2 fs-8"
                    placeholder="Search ..."
                    style={{ width: "200px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-7">
              {props?.User?.Reducer?.facilityInfo
                ?.filter((facility: any) =>
                  facility.facilityName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((facilityInfo: any) => (
                  <div
                    key={facilityInfo?.facilityId}
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mt-10"
                  >
                    <div className="card h-225px">
                      <div className="card-body d-flex flex-column justify-content-end align-items-center">
                        <div className="text-dark fs-2 text-center">
                          {facilityInfo.facilityName}
                        </div>
                        <span className="mb-5">
                          {facilityInfo.facilityAddress}
                        </span>
                        <div className="d-flex">
                          <button
                            type="button"
                            onClick={() =>
                              SetFacilityInfoAndNavigateToFavourite(
                                facilityInfo
                              )
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

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutConfirm}
        onHide={handleLogoutCancel}
        centered
        backdrop="static"
        dialogClassName="no-shadow-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Confirm Logout")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("Are you sure you want to go back? This will log you out.")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutCancel}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" onClick={handleLogoutConfirm}>
            {t("Logout")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

function mapStateToProps(state: any) {
  return { User: state };
}
export default connect(mapStateToProps)(SelectFacility);
