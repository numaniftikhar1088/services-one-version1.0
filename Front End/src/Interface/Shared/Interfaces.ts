export interface ILoadbutton {
  loading?: boolean;
  btnText: string;
  loadingText: string;
  className: string;
  onClick?: any;
  name?:any;
  disabled?: boolean;
  id?: any;
}

///for shared/common/inputs
export interface ICheckbox {
  id?: string;
  name?: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: any;
  disabled?: boolean;
  label?: string;
  error?: string;
  loading?: boolean;
  grandParentClassName?: string;
  labelClassName?: string;
  spanClassName?: string;
  depOptionID?: string;
  parentDivClassName?: string;
  checkTypeClassName?: string;
  testCode?: string;
}

export interface Iinput extends ICheckbox {
  required?: boolean;
  type?: string;
  max?: any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  className?: string;
  parentDivClassName?: string;
  maxLengthValue?: number;
  Inputs?: any;
}

export interface IRadio extends ICheckbox {
  choices: choiceArray[];
  loading?: boolean;
  disabled?: boolean;
  setformData2?: any;
  noRequired?: boolean;
}
interface choiceArray {
  id: string;
  label: string;
  value: string;
}
