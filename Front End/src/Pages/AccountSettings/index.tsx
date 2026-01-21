import { CircularProgress, Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import MultiSelect from "react-select";
import { default as SignaturePad } from "react-signature-canvas";
import { toast } from "react-toastify";
import store from "Redux/Store/AppStore";
import MiscellaneousService from "../../Services/MiscellaneousManagement/MiscellaneousService";
import UserManagementService, {
  getSignatureAssigneeUser,
  physicianProfileUpdate,
} from "../../Services/UserManagement/UserManagementService";
import { Decrypt } from "../../Utils/Auth";
import { maskPhone, reactSelectStyle, styles } from "../../Utils/Common";
import useLang from "./../../Shared/hooks/useLanguage";

interface PhysicianProfile {
  azureSignatureUrl: string;
  phoneNo: string;
  assigneeUserIds: string[];
}

interface UserInfo {
  fullName: string;
  email: string;
  id: string;
  phone: string;
  stateLicenseNumber: string;
  npi: string;
  userName?: string;
}

const emptyPhysicianProfileObject = {
  azureSignatureUrl: "",
  phoneNo: "",
  assigneeUserIds: [],
};

const emptyUserData = {
  fullName: "",
  email: "",
  id: "",
  phone: "",
  npi: "",
  stateLicenseNumber: "",
};

interface Users {
  label: string;
  value: string;
}

function AccountSettings() {
  const { t } = useLang();

  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState(false);
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFacilityUser, setIsFacilityUser] = useState(false);
  const [signatureURL, setSignatureURL] = useState<string>("");
  const [userData, setUserData] = useState<UserInfo>(emptyUserData);
  const [signCanvas, setSignCanvas] = useState<SignaturePad | null>(null);
  const [physicianProfile, setPhysicianProfile] = useState<PhysicianProfile>(
    emptyPhysicianProfileObject
  );

  const userTKN = sessionStorage.getItem("userinfo");
  const DECRYPTED_TKN = Decrypt(userTKN);
  const userInfo = JSON.parse(DECRYPTED_TKN);

  useEffect(() => {
    if (userInfo.userId) {
      fetchData(userInfo);
    }
  }, []);

  const setCanvasRef = useCallback((node: any) => {
    if (node !== null) {
      setSignCanvas(node);
    }
  }, []);

  useEffect(() => {
    if (signatureURL && signCanvas) {
      signCanvas.fromDataURL(signatureURL);
    }
  }, [signatureURL, signCanvas]);

  const fetchData = async (userInfo: any) => {
    const reducer: any = store.getState()?.Reducer;

    const user = userInfo?.authTenants?.find(
      (user: any) => user.key === reducer?.labKey
    );

    if (!user) return;

    try {
      const response = await MiscellaneousService.getAllUserLookup(
        user.infomationOfLoggedUser.portalType
      );
      setUsers(response?.data?.result);

      await Promise.all([
        getFacilityUserInfo(userInfo?.userId),
        fetchSignedAssignee(userInfo?.userId),
      ]);
    } catch (error) {
      console.error("Error in data fetching: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSignature = () => {
    setPhysicianProfile((prev: PhysicianProfile) => ({
      ...prev,
      azureSignatureUrl: "",
    }));
    signCanvas?.clear();
  };

  const handleEndPhysicianSignature = async () => {
    if (signCanvas?.isEmpty()) {
      return;
    }
    const imageBase64 = signCanvas?.toDataURL();
    setPhysicianProfile((prev: PhysicianProfile) => ({
      ...prev,
      azureSignatureUrl: imageBase64 ?? "",
    }));
  };

  const validatePhone = (phone: string) => {
    // Regular expression to match the mask format (999) 999-9999
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const savePhysicianProfileUpdate = async () => {
    // Validate the input value
    if (physicianProfile.phoneNo) {
      if (!validatePhone(physicianProfile.phoneNo)) {
        setPhoneNumberError(
          "Please enter a valid phone number in the format (XXX) XXX-XXXX."
        );

        return;
      } else {
        setPhoneNumberError("");
      }
    }

    if (
      (physicianProfile.assigneeUserIds?.length > 0 || allUsers) &&
      !physicianProfile.azureSignatureUrl &&
      isFacilityUser
    ) {
      toast.error("Signature is required. Please provide a valid signature.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await physicianProfileUpdate({
        azureSignatureUrl: physicianProfile.azureSignatureUrl ?? "",
        phoneNo: physicianProfile.phoneNo ?? "",
        isAssignSigToAll: allUsers,
        assigneeUserIds: allUsers
          ? users.map((user) => user.value) || []
          : physicianProfile.assigneeUserIds || [],
      });
      toast.success(response.data.message);
      if (userInfo.userId) {
        await Promise.all([
          getFacilityUserInfo(userInfo?.userId),
          fetchSignedAssignee(userInfo?.userId),
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setPhoneNumberError("");
      setError("");
    }
  };

  const fetchSignedAssignee = async (userId: string) => {
    try {
      const response = await getSignatureAssigneeUser(userId);
      const signatureURL = response?.data?.signature?.signatureURL;

      setSignatureURL(signatureURL);

      signCanvas?.fromDataURL(signatureURL);

      setPhysicianProfile((prev) => ({
        phoneNo: prev.phoneNo,
        azureSignatureUrl: signatureURL,
        assigneeUserIds: response?.data?.signature?.isAssignSigToAll
          ? []
          : response?.data?.signature?.assigneeUserIds,
      }));
      setAllUsers(response?.data?.signature?.isAssignSigToAll);
    } catch (error) {
      console.error("Failed to fetch signature assignee:", error);
    }
  };

  const getFacilityUserInfo = async (id: string | undefined) => {
    try {
      const result = await UserManagementService.fetchUserByIdV2(id);
      const objectInfo = {
        id: result.data.data.id,
        email: result.data.data.email,
        fullName: `${result.data.data.firstName} ${result.data.data.lastName}`,
        phone: result.data.data.phone,
        npi: result.data.data.additionalInfo.npi,
        stateLicenseNumber: result.data.data.additionalInfo.stateLicenseNumber,
        userName: result.data.data.userName,
      };
      setUserData(objectInfo);
      if (
        result?.data?.data?.physicianRoleID === result?.data?.data?.roleType
      ) {
        setIsFacilityUser(true);
      }
      setPhysicianProfile((prev) => ({
        ...prev,
        phoneNo: result.data.data.phone,
      }));
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (event: any) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (file && allowedTypes.includes(file.type)) {
      // Clear the signature pad if the file is a PNG
      if (file.type === "image/png") {
        clearSignature();
      }

      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        signCanvas?.fromDataURL(reader.result as string);

        setPhysicianProfile((prev: PhysicianProfile) => ({
          ...prev,
          azureSignatureUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setError(
        t("Invalid file type or size. Please upload a valid image file.")
      );
    }

    // Reset the file input to allow re-uploading the same file
    fileInput.value = "";
  };

  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    setAllUsers(isChecked);

    setPhysicianProfile((prev) => ({
      ...prev,
      assigneeUserIds: [],
    }));
  };

  const handleMultiSelectChange = (selectedOptions: any) => {
    setPhysicianProfile((prev) => ({
      ...prev,
      assigneeUserIds: selectedOptions.map((user: any) => user.value),
    }));
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-center flex-column-fluid">
      <div className="d-flex flex-column flex-center p-10">
        <div className="card card-flush w-lg-650px py-5">
          <div className="card-body py-4">
            <h3 className="mb-8">{t("Personal Information")}</h3>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="w-100">
                  <label>{t("Name")}</label>
                  <input
                    type="text"
                    className="form-control bg-white mb-3 mb-lg-0 h-30px"
                    placeholder={t("User Name")}
                    value={userData.fullName}
                    disabled
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="w-100">
                  <label>{userData.userName ? "User Name" : "Email"}</label>
                  {userData.userName ? (
                    <input
                      type="username"
                      className="form-control bg-white mb-3 mb-lg-0 h-30px"
                      placeholder={t("doe")}
                      value={userData.userName}
                      disabled
                    />
                  ) : (
                    <input
                      type="email"
                      className="form-control bg-white mb-3 mb-lg-0 h-30px"
                      placeholder={t("doe@example.com")}
                      value={userData.email}
                      disabled
                    />
                  )}
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="mt-2">
                  <label>{t("Phone No.")}</label>
                  <InputMask
                    mask="(999) 999-9999"
                    value={physicianProfile.phoneNo}
                    onChange={(e) => {
                      setPhysicianProfile({
                        ...physicianProfile,
                        phoneNo: maskPhone(e.target.value),
                      });
                    }}
                    className="form-control bg-white mb-3 mb-lg-0 h-30px"
                    placeholder="(XXX) XXX-XXXX"
                  />
                </div>
                {phoneNumberError && (
                  <div className="text-dark-65 form__error mt-2">
                    <span>{phoneNumberError}</span>
                  </div>
                )}
              </Grid>
              <Grid item xs={6}>
                {isFacilityUser ? (
                  <div className="mt-2">
                    <label>{t("Doctor's NPI #")}</label>
                    <input
                      type="text"
                      className="form-control bg-white mb-3 mb-lg-0 h-30px"
                      value={userData.npi}
                      disabled
                    />
                  </div>
                ) : null}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                {isFacilityUser ? (
                  <div className="mt-2">
                    <label>{t("State License #")}</label>
                    <input
                      type="text"
                      className="form-control bg-white mb-3 mb-lg-0 h-30px"
                      value={userData.stateLicenseNumber}
                      disabled
                    />
                  </div>
                ) : null}
              </Grid>
            </Grid>
            {isFacilityUser ? (
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6}>
                  <div className="w-100">
                    <SignaturePad
                      maxWidth={2}
                      penColor="black"
                      ref={setCanvasRef}
                      backgroundColor="white"
                      onEnd={handleEndPhysicianSignature}
                      canvasProps={{
                        style: {
                          border: "2px dotted black",
                          borderRadius: "4px",
                          width: "100%",
                          // pointerEvents: isSignatureDisabled ? "none" : "auto",
                          // opacity: isSignatureDisabled ? 0.5 : 1,
                        },
                      }}
                    />
                    <div className="d-flex align-items-center justify-content-between">
                      <label>{t("Physician's Signature")}</label>
                      <button
                        className="btn btn-secondary btn-sm fw-bold"
                        type="button"
                        onClick={clearSignature}
                      >
                        {t("Remove Sign")}
                      </button>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="d-flex gap-3">
                    <div className="w-100">
                      {t("Please Add a user to use the physician signature")}
                      <div className="form-check form-check-sm form-check-solid my-4">
                        <label htmlFor="allUsersCheckbox">
                          {t("Use signature for everyone")}
                        </label>
                        <input
                          id="allUsersCheckbox"
                          className="form-check-input mr-2 mb-4"
                          type="checkbox"
                          name="allUsers"
                          checked={allUsers}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <MultiSelect
                        styles={reactSelectStyle}
                        theme={(theme) => styles(theme)}
                        isMulti
                        options={users}
                        name="users"
                        placeholder={t("Select multi-users")}
                        value={users.filter((user) =>
                          physicianProfile?.assigneeUserIds?.includes(
                            user.value
                          )
                        )}
                        onChange={handleMultiSelectChange}
                        isDisabled={allUsers} // Disable MultiSelect if allUsers is checked
                      />
                    </div>
                  </div>
                  <div className="gap-2 mt-2">
                    <Grid xs={6}>
                      <input
                        type="file"
                        id="upload-file"
                        className="d-none"
                        onChange={handleFileChange}
                        // disabled={!!physicianProfile.azureSignatureUrl}
                      />
                      <label
                        htmlFor="upload-file"
                        className="dropzone pt-2 py-1 px-8 d-flex align-items-center"
                      >
                        <div className="dz-message needsclick">
                          {t("Choose File")}
                        </div>
                      </label>
                    </Grid>
                    <div>
                      <span className="text-muted">
                        {t("Note! Please choose only PNG | .JPG | .JPEG")}
                      </span>
                      {error && (
                        <div className="text-dark-65 form__error mt-2">
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
            ) : null}
            <div className="d-flex gap-2 mt-10">
              <button
                className="btn btn-primary btn-sm fw-bold mt-4"
                onClick={savePhysicianProfileUpdate}
              >
                {t("Save Changes")}
              </button>
              <button
                className="btn btn-primary btn-sm fw-bold mt-4"
                onClick={() => navigate("/MyFavorites")}
              >
                {"Go To My Favorites Menu"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
