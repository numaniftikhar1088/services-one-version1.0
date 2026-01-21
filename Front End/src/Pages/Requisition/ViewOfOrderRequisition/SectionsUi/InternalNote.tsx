import { AxiosResponse } from "axios";
import { t } from "i18next";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService";
import { LoaderIcon } from "Shared/Icons";

const InternalNote = (props: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fieldsInfo, RequisitionId, RequisitionOrderId, RequisitionType } =
    props;
  const [noteValue, setNoteValue] = useState(
    fieldsInfo.systemFieldName == "InternalNote" && fieldsInfo.fieldValue
  );
  const handleSubmitNote = async () => {
    if (!noteValue.trim()) {
      toast.warn("Please enter a note before submitting.");
      return;
    }
    const objToSend = {
      requisitionId: RequisitionId,
      requisitionOrderId: RequisitionOrderId,
      requsitionType: RequisitionType,
      note: noteValue,
    };

    try {
      setIsSubmitting(true);
      const res: AxiosResponse = await FacilityService.handleSubmitNote(
        objToSend
      );
      if (res.data.status === 200) {
        toast.success(res.data.message);
        props.loadData?.();
        setNoteValue("");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong while submitting the note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="align-items-center d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between px-4 py-3 bg-gray-100 mb-3 rounded">
        <div className="page-title d-flex flex-column justify-content-end flex-wrap me-3">
          <div className="w-100 page-title d-flex flex-column gap-4">
            {props.fieldsInfo.systemFieldName === "InternalNote" && (
              <div className="p-4">
                <label className="w-100 form-label fw-bold mb-2">
                  {props.fieldsInfo.fieldName}
                </label>
                <div className="d-flex gap-2">
                  <div className="w-300">
                    <textarea
                      className="form-control w-600px h-100px"
                      placeholder={t(props.fieldsInfo.fieldName)}
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSubmitNote}
                    className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "38px" }}
                  >
                    {isSubmitting ? (
                      <LoaderIcon />
                    ) : (
                      <i className="fa fa-paper-plane" />
                    )}
                  </button>
                </div>
              </div>
            )}
            {props.fieldsInfo.systemFieldName === "DisplayInternalNote" && (
              <div className="p-4">
                <label className="form-label fw-bold mb-3">
                  {props.fieldsInfo.fieldName}
                </label>

                {(props.fieldsInfo?.fieldValue || []).map(
                  (info: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 rounded bg-white border shadow-sm mb-3"
                    >
                      <div className="d-flex align-items-start">
                        <i className="fa fa-sticky-note text-primary me-3 fs-4 mt-1" />
                        <div className="flex-grow-1">
                          <p
                            className="mb-2 text-dark"
                            style={{ fontSize: "1rem" }}
                          >
                            {info.note}
                          </p>
                          <div className="d-flex justify-content-between text-muted small">
                            <span>
                              By: <strong>{info.addedBy}</strong>
                            </span>
                            <span>
                              {" "}
                              {info.addedDate
                                ? moment(info.addedDate).format(
                                  "MMM DD, YYYY [at] hh:mm A"
                                )
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {(!props.fieldsInfo?.fieldValue ||
                  props.fieldsInfo?.fieldValue.length === 0) && (
                    <div className="text-muted fst-italic">
                      No notes to display.
                    </div>
                  )}
              </div>
            )}
            {props?.fieldsInfo?.systemFieldName === "CollectorProviderComments" && (<>
              <textarea className="form-control w-600px h-100px" value={props.fieldsInfo?.fieldValue} disabled />
            </>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default InternalNote;
