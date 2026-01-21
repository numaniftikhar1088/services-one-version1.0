import { Grid } from "@mui/material";
import Radio from "../../../../../Shared/Common/Input/Radio";
import useLang from "Shared/hooks/useLanguage";
import { useEffect, useState } from "react";
import {
  GetPanelDisplayTypeLookup,
  GetSendOrderLookup,
} from "Services/Compendium/BloodLisCompendium/BloodLisCompendium";

function AdditionalSetupPanel({ formData, setFormData }: any) {
  const { t } = useLang();
  const [sendOrderLookup, setSendOrderLookup] = useState([]);
  const [panelDisplayTypeLookup, setPanelDisplayTypeLookup] = useState([]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      groupTests: {
        ...prev.groupTests,
        [name]: type === "checkbox" ? checked : parseInt(value),
      },
    }));
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const response = await GetSendOrderLookup();
        const response2 = await GetPanelDisplayTypeLookup();

        setSendOrderLookup(response.data);
        setPanelDisplayTypeLookup(response2.data);
      } catch (error) {
        console.error("Failed to fetch lookup data:", error);
      }
    };

    fetchLookupData();

    //
  }, []);

  return (
    <>
      <h6 className="text-primary h5">{t("Additional Setup")}</h6>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            // justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Grid item xs={12} md={6} lg={4} xl={3}>
              <div className="fv-row mb-4">
                <Radio
                id={`SendOrder`}
                  label={t("Send Order")}
                  name="sendOrder"
                  onChange={handleChange}
                  choices={sendOrderLookup}
                  checked={formData.groupTests.sendOrder}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={4} xl={3}>
              <div className="fv-row mb-4">
                <Radio
                  label={t("Panel Display Type")}
                  name="panelDisplayType"
                  onChange={handleChange}
                  choices={panelDisplayTypeLookup}
                  checked={formData.groupTests.panelDisplayType}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default AdditionalSetupPanel;
