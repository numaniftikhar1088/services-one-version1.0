import { lazy } from "react";
import UserListContextProvider from "Pages/Admin/UserManagement/UserListContext";
import ForgetPassword from "Pages/Auth/ForgetPassword/ForgetPassword";
import AuthenticateWithCode from "Pages/Auth/MFA/AuthenticateWithCode";
import VerificationCode from "Pages/Auth/MFA/VerificationCode";
import NewPassword from "Pages/Auth/NewPassword";
import PatientDataForm from "Pages/Auth/PatientDataForm";
import SecurityQuestionsUserName from "Pages/Auth/SecurityQuestions/SecurityQuestionsUserName";
import SignatureRequest from "Pages/Auth/SignatureRequest";
import BloodResultData from "Pages/Blood/BloodResultData";
import BloodResultDataContextProvider from "Pages/Blood/BloodResultData/BloodResultDataContext";
import ManageFacility from "Pages/Facility/ManageFacility";
import ManageFacilityContextProvider from "Pages/Facility/ManageFacility/FacilityListContext/useManageFacility";
import ResultPdfUpload from "Pages/LIS/InfectiousDisease/ResultPdfUpload/ResultFileUpload";
import MarketPlace from "Pages/MarketPlace";
import BillingDataProvier from "Pages/Requisition/Billing-v2/useReqContext";
import ViewRequisitionDataProvider from "Pages/Requisition/SingleRequisition/ViewReq/RequisitionContext/useReqContext";
import WorkLogDataProvider from "Pages/Requisition/WorkLogV2/WorkLogContext/useWorkLogContext";
import ViewSingleFacilityDynamic from "Pages/Facility/ViewSingleFacilityDynamic";
import FacilityInventory from "Pages/SupplyManagement/FacilityInventory";
import MicrobiologyPanelMapping from "Pages/MicroBiologyLis/PanelMapping";
import ManageSalesGroup from "Pages/ManageSalesGroup";

// Lazy-loaded components
const SupplyManagementBulkCheckIn = lazy(
  () => import("../Pages/SupplyManagement/BulkCheckIn")
);

const WorkLogV2 = lazy(() => import("Pages/Requisition/WorkLogV2"));

const SupplyManagementBulkCheckOut = lazy(
  () => import("../Pages/SupplyManagement/BulkCheckOut")
);

