import Select from "react-select";
import { styles } from "../../../Utils/Common";
import { setDropDownValue } from "../../../Utils/Common/Requisition";

function ServerSideDynamicDropDown(props: any) {
  const { data } = props;

  // const initialApiLoad = async () => {
  //   if (
  //     props?.defaultValue &&
  //     (data?.depfield ?? data?.field)?.autoCompleteOption
  //   ) {
  //     let parsedAutoCompleteData: any = JSON.parse(
  //       (data?.depfield ?? data?.field)?.autoCompleteOption
  //     );

  //     let payload = {
  //       systemFieldName:
  //         parsedAutoCompleteData.DependentControls[0].systemFieldName,
  //       jsonFieldNames: "",
  //     };

  //     let requestBody = parsedAutoCompleteData?.RequestBody;

  //     data.Inputs.map((section: any) => {
  //       section.fields.map((field: any) => {
  //         if (requestBody.hasOwnProperty(field.systemFieldName))
  //           requestBody[field.systemFieldName] = field.defaultValue;
  //       });
  //       section.dependencyControls.map((options: any) => {
  //         options.dependecyFields.map((field: any) => {
  //           if (
  //             requestBody.hasOwnProperty(field.systemFieldName) &&
  //             !field.displayType.includes("d-none")
  //           )
  //             requestBody[field.systemFieldName] = field.defaultValue;
  //         });
  //       });
  //     });

  //     if (parsedAutoCompleteData.Uri) {
  //       payload.jsonFieldNames = JSON.stringify(requestBody);

  //       const response = await Commonservice.makeApiCallForDropDown(
  //         parsedAutoCompleteData.Uri,
  //         payload
  //       );

  //       let updatedData = assignOptionsToDropDown(
  //         response.data.responseModel,
  //         parsedAutoCompleteData
  //       );
  //       data.setInputs(updatedData);
  //     }
  //   }
  // };

  // const assignOptionsToDropDown = (
  //   _options: any,
  //   parsedAutoCompleteData: any
  // ) => {
  //   const updatedFields = data.Inputs.map((section: any) => {
  //     section.fields.map((field: any) => {
  //       if (
  //         field.systemFieldName ===
  //         parsedAutoCompleteData.DependentControls[0].systemFieldName
  //       ) {
  //         field.options = _options;
  //         field.defaultValue = "";
  //       }
  //     });

  //     section.dependencyControls.map((options: any) => {
  //       options.dependecyFields.map((field: any) => {
  //         if (
  //           field.systemFieldName ===
  //           parsedAutoCompleteData.DependentControls[0].systemFieldName
  //         ) {
  //           field.options = _options;
  //           field.defaultValue = "";
  //         }
  //       });
  //     });

  //     return section;
  //   });

  //   return updatedFields;
  // };

  // useEffect(() => {
  //   initialApiLoad();
  // }, [props?.defaultValue]);

  return (
    <div
      className={
        data?.displayType
          ? data?.displayType
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <div
        id={props?.sysytemFieldName}
        ref={props?.inputElementDropdown}
        tabIndex={-1}
      />
      <label
        className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
      >
        {props?.label}
      </label>
      <Select
        menuPortalTarget={document.body}
        options={props?.RadioOptions ? props?.RadioOptions : data?.selectOpt}
        placeholder={props?.label}
        theme={(theme) => styles(theme)}
        value={setDropDownValue(
          props?.RadioOptions ? props?.RadioOptions : data?.selectOpt,
          props?.defaultValue,
          "ServerSideDynamicDropDown"
        )}
        onChange={(e: any) => props?.handleServerSideDropdownOnChange(e)}
        isSearchable={true}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: "var(--kt-input-border-color)",
            color: "var(--kt-input-border-color)",
          }),
        }}
      />
      {data.enableRule && (
        <div className="form__error">
          <span>{data.enableRule}</span>
        </div>
      )}
    </div>
  );
}

export default ServerSideDynamicDropDown;
