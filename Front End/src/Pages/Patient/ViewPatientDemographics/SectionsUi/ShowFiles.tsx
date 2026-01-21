import { useDispatch } from "react-redux";
import { savePdfUrls } from "Redux/Actions/Index";
const ShowFiles = (props: any) => {
  const dispatch = useDispatch();
  const openDocViewer = (link: any) => {
    window.open("/docs-viewer", "_blank");
    dispatch(savePdfUrls(link));
  };
  return (
    <span
      className="badge badge-light-primary round-3"
      onClick={() => openDocViewer(props.fileObj.fileUrl)}
      style={{ cursor: "pointer" }}
    >
      {props.fileObj.fileName}
    </span>
  );
};

export default ShowFiles;