const ShippingInformation = lazy(
  () =>
    import(
      "../Pages/SupplyManagement/ManageOrder/NewOrders/ShippingInformation"
    )
);
const TrainingAidsCategories = lazy(
  () =>
    import(
      "../Pages/TrainingAidMarketing/TrainingAidsCategory/TrainingAidsCategories"
    )
);
const BulletinBoard = lazy(() => import("../Pages/Marketing/BulletinBoard"));
const ManageSales = lazy(() => import("../Pages/ManageSalesRep"));
const PreConfiguration = lazy(
  () => import("../Pages/ShippingPickup/PreConfiguration")
);
const ToxResultFileConfiguration = lazy(
  () =>
    import(
      "../Pages/Requisition/ToxResultFileConfiguration/ResultFileConfiguration"
    )
);
const ViewOrders = lazy(
  () => import("../Pages/SupplyManagement/ManageOrder/ViewOrders")
);
// const UpsPickupAndShipment = lazy(
//   () => import("../Pages/ShippingPickup/PickupAndShipment")
// );
const ShippingAndSchedule = lazy(
  () => import("../Pages/ShippingPickup/ShippingAndSchedule")
);
const ManageOrder = lazy(() => import("../Pages/SupplyManagement/ManageOrder"));
const AddUserRoles = lazy(() => import("../Pages/Admin/AddUserRoles"));
const AddReferenceLab = lazy(
  () => import("../Pages/Admin/ReferenceLab/AddReferenceLab/AddReferenceLab")
);
const EditReferenceLab = lazy(
  () => import("../Pages/Admin/ReferenceLab/AddReferenceLab/EditReferenceLab")
);
const ViewReferenceLab = lazy(
  () => import("../Pages/Admin/ReferenceLab/ViewReferenceLab/ViewReferenceLab")
);
const UserManagement = lazy(() => import("Pages/Admin/UserManagement"));
const ChangePassword = lazy(() => import("../Pages/Auth/ChangePassword"));
const InitializePassword = lazy(
  () => import("../Pages/Auth/InitializePassword")
);
const Login2 = lazy(() => import("../Pages/Auth/Login2"));
const ResetPassword = lazy(() => import("../Pages/Auth/ResetPassword"));
const LabSwitching = lazy(() => import("../Pages/Auth/SwitchingLab"));
const Paneltype = lazy(() => import("../Pages/Compendium/Panel Type"));
const Compendium = lazy(() => import("../Pages/Compendium/PanelGroups"));
const PanelSetup = lazy(() => import("../Pages/Compendium/PanelSetup"));
const PanelSetupGrid = lazy(
  () => import("../Pages/Compendium/PanelSetup/PanelSetupGrid")
);
const QCBatchSetup = lazy(
  () => import("../Pages/Compendium/QCBatchSetup/QCBatchSetup")
);
const SpecimenType = lazy(() => import("../Pages/Compendium/SpecimenType"));
const SpecimenTypeAssigment = lazy(
  () => import("../Pages/Compendium/SpecimenTypeAssigment")
);
const TestAssignmentGrid = lazy(
  () => import("../Pages/Compendium/TestAssignmentGrid")
);
const TestSetUp = lazy(() => import("../Pages/Compendium/TestSetUp"));
const TestSetupGrid = lazy(() => import("../Pages/Compendium/TestSetupGrid"));
const TestType = lazy(() => import("../Pages/Compendium/TestType"));
const BloodCompendiumData = lazy(
  () =>
    import("../Pages/CompendiumData/BloodCompendiumData/BloodCompendiumData")
);
const GroupSetup = lazy(() => import("../Pages/CompendiumData/GroupSetup"));
const DocsViewer = lazy(() => import("../Pages/DocsViewer/DocsViewer"));
const DynamicConfiguration = lazy(
  () => import("../Pages/DynamicConfigurationSetup/DynamicConfiguration")
);
const AddFacility = lazy(() => import("../Pages/Facility/AddFacility"));
const AssignReferenceLab = lazy(
  () => import("../Pages/Facility/AssignReferenceLab/AssignReferenceLab")
);
const EditFacility = lazy(() => import("../Pages/Facility/EditFacility"));
const FacilityApprovalrList = lazy(
  () => import("../Pages/Facility/FacilityApproval/FacilityApprovalrList")
);
const ViewSingleFacilityForApproval = lazy(
  () =>
    import("../Pages/Facility/FacilityApproval/ViewSingleFacilityForApproval")
);
const FacilityOption = lazy(
  () => import("../Pages/Facility/FacilityOptions/FacilityOption")
);
const AddFacilityUser = lazy(
  () => import("../Pages/Facility/FacilityUser/CreateFacilityUser")
);
const EditFacilityUser = lazy(
  () =>
    import("../Pages/Facility/FacilityUser/CreateFacilityUser/EditFacilityUser")
);
const ViewAllUsers = lazy(() => import("../Pages/Facility/FacilityUser"));
const View = lazy(
  () => import("../Pages/Facility/FacilityUser/ViewAllUserTab/View")
);
const LabAssignment = lazy(
  () => import("../Pages/Facility/LabAssignment/LabAssignment")
);
const ManageUserRoles = lazy(() => import("../Pages/Facility/ManageUserRole"));
const ViewAssignedFacilities = lazy(
  () => import("../Pages/Facility/ViewAssignedFacilities")
);
const ViewAssignedUsers = lazy(
  () => import("../Pages/Facility/ViewAssignedUsers")
);
// const ViewSingleFacility = lazy(
//   () => import("../Pages/Facility/ViewSingleFacility")
// );
const ViewSingleUser = lazy(() => import("../Pages/Facility/ViewSingleUser"));
const ICD10Assigment = lazy(
  () => import("../Pages/ICD10Assigment/ICD10Assigment")
);
const InsuranceProviderAssignment = lazy(
  () => import("../Pages/Insurance/InsuranceAssigment")
);
const InfectiousDiseaseCompendiumData = lazy(
  () =>
    import(
      "../Pages/LIS/InfectiousDisease/CompendiumData/InfectiousDiseaseCompendiumData"
    )
);
const PanelMapping = lazy(
  () =>
    import(
      "../Pages/LIS/InfectiousDisease/CompendiumData/PanelMapping/PanelMaping"
    )
);
const MedicationAssignment = lazy(
  () => import("../Pages/LIS/ToxMedicationAssignment/MedicationAssignment")
);
const ToxMedication = lazy(
  () => import("../Pages/LIS/ToxMedicationList/ToxMedication")
);
const RequisitionSummary = lazy(
  () => import("../Pages/Requisition/SingleRequisition/RequisitionSummary")
);
const SingleRequisition = lazy(
  () => import("../Pages/Requisition/SingleRequisition")
);
const PhsyicianSignature = lazy(
  () => import("../Pages/Requisition/SingleRequisition/PhsyicianSignature")
);
const ViewSingleRequisition = lazy(
  () => import("../Pages/Requisition/ViewOfRequisition2")
);
const ManageInventory = lazy(
  () => import("../Pages/SupplyManagement/ManageInventory")
);
const WorkflowStatusMain = lazy(() => import("../Pages/WorkflowStatus"));
const Requisition = lazy(
  () => import("../Pages/Requisition/SingleRequisition/Requisition")
);
const Waiting = lazy(() => import("../Pages/Requisition/WaitingForSignature"));
const ToxicologyCompendiumData = lazy(
  () => import("../Pages/LIS/Toxicology/ToxicologyCompendiumData")
);
const CreateLab = lazy(() => import("../Pages/Lab/CreateLab"));
const LabsList = lazy(() => import("../Pages/Lab/LabsList"));
const MyFavoriteMenu = lazy(() => import("../Pages/Lab/MyFavoriteMenu"));
const ReferenceLab = lazy(() => import("../Pages/Lab/ReferenceLab"));
const EditPatientDemographics = lazy(
  () => import("../Pages/Patient/PatientDemographic/EditPatient")
);
const PatientDemographicsList = lazy(
  () => import("../Pages/Patient/PatientDemographicsList")
);
const ViewPatient = lazy(
  () => import("../Pages/Patient/ViewPatientDemographics")
);
const PatientInsuranceHistory = lazy(
  () => import("../Pages/Patient/PatientInsuranceHistory")
);
const BulkCheckIn = lazy(() => import("../Pages/Requisition/BulkCheckIn"));
const DrugAllergy = lazy(() => import("../Pages/Requisition/DrugAllergies"));
const IDBatchQC = lazy(
  () => import("../Pages/Requisition/IDBatchQC/IDBatchQC")
);
const LeveyJenning = lazy(
  () => import("../Pages/Requisition/LeveyJenning/LeveyJenning")
);
const PendingRequisition = lazy(
  () => import("../Pages/Requisition/PendingRequisition/PendingRequisition")
);
const PrinterSetup = lazy(
  () => import("../Pages/Requisition/PrinterSetup/PrinterSetup")
);
const RequisitionTypeComp = lazy(
  () => import("../Pages/Requisition/RequisitionType")
);
const ResultDataV2 = lazy(() => import("../Pages/Requisition/ResultData"));
const ResultFileUpload = lazy(
  () => import("../Pages/Requisition/ResultFileUpload/ResultFileUpload")
);
const OrderView = lazy(
  () => import("../Pages/Requisition/ViewOfOrderRequisition")
);
const ViewReq = lazy(
  () => import("../Pages/Requisition/SingleRequisition/ViewReq")
);
const ViewBillingReq = lazy(
  () => import("../Pages/Requisition/Billing-v2/index")
);
const ResultFileConfiguration = lazy(
  () => import("../Pages/ResultFileConfiguration/ResultFileConfiguration")
);
const Testing = lazy(() => import("../Pages/Requisition/Testing"));
const PageNotFound = lazy(() => import("../Shared/Common/Pages/PageNotFound"));
const ToxicologyResultData = lazy(() => import("../Pages/LIS/ToxResultData"));
const DynamicGrid = lazy(() => import("../Pages/DynamicGrid"));
const ToxicologyConfirmationResultFile = lazy(
  () =>
    import(
      "../Pages/LIS/ToxicologyConfirmationResultFileUpload/ToxConfirmationResultFile"
    )
);
const ManageNotification = lazy(() => import("../Pages/ManageNotification"));
const BulkPatientUpload = lazy(
  () => import("../Pages/Patient/BulkPatientUpload")
);
const IncompleteRequisition = lazy(
  () => import("../Pages/Requisition/IncompleteRequisition")
);
const TemplateSelector = lazy(() => import("../Pages/Requisition/Testing"));
const SalesRepRequest = lazy(
  () => import("../Pages/SalesManagements/SalesRepRequest")
);
const BloodLisCompendium = lazy(
  () => import("../Pages/Blood/BloodCompendium/BloodLisCompendium")
);
const SecurityQuestions = lazy(
  () => import("../Pages/Auth/SecurityQuestions/SecurityQuestions")
);
const ComorbidityAssignment = lazy(
  () => import("../Pages/ComorbiditiesAssignment/index")
);
const MicroBiologyCompendiumData = lazy(
  () => import("../Pages/MicroBiologyLis/CompendiumData/index")
);
const MicroBioLISSetting = lazy(
  () => import("../Pages/MicroBiologyLis/LisSetting")
);

