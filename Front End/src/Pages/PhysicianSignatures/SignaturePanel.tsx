import { AxiosResponse } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../Services/FacilityService/FacilityService";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, LoaderIcon, RemoveICon } from "../../Shared/Icons";
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { default as SignaturePad } from "react-signature-canvas";
import MultiSelect from "react-select";
import { Loader } from "Shared/Common/Loader";
import { styles } from "Utils/Common";
import NoRecord from "Shared/Common/NoRecord";
import useIsMobile from "Shared/hooks/useIsMobile";
interface SignatureProps {
  id: string;
  loadGridData: any;
  open: any;
  setOpen: any;
}
interface Users {
  isSelected: boolean;
  userId: string;
  userName: string;
}

export const reactSelectStyle = {
  control: (base: any) => ({
    ...base,
    boxShadow: "none",
    height: "auto !important",
    minHeight: "33px !important",
    borderRadius: ".475rem !important",
    padding: "0 0.4rem",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};
const SignaturePanel: React.FC<SignatureProps> = ({
  id,
  loadGridData,
  open,
  setOpen,
}) => {
  const [SignatureInfo, setSignatureInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [signCanvas, setSignCanvas] = useState<SignaturePad | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // Store selected user IDs
  const [error, setError] = useState("");
  const { t } = useLang();
  const isMobile = useIsMobile();

  const handleSelectedUserIdsChange = (userIds: string[]) => {
    setSelectedUserIds(userIds); // Update the selected user IDs
  };
  // ****************** get Signature And Facility Details By Id*********************
  const getAssignFacilitybyId = (id: string) => {
    FacilityService.getSignatureAndFacilityDetailsById(id).then(
      (res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          var data = res.data.data;
          setSignatureInfo(data);
        } else {
          toast.error(t(res?.data?.message));
        }
      }
    );
  };
  // ************************

  // ****************** Signature *********************
  const setCanvasRef = useCallback((node: any) => {
    if (node !== null) {
      setSignCanvas(node);
    }
  }, []);
  useEffect(() => {
    if (signCanvas && SignatureInfo?.signature) {
      let signatureData = SignatureInfo.signature;
      if (!signatureData.startsWith("data:image")) {
        signatureData = `data:image/png;base64,${signatureData}`;
      }
      signCanvas.fromDataURL(signatureData);
    }
  }, [SignatureInfo?.signature, signCanvas]);

  const handleEndPhysicianSignature = async () => {
    if (!signCanvas || signCanvas.isEmpty()) {
      return;
    }
    const imageBase64 = signCanvas.toDataURL();
    setSignatureInfo((prevInfo: any) => ({
      ...prevInfo,
      signature: imageBase64,
    }));
  };

  const clearSignature = () => {
    signCanvas?.clear(); // Clear the signature pad

    // Reset the signature state to empty
    setSignatureInfo((prevInfo: any) => ({
      ...prevInfo,
      signature: "", // Reset signature to empty
    }));
  };

  const handleFileChange = async (event: any) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (file && allowedTypes.includes(file.type)) {
      setError(""); // Reset error if the file is valid

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        if (signCanvas) {
          signCanvas.fromDataURL(base64Image); // Set the uploaded signature to the canvas
        }

        // Optionally update the state with the new base64 image
        setSignatureInfo((prevInfo: any) => ({
          ...prevInfo,
          signature: base64Image, // Save the uploaded base64 signature
        }));
      };

      reader.readAsDataURL(file);
    } else {
      setError(
        t("Invalid file type or size. Please upload a valid image file.")
      );
    }

    // Reset the file input after processing
    fileInput.value = "";
  };
  // ************************

  React.useEffect(() => {
    getAssignFacilitybyId(id);
    // if (signCanvas && SignatureInfo?.signature) {
    //   signCanvas.fromDataURL(SignatureInfo.signature); // Set the signature from base64
    // }
  }, []);

  const handleSave = async () => {
    if (!SignatureInfo.signature) {
      toast.error(t("Please provide your signature before saving."));
      return;
    }

    const payload = {
      userSignature: SignatureInfo.signature,
      userId: SignatureInfo.userId,
      assignedUserIds: selectedUserIds,
    };

    const response = await FacilityService.saveAndAssignSignature(payload)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          toast.success(t(res?.data?.responseMessage));
          loadGridData(true, false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
        toast.error(t("An error occurred while saving."));
      });
  };

  return (
    <>
      <div className=" d-flex justify-content-between align-items-center my-3 px-2">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <PermissionComponent
            moduleName="Facility"
            pageName="Facility Options"
            permissionIdentifier="Save"
          >
            <button
              id="FacilityOptionSave"
              className="btn btn-primary btn-sm fw-500"
              onClick={handleSave}
            >
              {t("Save")}
            </button>
          </PermissionComponent>
          <button
            id="FacilityOptionCancel"
            className="btn btn-secondary btn-sm btn-secondary--icon"
            onClick={() => setOpen(!open)}
          >
            {t("Cancel")}
          </button>
        </div>
        <div className="m-0 fs-4 lead fw-500"></div>
      </div>
      <div className="py-0">
        {/* ******** Signature Box ******** */}
        <div className="card border border-1 border-gray-300 mb-3 rounded">
          <div className="card-header bg-light d-flex justify-content-between align-items-center rounded min-h-35px px-4">
            <h6 className="mb-0">{t("Upload Signature")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="d-flex flex-wrap gap-3">
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
                    <div className="dz-message needsclick w-100 d-flex justify-content-center">
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
              <div className="w-100">
                <SignaturePad
                  maxWidth={2}
                  penColor="black"
                  ref={setCanvasRef}
                  backgroundColor="white"
                  onEnd={handleEndPhysicianSignature}
                  canvasProps={{
                    style: {
                      border: "2px dotted #c9d2dd",
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
            </div>
          </div>
        </div>
        {/* *************** Table *************** */}
        <h4 className="text-primary text-start my-2">
          {t("Assigned Facilities Users")}
        </h4>
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                isMobile
                  ? {}
                  : {
                      maxHeight: 800,
                      "&::-webkit-scrollbar": {
                        width: 7,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#fff",
                      },
                      "&:hover": {
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "var(--kt-gray-400)",
                          borderRadius: 2,
                        },
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--kt-gray-400)",
                        borderRadius: 2,
                      },
                    }
              }
              // component={Paper}
              className="shadow-none"
              // sx={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <Table
                // stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-30px">
                    {/* <TableCell className="w-20px min-w-20px"> </TableCell> */}
                    <TableCell
                      className="min-w-150px"
                      sx={{ width: "max-content" }}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("Facility Name")}
                      </div>
                    </TableCell>
                    <TableCell
                      className="min-w-150px"
                      sx={{ width: "max-content" }}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("Select All User")}
                      </div>
                    </TableCell>
                    <TableCell
                      className="min-w-150px"
                      sx={{ width: "max-content" }}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("User Name")}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={4} className="padding-0">
                      <Loader />
                    </TableCell>
                  ) : SignatureInfo?.userAssignedFacilities?.length == 0 ? (
                    <NoRecord message={"No data found for this table"} />
                  ) : (
                    SignatureInfo?.userAssignedFacilities?.map(
                      (item: any, index: number) => {
                        return (
                          <Row
                            row={item}
                            key={index}
                            onSelectedUserIdsChange={
                              handleSelectedUserIdsChange
                            }
                          />
                        );
                      }
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  );
};

