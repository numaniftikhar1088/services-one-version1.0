import React from "react";
import { useNavigate } from "react-router-dom";
import { CardProps } from "../dashboard.types";
import moment from "moment";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";


const darkenColor = (color: string) => {
  // Simple function to darken the color
  const parsedColor = parseInt(color.slice(1), 16);
  const darkenedColor = parsedColor - 0x333333;
  return `#${(darkenedColor & 0xffffff).toString(16).padStart(6, "0")}`;
};

const Card: React.FC<CardProps> = (props) => {
  const { t } = useLang()
  const navigate = useNavigate();
  const {
    value,
    title,
    description,
    color,
    filterDate,
    status,
    dateToSendToRequisition,
    tabId
  } = props;

  const handleCardClick = () => {
    const [startDate, endDate] = dateToSendToRequisition.split(" to ");

    // Parse the endDate into a moment object
    const parsedEndDate = moment(endDate, "M/D/YYYY");

    // Get the current date and subtract 5 days
    const currentDateMinusFive = moment().subtract(5, "days");

    // Determine the toDateForMissingResult
    const toDateForMissingResult = parsedEndDate.isBefore(currentDateMinusFive)
      ? parsedEndDate.format("M/D/YYYY")
      : currentDateMinusFive.format("M/D/YYYY");

    const newDate = `${startDate} to ${toDateForMissingResult}`;

    let requisitionFilter = {
      status,
      filterDate,
      dateFilter:
        title === "Missing Results" ? newDate : dateToSendToRequisition,
      callFrom: "dashboard",
    };

    navigate("/view-requisition", { state: { ...requisitionFilter, tabId } });
  };

  const darkenedColor = darkenColor(color);

  return (
    <div
      className="card text-left shadow-sm"
      onClick={handleCardClick}
      style={{
        backgroundColor: color,
        borderRadius: "10px",
        color: "#000",
        width: `${useIsMobile() ? "13.4rem" : "17rem"}`,
        minHeight: "100px",
        border: `2px solid ${color}`,
        transition: "border-color 0.8s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = darkenedColor)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = color)}
    >
      <div className="card-body p-3">
        <h1
          className="card-title"
          style={{ fontSize: "36px", width: "fit-content", margin: 0 }}
        >
         {value}
        </h1>
        <h5 className="card-subtitle mb-2">{t(title)}</h5>
        {description && (
          <p className="card-text" style={{ fontSize: "10px" }}>
             {t(description)}  
         
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
