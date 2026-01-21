export interface IPropsGroupSelect {
  show: boolean;
  id?: string;
  fields: any;
  formData?: any;
  setFormData?: any;
  RequsitionData?: any;
  isShown: any;
  setIsShown: any;
  inputs?: any;
  index?: any;
  dependenceyControls?: any;
  errorFocussedInput?: any;
  setInputs: any;
  defaultValue: any;
  setInfectiousData: any;
  setPhysicianId: any;
  physicianId: any;
  ValidationCheckOnClick: any;
  props: any;
  setErrorFocussedInput?: any;
}

export interface IRequisitionInputs {
  pageId: number;
  sectionId: number;
  sectionName: string;
  isSelected: boolean;
  sortOrder: number;
  displayType: string;
  cssStyle: string;
  customScript: string;
  fields?: (FieldsEntity | null)[] | null;
  dependencyControls?:
    | (DependencyControlsEntityOrRepeatDependencyControlsEntityOrRepeatDependencyControlsStateEntity | null)[]
    | null;
}
export interface FieldsEntity {
  controlId: number;
  controlDataID: number;
  systemFieldName?: string | null;
  displayFieldName: string;
  uiTypeId: number;
  uiType: string;
  required?: boolean | null;
  isNew?: boolean | null;
  sectionType?: number | null;
  visible: boolean;
  defaultValue?: string | null;
  options?: (OptionsEntity | null)[] | null;
  sortOrder: number;
  cssStyle?: string | null;
  dispayRule: string;
  enableRule: string;
  displayType?: string | null;
  dependencyControls?: null[] | null;
  repeatFields?:
    | (FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity | null)[]
    | null;
  repeatDependencyControls?:
    | (DependencyControlsEntityOrRepeatDependencyControlsEntityOrRepeatDependencyControlsStateEntity1 | null)[]
    | null;
  repeatFieldsState?:
    | (FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity1 | null)[]
    | null;
  repeatDependencyControlsState?:
    | (DependencyControlsEntityOrRepeatDependencyControlsEntityOrRepeatDependencyControlsStateEntity2 | null)[]
    | null;
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
export interface FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity {
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
  options?: (OptionsEntity | null)[] | null;
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
export interface DependencyControlsEntityOrRepeatDependencyControlsEntityOrRepeatDependencyControlsStateEntity1 {
  name: string;
  optionID: number;
  optionDataID: number;
  value: string;
  label: string;
  dependecyFields?:
    | FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity2[]
    | null;
  dependencyAction: string;
}
export interface FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity2 {
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
  options?: (OptionsEntity | null)[] | null;
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
export interface FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity1 {
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
  options?: (OptionsEntity | null)[] | null;
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
export interface DependencyControlsEntityOrRepeatDependencyControlsEntityOrRepeatDependencyControlsStateEntity2 {
  name: string;
  optionID: number;
  optionDataID: number;
  value: string;
  label: string;
  dependecyFields?:
    | FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity2[]
    | null;
  dependencyAction: string;
}
export interface DependencyControlsEntityOrRepeatDependencyControlsEntityOrRepeatDependencyControlsStateEntity {
  name: string;
  optionID: number;
  optionDataID: number;
  value: string;
  label: string;
  dependecyFields?:
    | FieldsEntityOrDependecyFieldsEntityOrRepeatFieldsEntityOrRepeatFieldsStateEntity2[]
    | null;
  dependencyAction: string;
}

export interface FormData {
  name?: string;
  id?: string | number;
  value?: string | number;

  depfield?: any;
  searchID?: number | string;
  preName?: string;
  controlId?: string | number;
  sectionName?: string;
}

export interface IDependecyFieldsOptions {
  name: string;
  id: number;
  value: string;
  optionDataID: number;
  label: string;
  isSelectedDefault: boolean;
  isVisable: boolean;
  dependencyControls?: null;
}
