import { TableCell } from "@mui/material";
import useLang from "../hooks/useLanguage";
import useIsMobile from "../hooks/useIsMobile";

function NoRecord({
  message,
  colSpan,
}: {
  message?: string;
  colSpan?: number;
}) {
  const { t } = useLang();
  const isMobile = useIsMobile();
  return (
    <TableCell colSpan={colSpan ?? 9}>
      <div
        className={`text-center d-flex align-items-center gap-2  ${isMobile ? "" : "justify-content-center"}  `}
        style={isMobile ? { marginLeft: "70px" } : {}}
      >
        <i className="bi bi-inbox h1 m-0"></i>
        <span className="fw-bolder">
          {message ? t(message) : t("No data found for this table")}
        </span>
      </div>
    </TableCell>
  );
}

export default NoRecord;
