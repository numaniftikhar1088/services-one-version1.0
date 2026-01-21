import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import Input from "../../../../Shared/Common/Input/Input";
import Radio from "../../../../Shared/Common/Input/Radio";
import Select from "../../../../Shared/Common/Input/Select";
import SingleCheckbox from "../../../../Shared/Common/Input/SingleCheckbox";
import LoadButton from "../../../../Shared/Common/LoadButton";
import useForm from "../../../../Shared/hooks/useForm";
import useLang from "./../../../../Shared/hooks/useLanguage";
import { stateDropdownArray } from "../../../../Utils/Common";
import validate from "../../../../Utils/validate";
import { EditInitialState, initialState } from "./initialState";

const EditReferenceLab: React.FC<{}> = () => {
  const { t } = useLang();

  // ******* Global State *******
  const { id } = useParams<{ id: string }>();

  // ******* initial Sate *******
  const {
    formData,
    setFormData,
    errors,
    changeHandler,
    setErrors,
    setDataAndErrors,
  }: any = useForm(initialState, validate);

  // ******* File Function And State *******
  // state
  const [images, setImages] = useState<any>([]);
  const [fileExtensionError, setFileExtensionError] = useState(false);
  // path
  const [file, setFile] = useState(
    `${process.env.PUBLIC_URL + "/media/logos/placeholder.png"}`
  );

  // upload function
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileExtension = e.target.files![0].type.split("/")[1];
    if (
      fileExtension === "jpeg" ||
      fileExtension === "jpg" ||
      fileExtension === "png"
    ) {
      setFileExtensionError(false);
      setFile(URL.createObjectURL(e.target.files![0]));
      var formData = new FormData();
      formData.append("file", e.target.files![0]);
    } else {
      setFileExtensionError(true);
    }
  };

  // Monitor changes in the "file" state
  useEffect(() => {
    console.log("image state:", file);
  }, [file]);

  // remove file function
  const removeImaage = () => {
    setFile("/media/logos/placeholder.png");
  };

  useEffect(() => {
    EditReferenceLab();
  }, []);
  // ******* Get BY ID *******
  const EditReferenceLab = () => {
    UserManagementService.EditGetByIdReferenceLab(id)
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 200) {
          const updatedState = EditInitialState(initialState, res.data.data);
          setFormData(updatedState);
        } else {
          console.log("Something went wrong in update or save facility");
        }
      })
      .catch((err: AxiosError) => console.log(err, "err while creating user"));
  };
  // ******* Submit Form Data states *******
  const [isRequest, setIsRequest] = useState(false);
  const [formValues, setFormValues] = useState<any>({
    accountActivationType: "",
  });
  const navigate = useNavigate();
  // function
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let size;
    let formErrors: any;
    formErrors = validate(formData, true);
    setErrors(formErrors);
    size = Object.keys(formErrors).length;
    const objToSend = {
      labInformation: {
        referenceLabId: id,
        labName: formData.labName.value,
        labDisplayName: formData.labDisplayName.value,
        portalLogo: file,
        clia: formData.clia.value,
        enter3DigitsProgram: formData.enter3DigitsProgram.value,
        enter3DigitsLabCode: formData.enter3DigitsLabCode.value,
        labType: formData.labType.value,
        enableReferenceId:
          formData.enableReferenceId.value === "1" ? true : false,
        status: formData.status.value,
        labAddress: {
          email: formData.email.value,
          phone: formData.phone.value,
          fax: formData.fax.value,
          address__1: formData.address__1.value,
          address__2: formData.address__2.value,
          city1: formData.city1.value,
          state1: formData.state1.value,
          zipCode1: formData.zipCode1.value,
        },
        labDirectorInfo: {
          labDirectorId: formData.labDirectorId.value,
          firstName: formData.firstName.value,
          middleName: formData.middleName.value,
          lastName: formData.lastName.value,
          emailAddress: formData.emailAddress.value,
          mobile: formData.mobile.value,
          phone: formData.phone.value,
          address__1: formData.address__1.value,
          address__2: formData.address__2.value,
          city1: formData.city1.value,
          state1: formData.state1.value,
          zipCode1: formData.zipCode1.value,
          capInfoNumber: formData.capInfoNumber.value,
          noCapProvider: `${formData.noCapProvider.value}`,
        },
      },
    };

    if (formData.status.value == true) {
      setIsRequest(true);
      UserManagementService.AddAdminReferenceLab(objToSend)
        .then((res: AxiosResponse) => {
          if (res.data.statusCode === 200) {
            setIsRequest(false);
            toast.success(t(res.data.message));
            setTimeout(() => {
              navigate("/reference-lab");
            }, 1000);
          } else {
            console.log(
              "Something went wrong in update or save Reference Lab Setup"
            );
            setIsRequest(false);
          }
        })
        .catch((err: AxiosError) => {
          console.log(err, t("err while creating user"));
          setIsRequest(false);
        });
    } else {
      toast.error(t("Please fill the required fields!"));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="app-toolbar py-3 py-lg-6">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                <li className="breadcrumb-item text-muted">
                  <a href="" className="text-muted text-hover-primary">
                    {t("Home")}
                  </a>
                </li>

                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>

                <li className="breadcrumb-item text-muted">{t("Admin")}</li>

                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>

                <li className="breadcrumb-item text-muted">
                  {t("Add Reference Lab")}
                </li>
              </ul>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon"
                id="kt_reset"
                to={"/reference-lab"}
              >
                <span>
                  <span>{t("Cancel")}</span>
                </span>
              </Link>
              <LoadButton
                className="btn btn-sm fw-bold btn-primary"
                loading={isRequest}
                btnText="Save"
                loadingText={t("Saving")}
              />
            </div>
          </div>
        </div>

        <div className="app-container container-fluid my-8 mt-0">
          {/* ******** Lab Information ********* */}
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 ">{t("Reference Lab Information")}</h5>
            </div>
            <div className="card-body py-md-4 py-3">
              <div className="row">
                <div className="col-lg-9">
                  <div className="row">
                    <Input
                      type="text"
                      label={t("Reference Lab Name")}
                      name="labName"
                      onChange={changeHandler}
                      className="form-control bg-transparent"
                      parentDivClassName="col-lg-4 col-md-6 col-sm-12"
                      placeholder={t("Reference Lab Name")}
                      value={formData?.labName?.value}
                      error={errors?.labName}
                      required={true}
                    />
                    <Input
                      type="text"
                      label={t("Lab Display Name")}
                      name="labDisplayName"
                      onChange={changeHandler}
                      className="form-control bg-transparent"
                      parentDivClassName="col-lg-4 col-md-6 col-sm-12"
                      placeholder={t("Lab Display Name")}
                      value={formData?.labDisplayName?.value}
                      error={errors?.labDisplayName}
                      required={true}
                    />
                    <Input
                      type="text"
                      label={t("CLIA")}
                      name="clia"
                      onChange={changeHandler}
                      className="form-control bg-transparent"
                      parentDivClassName="col-lg-4 col-md-6 col-sm-12"
                      placeholder={t("CLIA")}
                      value={formData?.clia?.value}
                      error={errors?.clia}
                      required={true}
                    />
                    <Input
                      type="text"
                      label={t("Enter 3 Digits Program")}
                      name="enter3DigitsProgram"
                      onChange={changeHandler}
                      className="form-control bg-transparent"
                      parentDivClassName="col-lg-4 col-md-6 col-sm-12"
                      placeholder={t("Enter 3 Digits Program")}
                      value={formData?.enter3DigitsProgram?.value}
                      error={errors?.enter3DigitsProgram}
                      required={true}
                      maxLengthValue={3}
                    />
                    <Input
                      type="text"
                      label={t("3 Digits Lab Code")}
                      name="enter3DigitsLabCode"
                      onChange={changeHandler}
                      className="form-control bg-transparent"
                      parentDivClassName="col-lg-4 col-md-6 col-sm-12"
                      placeholder={t("3 Digits Lab Code")}
                      value={formData?.enter3DigitsLabCode?.value}
                      error={errors?.enter3DigitsLabCode}
                      required={true}
                      maxLengthValue={3}
                    />

                    <div className="col-lg-4 mb-4">
                      <Radio
                        label="Lab Type"
                        name="labType"
                        onChange={changeHandler}
                        disabled={true}
                        choices={[
                          {
                            id: "In-House",
                            label: t("In-House"),
                            value: "1",
                          },
                          {
                            id: "Reference",
                            label: t("Reference"),
                            value: "2",
                          },
                        ]}
                        error={errors.labType}
                        checked={formData.labType.value}
                      />
                    </div>
                    <div className="col-lg-4 mb-4">
                      <Radio
                        label="Enable Reference Id"
                        name="enableReferenceId"
                        onChange={changeHandler}
                        choices={[
                          {
                            id: "No",
                            label: t("No"),
                            value: "No",
                          },
                          {
                            id: "Yes",
                            label: t("Yes"),
                            value: "Yes",
                          },
                        ]}
                        error={errors.enableReferenceId}
                        checked={formData.enableReferenceId.value}
                      />
                    </div>
                    <SingleCheckbox
                      type="text"
                      label={t("Inactive/Active")}
                      name="status"
                      id="status"
                      onChange={changeHandler}
                      className="form-control bg-transparent"
                      parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                      placeholder={t("Status")}
                      value={formData?.status?.value}
                      error={errors?.status}
                      checkTypeClassName="form-check form-switch form-switch-sm form-check-solid flex-stack"
                      required={true}
                      checked={formData?.status?.value}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="fv-row mb-7 mt-6">
                    <div className="image-input image-input-outline image-input-placeholder">
                      <img
                        src={file}
                        className="image-input-wrapper w-125px h-125px"
                      />
                      <label
                        style={{
                          marginTop: "-112px",
                          marginLeft: "-3px",
                        }}
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                      >
                        <i className="bi bi-pencil-fill fs-7"></i>
                        <input
                          type="file"
                          name="logo"
                          style={{ display: "none" }}
                          onChange={uploadFile}
                        />
                      </label>
                      <span
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        data-kt-image-input-action="cancel"
                        data-bs-toggle="tooltip"
                        title="Cancel avatar"
                      >
                        <i className="bi bi-x fs-2"></i>
                      </span>
                      <span
                        style={{ marginLeft: "-12px" }}
                        className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                        data-kt-image-input-action="remove"
                        data-bs-toggle="tooltip"
                        title="Remove avatar"
                      >
                        <button
                          style={{
                            border: "none",
                            background: "white",
                          }}
                          onClick={removeImaage}
                          type="button"
                        >
                          <i className="bi bi-x fs-2"></i>
                        </button>
                      </span>
                    </div>
                    {fileExtensionError ? (
                      <div className="form-text" style={{ color: "red" }}>
                        {t("Plz Upload: png, jpg, jpeg. file")}
                      </div>
                    ) : (
                      <div className="form-text">
                        {t("Allowed file types: png, jpg, jpeg.")}
                      </div>
                    )}
                  </div>
                </div>
                <hr />
                <div className="col-12 my-3">
                  <h3>{"Enter Lab Address"}</h3>
                </div>
                <Input
                  type="text"
                  label={t("Email")}
                  name="email"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Email")}
                  value={formData?.email?.value}
                  error={errors?.email}
                />
                <Input
                  type="text"
                  label={t("Phone")}
                  name="phone"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("(999) 999-9999")}
                  value={formData?.phone?.value}
                  error={errors?.phone}
                  required={true}
                />
                <Input
                  type="text"
                  label={t("Fax")}
                  name="fax"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Fax")}
                  value={formData?.fax?.value}
                  error={errors?.fax}
                />
                <Input
                  type="text"
                  label={t("Address1")}
                  name="address__1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Address1")}
                  value={formData?.address__1?.value}
                  error={errors?.address__1}
                  required={true}
                />
                <Input
                  type="text"
                  label={t("Address2")}
                  name="address__2"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Address2")}
                  value={formData?.address__2?.value}
                  error={errors?.address__2}
                />
                <Input
                  type="text"
                  label={t("City")}
                  name="city1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("city")}
                  value={formData?.city1?.value}
                  error={errors?.city1}
                />
                <Select
                  menuPortalTarget={document.body}
                  label={t("State")}
                  name="state1"
                  id="state2"
                  options={stateDropdownArray}
                  value={formData?.state1?.value}
                  onChange={changeHandler}
                  error={errors.state1}
                />
                <Input
                  type="text"
                  label={t("Zip Code")}
                  name="zipCode1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Zip Code")}
                  value={formData?.zipCode1?.value}
                  error={errors?.zipCode1}
                />
              </div>
            </div>
          </div>
          {/* ******** Lab Director Info ********* */}
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 ">{t("Lab Director Info")}</h5>
            </div>
            <div className="card-body py-md-4 py-3">
              <div className="row">
                <Input
                  type="text"
                  label={t("First Name")}
                  name="firstName"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("First Name")}
                  value={formData?.firstName?.value}
                  error={errors?.firstName}
                  required={true}
                />
                <Input
                  type="text"
                  label={t("Middle Name")}
                  name="middleName"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Middle Name")}
                  value={formData?.middleName?.value}
                  error={errors?.middleName}
                />
                <Input
                  type="text"
                  label={t("Last Name")}
                  name="lastName"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Last Name")}
                  value={formData?.lastName?.value}
                  error={errors?.lastName}
                  required={true}
                />
                <Input
                  type="text"
                  label={t("Email Address")}
                  name="emailAddress"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Email Address")}
                  value={formData?.emailAddress?.value}
                  error={errors?.emailAddress}
                />
                <Input
                  type="text"
                  label={t("Mobile")}
                  name="mobile"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Mobile")}
                  value={formData?.mobile?.value}
                  error={errors?.mobile}
                  required={true}
                />
                <Input
                  type="text"
                  label={t("Phone")}
                  name="phone1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("(999) 999-9999")}
                  value={formData?.phone1?.value}
                  error={errors?.phone1}
                />
                <Input
                  type="text"
                  label={t("Address1")}
                  name="address__1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Address1")}
                  value={formData?.address__1?.value}
                  error={errors?.address__1}
                  required={true}
                />
                <Input
                  type="text"
                  label={t("Address2")}
                  name="address__2"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Address2")}
                  value={formData?.address__2?.value}
                  error={errors?.address__2}
                />
                <Input
                  type="text"
                  label={t("City")}
                  name="city1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("city1")}
                  value={formData?.city1?.value}
                  error={errors?.city1}
                />
                <Select
                  menuPortalTarget={document.body}
                  label={t("State")}
                  name="state1"
                  id="state2"
                  options={stateDropdownArray}
                  value={formData?.state1?.value}
                  onChange={changeHandler}
                  error={errors.state1}
                />
                <Input
                  type="text"
                  label={t("Zip Code")}
                  name="zipCode1"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Zip Code")}
                  value={formData?.zipCode1?.value}
                  error={errors?.zipCode1}
                />
                <SingleCheckbox
                  type="text"
                  label={t("No CAP # Provider")}
                  name="noCapProvider"
                  onChange={changeHandler}
                  className="form-control bg-transparent"
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("No CAP # Provider")}
                  value={formData?.noCapProvider?.value}
                  error={errors?.noCapProvider}
                  checked={formData?.noCapProvider?.value}
                />
                {formData.noCapProvider.value === true && (
                  <Input
                    type="text"
                    label={t("CAP Info Number")}
                    name="capInfoNumber"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                    placeholder={t("CAP Info Number")}
                    value={formData?.capInfoNumber?.value}
                    error={errors?.capInfoNumber}
                    required={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditReferenceLab;
