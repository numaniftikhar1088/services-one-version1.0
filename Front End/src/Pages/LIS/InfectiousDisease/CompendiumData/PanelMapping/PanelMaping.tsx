import React from "react";
import CollapsibleTable from ".";
interface NavProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}
const PanelMapping: React.FC<NavProps> = ({ setRefresh, refresh }) => {
  return (
    <>
      <CollapsibleTable  setRefresh={setRefresh} refresh={refresh}/>
    </>
  );
};

export default PanelMapping;