function ViewRequisitionWrapper() {
  return (
    <ViewRequisitionDataProvider>
      <ViewReq />
    </ViewRequisitionDataProvider>
  );
}

function BloodResultDataWrapper() {
  return (
    <BloodResultDataContextProvider>
      <BloodResultData />
    </BloodResultDataContextProvider>
  );
}

function BillingWrapper() {
  return (
    <BillingDataProvier>
      <ViewBillingReq />
    </BillingDataProvier>
  );
}

function UserListWrapper() {
  return (
    <UserListContextProvider>
      <UserManagement />
    </UserListContextProvider>
  );
}
function WorkLogWrapper() {
  return (
    <WorkLogDataProvider>
      <WorkLogV2 />
    </WorkLogDataProvider>
  );
}

function ManageFacilityWrapper() {
  return (
    <ManageFacilityContextProvider>
      <ManageFacility />
    </ManageFacilityContextProvider>
  );
}

const AuthRoutes = [
  {
    path: "",
    element: MyFavoriteMenu,
  },
  {
    path: "OrderView",
    element: OrderView,
  },
  {
    path: "view-requisition",
    element: ViewRequisitionWrapper,
  },
  {
    path: "Billing",
    element: BillingWrapper,
  },
  {
    path: "panel-mapping",
    element: PanelMapping,
  },
  {
    path: "lab-assignment",
    element: LabAssignment,
  },
  {
    path: "result-file-template",
    element: ResultFileConfiguration,
  },
  {
    path: "tox-medication-list",
    element: ToxMedication,
  },
  {
    path: "testing",
    element: TemplateSelector,
  },
  {
    path: "tox-confirmation-file-upload",
    element: ToxicologyConfirmationResultFile,
  },
  {
    path: "Pending-requisition",
    element: PendingRequisition,
  },
  {
    path: "dynamic-configuration",
    element: DynamicConfiguration,
  },
  {
    path: "Medication-Assignment",
    element: MedicationAssignment,
  },
  {
    path: "tox-result-pre-configuration",
    element: ToxResultFileConfiguration,
  },
  {
    path: "*",
    element: MyFavoriteMenu,
  },
  {
    path: "MyFavorites",
    element: MyFavoriteMenu,
  },
  {
    path: "sales-Rep-Request",
    element: SalesRepRequest,
  },
  {
    path: "microbiology-compendium-data",
    element: MicroBiologyCompendiumData,
  },
  {
    path: "manage-sales-group",
    element: ManageSalesGroup,
  },
  // {
  //   path: "home",
  //   element: Home,
  // },
  {
    path: "PageNotFound",
    element: PageNotFound,
  },

  {
    path: "testing",
    element: Testing,
  },
  {
    path: "add-facility-user",
    element: AddFacilityUser,
  },
  {
    path: "edit-facility-user/:id",
    element: EditFacilityUser,
  },
  {
    path: "add-user-roles",
    element: AddUserRoles,
  },
  {
    path: "toxicology-result-data",
    element: ToxicologyResultData,
  },
  {
    path: "labs",
    element: LabsList,
  },
  {
    path: "CreateLab",
    element: AddReferenceLab,
  },
  {
    path: "facilitylist",
    element: ManageFacilityWrapper,
  },
  {
    path: "RequisitionSummary",
    element: RequisitionSummary,
  },
  {
    path: "facilityApproval",
    element: FacilityApprovalrList,
  },
  {
    path: "manageuserrole",
    element: ManageUserRoles,
  },
  {
    path: "user-management",
    element: UserListWrapper,
  },
  {
    path: "addfacility",
    element: AddFacility,
  },
  {
    path: "editfacility/:id",
    element: EditFacility,
  },
  {
    path: "waiting-signature",
    element: Waiting,
  },
  {
    path: "facility-user-list",
    element: ViewAllUsers,
  },

  {
    path: "facility-view/:id",
    element: ViewSingleFacilityDynamic,
  },
  {
    path: "facility-view-approval/:id",
    element: ViewSingleFacilityForApproval,
  },
  {
    path: "view-assigned-users/:id",
    element: ViewAssignedUsers,
  },
  {
    path: "facility-user-view-by-id/:id",
    element: View,
  },
  {
    path: "assign-refrence-lab",
    element: AssignReferenceLab,
  },

  {
    path: "bulk-check-in",
    element: BulkCheckIn,
  },
  {
    path: "requisition",
    element: SingleRequisition,
  },
  {
    path: "requisition-type",
    element: RequisitionTypeComp,
  },
  {
    path: "levey-jenning",
    element: LeveyJenning,
  },
  {
    path: "view",
    element: ViewSingleRequisition,
  },
  {
    path: "insurance-provider-assigment",
    element: InsuranceProviderAssignment,
  },
  {
    path: "ICD-10-code-assigment",
    element: ICD10Assigment,
  },
  {
    path: "patient-demographics-list",
    element: PatientDemographicsList,
  },
  // {
  //   path: "addpatient",
  //   element: AddPatientDemographics,
  // },
  {
    path: "editpatient/:id",
    element: EditPatientDemographics,
  },
  {
    path: "view-patient-demographics-patient/:id",
    element: ViewPatient,
  },
  {
    path: "patient-insurance-history/:id",
    element: PatientInsuranceHistory,
  },
  {
    path: "compendium-data",
    element: BloodCompendiumData,
  },
  {
    path: "group",
    element: Compendium,
  },
  {
    path: "specimen-type",
    element: SpecimenType,
  },
  {
    path: "group-setup",
    element: GroupSetup,
  },
  {
    path: "drug-allergy",
    element: DrugAllergy,
  },
  {
    path: "panel-setup",
    element: PanelSetup,
  },
  {
    path: "test-setUp",
    element: TestSetUp,
  },
  {
    path: "physician",
    element: PhsyicianSignature,
  },
  {
    path: "test-type",
    element: TestType,
  },
  {
    path: "panel-type",
    element: Paneltype,
  },
  {
    path: "panelsetupgrid",
    element: PanelSetupGrid,
  },
  {
    path: "/testsetupgrid",
    element: TestSetupGrid,
  },
  {
    path: "/testassignmentgrid",
    element: TestAssignmentGrid,
  },
  {
    path: "AddReferenceLab",
    element: ReferenceLab,
  },
  {
    path: "bulletin-board",
    element: BulletinBoard,
  },
  {
    path: "addReferenceLab/:id",
    element: ReferenceLab,
  },
  {
    path: "view-assigned-facilities/:id",
    element: ViewAssignedFacilities,
  },

  {
    path: "facility-user-view/:id",
    element: ViewSingleUser,
  },
  {
    path: "add-reference-lab",
    element: CreateLab,
  },
  {
    path: "edit-reference-lab/:id",
    element: EditReferenceLab,
  },
  {
    path: "reference-lab",
    element: ViewReferenceLab,
  },
  {
    path: "ChangePassword/:id",
    element: ChangePassword,
  },
  {
    path: "specimen-type-assigment",
    element: SpecimenTypeAssigment,
  },
  {
    path: "infectious-disease-compendium-data",
    element: InfectiousDiseaseCompendiumData,
  },
  {
    path: "Toxicology-compendium-data",
    element: ToxicologyCompendiumData,
  },
  {
    path: "result-file-upload",
    element: ResultFileUpload,
  },
  {
    path: "result-data",
    element: ResultDataV2,
  },
  {
    path: "id-batch-qc",
    element: IDBatchQC,
  },
  {
    path: "OrderView/:id/:orderid",
    element: OrderView,
  },
  {
    path: "requisition/:id",
    element: Requisition,
  },
  {
    path: "printer-setup",
    element: PrinterSetup,
  },
  {
    path: "qc-batch-setup",
    element: QCBatchSetup,
  },
  {
    path: "facility-option",
    element: FacilityOption,
  },
  {
    path: "workflow-status",
    element: WorkflowStatusMain,
  },
  {
    path: "manage-inventory",
    element: ManageInventory,
  },
  {
    path: "manage-order",
    element: ManageOrder,
  },
  {
    path: "supply-order",
    element: ShippingInformation,
  },
  {
    path: "supply-order-view",
    element: ViewOrders,
  },
  {
    path: "Manage-Sales-Rep",
    element: ManageSales,
  },
  {
    path: "specimen-shipped",
    element: ShippingAndSchedule,
  },
  {
    path: "dynamic-grid",
    element: DynamicGrid,
  },
  {
    path: "courier/pre-configuration",
    element: PreConfiguration,
  },
  {
    path: "training-Category",
    element: TrainingAidsCategories,
  },
  {
    path: "incomplete-requisition",
    element: IncompleteRequisition,
  },
  {
    path: "supply-management/bulkcheckin",
    element: SupplyManagementBulkCheckIn,
  },
  {
    path: "supply-management/bulkcheckout",
    element: SupplyManagementBulkCheckOut,
  },
  {
    path: "security/change-questions",
    element: SecurityQuestions,
  },
  {
    path: "bulk-patient-upload",
    element: BulkPatientUpload,
  },
  {
    path: "manage-notification",
    element: ManageNotification,
  },
  {
    path: "blood-compendium",
    element: BloodLisCompendium,
  },
  {
    path: "blood-result-data",
    element: BloodResultDataWrapper,
  },
  {
    path: "work-log",
    element: WorkLogWrapper,
  },
  {
    path: "marketplace",
    element: MarketPlace,
  },
  {
    path: "facilities-inventory",
    element: FacilityInventory,
  },
  {
    path: "result-pdf-upload",
    element: ResultPdfUpload,
  },
  {
    path: "Comorbidity-Assignment",
    element: ComorbidityAssignment,
  },
  {
    path: "microbiology-lis-setting",
    element: MicroBioLISSetting,
  },
  {
    path: "microbiology-panel-mapping",
    element: MicrobiologyPanelMapping,
  },
];

//unAuthRoutes
const UnAuthRoutes = [
  {
    path: "/",
    element: Login2,
  },
  {
    path: "/switching",
    element: LabSwitching,
  },
  {
    path: "/InitializePassword",
    element: InitializePassword,
  },
  {
    path: "/ResetPassword",
    element: ResetPassword,
  },
  {
    path: "/login",
    element: Login2,
  },
  {
    path: "/externallogin",
    element: Login2,
  },
  {
    path: "/docs-viewer",
    element: DocsViewer,
  },
  {
    path: "/forget-password",
    element: ForgetPassword,
  },
  {
    path: "/signature-request",
    element: SignatureRequest,
  },
  {
    path: "/new-password",
    element: NewPassword,
  },
  {
    path: "/security-questions-username",
    element: SecurityQuestionsUserName,
  },
  {
    path: "/verify/:labId/:userId/:senderType",
    element: VerificationCode,
  },
  {
    path: "/authentication/:labId/:userId",
    element: AuthenticateWithCode,
  },
  {
    path: "/patient-data-form",
    element: PatientDataForm,
  },
];

// Getting all routes
const RoutesObj = {
  AuthRoutes,
  UnAuthRoutes,
};

export default RoutesObj;
