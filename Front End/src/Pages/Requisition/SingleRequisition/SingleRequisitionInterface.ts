export interface FieldOption {
  isSelectedDefault: boolean;
  [key: string]: any;
}
export interface Field {
  systemFieldName: string;
  defaultValue: string;
  validationExpression: string;
  options?: FieldOption[];
  [key: string]: any;
}
export interface Input {
  sectionId: number;
  fields: Field[];
  [key: string]: any;
}
export interface Props {
  Inputs: Input[];
  index: number;
  fieldIndex: number;
  depControlIndex: number;
  isDependency: boolean;
  repeatFieldSection: boolean;
  isDependencyRepeatFields: boolean;
  repeatFieldIndex: number;
  repeatDependencySectionIndex: number;
  repeatDepFieldIndex: number;
  ArrayReqId: string | number;
  parentDivClassName: string;
  label: string;
  spanClassName?: string;
  infectiousData: any[];
  setInputs?: (inputs: Input[]) => void;
  setInfectiousData?: (data: any[]) => void;
  sectionId?: number;
  sectionName?: string;
  name?: string;
  SignPadValue?: string;
  setSignPadValue?: any;
  patientId?: string;
  defaultValue?: any; // could type this further if you know structure
  setRecordId?: (id: string | number) => void;
  setReqStatus?: (status: string) => void;
  setStatus?: (status: string) => void;
  [key: string]: any;
}