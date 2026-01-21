import { LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import ViewInvoice from "Pages/Invoice/ViewInvoice";
import ConfirmationQC from "Pages/LIS/Toxicology/ConfirmationQC";
import ScreenQC from "Pages/LIS/Toxicology/ScreenQC";
import AssignFacilitySalesRep from "Pages/ManageSalesRep/AssignFacility";
import PatientInsuranceHistory from "Pages/Patient/PatientInsuranceHistory";
import ViewPatientDemographics from "Pages/Patient/ViewPatientDemographics";
import PhysicianSignature from "Pages/PhysicianSignatures/PhysicianSignature";
import ReqTracking from "Pages/Requisition/ReqTracking";
import { connect } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import AccountSettings from "../../Pages/AccountSettings";
import AddUserRoles from "../../Pages/Admin/AddUserRoles";
import EditReferenceLab from "../../Pages/Admin/ReferenceLab/AddReferenceLab/EditReferenceLab";
import ChangePassword from "../../Pages/Auth/ChangePassword";
import ChangeSecurityQuestions from "../../Pages/Auth/SecurityQuestions/ChangeSecurityQuestions";
import SecurityQuestions from "../../Pages/Auth/SecurityQuestions/SecurityQuestions";
import BloodLISSetting from "../../Pages/Blood/BloodLIS/LIS";
import InvoiceSetups from "../../Pages/Blood/BloodQc";
import PanelType from "../../Pages/Compendium/Panel Type";
import Index from "../../Pages/Compendium/TestType";
import { DynamicForm } from "../../Pages/DynamicForm";
import DynamicGrid from "../../Pages/DynamicGrid";
import DynamicOneUi from "../../Pages/DynamicOneUi";
import EditFacility from "../../Pages/Facility/EditFacility";
import ViewSingleFacilityForApproval from "../../Pages/Facility/FacilityApproval/ViewSingleFacilityForApproval";
import AddFacilityUser from "../../Pages/Facility/FacilityUser/CreateFacilityUser";
import EditFacilityUser from "../../Pages/Facility/FacilityUser/CreateFacilityUser/EditFacilityUser";
import View from "../../Pages/Facility/FacilityUser/ViewAllUserTab/View";
import MyFavoriteMenu from "../../Pages/Lab/MyFavoriteMenu";
import ManageSales from "../../Pages/ManageSalesRep";
import BulletinBoard from "../../Pages/Marketing/BulletinBoard";
import AddPatient from "../../Pages/Patient/PatientDemographic";
import EditPatient from "../../Pages/Patient/PatientDemographic/EditPatient";
import RequisitionReport from "../../Pages/Requisition/RequisitionReport";
import RequisitionSummary from "../../Pages/Requisition/SingleRequisition/RequisitionSummary";
import OrderView from "../../Pages/Requisition/ViewOfOrderRequisition";
import SalesRepView from "../../Pages/SalesManagements/Pending/View";
import SalesRepRequest from "../../Pages/SalesManagements/SalesRepRequest";
import UpsPickupAndShipment from "../../Pages/ShippingPickup/PickupAndShipment";
import ShippingInformation from "../../Pages/SupplyManagement/ManageOrder/NewOrders/ShippingInformation";
import ViewOrders from "../../Pages/SupplyManagement/ManageOrder/ViewOrders";
import TrainingAidsMain from "../../Pages/TrainingAidMarketing/TrainingAids/TrainingAidsMain";
import RoutesObj from "../../Routes/Routes";
import AuthRoutes from "../../Utils/Auth/RouteDirection";
import AsideMenu from "../Common/AsideMenu";
import { SideDrawers } from "../Common/SideDrawers";
import TopHeader from "../Common/TopHeader";
import InvoiceSetup from "Pages/Invoice/InvoiceSetup";
import { AddNewIntegration } from "Pages/Integration";
import ViewSingleFacilityDynamic from "Pages/Facility/ViewSingleFacilityDynamic";
import AssignFacility from "Pages/Facility/FacilityUser/CreateFacilityUser/AssignFacility";
import { DynamicFacility } from "Pages/Facility/DynamicFacility";
import AddFacility from "Pages/Facility/AddFacility/index";
import DynamicSplitPane from "Pages/DynamicSplitPane";
import DynamicGridProvider from "Pages/DynamicGrid/Context/useDynamicGrid";
import Dashboard from "Pages/Dashboard";
import LisTracking from "Pages/Blood/LisTracking";

function TrueMedDashboardLayout(props: any) {
  const location = useLocation();

  const StyledLinearProgress = styled(LinearProgress)(() => ({
    "&.MuiLinearProgress-root": {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#fff",
      height: "2px",
      zIndex: 9999,
      "& .MuiLinearProgress-bar": {
        backgroundColor: "#69A54B",
      },
    },
  }));

  function DynamicGridWrapper() {
    return (
      <DynamicGridProvider>
        <DynamicGrid />
      </DynamicGridProvider>
    );
  }

  return (
    <div className="d-flex flex-column flex-root app-root">
      <div className="app-page flex-column flex-column-fluid">
        <StyledLinearProgress className="d-none" />
        <TopHeader />
        <div
          className="app-wrapper flex-column flex-row-fluid"
          id="kt_app_wrapper"
        >
          <AsideMenu />
          <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
            <Routes>
              <Route
                path="/physician-signature"
                element={<PhysicianSignature />}
              />
              {location.pathname.includes("ChangePassword") ? (
                <Route path="ChangePassword/:id" element={<ChangePassword />} />
              ) : location.pathname.includes("MyFavorites") ? (
                <Route path="/MyFavorites" element={<MyFavoriteMenu />} />
              ) : (
                <>
                  <Route path="/" element={<MyFavoriteMenu />} />
                  {/* {getAuthRoutes(RoutesObj.AuthRoutes, props.User.Menus)} */}
                  <Route
                    path="*"
                    element={
                      <AuthRoutes
                        routesArr={RoutesObj.AuthRoutes}
                        menus={props.User.Menus}
                      />
                    }
                  />
                </>
              )}
              <Route path="patient" element={<AddPatient />} />
              <Route path="patient/:patientId" element={<AddPatient />} />
              <Route
                path="pickup-shipment/:courierName"
                element={<UpsPickupAndShipment />}
              />
              <Route path="facility-user-view-by-id/:id" element={<View />} />
              <Route
                path="OrderView/:requisitionId/:requisitionOrderId"
                element={<OrderView />}
              />
              <Route
                path="facility-view/:id"
                element={<ViewSingleFacilityDynamic />}
              />
              <Route
                path="view-patient-demographics-patient/:id"
                element={<ViewPatientDemographics />}
              />
              <Route path="supply-order-view" element={<ViewOrders />} />
              <Route path="supply-order" element={<ShippingInformation />} />
              <Route
                path="facility-view-approval/:id"
                element={<ViewSingleFacilityForApproval />}
              />
              <Route path="facility-user" element={<EditFacilityUser />} />
              <Route path="assign-facility/:id" element={<AssignFacility />} />
              <Route
                path="assign-facility/sales-rep-user/:id"
                element={<AssignFacilitySalesRep />}
              />
              <Route path="editfacility/:id" element={<EditFacility />} />
              <Route
                path="RequisitionSummary"
                element={<RequisitionSummary />}
              />
              <Route path="add-user-roles" element={<AddUserRoles />} />
              <Route path="editpatient/:id" element={<EditPatient />} />
              <Route
                path="edit-reference-lab/:id"
                element={<EditReferenceLab />}
              />{" "}
              <Route path="add-facility-user" element={<AddFacilityUser />} />
              <Route path="bulletin-board" element={<BulletinBoard />} />
              <Route path="training-documents" element={<TrainingAidsMain />} />
              <Route path="Manage-Sales-Rep" element={<ManageSales />} />
              <Route path="sales-Rep-Request" element={<SalesRepRequest />} />
              <Route
                path="salesUser-view-by-id/:id"
                element={<SalesRepView />}
              />
              <Route path="panel-type" element={<PanelType />} />
              <Route path="test-type" element={<Index />} />
              <Route path="dynamic-form/:pageId" element={<DynamicForm />} />
              <Route
                path="dynamic-grid/:pageId"
                element={<DynamicGridWrapper />}
              />
              <Route path="dynamic-one-ui/:pageId" element={<DynamicOneUi />} />
              <Route path="Blood-LIS-Setting" element={<BloodLISSetting />} />
              <Route path="dynamic-facility" element={<DynamicFacility />} />
              <Route path="blood-qc" element={<InvoiceSetups />} />
              <Route
                path="Requisition-Report"
                element={<RequisitionReport />}
              />
              <Route
                path="security/password"
                element={<ChangeSecurityQuestions />}
              />
              <Route
                path="security/change-questions"
                element={<SecurityQuestions />}
              />
              <Route path="account-settings" element={<AccountSettings />} />
              <Route
                path="dynamic-split-pane/:pageId"
                element={<DynamicSplitPane />}
              />
              <Route path="/facility" element={<AddFacility />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="Create-Invoice" element={<InvoiceSetup />} />
              <Route path="View-Invoice" element={<ViewInvoice />} />
              <Route path="/lis-tracking" element={<LisTracking />} />
              <Route
                path="/add-integration/:id"
                element={<AddNewIntegration />}
              />
              <Route
                path="/requisition-tracking/:reqOrderId"
                element={<ReqTracking />}
              />
              <Route path="/tox-lis/screen-qc" element={<ScreenQC />} />
              <Route
                path="/tox-lis/confirmation-qc"
                element={<ConfirmationQC />}
              />
              <Route path="/blanklandingpage" element={<div></div>} />
              <Route
                path="/patient-insurance-history/:id"
                element={<PatientInsuranceHistory />}
              />
            </Routes>
          </div>
        </div>
        <SideDrawers />
      </div>
    </div>
  );
}

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(TrueMedDashboardLayout);
