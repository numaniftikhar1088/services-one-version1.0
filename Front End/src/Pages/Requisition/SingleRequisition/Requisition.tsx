import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Tox from "../RequisitionsList/Tox";
import InfectionDisease from "../RequisitionsList/InfectionDisease";
import Blood from "../RequisitionsList/Blood";
import useLang from "Shared/hooks/useLanguage";


function CustomToggle({ children }: any) {
  const { t } = useLang();
  return (
    <label className="form-check form-check-sm form-check-solid col-6 my-1 d-flex">
      <input
        className="form-check-input mr-2"
        type="checkbox"
        defaultValue=""
      />
      {children}
    </label>
  );
}
const Requisition = () => {
   const { t } = useLang();
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center mb-0">
        <h3 className="m-0 ">{t("Requisition")}</h3>
      </div>
      <div className="card-body px-3 px-md-8">
        <div className="">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <Accordion
              style={{ border: "2px solid #008856" }}
              className="crad rounded-3"
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ background: "#008856" }}
              >
                <CustomToggle eventKey="1">
                  <h6 className="mb-1">{t("Infectious Disease")}</h6>
                </CustomToggle>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <InfectionDisease />
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="mb-2 mt-2 col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <Accordion
              className="crad rounded-3"
              style={{ border: "2px solid #848482" }}
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ background: "#848482" }}
              >
                <CustomToggle eventKey="2">
                  <h6 className="mb-1">TOX</h6>
                </CustomToggle>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <Tox />
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="mb-2 mt-2 col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <Accordion
              style={{ border: "2px solid #DCD300" }}
              className="crad rounded-3"
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{ background: "#DCD300" }}
              >
                <CustomToggle eventKey="3">
                  <h6 className="mb-1">{t("Blood")}</h6>
                </CustomToggle>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <Blood />
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requisition;
