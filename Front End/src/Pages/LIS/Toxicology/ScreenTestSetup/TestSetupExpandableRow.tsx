import { AxiosError, AxiosResponse } from "axios";
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import { useDataContext } from "../../../../Shared/DataContext";
import { LoaderIcon } from "../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";

interface TestSetupExpandableRowProps {
  Close: any;
  RowId: number;
  specimenTypeId: number;
  performingLabId: number;
}
const TestSetupExpandableRow: FC<TestSetupExpandableRowProps> = (
  props: any
) => {
  const { t } = useLang();

  const { Close, RowId, specimenTypeId, performingLabId } = props;
  const { DropDowns, setDropdowns } = useDataContext();
  const [preFilledIds, setPreFilledIds] = useState([]);
  const [rows, setRows] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [IdsArray, setIdsArray] = useState<any[]>([]);
  const [requet, setRequest] = useState(false);
  const addRow = () => {
    setRows((prevRows: any) => [...prevRows, prevRows.length + 1]);
  };
  const handleDeleteRow = (index: number) => {
    setRows((prevRows: any) =>
      prevRows.filter((_: any, i: any) => i !== index)
    );
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((_, i) => i !== index)
    );
  };
  const handleChangeTestType = (selectedOption: any, rowIndex: number) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[rowIndex] = selectedOption;
    setSelectedOptions(updatedOptions);
    setIdsArray((prev) => [...prev, selectedOption?.value]);
  };
  const GetAssignedTestAgainstId = () => {
    RequisitionType.GetAssignedAgainstIDS(RowId, specimenTypeId)
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.result.map((item: any) => ({
          value: item.TestId,
          label: item.TestName,
        }));
        setPreFilledIds(mappedData);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const Delete = async (id: any) => {
    const query = {
      drugClassId: RowId,
      screenTestIds: [id],
    };
    await RequisitionType.DeleteToxScreenTestSetupAnalyte(query)
      .then((res: AxiosResponse) => {
        if (res.data.httpStatusCode === 200) {
          toast.success(t(res.data.message));
          GetAssignedTestAgainstId();
        } else {
          toast.error(t("Error!"));
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const handleDrugClassAnalyte = () => {
    setRequest(true);
    const queryModel = {
      drugClassId: RowId,
      screenTestIds: IdsArray,
    };
    RequisitionType.SaveToxDrugsAnalytes(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data.httpStatusCode === 200) {
          toast.success(t(res.data.message));
          setRequest(false);
          Close();
          setSelectedOptions([]);
        } else {
          toast.error(t("Error!"));
          setRequest(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  useEffect(() => {
    GetAssignedTestAgainstId();

    if (specimenTypeId && performingLabId) {
      console.log(specimenTypeId, performingLabId, "performingLabId");
      ScreenTestLookup();
    }
  }, []);

  const ScreenTestLookup = () => {
    RequisitionType.ScreenTestLookup(specimenTypeId, performingLabId)
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.result.map((item: any) => ({
          value: item.TestId,
          label: item.TestName,
        }));
        setDropdowns((prev: any) => ({
          ...prev,
          ScreenTestLookup: mappedData,
        }));
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="card shadow-sm mb-3 rounded border border-info">
        <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-danger min-h-35px">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <h6 className="text-warning m-0">{t("Test SetUp")}</h6>
          </div>
        </div>

        <div className="card-body py-md-4 py-3">
          <div className="mb-md-3 md-sm-3 mb-lg-3">
            {" "}
            <button
              id={`compendiumDataTestSetupExpandAddNew`}
              color="success"
              className="btn btn-primary btn-sm text-capitalize fw-400"
              onClick={addRow}
            >
              <i className="bi bi-plus-lg"></i>
              {t("Add New")}
            </button>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6">
            <table className="table table-dotted">
              <tr className="bg-transparent">
                <th className="fw-900 text-gray-700">
                  {t("Drug Class Analytes")}
                </th>
                <th className="fw-900 text-gray-700">{t("Delete")}</th>
              </tr>
              <tbody>
                {preFilledIds.length !== 0 &&
                  preFilledIds.map((i: any, index: any) => (
                    <tr key={i.label + index}>
                      <td id={`ClassAnalyte_${index + 1}`}>{i.label}</td>
                      <td className="">
                        <i
                          id={`Delete_${index + 1}`}
                          className="fa fa-close fs-2 text-danger cursor-pointer"
                          onClick={() => Delete(i?.value)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                {rows?.map((row: any, index: any) => (
                  <tr key={index}>
                    <td>
                      <Select
                        inputId={`compendiumDataTestSetupExpandSelectScreenTest`}
                        menuPortalTarget={document.body}
                        styles={reactSelectSMStyle}
                        theme={(theme: any) => styles(theme)}
                        options={DropDowns?.ScreenTestLookup}
                        placeholder="---Select---"
                        onChange={(event: any) =>
                          handleChangeTestType(event, index)
                        }
                        value={selectedOptions[index]}
                      />
                    </td>
                    <td className="">
                      <i
                        className="fa fa-close fs-2 text-danger cursor-pointer"
                        onClick={() => handleDeleteRow(index)}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
            {" "}
            <button
              id={`compendiumDataTestSetupExpandSave`}
              color="success"
              className="btn btn-primary btn-sm text-capitalize fw-400"
              onClick={() => {
                handleDrugClassAnalyte();
              }}
            >
              {requet ? <LoaderIcon /> : null} {t("Save")}
            </button>
            <button
              id={`compendiumDataTestSetupExpandCancel`}
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              onClick={Close}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestSetupExpandableRow;
