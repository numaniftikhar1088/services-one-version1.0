import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUserInfo } from "../../Redux/Actions/Index";
import Commonservice from "../../Services/CommonService";
import MyFavouriteMenuServices from "../../Services/MyFavouriteMenuServices/MyFavouriteMenuServices";
import Splash from "../../Shared/Common/Pages/Splash";
import { LoaderIcon } from "../../Shared/Icons";
import { Decrypt, Encrypt, getTokenData } from "../../Utils/Auth";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const MyfavoriteMenu = (props: any) => {
  const { t } = useLang();
  const navigate = useNavigate();

  const webInfo = useSelector((state: any) => state?.Reducer?.webInfo);

  const [request, setRequest] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [check, setCheck] = useState(false);
  const [items, setItems] = useState<any>(props.User.Menus);
  const [menu, setMenu] = useState<any>([]);
  const [loader, setloader] = useState(false);
  const userinfo = getTokenData();
  const [openalert, setOpenAlert] = React.useState(false);
  const adminId = useSelector((state: any) => state.Reducer?.adminId);
  const [value, setValue] = useState<any>({
    userid: "",
    menuid: [],
  });
  const [selectedBox, setSelectedBox] = useState<any>({
    moduleIds: [],
    menuIds: [],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    CheckForRedirect();
    getDataFromUrl();
  }, []);

  const handleClickOpen = (userid: string, menuid: string) => {
    setOpenAlert(true);
    setValue(() => {
      return {
        userid: userid,
        menuid: menuid,
      };
    });
  };

  function getDataFromUrl() {
    var search = window.location.search.substring(1);
    if (search) {
      let decryptedUrlData = Decrypt(search);
      let urlData = JSON.parse(
        '{"' +
          decodeURI(decryptedUrlData)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );

      if (urlData) {
        let stringfiedUrlData = JSON.stringify(urlData);
        const encryptedStringfiedUrlData = Encrypt(stringfiedUrlData);
        sessionStorage.setItem("facilityInfo", encryptedStringfiedUrlData);
      }
    }
  }

  const CheckForRedirect = async () => {
    let decryptionId = window.location.href.split("/").reverse()[0];
    if (decryptionId === undefined || decryptionId === "MyFavorites") return;
    if (decryptionId) {
      await Commonservice.getEncodedText(decryptionId)
        .then((res: any) => {
          let decryteddata = Decrypt(res?.data?.data?.encodedText);

          let parsedData = JSON.parse(decryteddata);
          dispatch(setUserInfo(parsedData));
          const encryptData: any = Encrypt(decryteddata);
          localStorage.setItem("userinfo", encryptData);
        })
        .catch((err: any) => {});
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    setItems(props.User.Menus);
  }, [adminId]);

  useEffect(() => {
    getPreFilledIds();
  }, [menu]);

  const loadDataUserFavouriteMenu = () => {
    MyFavouriteMenuServices.getUserFavouriteMenu()
      .then((res: any) => {
        setMenu(res.data.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setRequest(false);
    loadDataUserFavouriteMenu();
  };

  const handleOpen = () => setOpen(true);

  const setFormState = (menu: any) => {
    let menuArr: any = [];
    menu?.map((items: any) => {
      items?.favouriteMenus?.map((inner: any) => {
        if (inner?.isChecked) {
          menuArr?.push(inner.favouriteMenuId);
        }
      });
    });
    return menuArr;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const queryModel = {
      favouriteMenuId: selectedBox.menuIds,
      userId: userinfo.userId,
      isChecked: true,
    };
    setRequest(true);
    await MyFavouriteMenuServices.saveMyFavouriteMenu(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.responseStatus);
          setRequest(false);
          setTimeout(() => {
            handleClose();
            loadDataUserFavouriteMenu();
          }, 500);
        }
        handleClose();
      })
      .catch((err?: AxiosError) => {
        toast.error("error");
      });
    setRequest(false);
  };

  const getPreFilledIds = () => {
    if (menu?.length > 0) {
      const Arr = setFormState(menu);
      setSelectedBox((preVal: any) => {
        return {
          ...preVal,
          menuIds: Arr,
        };
      });
    }
  };

  const DeleteMyFavouriteMenu = async (value: any) => {
    let favouriteMenuId = [];
    favouriteMenuId.push(value.menuid);
    const objToSend = {
      userId: value.userid,
      favouriteMenuId: favouriteMenuId,
    };
    setCheck(true);
    await MyFavouriteMenuServices?.RemoveFavouriteMenus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          handleCloseAlert();
          loadDataUserFavouriteMenu();
          setCheck(false);
          toast.success(res?.data?.responseMessage);
        } else {
          handleCloseAlert();
          setCheck(false);
          toast.error(res?.data?.responseMessage);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const BulkDelete = async (menus: any) => {
    let idsArray: any = [];
    menus.map((i: any) => {
      idsArray.push(i.id);
    });
    const objToSend = {
      favouriteMenuId: idsArray,
      userId: userinfo.userId,
    };
    await MyFavouriteMenuServices?.RemoveFavouriteMenus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const handleAllSelect = (checked: boolean, id: string, menus: any) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          moduleIds: [...selectedBox.moduleIds, id],
          menuIds: [
            ...new Set(
              selectedBox.menuIds.concat(menus?.map((items: any) => items.id))
            ),
          ],
        };
      });
    }
    if (!checked) {
      let arrCopyMenus = [...selectedBox?.menuIds];
      for (let index = 0; index < menus.length; index++) {
        arrCopyMenus = arrCopyMenus.filter(
          (items: any) => items !== menus[index].id
        );
      }
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          moduleIds: selectedBox.moduleIds.filter((item: any) => item !== id),
          menuIds: arrCopyMenus,
        };
      });
    }
  };

  const handleChangeMenuIds = (checked: boolean, id: number, moduleId: any) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          menuIds: [...selectedBox.menuIds, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          moduleIds: selectedBox.moduleIds.filter(
            (item: any) => item !== moduleId
          ),
          menuIds: selectedBox.menuIds.filter((item: any) => item !== id),
        };
      });
    }
  };

  useEffect(() => {
    loadDataUserFavouriteMenu();
  }, [adminId]);

  const handleLinkUrl = (page: any) => {
    const pages = [
      "dynamic-form",
      "dynamic-grid",
      "dynamic-one-ui",
      "dynamic-split-pane",
    ];

    for (const p of pages) {
      if (page?.linkURL?.includes(p)) {
        return `/${p}/${window.btoa(page?.favouriteMenuId)}`;
      }
    }

    // Fallback to original linkURL
    return page?.linkURL ?? "#";
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`My Favorites ${
          webInfo?.title ? `| ${webInfo?.title}` : ""
        }`}</title>
      </Helmet>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="d-flex flex-stack flex-wrap">
            <div className="d-flex align-items-baseline justify-content-start  mt-8">
              <i className="bi bi-star-fill text-warning fs-1"></i>
              <h3 className="text-dark mx-4 mb-0">{t("My Favorites Menu")}</h3>
            </div>
            <PermissionComponent
              moduleName="My Favorites"
              pageName="My Favorites Menu"
              permissionIdentifier="Add"
            >
              <button
                className="btn btn-sm fw-bold btn-primary mt-8"
                onClick={handleOpen}
              >
                {t("Add My Favorite Menu")}
              </button>
            </PermissionComponent>
          </div>
          <div className="row">
            {loader ? (
              <>
                <div
                  style={{ height: "100vh" }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <Splash />
                </div>
              </>
            ) : (
              menu?.map((item: any) => (
                <React.Fragment key={item.userId}>
                  {Array.isArray(item?.favouriteMenus)
                    ? item?.favouriteMenus.map((inner: any) => (
                        <div
                          className="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 mt-10"
                          key={inner.favouriteMenuId}
                        >
                          <div className="favorite-menu-card position-relative w-100">
                            <i
                              className="bi bi-x-lg position-absolute z-index-1 top-0 end-0 m-3"
                              onClick={() =>
                                handleClickOpen(
                                  item?.userId,
                                  inner?.favouriteMenuId
                                )
                              }
                            ></i>
                            <Link
                              className="card bg-white"
                              to={handleLinkUrl(inner)}
                            >
                              <img
                                src={inner.menuIcon}
                                alt=""
                                className="img-fluid"
                              />
                            </Link>
                            <div className="text-dark fs-4 text-center mt-4">
                              {t(inner.menu)}
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="card shadow-none rounded-0 w-350px w-sm-475px w-md-800px rounded-3 ">
            {/* ************************** Demo Body *********************** */}
            <div
              className="card-header min-h-40px h-40px d-flex align-items-center"
              id="kt_engage_demos_header"
            >
              <h3 className="fw-bold text-gray-700 m-0">
                {t("Add My Favorite Menu")}
              </h3>
              <span className="svg-icon svg-icon-2" onClick={handleClose}>
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.5"
                    x={6}
                    y="17.3137"
                    width={16}
                    height={2}
                    rx={1}
                    transform="rotate(-45 6 17.3137)"
                    fill="currentColor"
                  />
                  <rect
                    x="7.41422"
                    y={6}
                    width={16}
                    height={2}
                    rx={1}
                    transform="rotate(45 7.41422 6)"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>

            <div
              className="card-body scroll pb-2"
              style={{ height: "calc(100vh - 150px)" }}
            >
              {items?.map((item: any) =>
                item.moduleId === 25 ? null : (
                  <>
                    <div className="d-flex align-items-start justify-content-start">
                      <label className="form-check form-check-sm form-check-solid mt-1">
                        <input
                          className="form-check-input mr-2"
                          type="checkbox"
                          checked={item.claims.every((test: any) =>
                            selectedBox?.menuIds.includes(test.id)
                          )}
                          onChange={(e) =>
                            handleAllSelect(
                              e.target.checked,
                              item?.moduleId,
                              item?.claims
                            )
                          }
                        />
                      </label>
                      <span className="d-flex align-items-start gap-2">
                        <img
                          src={item.moduleIcon}
                          alt=""
                          className="img-fluid w-25px"
                        />
                        <p className="m-0 mt-1">{t(item.module)}</p>
                      </span>
                    </div>
                    <div className="row px-14 my-4">
                      {Array.isArray(item?.claims)
                        ? item?.claims.map((inner: any) => (
                            <>
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6">
                                <div className="d-flex align-items-start justify-content-start my-1">
                                  <label className="form-check form-check-sm form-check-solid mt-1 mb-0">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                      checked={selectedBox?.menuIds?.includes(
                                        inner?.id
                                      )}
                                      onChange={(e) =>
                                        handleChangeMenuIds(
                                          e.target.checked,
                                          inner?.id,
                                          item?.moduleId
                                        )
                                      }
                                    />
                                  </label>
                                  <span className="d-flex align-items-start gap-2">
                                    <img
                                      src={inner.iCon}
                                      alt=""
                                      className="img-fluid w-25px"
                                    />
                                    <p className="m-0 mt-1"> {t(inner.name)}</p>
                                  </span>
                                </div>
                              </div>
                            </>
                          ))
                        : null}
                    </div>
                  </>
                )
              )}
            </div>

            <div className="card-footer py-2 px-9 gap-3 d-flex justify-content-start w-100">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleClose}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                id="kt_app_layout_builder_preview"
                className="btn btn-sm btn-primary fw-semibold"
                onClick={(e) => handleSubmit(e)}
              >
                {request ? <LoaderIcon /> : null}
                <span className="indicator-label">{t("Save")}</span>
                <span className="indicator-progress">
                  {t("Please wait...")}
                  <span className="spinner-border spinner-border-sm align-middle ms-2" />
                </span>
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Menu")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this Menu ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => DeleteMyFavouriteMenu(value)}
          >
            <span>{check ? <LoaderIcon /> : null}</span>{" "}
            <span>
              {""}
              {t("Delete")}
            </span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </div>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(MyfavoriteMenu);
