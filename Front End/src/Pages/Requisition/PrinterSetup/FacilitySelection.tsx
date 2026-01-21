import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { LoaderIcon } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
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

  const [sports, setSports] = useState([]);
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
  useEffect(() => {
    setSports(
      facilities
        .map((facility: any) => ({
          id: facility.facilityId,
          facilityName: facility.facilityName + " - " + facility.address1,
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
  const handleChangeTestList = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    name: string,
    index: number
  ) => {
    const objToExtend = {
      id: id,
      facilityName: name,
      index: index,
    };
    const { checked } = e.target;

    setisCheckTestList([...isCheckTestList, id]);
    setCheckedList((preVal: any) => {
      return {
        ...preVal,
        testList: [...checkedList.testList, objToExtend],
      };
    });

    if (!checked) {
      setisCheckTestList(isCheckTestList.filter((item) => item !== id));
      setCheckedList((preVal: any) => {
        return {
          ...preVal,
          testList: [
            ...checkedList.testList.filter((item: any) => item.id !== id),
          ],
        };
      });
    }
  };
  const handleChangeSelectedTestList = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    name: string,
    index: number
  ) => {
    const { checked } = e.target;
    const objToExtend = {
      id: id,
      facilityName: name,
      index: index,
    };

    setisCheckedSelectedList([...isCheckedSelectedList, id]);
    setCheckedList((preVal: any) => {
      return {
        ...preVal,
        selectedTestList: [...checkedList.selectedTestList, objToExtend],
      };
    });
    if (checked) {
      setSelectedItemsToPop(
        selectedItemsToPop.filter((item: any) => item.id !== id)
      );
    }

    if (!checked) {
      setSelectedItemsToPop([...selectedItemsToPop, objToExtend]);
      setisCheckedSelectedList(
        isCheckedSelectedList.filter((item) => item !== id)
      );
      setCheckedList((preVal: any) => {
        return {
          ...preVal,
          selectedTestList: [
            ...checkedList.selectedTestList.filter(
              (item: any) => item.id !== id
            ),
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
    FacilityService.savefacilities(queryModel)
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
  return (
    <>
      <div className="my-6 mt-0">
        <button
          className="btn btn-primary btn-sm fw-bold mr-3 px-5 py-2 text-capitalize"
          onClick={handleSubmit}
        >
          {isRequest ? <LoaderIcon /> : null}
          {t("Save")}
        </button>
        <button
          className="btn btn-secondary btn-sm fw-bold mr-3 px-5 py-2 text-capitalize"
          onClick={handleclose}
        >
          {t("Cancel")}
        </button>
      </div>

      <div className="card shadow-sm mb-3 rounded border border-warning">
        <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-warning">
          <h6 className="text-warning">{t("Facilities")}</h6>
        </div>
        <div className="card-body py-md-4 py-3">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
            <div className="row">
              <div className="col-xl-5_5 col-lg-5_5 col-md-12 col-sm-12 ">
                <span className="fw-bold">{t("All Facilities")}</span>
                <input
                  type="text"
                  name=""
                  className="form-control bg-transparent mb-5 mb-sm-0"
                  placeholder={t("Search...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                    <Checkbox
                      type="checkbox"
                      name="testList"
                      id="selectAll"
                      handleChange={handleSelectAll}
                      isChecked={isCheckAll.testList}
                    />
                    <span className="fw-bold">{t("All List")}</span>
                  </div>

                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {filteredSports?.map((items: any, index: number) => (
                      <li
                        key={index}
                        className={
                          dragOverItemIndex?.listone === index
                            ? "list-group-item next-position py-2 px-3 cursor-pointer "
                            : "list-group-item py-2 px-3  border-0 cursor-pointer"
                        }
                      >
                        <div className="d-flex">
                          <React.Fragment key={items?.id}>
                            <Checkbox
                              type="checkbox"
                              name={items?.facilityName}
                              id={items?.id + 1}
                              handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                handleChangeTestList(
                                  e,
                                  items?.id,
                                  items?.facilityName,
                                  index
                                )
                              }
                              isChecked={isCheckTestList.includes(items?.id)}
                            />
                            {items?.facilityName}
                          </React.Fragment>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xl-1 col-lg-1 col-md-12 col-sm-12 gap-2 d-flex flex-column justify-content-center align-items-center"></div>

              <div className="mb-2 col-xl-5_5 col-lg-5_5 col-md-12 col-sm-12 ">
                <span className="fw-bold">{t("Selected Facilities")}</span>
                <input
                  type="text"
                  name=""
                  className="form-control bg-transparent mb-5 mb-sm-0"
                  placeholder={t("Search...")}
                  value={searchQuery2}
                  onChange={(e) => setSearchQuery2(e.target.value)}
                />
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                    <Checkbox
                      type="checkbox"
                      name="selectedtestList"
                      id="selectAll"
                      handleChange={handleSelectAll}
                      isChecked={isCheckAll.selectedTestList}
                    />
                    <span className="fw-bold">{t("Selected List")}</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {filteredSports2?.map((item: any, index: number) => (
                      <li
                        key={index}
                        className={
                          dragOverItemIndex?.listtwo === index
                            ? "list-group-item next-position py-2 px-3 cursor-pointer "
                            : "list-group-item py-2 px-3  border-0 cursor-pointer"
                        }
                      >
                        <div className="d-flex">
                          <React.Fragment key={item.id}>
                            <Checkbox
                              type="checkbox"
                              name={item.facilityName}
                              id={item.id}
                              handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                handleChangeSelectedTestList(
                                  e,
                                  item.id,
                                  item.facilityName,
                                  index
                                )
                              }
                              isChecked={isCheckedSelectedList.includes(
                                item.id
                              )}
                            />
                            {item.facilityName}
                            {item.address1}
                          </React.Fragment>
                        </div>
                      </li>
                    ))}
                  </ul>
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
