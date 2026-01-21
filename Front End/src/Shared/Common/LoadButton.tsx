import { ILoadbutton } from "../../Interface/Shared/Interfaces";
import { LoaderIcon } from "../Icons";

const LoadButton = (props: ILoadbutton) => {
  const { btnText, className, loadingText, loading, onClick, disabled,name,id } = props;

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={className}
      name={name}
      id={id}
    >
      {loading && (
        <>
          <LoaderIcon />
          {loadingText}
        </>
      )}
      {!loading && <span>{btnText}</span>}
    </button>
  );
};

export default LoadButton;
