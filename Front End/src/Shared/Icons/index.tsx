export const DoneIcon = () => <i className="bi bi-check2"></i>;
export const CrossIcon = (props?: any) => (
  <i className={props?.className ? props?.className : "bi bi-x"}></i>
);
export const AddIcon = () => <i className="bi bi-plus-lg"></i>;
export const RemoveICon = () => <i className="bi bi-dash-lg"></i>;
export const ThreeDots = () => <i className="bi bi-three-dots-vertical p-0" />;
export const EditIcon = (classes?: string) => (
  <i className={classes ? classes : "fa fa-edit text-primary mr-2"}></i>
);
export const DeleteIcon = (classes?: string) => (
  <i className={classes ? classes : "bi bi-trash text-danger mr-2"}></i>
);
export const SuccessIcon = () => (
  <i className="fa fa-check-circle text-primary mr-2"></i>
);
export const InactiveIcon = () => (
  <i className="fa fa-ban text-danger mr-2"></i>
);
export const RefreshIcon = () => (
  <i className="bi bi-arrow-counterclockwise fs-2"></i>
);
export const EyeIconSlash = () => <i className="bi bi-eye-slash fs-2"></i>;
export const EyeIcon = (classes?: any) => (
  <i className={classes ? classes : "fa fa-eye text-warning"}></i>
);
export const UploadPhoto = () => (
  <i className="bi bi-card-image icon-2x text-primary pe-2"></i>
);
export const TrashIcon = (props: any) => (
  <i
    style={{ ...props?.style }}
    className={props?.className ?? "bi bi-trash"}
  ></i>
);

export const LoaderIcon = () => (
  <i className="fas fa-spinner fa-pulse p-0 m-0 align-baseline"></i>
);

export const CloseIcon = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      opacity="0.5"
      x={6}
      y="17.3137"
      width={16}
      height={2}
      rx={1}
      transform="rotate(-45 6 17.3137)"
      fill="currentColor"
    />
    <rect
      x="7.41422"
      y={6}
      width={16}
      height={2}
      rx={1}
      transform="rotate(45 7.41422 6)"
      fill="currentColor"
    />
  </svg>
);

export const ExportIcon = () => (
  <i
    style={{
      color: "white",
      fontSize: "20px",
      paddingLeft: "2px",
    }}
    className="fa"
  >
    &#xf1c3;
  </i>
);
export const ExportAllRecords = () => (
  <i className="fa text-excle mr-2  w-20px">&#xf1c3;</i>
);

export const SelectedRecords = () => (
  <i className="fa text-success mr-2 w-20px">&#xf15b;</i>
);

export const ArrowUp = (props: any) => (
  <i className={`fa fa-long-arrow-up ${props?.CustomeClass}`}></i>
);
export const ArrowDown = (props: any) => (
  <i className={`fa fa-long-arrow-down ${props?.CustomeClass}`}></i>
);
