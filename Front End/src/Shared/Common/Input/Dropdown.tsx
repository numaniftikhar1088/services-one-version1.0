// import React from 'react'
// import Select from "react-select";
// import {  styles } from "../../../Utils/Common";
// import { setDropDownValue } from '../../../Utils/Common/Requisition';
// import { assignFormValues } from '../../../Utils/Auth';

// const Dropdown = (props) => {
//   return (
//     <div>
//       <div id={sysytemFieldName} ref={inputElementDropdown} tabIndex={-1}>
//             {" "}
//           </div>
//           <div
//             className={
//               props?.displayType
//                 ? props?.displayType
//                 : "col-lg-6 col-md-6 col-sm-12 mb-4"
//             }
//           >
//             <label
//               className={required ? "required mb-2 fw-500" : "mb-2 fw-500"}
//             >
//               {props?.placeholder}
//             </label>
//             <Select
//               options={props?.options}
//               placeholder={props?.placeholder}
//               theme={(theme) => styles(theme)}
//               value={setDropDownValue(props?.options, defaultValue)}
//               onChange={(e: any) => {
//                 props?._setState(props?.sysytemFieldName, e.value);
//                 assignFormValues(
//                   Inputs,
//                   dependenceyControls,
//                   index,
//                   depControlIndex,
//                   fieldIndex,
//                   e.value,
//                   isDependency,
//                   repeatFieldSection,
//                   isDependencyRepeatFields,
//                   repeatFieldIndex,
//                   repeatDependencySectionIndex,
//                   repeatDepFieldIndex,
//                   e.label
//                 );
//               }}
//               isSearchable={true}
//               styles={{
//                 control: (baseStyles, state) => ({
//                   ...baseStyles,
//                   borderColor: "var(--kt-input-border-color)",
//                   color: "var(--kt-input-border-color)",
//                 }),
//               }}
//             />
//             {props.enableRule && (
//               <div className="form__error">
//                 <span>{props.enableRule}</span>
//               </div>
//             )}
//           </div>
//     </div>
//   )
// }

// export default Dropdown


const Dropdown = () => {
  return <div></div>;
};

export default Dropdown;
