import { AxiosError, AxiosResponse } from "axios";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MultiSelect from "react-select";
import { default as SignaturePad } from "react-signature-canvas";
import { toast } from "react-toastify";
import useLang from "./../../../Shared/hooks/useLanguage";
import HttpClient from "HttpClient";
import { setWebInfo } from "Redux/Actions/Index";
import Commonservice from "Services/CommonService";
import FacilityService from "Services/FacilityService/FacilityService";
import MiscellaneousService from "Services/MiscellaneousManagement/MiscellaneousService";
import UserManagementService from "Services/UserManagement/UserManagementService";
import Splash from "Shared/Common/Pages/Splash";
import { getUrlParameters, reactSelectStyle, styles } from "Utils/Common";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";

interface PhysicianProfile {
  azureSignatureURL: string;
  userId: string;
  assigneeUserIds: string[];
}

interface Users {
  label: string;
  value: string;
}

const emptyPhysicianProfileObject = {
  userId: "",
  azureSignatureURL: "",
  assigneeUserIds: [],
};

const SignatureRequest = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const url = getUrlParameters();
  const dispatch = useDispatch();

  const userId = url.get("userid");
  const ticket = url.get("ticket");
  const type = url.get("type");
  const portalkey = url.get("portalkey");
  const labId = url.get("labid");
  const ticketType = url.get("type");

  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  const [loader, setLoader] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [allUsers, setAllUsers] = useState(false);
  const [users, setUsers] = useState<Users[]>([]);
  const [signCanvas, setSignCanvas] = useState<SignaturePad | null>(null);
  const [physicianProfile, setPhysicianProfile] = useState<PhysicianProfile>(
    emptyPhysicianProfileObject
  );

  const generateUniqueFilename = () => {
    const timestamp = new Date().getTime();
    return `signature_${timestamp}.png`;
  };

  const handleUploadBlob = async () => {
    const contentArray = new Uint8Array(
      Array.from(
        atob(physicianProfile.azureSignatureURL.split(",")[1]),
        (char) => char.charCodeAt(0)
      )
    );
    const data = {
      name: generateUniqueFilename(),
      portalKey: portalkey,
      fileType: "image/png",
      extention: "png",
      content: Array.from(contentArray),
      isPublic: true,
    };
    try {
      const res: AxiosResponse = await FacilityService.BlobUpload(data);
      const result = res?.data?.Data;
      return result;
    } catch (error: unknown) {
      console.error("Error uploading blob:", error);
    }
  };

  const SaveSignature = async () => {
    if (!physicianProfile.azureSignatureURL) {
      toast.error(t("Please provide a signature"));
      return;
    }

    // if (!allUsers && physicianProfile.assigneeUserIds.length === 0) {
    //   toast.error(t('Please assign at least one user'));
    //   return;
    // }

    setIsSaving(true);
    try {
      const blobLink = await handleUploadBlob();
      const requestBody = {
        labId: labId,
        userId: userId,
        azureSignatureURL: blobLink,
        isAssignSigToAll: allUsers,
        assigneeUserIds: (() => {
          const baseIds = allUsers
            ? users.map((user) => user.value) || []
            : physicianProfile.assigneeUserIds || [];
          // Always include userId, and remove duplicates
          return Array.from(new Set([...baseIds, userId]));
        })(),
        ticket: ticket?.replace(/\s/g, "+"),
        ticketType: ticketType && parseInt(ticketType),
      };

      const res: any = await UserManagementService.AddSignatureViaEmail(
        requestBody,
        portalkey,
        userId
      );

      if (res?.data?.status === 200) {
        toast.success(t("Signature saved successfully"));
        navigate("/login");
      } else {
        toast.error(t("Failed to save signature"));
      }
    } catch (error: AxiosError | unknown) {
      console.error(error);
      toast.error(t("An error occurred while saving the signature"));
    } finally {
      setIsSaving(false);
    }
  };

  const setCanvasRef = useCallback((node: any) => {
    if (node !== null) {
      setSignCanvas(node);
    }
  }, []);

  const handleEndPhysicianSignature = async () => {
    if (signCanvas?.isEmpty()) {
      return;
    }
    const imageBase64 = signCanvas?.toDataURL();
    setPhysicianProfile((prev: PhysicianProfile) => ({
      ...prev,
      azureSignatureURL: imageBase64 ?? "",
    }));
  };

  const clearSignature = () => {
    setPhysicianProfile((prev: PhysicianProfile) => ({
      ...prev,
      azureSignatureURL: "",
    }));
    signCanvas?.clear();
  };

  const getLogoUrl = () => {
    Commonservice.getLoginPageLogo()
      .then((res: any) => {
        setLogoUrl(res.data.logo);
        dispatch(
          setWebInfo({
            smartLogoUrl: res.data?.smartLogo,
            title: res.data?.labName,
          })
        );
        setFaviconAndTitle(res.data?.smartLogo, res.data?.labName);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    setAllUsers(isChecked);
    setPhysicianProfile((prev) => ({
      ...prev,
      assigneeUserIds: [],
    }));
  };

  const handleFileChange = async (event: any) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (file && allowedTypes.includes(file.type)) {
      if (file.type === "image/png") {
        clearSignature();
      }
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        signCanvas?.fromDataURL(reader.result as string);
        setPhysicianProfile((prev: PhysicianProfile) => ({
          ...prev,
          azureSignatureURL: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError(
        t("Invalid file type or size. Please upload a valid image file.")
      );
    }
    fileInput.value = "";
  };

  useLayoutEffect(() => {
    getLogoUrl();
  }, []);

  const fetchData = async () => {
    try {
      const response = await MiscellaneousService.getAllUserLookupPublicUrl(
        type,
        portalkey,
        userId
      );
      setUsers(response?.data?.result);
    } catch (error) {
      console.error("Error in data fetching: ", error);
    }
  };

  const handleMultiSelectChange = (selectedOptions: any) => {
    setPhysicianProfile((prev) => ({
      ...prev,
      assigneeUserIds: selectedOptions.map((user: any) => user.value),
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoader(true);
    if (ticket && type) {
      const requestBody = {
        ticket: ticket,
        ticketType: parseInt(type),
      };
      HttpClient()
        .post(`/api/Account/ValidateTicketV2`, requestBody)
        .then((res) => {
          if (res?.data?.status === 200) {
            setValid(true);
            setLoader(false);
          } else if (
            res?.data?.status === 400 &&
            res?.data?.title === "Invalid/Expired"
          ) {
            setValid(false);
            setLoader(false);
            toast.error(
              t("Link is expired, please contact your administrator")
            );
          }
        })
        .catch((error: AxiosError) => {
          console.error(error);
          setLoader(false);
          toast.error(t("Link is expired, please contact your administrator"));
        });
    } else {
      toast.error(t("Invalid URL"));
    }
  }, []);

  if (loader) {
    return <Splash />;
  }

  if (!valid) {
    return (
      <div className="d-flex flex-column flex-center flex-column-fluid">
        <div className="d-flex flex-column flex-center text-center p-10">
          <div className="card card-flush w-lg-650px py-5">
            <div className="card-body py-15 py-lg-15">
              <h1 className="fw-bolder fs-2hx text-gray-900 mb-4">
                {t("Oops!")}
              </h1>
              <div className="fw-semibold fs-6 text-gray-500">
                {t("Link is Expired")}
              </div>

              <div className="mb-1">
                <img
                  src={`${
                    process.env.PUBLIC_URL +
                    "/media/menu-svg/password-expiry.svg"
                  }`}
                  className="mw-100 mh-300px"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
      style={{
        backgroundImage: `url('${process.env.PUBLIC_URL}/media/illustrations/login/sketch-1.png')`,
        minHeight: "100vh",
      }}
    >
      <div className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20">
        <div className="w-lg-650px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            {logoUrl && (
              <img alt="Logo" src={logoUrl} className="h-45px mb-4" />
            )}
            <h4 className="fw-bold text-gray-800">
              {t("Physician's Signature")}
            </h4>
          </div>

          {/* Signature Section */}
          <div className="mb-6">
            <label className="form-label fw-semibold text-gray-700 mb-3 required">
              {t("Create or Upload Signature")}
            </label>

            <div className="signature-container mb-4">
              <SignaturePad
                maxWidth={2}
                penColor="black"
                ref={setCanvasRef}
                backgroundColor="white"
                onEnd={handleEndPhysicianSignature}
                clearOnResize={false}
                canvasProps={{
                  style: {
                    border: "2px dotted #d1d5db",
                    borderRadius: "8px",
                    width: "100%",
                    height: "200px",
                  },
                }}
              />
            </div>

            {/* Signature Controls */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <button
                className="btn btn-light btn-sm fw-bold"
                type="button"
                onClick={clearSignature}
              >
                {t("Clear Signature")}
              </button>

              <div className="d-flex align-items-center gap-3">
                <input
                  type="file"
                  id="upload-file"
                  className="d-none"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg"
                />
                <label
                  htmlFor="upload-file"
                  className="btn btn-outline btn-outline-primary btn-sm fw-bold cursor-pointer mb-0"
                >
                  {t("Upload Image")}
                </label>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-4">
                <span className="fs-7">{error}</span>
              </div>
            )}

            <div className="text-muted fs-8">
              {t("Supported formats: PNG, JPG, JPEG")}
            </div>
          </div>

          {/* User Assignment Section */}
          <div className="mb-8">
            <label className="form-label fw-semibold text-gray-700 mb-3">
              {t("Assign Signature to Users")}
            </label>

            <div className="form-check form-check-solid mb-4">
              <input
                id="allUsersCheckbox"
                className="form-check-input"
                type="checkbox"
                checked={allUsers}
                onChange={handleCheckboxChange}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor="allUsersCheckbox"
              >
                {t("Apply to all users")}
              </label>
            </div>

            {!allUsers && (
              <MultiSelect
                styles={reactSelectStyle}
                theme={(theme) => styles(theme)}
                isMulti
                options={users}
                name="users"
                placeholder={t("Select users...")}
                value={users.filter((user) =>
                  physicianProfile?.assigneeUserIds?.includes(user.value)
                )}
                onChange={handleMultiSelectChange}
                className="react-select-container"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-3">
            <Link to="/login" className="btn btn-secondary btn-sm fw-bold">
              {t("Back")}
            </Link>
            <button
              className="btn btn-primary btn-sm fw-bold"
              onClick={SaveSignature}
              disabled={isSaving}
              style={{
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
            >
              {isSaving ? t("Saving...") : t("Save Signature")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureRequest;
