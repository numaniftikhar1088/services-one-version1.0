import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import Pickup from "./Pickup";
import AddNewPickup from "./Pickup/AddNewPickup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InsuranceService from "../../../Services/InsuranceService/InsuranceService";
import { useForm } from "react-hook-form";
import { useCourierContext } from "../../../Shared/CourierContext";
import Shipment from "./Shipment";
import AddNewShipment from "./Shipment/AddNewShipment";
import ShipmentTracking from "./ShipmentTracking";
import PickupArchive from "./PickupArchive";
import CancelOrder from "./CancelOrder";
import ShipmentArchive from "./ShipmentArchive";
import ShipmentTrackingArchive from "./ShipmentTrackingArchive";
import useLang from "Shared/hooks/useLanguage";
// import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { useSelector } from "react-redux";

const TabSelected = styled(Tab)(AutocompleteStyle());

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export type CourierNameI = "UPS" | "FedEx";

const UpsPickupAndShipment: React.FC<{}> = () => {
  const { t } = useLang();
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);

  const {
    setCourierName,
    setSearchRequest,
    setSearchRequestShipment,
    setSearchRequestShipmentTracking,
    setTabs,
    tabs,
    courierName,
  } = useCourierContext();

  const params = useParams().courierName;
  const navigate = useNavigate();

  const handleTabChanged = (_: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue);
    setModalShow(false);
    setModalShow1(false);
  };

  useEffect(() => {
    let courier: CourierNameI | null = null;
    if (params === "UPS" || params === "FedEx") {
      courier = params;
      setCourierName(courier);
      setSearchRequest((prev: any) => ({
        ...prev,
        courierName: courier,
      }));
      setSearchRequestShipment((prev: any) => ({
        ...prev,
        courierName: courier,
      }));
      setSearchRequestShipmentTracking((prev: any) => ({
        ...prev,
        courierName: courier,
      }));
      setModalShow(false);
      setModalShow1(false);
      setTabs(0);
    } else {
      navigate("/pickup-shipment/UPS");
    }
  }, [params]);

  const permissions =
    useSelector(
      (state: any) =>
        state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.permissions
    ) || [];

  const hasPermission = (
    moduleName: string,
    pageName: string,
    action: string
  ) => {
    return permissions.some(
      (p: any) =>
        p.subject.replace(/\n/g, "").toLowerCase() ===
          pageName.replace(/\n/g, "").toLowerCase() &&
        p.moduleName.replace(/\n/g, "").toLowerCase() ===
          moduleName.replace(/\n/g, "").toLowerCase() &&
        p.action.replace(/\n/g, "").toLowerCase() === action.toLowerCase()
    );
  };

  const canCancelOrder = hasPermission(
    "Shipping and Pickup",
    courierName === "FedEx"
      ? "FedEx Pickup and Shipment"
      : "UPS Pickup and Shipment",
    "Cancel"
  );

  return (
    <>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            <AddNewPickup modalShow={modalShow} setModalShow={setModalShow} />
            <AddNewShipment
              setModalShow={setModalShow1}
              modalShow={modalShow1}
            />
            <Tabs
              value={tabs}
              onChange={handleTabChanged}
              className="min-h-auto"
              TabIndicatorProps={{ style: { background: "transparent" } }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons": {
                  width: 0,
                  transition: "width 0.7s ease",
                  "&:not(.Mui-disabled)": {
                    width: "48px",
                  },
                },
              }}
            >
              <TabSelected
                label={t("Pickup")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`pickup`}
              />
              {/* <TabSelected
                label={t("Shipment")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
              /> */}
              {/* <TabSelected
                label={t("Shipment Tracking")}
                {...a11yProps(2)}
                className="fw-bold text-capitalize"
              /> */}
              <TabSelected
                label={t("Pickup Archive")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`PickUpArchive`}
              />

              {canCancelOrder && (
                <TabSelected
                  label={t("Cancel Order")}
                  {...a11yProps(2)}
                  className="fw-bold text-capitalize"
                  id={`CancelOrder`}
                />
              )}

              {/* <TabSelected
                label={t("Shipment Archive")}
                {...a11yProps(4)}
                className="fw-bold text-capitalize"
              /> */}
              {/* <TabSelected
                label={t("Shipment Tracking Archive")}
                {...a11yProps(5)}
                className="fw-bold text-capitalize"
              /> */}
            </Tabs>
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body py-2">
                <TabPanel value={tabs} index={0}>
                  <Pickup setModalShow={setModalShow} />
                </TabPanel>
                {/* <TabPanel value={tabs} index={1}>
                  <Shipment setModalShow={setModalShow1} />
                </TabPanel> */}
                {/* <TabPanel value={tabs} index={2}>
                  <ShipmentTracking />
                </TabPanel> */}
                <TabPanel value={tabs} index={1}>
                  <PickupArchive />
                </TabPanel>

                <TabPanel value={tabs} index={2}>
                  <CancelOrder />
                </TabPanel>

                {/* <TabPanel value={tabs} index={4}>
                  <ShipmentArchive />
                </TabPanel> */}
                {/* <TabPanel value={tabs} index={5}>
                  <ShipmentTrackingArchive />
                </TabPanel> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpsPickupAndShipment;
