import DocComponent from "Pages/DocsViewer/DocComponent";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { savePdfUrls } from "Redux/Actions/Index";
import useLang from "Shared/hooks/useLanguage";
import { assignFormValues } from "Utils/Auth";
import { isJson } from "Utils/Common/Requisition";

function ReportTemplates(props: any) {
  const { t } = useLang();
  const { data, setInputs } = props;
  const dispatch = useDispatch();

  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);

  const handleTemplateChange = (
    id: number,
    url: string,
    e: any,
    label: string
  ) => {
    setSelectedTemplates((prevTemplates: any[]) => {
      const updatedTemplates = [...prevTemplates];
      const index = updatedTemplates.findIndex(
        (template) => template.label === label
      );

      const newTemplate = {
        label: label,
        id: id,
        name: e.target.value,
        fileUrl: url,
      };
      // If the label already exists, update it
      if (index > -1) {
        updatedTemplates[index] = newTemplate;
      } else {
        // Otherwise, add a new selection
        updatedTemplates.push(newTemplate);
      }

      return updatedTemplates;
    });
  };

  // useEffect for default selection of template options of facility Edit
  useEffect(() => {
    if (props?.defaultValue.length > 0) {
      setSelectedTemplates(
        isJson(props?.defaultValue)
          ? JSON.parse(props.defaultValue)
          : props.defaultValue
      );
    }
  }, [props?.defaultValue]);

  useEffect(() => {
    handleReportSelection();
  }, [selectedTemplates]);

  const handleReportSelection = async () => {
    let newInputs = await assignFormValues(
      props.Inputs,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      selectedTemplates,
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );

    setInputs(newInputs);
  };

  return (
    <div className="card mt-2">
      <div className="col-lg-12 col-sm-12 col-md-12 col-xxl-12">
        <div className="row">
          <h6 className="text-primary mb-5">
            {t("Select the required report template for resulting")}
          </h6>
          <div>
            {[
              ...new Set(data.options.map((template: any) => template.label)),
            ].map((uniqueReqType: any) => (
              <div className="d-flex justify-content-between align-item-center mb-2">
                <div key={uniqueReqType}>
                  <span className="fw-500">{t(uniqueReqType)}</span>
                  <div className="mt-5">
                    {data.options
                      .filter(
                        (template: any) => template.label === uniqueReqType
                      )
                      .map((template: any) => (
                        <div key={template.name} className="mb-3">
                          <label className="form-check form-check-inline form-check-solid me-5">
                            <input
                              className="form-check-input ifuser"
                              type="radio"
                              name={`template_${uniqueReqType}`}
                              value={t(template.name)}
                              checked={
                                selectedTemplates?.find(
                                  (sel) => sel.label === uniqueReqType
                                )?.name === template.name
                              }
                              onChange={(e: any) => {
                                handleTemplateChange(
                                  template.id,
                                  template.value,
                                  e,
                                  uniqueReqType
                                );
                              }}
                              id={template.name.split(" ").join("")}
                            />
                            {t(template.name)}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  {selectedTemplates
                    .filter((template) => template.label === uniqueReqType)
                    .map((template) => (
                      <a
                        href={"/docs-viewer"}
                        target="_blank"
                        onClick={() => {
                          dispatch(
                            savePdfUrls(template.fileUrl ?? template.value)
                          );
                        }}
                      >
                        <DocComponent
                          pdfUrl={template.fileUrl ?? template.value}
                        />
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ReportTemplates);