export default SignaturePanel;

const Row = (props: {
  row: any;
  onSelectedUserIdsChange: (selectedUserIds: string[]) => void;
}) => {
  const { row, onSelectedUserIdsChange } = props;
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState<Users[]>(row.facilityUsers || []);
  // const [selectedUsers, setSelectedUsers] = useState<any[]>(initialSelected); // Store selected users
  const [selectedUsers, setSelectedUsers] = useState(
    users
      .filter((user) => user.isSelected)
      .map((user) => ({
        label: user.userName || "No Name",
        value: user.userId,
      }))
  );

  const formattedUsers = users.map((user) => ({
    label: user.userName || "No Name", // Default to "No Name" if the userName is empty
    value: user.userId, // userId is the value for each user
  }));

  const allSelected = selectedUsers.length === users.length;
  const handleSelectAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all users
      setSelectedUsers(formattedUsers);
      onSelectedUserIdsChange(formattedUsers.map((user) => user.value)); // Sele
    } else {
      // Unselect all users
      setSelectedUsers([]);
      onSelectedUserIdsChange([]); // Unselect all
    }
  };

  const { t } = useLang();

  const handleMultiSelectChange = useCallback(
    (selectedOptions: any) => {
      setSelectedUsers(selectedOptions || []);
      // Send the selected user IDs to the parent component
      onSelectedUserIdsChange(
        selectedOptions.map((option: any) => option.value)
      );
    },
    [onSelectedUserIdsChange]
  );

  React.useEffect(() => {
    setUsers(row.facilityUsers);

    const initialSelected = row.facilityUsers
      ?.filter((user: { isSelected: any }) => user.isSelected)
      .map((user: { userName: any; userId: any }) => ({
        label: user.userName || "No Name",
        value: user.userId,
      }));
    setSelectedUsers(initialSelected);
    onSelectedUserIdsChange(
      initialSelected.map((user: { value: any }) => user.value)
    );
  }, [row.facilityUsers]);
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.facilityName}</TableCell>
        <TableCell>
          {row.isSelectAllUser}
          <div className="form-check form-check-sm form-check-solid d-flex justify-content-center">
            <input
              id="allUsersCheckbox"
              className="form-check-input"
              type="checkbox"
              name="allUsers"
              checked={allSelected}
              onChange={handleSelectAllUsers}
            />
          </div>
        </TableCell>
        <TableCell>
          <MultiSelect
            styles={reactSelectStyle}
            theme={(theme) => styles(theme)}
            isMulti
            options={formattedUsers} // Pass formatted users as options
            name="users"
            placeholder={t("Select multi-users")} // Translation key
            value={selectedUsers} // Pass the selected users
            menuPortalTarget={document.body} //for last enter show drop down (outside the scroll)
            onChange={handleMultiSelectChange} // Handle change event
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
