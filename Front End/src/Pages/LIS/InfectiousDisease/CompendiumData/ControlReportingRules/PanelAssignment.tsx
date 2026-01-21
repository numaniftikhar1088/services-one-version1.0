import React, { useEffect, useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

interface IProps {
  facilities: any;
  sports2: any;
  setSports2: any;
  selectedPanels: any;
  setSelectedPanels: any;
}

const PanelAssignment: React.FC<IProps> = ({
  facilities,
  sports2,
  setSports2,
  selectedPanels,
  setSelectedPanels,
}) => {


 
  
  const isMobile = useIsMobile();
  


  const { t } = useLang();

  const [sports, setSports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [isCheckTestList, setisCheckTestList] = useState<any[]>([]);
  const [selectedItemsToPop, setSelectedItemsToPop] = useState<any>([]);
  const [isCheckedSelectedList, setisCheckedSelectedList] = useState<any[]>([]);
  const [checkedList, setCheckedList] = useState({
    testList: [],
    selectedTestList: [],
  });

  const handleChangeTestList = (e: any, id: any, name: any, index: any) => {
    // Check if the item is already in isCheckTestList
    let objToSet = {
      panelId: id,
      panelDisplayName: name,
    };

    selectedPanels.push(objToSet);
    const isSelected = isCheckTestList.includes(id);
    if (isSelected) {
      // Remove the item from isCheckTestList

      setisCheckTestList(isCheckTestList.filter((item) => item !== id));
    } else {
      // Add the item to isCheckTestList
      setisCheckTestList([...isCheckTestList, id]);
    }

    // Then, update checkedList.testList
    setCheckedList((prevVal: any) => {
      if (isSelected) {
        // If it was selected, remove it from testList
        return {
          ...prevVal,
          testList: checkedList.testList.filter((item: any) => item.id !== id),
        };
      } else {
        // If it wasn't selected, add it to testList
        return {
          ...prevVal,
          testList: [
            ...checkedList.testList,
            { id, facilityName: name, index },
          ],
        };
      }
    });
  };

  const handleChangeSelectedTestList = (
    e: any,
    id: any,
    name: any,
    index: any
  ) => {
    // Check if the item is already in isCheckedSelectedList
    const isSelected = isCheckedSelectedList.includes(id);
    const updatedSelectedPanels = selectedPanels.filter(
      (panel: any) => panel.panelId !== id
    );
    setSelectedPanels(updatedSelectedPanels);
    if (isSelected) {
      // Remove the item from isCheckedSelectedList
      setisCheckedSelectedList(
        isCheckedSelectedList.filter((item) => item !== id)
      );
      // Remove the item from selectedItemsToPop
      setSelectedItemsToPop(
        selectedItemsToPop.filter((item: any) => item.id !== id)
      );
      // Remove the item from checkedList.selectedTestList
      setCheckedList((prevVal) => {
        return {
          ...prevVal,
          selectedTestList: checkedList.selectedTestList.filter(
            (item: any) => item.id !== id
          ),
        };
      });
    } else {
      // Add the item to isCheckedSelectedList
      setisCheckedSelectedList([...isCheckedSelectedList, id]);
      // Add the item to selectedItemsToPop
      setSelectedItemsToPop([
        ...selectedItemsToPop,
        { id, facilityName: name, index },
      ]);
      // Add the item to checkedList.selectedTestList
      setCheckedList((prevVal: any) => {
        return {
          ...prevVal,
          selectedTestList: [
            ...checkedList.selectedTestList,
            { id, facilityName: name, index },
          ],
        };
      });
    }
  };

  const forwardPush = () => {
    if (checkedList.testList.length !== 0) {
      let originalArrCopy = Array.isArray(sports2) ? [...sports2] : [];
      let arrWithCheckedItems = Array.isArray(checkedList.testList)
        ? [...checkedList.testList]
        : [];

      let concatedArray = [
        ...(originalArrCopy || []),
        ...(arrWithCheckedItems || []),
      ];
      let currentArray = [...sports];

      // Remove the pushed items from the original sports array
      let updatedSports = currentArray.filter((item: any) => {
        return !concatedArray.find((el) => el.id === item.id);
      });

      setSports(updatedSports);
      setSports2(concatedArray);
      setCheckedList((preVal: any) => {
        return {
          ...preVal,
          testList: [],
        };
      });
      setisCheckTestList([]);
    }
  };

  const backwardPush = () => {
    if (checkedList.selectedTestList.length !== 0) {
      let orignalArrCopy = [...sports];
      let arrWithCheckedItems: any = [...checkedList.selectedTestList];

      let concatedArray = [
        ...new Set(orignalArrCopy.concat(arrWithCheckedItems)),
      ];
      let currentArray = [...sports2];

      let updatedSports = currentArray.filter((item: any) => {
        return !concatedArray.find((el: any) => el.id === item.id);
      });
      setSports2(updatedSports);
      setSports(concatedArray);
      setCheckedList((preVal: any) => {
        return {
          ...preVal,
          selectedTestList: [],
        };
      });
      setisCheckedSelectedList([]);
    }
  };

  const filteredSports = sports?.filter((facility: any) =>
    facility?.facilityName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  const filteredSports2 = sports2?.filter((facility: any) =>
    facility?.facilityName?.toLowerCase()?.includes(searchQuery2?.toLowerCase())
  );

  useEffect(() => {
    forwardPush();
  }, [checkedList.testList]);

  useEffect(() => {
    backwardPush();
  }, [checkedList.selectedTestList]);

  useEffect(() => {
    setSports(
      facilities
        ?.map((facility: any) => ({
          id: facility.panelId,
          facilityName: facility.panelDisplayName,
        }))
        .filter(
          (facility: any) =>
            !sports2?.some((item: any) => item.id === facility.id)
        )
    );
  }, [sports2, facilities]);
  
  const moveToSports2 = () => {
    if (Array.isArray(sports)) {
      let sportsCopy = [...sports];
      let sports2Copy = Array.isArray(sports2) ? [...sports2] : [];
      let newSports2 = [...sports2Copy, ...sportsCopy];
      setSports2(newSports2);
      setSports([]);
    }
  };
  
  const moveToSports = () => {
    if (Array.isArray(sports2)) {
      let sports2Copy = [...sports2];
      let sportsCopy = Array.isArray(sports) ? [...sports] : [];
      let newSports = [...sportsCopy, ...sports2Copy];
      setSports(newSports);
      setSports2([]);
    }
  };

  return (
    <>
      <div className="py-0">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
            <h6 className="text-warning mb-0">{t("Panels")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                {/* Mobile Action Buttons - Show at top on mobile */}
                {isMobile && (
                  <div className="col-12 mb-3">
                    <div className="d-flex justify-content-center gap-3">
                      <span
                        className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                        onClick={moveToSports2}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="IDCompendiumDataControlReportingRuleSelectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf101;
                        </i>
                      </span>
                      <span
                        className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                        onClick={moveToSports}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="IDCompendiumDataControlReportingRuleDeselectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf100;
                        </i>
                      </span>
                    </div>
                  </div>
                )}
                
                <div className={isMobile ? "d-flex flex-column" : "d-flex align-items-center flex-wrap justify-content-around"}>
                  {/* All Panels Section */}
                  <div className={isMobile ? "col-12 mb-3" : "col-lg-5 col-md-5 col-sm-12"}>
                    <span className="fw-bold">{t("All Panels")}</span>
                    <input
                      id="IDCompendiumDataControlReportingRuleAllFacilitySearch"
                      type="text"
                      name=""
                      className="form-control bg-transparent mb-5 mb-sm-0"
                      placeholder={t("Search...")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("All List")}</span>
                      </div>

                      <ol
                        id="IDCompendiumDataControlReportingRuleAllFacility"
                        className={isMobile ? "list-group rounded-0 list-group-even-fill scroll2" : "list-group rounded-0 list-group-even-fill h-225px scroll"}
                      >
                        {filteredSports?.map((items: any, index: number) => (
                          <li
                            key={items.id}
                            className={
                              "list-group-item px-2 py-1  border-0 cursor-pointer"
                            }
                            onClick={(e) =>
                              handleChangeTestList(
                                e,
                                items?.id,
                                items?.facilityName,
                                index
                              )
                            }
                          >
                            <div className="d-flex">
                              <React.Fragment key={items?.id}>
                                {items?.facilityName}
                              </React.Fragment>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Desktop Action Buttons - Show in middle on desktop */}
                  {!isMobile && (
                    <div className="align-items-center d-flex flex-md-column mt-2 justify-content-center gap-2 px-3">
                      <span
                        className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                        onClick={moveToSports2}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="IDCompendiumDataControlReportingRuleSelectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf101;
                        </i>
                      </span>
                      <span
                        className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                        onClick={moveToSports}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="IDCompendiumDataControlReportingRuleDeselectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf100;
                        </i>
                      </span>
                    </div>
                  )}

                  {/* Selected Panels Section */}
                  <div className={isMobile ? "col-12" : "col-lg-6 col-md-5 col-sm-12"}>
                    <span className="fw-bold required">
                      {t("Selected Panels")}
                    </span>
                    <input
                      id="IDCompendiumDataControlReportingRuleSelectFacilitySearch"
                      type="text"
                      name=""
                      className="form-control bg-transparent mb-5 mb-sm-0"
                      placeholder={t("Search...")}
                      value={searchQuery2}
                      onChange={(e) => setSearchQuery2(e.target.value)}
                    />
                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                        <span className="fw-bold">{t("Selected List")}</span>
                      </div>

                      <ol
                        id="IDCompendiumDataControlReportingRuleAllFacility"
                        className={isMobile ? "list-group rounded-0 list-group-even-fill  scroll2" : "list-group rounded-0 list-group-even-fill h-225px scroll"}
                      >
                        {filteredSports2?.map((item: any, index: number) => (
                          <li
                            key={item.id}
                            className={
                              "list-group-item px-2 py-1  border-0 cursor-pointer"
                            }
                            onClick={(e) =>
                              handleChangeSelectedTestList(
                                e,
                                item.id,
                                item.facilityName,
                                index
                              )
                            }
                          >
                            <div className="d-flex">
                              <React.Fragment key={item.id}>
                                {item.facilityName}
                                {/* {item.address1} */}
                              </React.Fragment>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanelAssignment;