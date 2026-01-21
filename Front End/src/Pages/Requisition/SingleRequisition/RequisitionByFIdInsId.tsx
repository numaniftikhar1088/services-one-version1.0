import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import ReqSection from "./ReqSection";

const RequisitionByFIdInsId = (props: any) => {
  const inputElementReactSelect = useRef<any>();
  useEffect(() => {
    if (props?.focusOnInfectiousData) {
      inputElementReactSelect.current.focus();
    }
  }, [props?.focusOnInfectiousData]);

  return (
    <>
      <div ref={inputElementReactSelect} tabIndex={-1}>
        {" "}
      </div>
      {Array.isArray(props.infectiousData) &&
        props.infectiousData?.map((ReqConfig: any) => (
          <>
            <ReqSection
              ReqConfig={ReqConfig}
              isShown={props?.isShown}
              formState={props?.formState}
              setFormState={props?.setFormState}
              setFormData={props?.setFormData}
              setIsShown={props.setIsShown}
              infectiousData={props.infectiousData}
              setInfectiousData={props.setInfectiousData}
              setInputs={props?.setInputs}
              errorFocussedInput={props?.errorFocussedInput}
              rid={ReqConfig?.reqId}
              FinalAppendedArray={props.FinalAppendedArray}
              finaliseArray={props.finaliseArray}
              setFinalizeArray={props.setFinalizeArray}
              setSelectedReqIds={props.setSelectedReqIds}
              selectedReqIds={props.selectedReqIds}
              apiCallCondition={props.apiCallCondition}
              inputValueForSpecimen={props.inputValueForSpecimen}
              setInputValueForSpecimen={props.setInputValueForSpecimen}
              checkbox={props.checkbox}
              setCheckbox={props.setCheckbox}
              noMedication={props.noMedication}
              setNoMedication={props.setNoMedication}
              SignPadValue={props.SignPadValue}
              setSignPadValue={props.setSignPadValue}
              showButton={props.showButton}
              setErrorFocussedInput={props.setErrorFocussedInput}
              noFamilyHistroy={props.noFamilyHistroy}
              setNoFamilyHistory={props.setNoFamilyHistory}
              noActiveMedication={props.noActiveMedication}
              setNoActiveMedication={props.setNoActiveMedication}
              IsSelectedByDefaultCompendiumData={
                props.IsSelectedByDefaultCompendiumData
              }
              setIsSelectedByDefaultCompendiumData={
                props.setIsSelectedByDefaultCompendiumData
              }
              setCheckReqType={props.setCheckReqType}
              validationBackup={props.validationBackup}
              setValidationBackup={props.setValidationBackup}
              screening={props.screening}
              setScreening={props.setScreening}
              onDateValidityChange={props.onDateValidityChange}

            />
          </>
        ))}
    </>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return { Requisition: state };
}
export default connect(mapStateToProps)(RequisitionByFIdInsId);
//export default RequisitionByFIdInsId;
