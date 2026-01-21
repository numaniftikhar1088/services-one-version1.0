import SectionsList from "./SectionsList";
const SectionCard = (props: any) => {
  const colorList: string[] = [
    "#dcebd5",
    "#50cd89",
    "#7239ea",
    "#ffc700",
    "#f1416c",
    "#8B8989",
    "#8B0000",
    "#FF0000",
  ];
  return (
    <>
      {props.sectionData.isSelected && (
        <div className={`ViewGrid-item ${props.sectionData.displayType} p-5`}>
          <SectionsList
            SectionsInfo={props?.sectionData}
            colorList={colorList[0]}
            sectionIndex={props?.sectionIndex}
            displayData={props?.displayData}
            setDisplay={props?.setDisplay}
            loadData={props.loadData}
          />
        </div>
      )}
    </>
  );
};

export default SectionCard;
