export type ReactState =  React.Dispatch<React.SetStateAction<boolean>>
export type LooseReactState = React.Dispatch<React.SetStateAction<any>>
export type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
export type StringRecord = Record<string, string>;