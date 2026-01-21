import { LooseReactState } from "../../Shared/Type";

export interface ViewRequisitionGridData {
  accesionedDate: Date;
  accessionedBy: string;
  addedBy: string;
  addedDate: Date;
  clientName: string;
  dateOfBirth: Date;
  dateOfCollection: Date;
  firstName: string;
  insuranceProvider: string;
  insuranceType: string;
  labCode: string;
  lastName: string;
  order: string;
  patientID: string;
  physicianName: string;
  receiveDate: Date;
  requisitionId: number;
  requisitionType: string;
  status: string;
  timeOfCollection: Date;
  validateDate: Date;
}

export interface FieldsEntity {
  controlId: number;
  controlDataID: number;
  systemFieldName: string;
  displayFieldName: string;
  uiTypeId: number;
  uiType: string;
  required: boolean;
  isNew: boolean;
  sectionType: number;
  visible: boolean;
  defaultValue: string;
  options?: null[] | null;
  sortOrder: number;
  cssStyle: string;
  dispayRule: string;
  enableRule: string;
  displayType: string;
  dependencyControls?: null[] | null;
  repeatFields?: null[] | null;
  repeatDependencyControls?: null[] | null;
  repeatFieldsState?: null[] | null;
  repeatDependencyControlsState?: null[] | null;
}
export interface IRequsitionSection {
  pageId: number;
  sectionId: number;
  sectionName: string;
  isSelected: boolean;
  sortOrder: number;
  displayType: string;
  cssStyle: string;
  customScript: string;
  fields?: FieldsEntity[] | null;
  dependencyControls?: null[] | null;
  options?: (OptionsEntity | null)[] | null;
}
export const type = {};
export interface IRequisitionSectionsCompProps {
  sectionIndex: number;
  Inputs: any;
  section: IRequsitionSection;
  setInputs: LooseReactState;
  setIsShown: LooseReactState;
  isShown?: boolean;
}

export interface IRequisitionSectionsField {
  controlId: number;
  controlDataID: number;
  systemFieldName: string;
  displayFieldName: string;
  uiTypeId: number;
  uiType: string;
  required: boolean;
  isNew: boolean;
  sectionType: number;
  visible: boolean | string;
  defaultValue: string;
  options?: any;
  sortOrder: number;
  cssStyle: string;
  dispayRule: string;
  enableRule: string;
  displayType: string;
  dependencyControls?: null[] | null;
  repeatFields?: null[] | null;
  repeatDependencyControls?: null[] | null;
  repeatFieldsState?: null[] | null;
  repeatDependencyControlsState?: null[] | null;
  index?: number;
}

export interface IDependencyFields {
  name: string;
  optionID: number;
  optionDataID: number;
  value: string;
  label: string;
  dependecyFields?: DependecyFieldsEntity[] | null;
  dependencyAction: string;
}
export interface DependecyFieldsEntity {
  controlId: number;
  controlDataID: number;
  systemFieldName: string;
  displayFieldName: string;
  uiTypeId: number;
  uiType: string;
  required: boolean;
  isNew: boolean;
  sectionType: number;
  visible: boolean;
  defaultValue: string;
  options?: OptionsEntity[] | null;
  sortOrder: number;
  cssStyle: string;
  dispayRule: string;
  enableRule: string;
  displayType: string;
  dependencyControls?: null[] | null;
  repeatFields?: null[] | null;
  repeatDependencyControls?: null[] | null;
  repeatFieldsState?: null[] | null;
  repeatDependencyControlsState?: null[] | null;
}
export interface OptionsEntity {
  name: string;
  id: number;
  value: string;
  optionDataID: number;
  label: string;
  isSelectedDefault: boolean;
  isVisable: boolean;
  dependencyControls?: null;
}

export interface IFormInputsProps {
  sectionIndex: number;
  fieldIndex: number;
  depControlIndex?: number;
  field: IRequisitionSectionsField;
  isDependent: boolean;
  Inputs: any;
  section: IRequsitionSection;
  setInputs?: React.Dispatch<React.SetStateAction<any>>;
  setIsShown?: LooseReactState;
  isShown?: boolean;
}

export interface IRenderSwitchProps {
  uiType: string;
  visible: boolean;
  isDependent: boolean;
}

export interface repeatFieldsProps {
  sectionIndex: number;
  section: IRequsitionSection;
  fieldIndex: number;
  repeatFields?: null[] | null;
  repeatDependencyControls?: null[] | null;
  repeatFieldsState?: null[] | null;
  repeatDependencyControlsState?: null[] | null;
  displatClassForBtn: string;
  Inputs: any;
  setInputs?: React.Dispatch<React.SetStateAction<any>>;
  setIsShown?: LooseReactState;
  isShown?: boolean;
}
//
