import { TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "react-select";
import SpecimenTypeAssigmentService from "Services/Compendium/SpecimenTypeAssigmentService";
import useLang from "Shared/hooks/useLanguage";
import { CrossIcon, DoneIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";

interface SpecimenType {
  value: number;
  label: string;
}
interface SpecimenTypeDetails {
  specimenTypeId: number;
  specimenType: string;
}
function AddSpecimenType({
  postData,
  handlesave,
  setPostData,
  handleCancel,
  handleCheckChange,
  handleChangeCategory,
}: any) {
  const { t } = useLang();
  const [SpecimenTypeList, setSpecimenTypeList] = useState<SpecimenType[]>([]);
  const GetSpecimenType = () => {
    SpecimenTypeAssigmentService.SpecimenTypeLookup().then((res: any) => {
      let SpecimenTypeArray: SpecimenType[] = [];
      res?.data?.data.map(
        ({ specimenTypeId, specimenType }: SpecimenTypeDetails) => {
          let SpecimenTypeDetails: SpecimenType = {
            value: specimenTypeId,
            label: specimenType,
          };
          SpecimenTypeArray.push(SpecimenTypeDetails);
        }
      );
      setSpecimenTypeList(SpecimenTypeArray);
    });
  };
  useEffect(() => {
    GetSpecimenType();
  }, []);

  return (
    <>
      <TableRow className="h-40px">
        <TableCell className="w-50px">
          <div className="gap-2 d-flex">
            <button
              id={`BloodLisSettingSpecimenTypeSave`}
              onClick={() => {
                handlesave();
              }}
              className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
            >
              <DoneIcon />
            </button>
            <button
              id={`BloodLisSettingSpecimenTypeCancel`}
              onClick={() => {
                handleCancel();
              }}
              className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
            >
              <CrossIcon />
            </button>
          </div>
        </TableCell>
        <TableCell>
          <div className="required d-flex">
            <Select
              inputId={`BloodLisSettingSpecimenTypeSelect`}
              menuPortalTarget={document.body}
              styles={reactSelectSMStyle}
              placeholder={t("Select Specimen Type")}
              theme={(theme: any) => styles(theme)}
              options={SpecimenTypeList}
              value={
                postData.SpecimenType
                  ? SpecimenTypeList.find(
                      (option: any) => option.label === postData.SpecimenType
                    )
                  : null
              }
              onChange={handleChangeCategory}
              name="specimenTypeId"
              required={true}
              className="z-index-3 w-100"
            />
          </div>
        </TableCell>
        <TableCell>
          <input
            id={`BloodLisSettingSpecimenTypePrefix`}
            type="text"
            name="CategoryTitle"
            placeholder={t("Category Title")}
            className="form-control bg-white rounded-2 fs-8 h-30px"
            value={postData.prefix}
            onChange={(e) =>
              setPostData((oldData: any) => ({
                ...oldData,
                prefix: e.target.value,
              }))
            }
          />
        </TableCell>
        <TableCell>
          <input
            id={`BloodLisSettingSpecimenTypeSuffix`}
            type="text"
            name="CategoryTitle"
            placeholder={t("Category Name")}
            className="form-control bg-white rounded-2 fs-8 h-30px"
            value={postData.suffix}
            onChange={(e: any) =>
              setPostData((oldData: any) => ({
                ...oldData,
                suffix: e.target.value,
              }))
            }
          />
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center form-check form-switch">
            <input
              id={`BloodLisSettingSpecimenTypeSwitchButton`}
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="isActive"
              checked={postData.isActive}
              onChange={handleCheckChange}
            />
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

export default AddSpecimenType;
