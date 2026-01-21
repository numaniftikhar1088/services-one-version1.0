import { useState } from "react";

import Select from "react-select";

import { AxiosError, AxiosResponse } from "axios";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
export const getImageFileSize = (bytes: any) => {
  let decimals = 2;
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
export const extractLastModifiedDate = (file: any) => {
  const dateObject = new Date(file);
  const extractedTime = dateObject.toUTCString();

  return extractedTime;
};
interface Facility {
  value: number;
  label: string;
}
function TestingSuppliesTable({
  setPath,
  postData,
  fileName,
  handlesave,
  setpostData,
  setfileName,
  handleCancel,
  clearFileName,
  handleRepClick,
  salesReplookup,
  categoryLookup,
  selectedSalesRep,
  removeSelectedRep,
  allRepsSearchTerm,
  filteredSelectedReps,
  handleChangeCategory,
  setAllRepsSearchTerm,
  selectedRepsSearchTerm,
  moveAllToFacilityLookup,
  moveAllToSelectedFacilities,
  setSelectedSalesRepsSearchTerm,
}: any) {
  const { t } = useLang();

  const [loading, setLoading] = useState<any>("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Only one file

      // Check file size (1MB limit)
      if (file.size > 1 * 1024 * 1024) {
        toast.error(t("File size should not exceed 1 MB."));
        e.target.value = "";
        return;
      }

      setfileName([...fileName, file]);
      e.target.value = "";
    }
  };

  const handleImageDeselect = (image: any) => {
    const _fileName = [...fileName];
    const index = _fileName.map((_) => _.name).indexOf(image.name);
    if (index > -1) {
      _fileName.splice(index, 1);
    }
    setfileName([..._fileName]);
  };

  const handleUpload = async () => {
    setLoading(true);
    let obj: any = {};
    let files = Array.from(fileName).map((file: any) => {
      let reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (event: any) => {
          const content = event.target.result;
          const byteArray = new Uint8Array(content);
          const byteRepresentation = Array.from(byteArray);
          const filename = file.name;
          const extension = filename.split(".").pop();
          obj = {
            name: filename,
            portalKey: "demoapp",
            fileType: file.type,
            extention: extension,
            content: byteRepresentation,
            isPublic: true,
          };
          resolve(obj);
        };
        reader.readAsArrayBuffer(file);
      });
    });
    let res = await Promise.all(files);

    await FacilityService.UploadFilesToBlobFormModel(res)
      .then((res: AxiosResponse) => {
        setPath(res?.data?.Data?.[0]); // added single path index
        toast.success(res?.data?.Title);
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  // Function to remove duplicates from an array based on 'value'
  const removeDuplicates = (arr: Facility[]): Facility[] => {
    const uniqueValues = new Set<number>();
    return arr.filter((item) => {
      if (uniqueValues.has(item.value)) {
        return false;
      } else {
        uniqueValues.add(item.value);
        return true;
      }
    });
  };
  // Remove duplicates from the lookup array
  const uniqueLookup = removeDuplicates(salesReplookup);

  const lookupForEdit = uniqueLookup.filter(
    (lookupItem: Facility) =>
      !selectedSalesRep.some(
        (selectedItem: Facility) => selectedItem.value === lookupItem.value
      )
  );

  const filteredAllReps = lookupForEdit.filter((facility) =>
    facility.label.toLowerCase().includes(allRepsSearchTerm.toLowerCase())
  );
  return (
    <>
      <div className="card-header d-flex justify-content-sm-between justify-content-center align-items-center minh-42px gap-3 p-0">
        <div>
          <h5 className="m-0 ">{t("Testing Supplies")}</h5>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            id={`TrainingDocumentSaleRepCancel`}
            className="btn btn-secondary btn-sm btn-secondary--icon"
            onClick={handleCancel}
          >
            {t("Cancel")}
          </button>
          <button
            id={`TrainingDocumentSaleRepSave`}
            className="btn btn-primary btn-sm btn-primary--icon px-7"
            onClick={handlesave}
          >
            <span>
              <span>{t("Save")}</span>
            </span>
          </button>
        </div>
      </div>
      <div
        className="MuiCollapse-root MuiCollapse-vertical MuiCollapse-entered css-c4sutr"
        style={{
          height: "auto",
          minHeight: "0px",
          transitionDuration: "357ms",
        }}
      >
        <div className="MuiCollapse-wrapper MuiCollapse-vertical css-hboir5">
          <div className="MuiCollapse-wrapperInner MuiCollapse-vertical css-8atqhb">
            <div className="MuiBox-root css-1ynyhby">
              <div className="MuiTypography-root MuiTypography-body1 MuiTypography-gutterBottom css-1tqv6h6">
                <div className=" container-fluid">
                  {" "}
                  <div className="col-lg-12 bg-white">
                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center pb-0 pt-0 mt-2">
                      <div className="row d-flex align-items-center mb-2 w-100">
                        <div className="col-md-3 d-flex align-items-center w-auto">
                          <PermissionComponent
                            moduleName="Marketing"
                            pageName="Training Documents"
                            permissionIdentifier="UploadFile"
                          >
                            <div className="align-items-center d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between py-3  rounded">
                              <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                                <div className="d-flex gap-2">
                                  <input
                                    id={`TrainingDocumentSaleRepUploadFile`}
                                    type="file"
                                    className="d-none"
                                    value={postData.fileUpload}
                                    accept="pdf"
                                    onChange={handleFileSelect}
                                    disabled={
                                      fileName?.length === 1 ||
                                      postData?.fileName?.length === 1
                                    }
                                  />

                                  <label
                                    htmlFor="TrainingDocumentSaleRepUploadFile"
                                    className="dropzone pt-2 py-1 px-8 d-flex align-items-center w-125px"
                                  >
                                    <div className="dz-message needsclick">
                                      {t("Choose File")}
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </PermissionComponent>
                          {fileName.length > 0 ? (
                            <div>
                              <button
                                id={`TrainingDocumentSaleRepUploadButton`}
                                className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
                                onClick={handleUpload}
                                disabled={fileName?.length < 1}
                              >
                                <i className="bi bi-upload"></i>
                              </button>
                            </div>
                          ) : null}
                        </div>
                        <div className=" col-md-3 d-flex align-items-center w-auto pb-md-0 pb-3">
                          <span className="fw-400 mr-3 required">
                            {t("Category")}
                          </span>
                          <Select
                            inputId={`TrainingDocumentSaleRepCategory`}
                            menuPortalTarget={document.body}
                            styles={reactSelectSMStyle}
                            theme={(theme: any) => styles(theme)}
                            options={categoryLookup}
                            name="SalesRepCategory"
                            onChange={handleChangeCategory}
                            value={categoryLookup.filter(function (
                              option: any
                            ) {
                              return option.value === postData.categoryId;
                            })}
                          />
                        </div>
                        {postData?.fileName?.length > 0 ? (
                          <div className="col-lg-8 col-sm-12 col-md-8">
                            <div className="border bg-light-secondary rounded p-2 my-3">
                              <div className="d-flex justify-content-between">
                                <div className="text-dark-65">
                                  <span>
                                    <span className="fw-bold">
                                      {t("File Name:")}
                                    </span>{" "}
                                    {postData.fileName}
                                  </span>
                                </div>
                                <RxCross2
                                  style={{ fontSize: "large" }}
                                  onClick={() => clearFileName()}
                                />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {fileName.length > 0 ? (
                        <>
                          <>
                            <div className="col-lg-7 col-sm-12 col-md-8">
                              <div className="border bg-light-secondary rounded p-2 my-3">
                                <div className="d-flex justify-content-between">
                                  <>
                                    <div className="text-dark-65">
                                      <span>
                                        <span className="fw-bold">
                                          {t("File Name:")}
                                        </span>
                                        {fileName[0]?.name}
                                      </span>
                                      <br />
                                    </div>
                                    <div>
                                      <span className="px-5">
                                        {extractLastModifiedDate(
                                          fileName[0]?.lastModifiedDate
                                        )}
                                      </span>

                                      <span
                                        style={{
                                          fontSize: "13px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          handleImageDeselect(fileName[0])
                                        }
                                      >
                                        &#x2716;
                                      </span>
                                    </div>
                                  </>
                                </div>{" "}
                              </div>
                            </div>
                          </>
                          {/* NOTE: Commented this code as currently user is being able to upload only one file */}
                          {/* 
                          <>
                            <div className="my-2 col-6">
                              <span className="fs-7 text-gray-400">
                                <span className="fw-bold">{t("Note: ")}</span>
                                {t(
                                  "Max file size is 1MB and max number of files is 10."
                                )}
                              </span>
                            </div>
                          </> */}
                        </>
                      ) : null}
                    </div>
                    <div className="py-0">
                      <div className="card shadow-sm rounded border border-warning">
                        <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
                          <h6 className="text-warning mb-0">{t("Sale Rep")}</h6>
                        </div>
                        <div className="card-body py-md-4 py-3 px-4">
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="row">
                              <div className="d-flex align-items-center flex-wrap justify-content-around">
                                <div className="col-lg-5 col-md-5 col-sm-12">
                                  <span className="fw-bold">
                                    {t("All Reps")}
                                  </span>
                                  <input
                                    id={`TrainingDocumentSaleRepAllSaleRepSearch`}
                                    className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                                    value={allRepsSearchTerm}
                                    onChange={(e) =>
                                      setAllRepsSearchTerm(e.target.value)
                                    }
                                    placeholder={t("Search...")}
                                    type="text"
                                  />
                                  <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                                    <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                                      <span className="fw-bold">
                                        {t("All List")}
                                      </span>
                                    </div>
                                    <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                                      {filteredAllReps.map(
                                        (rep: any, index: any) => (
                                          <li
                                            id={`TrainingDocumentSaleRepAllSaleRep_${rep.value}`}
                                            key={index}
                                            onClick={() => handleRepClick(rep)}
                                            className="list-group-item py-1 px-2 border-0 cursor-pointer"
                                          >
                                            <div className="d-flex">
                                              <span>{rep.label}</span>
                                            </div>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                                <div className="align-items-center d-flex flex-md-column mt-2 justify-content-center gap-2 px-3">
                                  <span
                                    id={`TrainingDocumentSaleRepSelectAll`}
                                    className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                                    onClick={moveAllToSelectedFacilities}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i
                                      style={{
                                        fontSize: "20px",
                                        color: "white",
                                      }}
                                      className="fa"
                                    >
                                      &#xf101;
                                    </i>
                                  </span>
                                  <span
                                    id={`TrainingDocumentSaleRepDeselectAll`}
                                    className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                                    onClick={moveAllToFacilityLookup}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i
                                      style={{
                                        fontSize: "20px",
                                        color: "white",
                                      }}
                                      className="fa"
                                    >
                                      &#xf100;
                                    </i>
                                  </span>
                                </div>
                                <div className="col-lg-6 col-md-5 col-sm-12">
                                  <span className="fw-bold required">
                                    {t("Selected Reps")}
                                  </span>
                                  <input
                                    id={`TrainingDocumentSaleRepSelectedSaleRepSearch`}
                                    className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                                    value={selectedRepsSearchTerm}
                                    onChange={(e) =>
                                      setSelectedSalesRepsSearchTerm(
                                        e.target.value
                                      )
                                    }
                                    placeholder={t("Search...")}
                                    type="text"
                                  />
                                  <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                                    <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                                      <span className="fw-bold">
                                        {t("Selected List")}
                                      </span>
                                    </div>
                                    <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                                      {filteredSelectedReps.map(
                                        (rep: any, index: any) => (
                                          <li
                                            id={`TrainingDocumentSaleRepSelectedSaleRep_${rep.value}`}
                                            onClick={() =>
                                              removeSelectedRep(rep)
                                            }
                                            key={index}
                                            className="list-group-item py-1 px-2 border-0 cursor-pointer"
                                          >
                                            {rep.label}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 pb-6 pt-3">
                      <label>
                        <h6>{t("Description")}</h6>
                      </label>
                      <textarea
                        id={`TrainingDocumentSaleRepTextarea`}
                        value={postData.trainingAidsDescription}
                        onChange={(e) =>
                          setpostData((oldData: any) => ({
                            ...oldData,
                            trainingAidsDescription: e.target.value,
                          }))
                        }
                        className=" form-control h-65px"
                        data-errormessage="Please Enter description"
                        data-validation-engine="validate[required]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TestingSuppliesTable;
