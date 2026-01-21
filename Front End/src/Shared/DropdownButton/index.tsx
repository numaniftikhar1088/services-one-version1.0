import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { ThreeDots } from "../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";

interface DropdownButtonProps {
  iconArray: iconTextList[];
  row: any;
  getValues?: (row: any, text: any) => void;
}

interface iconTextList {
  icon: any;
  text: string;
}

const ActionButton: React.FC<DropdownButtonProps> = ({
  iconArray,
  row,
  getValues,


}) => {

  const { t } = useLang();
  return (
    <div className="rotatebtnn">
      <DropdownButton
        id={`LabAsignment3Dots_${row.id}`}
        className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
        key="end"
        drop="end"
        title={<ThreeDots />}
      >
        {iconArray?.map(({ icon, text }: iconTextList) => (
          <>
            <Dropdown.Item
              eventKey="3"
              id="LabAsignmentEdit"
              onClick={() => getValues?.(row, text)}
              className="d-flex menu-item py-2 px-3"
            >
              <span>{icon}</span>
              {t(text)}
            </Dropdown.Item>
          </>
        ))}
      </DropdownButton>
    </div>
  );
};

export default ActionButton;
