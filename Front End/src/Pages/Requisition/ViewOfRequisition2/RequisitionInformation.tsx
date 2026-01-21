import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import ViewInfectiousDisease from "./ViewInfectiousDisease";
function CustomToggle({ children, eventKey }: any) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("totally custom!")
  );
  return (
    <label className="form-check form-check-sm form-check-solid col-6 my-1 d-flex">
      <input
        className="form-check-input mr-2"
        type="checkbox"
        defaultValue=""
        onClick={decoratedOnClick}
      />
      {children}
    </label>
  );
}
const RequisitionInformation = () => {
  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center mb-0">
            <h3 className="m-0 ">Requisition</h3>
          </div>
          <div className="card-body px-3 px-md-8">
            <div className="">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <Accordion
                  className="crad rounded-2"
                  defaultActiveKey="0"
                  alwaysOpen
                  style={{ border: "2px solid #069636" }}
                >
                  <Card>
                    <Card.Header
                      className="rounded px-7 h-35px rounded-0 border-0 bg-light-primary"
                      //   style={{ background: "#DCD300" }}
                    >
                      <CustomToggle eventKey="1">
                        <span>
                          {" "}
                          <h6 className="mb-1">Infectious Disease</h6>
                        </span>
                      </CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        <ViewInfectiousDisease />
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div>
              {/* <div className="mb-2 mt-2 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <Accordion
                  defaultActiveKey="0"
                  alwaysOpen
                  className="crad rounded-3"
                  style={{ border: "2px solid #848482" }}
                >
                  <Card>
                    <Card.Header
                      className="rounded px-7 h-35px rounded-0 border-0"
                      style={{ background: "#848482" }}
                    >
                      <CustomToggle eventKey="2">
                        <h6 className="mb-1">TOX</h6>
                      </CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                      <Card.Body className="p-3"></Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div> */}
              {/* <div className="mb-2 mt-2 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <Accordion
                  className="crad rounded-3"
                  defaultActiveKey="0"
                  alwaysOpen
                  style={{ border: "2px solid #DCD300" }}
                >
                  <Card>
                    <Card.Header
                      className="rounded px-7 h-35px rounded-0 border-0"
                      style={{ background: "#DCD300" }}
                    >
                      <CustomToggle eventKey="3">
                        <span>
                          {" "}
                          <h6 className="mb-1">Blood</h6>
                        </span>
                      </CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="3">
                      <Card.Body></Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequisitionInformation;
