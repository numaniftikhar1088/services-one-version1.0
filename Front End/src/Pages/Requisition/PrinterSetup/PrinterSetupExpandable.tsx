import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import useLang from "Shared/hooks/useLanguage";
export interface ITableObj {
  id: number;
  printerName: string;
  modelNumber: string;
  labelSize: string;
  labelName: string;
  labName: string;
  labId: number | null;
  isDefault: boolean;
  facilities: any;
  rowStatus: boolean;
  configurationDocumentLink: string;
  labelContent: string;
  softwareDownloadLink: string;
}
const PrinterSetupExpandable = (props: {
  row: ITableObj;
  handleChange: any;
  ShowBlob: any;
}) => {
  const { t } = useLang();

  const { row, handleChange, ShowBlob } = props;
  const dispatch = useDispatch();
  return (
    <>
      {/* <div className="card"> */}
      <div className="card-body py-md-4 py-3">
        <div className="d-flex align-items-end">
          <div className="d-flex flex-row fv-row w-50">
            <div className="d-flex flex-column w-100">
              <label
                className={`mb-2 fw-700 fs-6 ${
                  row?.rowStatus ? "required" : ""
                }`}
              >
                {t("Label Content")}
              </label>
              <textarea
                id={`PrinterSetupExpandTextarea`}
                className="form-control-printer fw-400 fs-7 p-4 rounded"
                name="labelContent"
                placeholder="Label Content"
                rows={2}
                value={row?.labelContent}
                disabled={!row?.rowStatus}
                onChange={(event: any) =>
                  handleChange(event.target.name, event.target.value, row?.id)
                }
              ></textarea>
            </div>
          </div>
          {!row?.rowStatus ? (
            <div className="">
              <Link to={`/docs-viewer`} target="_blank">
                <button
                  id={`PrinterSetupExpandConfigrationButton`}
                  className="btn btn-primary btn-sm mx-2 fw-bold px-5 text-capitalize"
                  disabled={true}
                  onClick={() => {
                    dispatch(savePdfUrls(row?.configurationDocumentLink));
                  }}
                >
                  {t("configuration document link")}
                </button>
              </Link>
            </div>
          ) : null}
          {!row.rowStatus ? (
            <div className="">
              <button
                id={`PrinterSetupDownloadLinkButton`}
                className="btn btn-primary btn-sm mx-2 fw-bold px-5 text-capitalize"
                disabled={true}
                onClick={() => {
                  ShowBlob(row?.softwareDownloadLink);
                }}
              >
                {t("software download link")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default PrinterSetupExpandable;
