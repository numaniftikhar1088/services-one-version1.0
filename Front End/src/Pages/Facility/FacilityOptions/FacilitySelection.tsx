import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { LoaderIcon } from "../../../Shared/Icons";
import useIsMobile from "Shared/hooks/useIsMobile";
interface CheckboxProps {
  id: string;
  type: string;
  name: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: boolean;
}
interface IValues {
  listone: string | number | undefined;
  listtwo: string | number | undefined;
}
interface IObj {
  id: string | never;
  name: string | never;
  list: boolean | never;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  type,
  name,
  handleChange,
  isChecked,
}) => {
  return (
    <label className="form-check form-check-sm form-check-solid me-5 border">
      <input
        id={id}
        name={name}
        type={type}
        onChange={handleChange}
        checked={isChecked}
        className="form-check-input"
      />
    </label>
  );
};
interface IProps {
  facilities: any;
  sports2: any;
  setSports2: any;
  id: any;
  loadGridData: any;
  setOpen: any;
  row: any;
}

const FacilitySelection: React.FC<IProps> = ({
  facilities,
  sports2,
  setSports2,
  id,
  loadGridData,
  setOpen,
  row,
}) => {
  const isMobile = useIsMobile();

  const { t } = useLang();
  // setSports2(row.facilities);
  const [isCheckAll, setIsCheckAll] = useState({
    testList: false,
    selectedTestList: false,
  });
  const [values, setValues] = useState<any>({
    facilitiesIds: [],
  });
  const handleclose = () => {
    setOpen(false);
    // loadGridData(true, false);
  };
  const [isCheckTestList, setisCheckTestList] = useState<any[]>([]);
  const [isCheckedSelectedList, setisCheckedSelectedList] = useState<any[]>([]);
  const [selectedItemsToPop, setSelectedItemsToPop] = useState<any>([]);
  const [dragItemIndex, setDragItemIndex] = useState<any>();
  const [checkedList, setCheckedList] = useState({
    testList: [],
    selectedTestList: [],
  });
  const [dragOverItemIndex, setDragOverItemIndex] = useState<IValues>({
    listone: "",
    listtwo: "",
  });

  const [sports, setSports] = useState<any[]>([]);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "testList") {
      if (!isCheckAll.testList) {
        // Get an array of all the facility IDs and names
        const allFacilities = filteredSports.map((li: any) => ({
          id: li.id,
          facilityName: li.facilityName,
        }));

        setCheckedList((preVal: any) => {
          return {
            ...preVal,
            testList: [...allFacilities],
          };
        });
        setisCheckTestList(allFacilities.map((facility: any) => facility.id));
      } else {
        setCheckedList((preVal: any) => {
          return {
            ...preVal,
            testList: [],
          };
        });
        setisCheckTestList([]);
      }
      setIsCheckAll((prevVal: any) => ({
        ...prevVal,
        testList: !prevVal.testList,
      }));
    }

    if (name === "selectedtestList") {
      if (!isCheckAll.selectedTestList) {
        const allFacilities = filteredSports2.map((li: any) => ({
          id: li.id,
          facilityName: li.facilityName,
        }));
        setCheckedList((preVal: any) => {
          return {
            ...preVal,
            selectedTestList: [...allFacilities],
          };
        });

        setisCheckedSelectedList(allFacilities.map((li: any) => li.id));
      }
      if (isCheckAll.selectedTestList) {
        setisCheckedSelectedList([]);
      }
      setIsCheckAll((preVal: any) => {
        return {
          ...preVal,
          selectedTestList: !isCheckAll.selectedTestList,
        };
      });
    }
  };
  useEffect(() => {
    setSports2(row);
  }, []);
  // useEffect(() => {
  //   setSports(
  //     facilities
  //       .map((facility: any) => ({
  //         id: facility.facilityId,
  //         facilityName: facility.facilityName + ' - ' + facility.address1,
  //       }))
  //       .filter(
  //         (facility: any) =>
  //           !sports2?.some((item: any) => item.id === facility.id),
  //       ),
  //   )
  //   setValues((preVal: any) => {
  //     return {
  //       ...preVal,
  //       facilitiesIds: sports2?.map((item: any) => item.id),
  //     }
  //   })
  // }, [sports2, facilities])

  useEffect(() => {
    setSports(
      facilities
        .map((facility: any) => ({
          id: facility.value,
          facilityName: facility.label,
        }))
        .filter(
          (facility: any) =>
            !sports2?.some((item: any) => item.id === facility.id)
        )
    );
    setValues((preVal: any) => {
      return {
        ...preVal,
        facilitiesIds: sports2?.map((item: any) => item.id),
      };
    });
  }, [sports2, facilities]);
  // const handleChangeTestList = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   id: string,
  //   name: string,
  //   index: number,
  // ) => {
  //
  //   const objToExtend = {
  //     id: id,
  //     facilityName: name,
  //     index: index,
  //   }
  //   const { checked } = e.target
  //

  //   setisCheckTestList([...isCheckTestList, id])
  //   setCheckedList((preVal: any) => {
  //     return {
  //       ...preVal,
  //       testList: [...checkedList.testList, objToExtend],
  //     }
  //   })

  //   if (!checked) {
  //     setisCheckTestList(isCheckTestList.filter((item) => item !== id))
  //     setCheckedList((preVal: any) => {
  //       return {
  //         ...preVal,
  //         testList: [
  //           ...checkedList.testList.filter((item: any) => item.id !== id),
  //         ],
  //       }
  //     })
  //   }
  // }
  // const handleChangeSelectedTestList = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   id: string,
  //   name: string,
  //   index: number,
  // ) => {
  //   const { checked } = e.target
  //   const objToExtend = {
  //     id: id,
  //     facilityName: name,
  //     index: index,
  //   }

  //   setisCheckedSelectedList([...isCheckedSelectedList, id])
  //   setCheckedList((preVal: any) => {
  //     return {
  //       ...preVal,
  //       selectedTestList: [...checkedList.selectedTestList, objToExtend],
  //     }
  //   })
  //   if (checked) {
  //     setSelectedItemsToPop(
  //       selectedItemsToPop.filter((item: any) => item.id !== id),
  //     )
  //   }

  //   if (!checked) {
  //     setSelectedItemsToPop([...selectedItemsToPop, objToExtend])
  //     setisCheckedSelectedList(
  //       isCheckedSelectedList.filter((item) => item !== id),
  //     )
  //     setCheckedList((preVal: any) => {
  //       return {
  //         ...preVal,
  //         selectedTestList: [
  //           ...checkedList.selectedTestList.filter(
  //             (item: any) => item.id !== id,
  //           ),
  //         ],
  //       }
  //     })
  //   }
  // }
  const handleChangeTestList = (e: any, id: any, name: any, index: any) => {
    // Check if the item is already in isCheckTestList
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
  useEffect(() => {
    forwardPush();
  }, [checkedList.testList]);

  useEffect(() => {
    backwardPush();
  }, [checkedList.selectedTestList]);
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
      setValues((preVal: any) => {
        return {
          ...preVal,
          facilitiesIds: [
            ...new Set(
              (preVal?.facilitiesIds || []).concat(
                concatedArray.map((item: any) => item.id)
              )
            ),
          ],
        };
      });
      setCheckedList((preVal: any) => {
        return {
          ...preVal,
          testList: [],
        };
      });
      setisCheckTestList([]);
      setIsCheckAll((prevVal) => ({
        ...prevVal,
        testList: false, // Uncheck the checkbox
      }));
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
      setValues((preVal: any) => {
        return {
          ...preVal,
          facilitiesIds: updatedSports.map((item: any) => item.id),
        };
      });
      setisCheckedSelectedList([]);
      setIsCheckAll((prevVal) => ({
        ...prevVal,
        selectedTestList: false, // Uncheck the checkbox
      }));
    }
  };
  //////////////////////////// Search ///////////////////////////////
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");

  // const [filteredFacilities, setFilteredFacilities] = useState([])
  const filteredSports = sports.filter((facility: any) =>
    facility.facilityName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  const filteredSports2 = sports2?.filter((facility: any) =>
    facility.facilityName?.toLowerCase()?.includes(searchQuery2?.toLowerCase())
  );
  const [isRequest, setIsRequest] = useState(false);
  //////////////////////////// Search ///////////////////////////////
  const handleSubmit = (row: any) => {
    const queryModel = {
      id: id,
      facilites: values.facilitiesIds,
    };
    setIsRequest(true);
    FacilityService.SaveFacilitiesInFacilityOptions(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          toast.success(t("Facilities Successfully Saved"));
          setIsRequest(false);
          loadGridData(true, false);
          setValues((preVal: any) => {
            return {
              ...preVal,
              facilitiesIds: [],
            };
          });
          setCheckedList((prevState: any) => ({
            ...prevState,
            selectedTestList: [],
            testList: [],
          }));
          setSports([]);
          setSports2([]);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

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
      <div className=" d-flex justify-content-between align-items-center my-3 px-2">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <PermissionComponent
            moduleName="Facility"
            pageName="Facility Options"
            permissionIdentifier="Save"
          >
            <button
              id="FacilityOptionSave"
              className="btn btn-primary btn-sm fw-500"
              onClick={handleSubmit}
            >
              {isRequest ? <LoaderIcon /> : null}
              {t("Save")}
            </button>
          </PermissionComponent>
          <button
            id="FacilityOptionCancel"
            className="btn btn-secondary btn-sm btn-secondary--icon"
            onClick={handleclose}
          >
            {t("Cancel")}
          </button>
        </div>
        <div className="m-0 fs-4 lead fw-500"></div>
      </div>
      <div className="py-0">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
            <h6 className="text-warning mb-0">{t("Facilities")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                {/* Mobile Action Buttons - Show on top for mobile */}
                {isMobile && (
                  <div className="col-12 d-flex justify-content-center gap-3 mb-3">
                    <span
                      className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                      onClick={moveToSports2}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        id="FacilityOptionSelectFacility"
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
                        id="FacilityOptionDeselectFacility"
                        style={{ fontSize: "20px", color: "white" }}
                        className="fa"
                      >
                        &#xf100;
                      </i>
                    </span>
                  </div>
                )}

                <div
                  className={
                    isMobile
                      ? "d-block"
                      : "d-flex align-items-center flex-wrap justify-content-around"
                  }
                >
                  <div
                    className={
                      isMobile ? "col-12 mb-4" : "col-lg-5 col-md-5 col-sm-12"
                    }
                  >
                    <span className="fw-bold">{t("All Facilities")}</span>
                    <input
                      id="FacilityOptionAllFacilitySearch"
                      type="text"
                      name=""
                      className="form-control bg-white my-2 h-30px rounded-2 fs-8 w-100"
                      placeholder={t("Search...")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("All List")}</span>
                      </div>

                      <ol
                        className={`list-group rounded-0 list-group-even-fill  ${isMobile ? "scroll2" : "h-225px scroll"}  `}
                      >
                        {filteredSports?.map((items: any, index: number) => (
                          <li
                            id={`FacilityOptionAllFacility_${items.id}`}
                            key={items.id}
                            className={
                              dragOverItemIndex?.listone === index
                                ? "next-position list-group-item px-2 py-1 border-0 cursor-pointer"
                                : "list-group-item px-2 py-1 border-0 cursor-pointer"
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

                  {/* Desktop Action Buttons */}
                  {!isMobile && (
                    <div className="align-items-center d-flex flex-md-column mt-2 justify-content-center gap-2 px-3">
                      <span
                        className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                        onClick={moveToSports2}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="FacilityOptionSelectFacility"
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
                          id="FacilityOptionDeselectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf100;
                        </i>
                      </span>
                    </div>
                  )}

                  <div
                    className={
                      isMobile ? "col-12" : "col-lg-6 col-md-5 col-sm-12"
                    }
                  >
                    <span className="fw-bold required">
                      {t("Selected Facilities")}
                    </span>
                    <input
                      id="FacilityOptionSelectedFacilitySearch"
                      type="text"
                      name=""
                      className="form-control bg-white my-2 h-30px rounded-2 fs-8 w-100"
                      placeholder={t("Search...")}
                      value={searchQuery2}
                      onChange={(e) => setSearchQuery2(e.target.value)}
                    />
                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                        <span className="fw-bold">{t("Selected List")}</span>
                      </div>

                      <ol
                        className={`list-group rounded-0 list-group-even-fill ${isMobile ? "scroll2" : "h-225px scroll"} `}
                      >
                        {filteredSports2?.map((item: any, index: number) => (
                          <li
                            id={`FacilityOptionSelectesFacility_${item.id}`}
                            key={item.id}
                            className={
                              dragOverItemIndex?.listtwo === index
                                ? "next-position list-group-item px-2 py-1 border-0 cursor-pointer"
                                : "list-group-item px-2 py-1 border-0 cursor-pointer"
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

export default FacilitySelection;
