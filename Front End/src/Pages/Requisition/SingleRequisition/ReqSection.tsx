import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import SectionComp from "./SectionComp";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { commaSeperatedStrSlice } from "../../../Utils/Common/Requisition";
import { setSelectedRequisitionData } from "../../../Redux/Actions/Pages/Requisition";
import { useDispatch } from "react-redux";
import { t } from "i18next";
function CustomToggle({ children, eventKey, isSelected, props }: any) {
  const dispatch = useDispatch();
  const removeSelectedRequisitionData = (
    nameToRemove: any,
    idToRemove: any
  ) => {
    dispatch(
      setSelectedRequisitionData((prevState: any) => {
        const filteredData = {
          requisitionName: prevState.requisitionName.filter(
            (name: any) => name !== nameToRemove
          ),
          requsitionId: prevState.requsitionId.filter(
            (id: any) => id !== idToRemove
          ),
        };
        return filteredData;
      })
    );
  };
  const decoratedOnClick = useAccordionButton(eventKey, (checked) => {
    let reqIdName = commaSeperatedStrSlice(eventKey);
    let arrayIds: any = [];
    let arrayName: any = [];
    arrayIds.push(reqIdName.requsitionId);
    arrayName.push(reqIdName.requisitionName);
    props.setSelectedReqIds({
      requsitionId: arrayIds,
      requisitionName: arrayName,
    });
    let obj = {
      requsitionId: arrayIds,
      requisitionName: arrayName,
    };

    if (checked) {
      dispatch(setSelectedRequisitionData(obj));
      props.infectiousData.map((i: any) => {
        if (i.reqId === props.ReqConfig.reqId) {
          i.isSelected = true;
        }
        props.setInfectiousData(props.infectiousData);
        props.setCheckReqType(true);
      });
    } else {
      removeSelectedRequisitionData(
        reqIdName.requisitionName,
        reqIdName.requsitionId
      );
      props.infectiousData.map((i: any) => {
        if (i.reqId == props.ReqConfig.reqId) {
          i.isSelected = false;
        }
        props.setInfectiousData(props.infectiousData);
        props.setCheckReqType(false);
      });
    }
  });

  useEffect(() => {
    if (!isSelected) {
      removeSelectedRequisitionData(
        props.ReqConfig.requisitionName,
        props.ReqConfig.reqId
      );
    }
  }, [isSelected]);

  return (
    <label className="form-check form-check-sm form-check-solid d-flex align-items-center">
      <input
        className="form-check-input mr-2"
        type="checkbox"
        defaultValue=""
        checked={isSelected}
        onChange={(e: any) => {
          decoratedOnClick(e.target.checked);
        }}
      />
      {children}
    </label>
  );
}

const ReqSection = (props: any) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const expandAccordion = () => {
    props.setIsSelectedByDefaultCompendiumData(
      !props.IsSelectedByDefaultCompendiumData
    );

    if (props.ReqConfig.isSelected) {
      setActiveKey(
        props.ReqConfig.reqId + "," + props.ReqConfig.requistionName
      );
    } else {
      setActiveKey(null);
    }
  };

  useEffect(() => {
    expandAccordion();
  }, [props.ReqConfig.isSelected]);
  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <Accordion
          className={`crad rounded-3 ${props?.ReqConfig?.colour}`}
          style={{ border: `2px solid ${props?.ReqConfig?.colour}` }}
          activeKey={activeKey ? activeKey : null}
        >
          <Card.Header
            style={{ background: props?.ReqConfig?.colour }}
            className="px-4 h-35px rounded-3 border-0 min-h-40px pt-1 align-items-center d-flex"
          >
            <CustomToggle
              eventKey={
                props?.ReqConfig?.reqId + "," + props?.ReqConfig?.requistionName
              }
              isSelected={props.ReqConfig.isSelected}
              props={props}
            >
              <h6 className="mb-0">{t(props?.ReqConfig?.requistionName)}</h6>
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse
            eventKey={
              props?.ReqConfig?.reqId + "," + props?.ReqConfig?.requistionName
            }
          >
            <Card.Body className="p-3 ">
              <div className="row grid2">
                {Array.isArray(props?.ReqConfig?.sections) &&
                  props?.ReqConfig?.sections?.map(
                    (section: any, index: number) => (
                      <div
                        className={`${section.displayType} mb-4 ${section.cssStyle}`}
                        key={index}
                      >
                        <SectionComp
                          Section={section}
                          Inputs={props?.ReqConfig?.sections}
                          setInputs={props?.setInputs}
                          index={index}
                          formState={props?.formState}
                          setFormState={props?.setFormState}
                          setFormData={props?.setFormData}
                          setIsShown={props.setIsShown}
                          infectiousData={props.infectiousData}
                          setInfectiousData={props.setInfectiousData}
                          inputDataInputsForValidation={
                            props?.inputDataInputsForValidation
                          }
                          infectiousInputs={true}
                          errorFocussedInput={props?.errorFocussedInput}
                          rid={props?.rid}
                          rname={props?.ReqConfig?.requistionName}
                          apiCallCondition={props.apiCallCondition}
                          inputValueForSpecimen={props.inputValueForSpecimen}
                          setInputValueForSpecimen={
                            props.setInputValueForSpecimen
                          }
                          checkbox={props.checkbox}
                          setCheckbox={props.setCheckbox}
                          noMedication={props.noMedication}
                          setNoMedication={props.setNoMedication}
                          SignPadValue={props.SignPadValue}
                          setSignPadValue={props.setSignPadValue}
                          fields={section}
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
                          validationBackup={props.validationBackup}
                          setValidationBackup={props.setValidationBackup}
                          screening={props.screening}
                          setScreening={props.setScreening}
                          onDateValidityChange={props.onDateValidityChange}


                        />
                      </div>
                    )
                  )}
                <div className="col-12 col-sm-12 pb-4 grid-item grid-sizer"></div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Accordion>
      </div>
    </>
  );
};

export default ReqSection;
