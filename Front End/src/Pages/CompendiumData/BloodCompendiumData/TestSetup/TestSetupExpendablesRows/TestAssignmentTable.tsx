import React, { useState } from "react";
import useLang from './../../../../../Shared/hooks/useLanguage';

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
const TestAssignment = () => {
  const { t } = useLang()
  const [isCheckAll, setIsCheckAll] = useState({
    testList: false,
    selectedTestList: false,
  });
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
  const [sports, setSports] = useState([
    { id: "0", name: "% Basophils", list: true },
    { id: "1", name: "% Eosinophils", list: true },
    { id: "2", name: "% Lymphocytes", list: true },
    { id: "3", name: "% Monocytes", list: true },
    { id: "4", name: "% Free PSA", list: true },
    { id: "5", name: "% Free Testosterone", list: true },
    { id: "6", name: "% Saturation", list: true },
    { id: "7", name: "% Neutrophils", list: true },
    { id: "8", name: "%Free Testosterone Index (FTI)", list: true },
    { id: "9", name: "A/G Ratio", list: true },
  ]);
  const [sports2, setSports2] = useState<any>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    if (name === "testList") {
      if (!isCheckAll.testList) {
        setisCheckTestList(sports.map((li: any) => li.id));
      }
      if (isCheckAll.testList) {
        setisCheckTestList([]);
      }
      setIsCheckAll((preVal: any) => {
        return {
          ...preVal,
          testList: !isCheckAll.testList,
        };
      });
    }
    if (name === "selectedtestList") {
      if (!isCheckAll.selectedTestList) {
        setisCheckedSelectedList(sports2.map((li: any) => li.id));
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

  const handleChangeTestList = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    name: string,
    index: number
  ) => {

    const objToExtend = {
      id: id,
      name: name,
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
      name: name,
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

  const handleDragStart = (index: any) => {
    setDragItemIndex(index);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };
  const handleDragEnter = (index: any) => {
    setDragOverItemIndex(index);
  };
  const handleDrop = (index: number, id: any, list: boolean) => {
    const _sports = [...sports];
    const dragItem = _sports.splice(dragItemIndex, 1);
    const newObj = {
      id: dragItem[0].id,
      name: dragItem[0].name,
      list: list,
    };
    _sports.splice(index, 0, newObj);
    setSports(_sports);
  };
  const handleDrop2 = (index: any, id: string, list: boolean) => {
    const _sports = [...sports2];
    const dragItem = _sports.splice(dragItemIndex, 1);
    const newObj = {
      id: dragItem[0].id,
      name: dragItem[0].name,
      list: list,
    };
    _sports.splice(index, 0, newObj);
    setSports2(_sports);
  };

  const handleDragLeave = (event: any) => {
    setDragOverItemIndex({
      listone: undefined,
      listtwo: undefined,
    });
  };
  const handleDragEnd = (event: any) => {
    setDragItemIndex(undefined);
    setDragOverItemIndex({
      listone: undefined,
      listtwo: undefined,
    });
  };
  const forwardPush = () => {
    if (checkedList.testList.length !== 0) {
      let orignalArrCopy = [...sports2];
      let arrWithCheckedItems = [...checkedList.testList];
      let concatedArray = orignalArrCopy.concat(arrWithCheckedItems);
      let currrentArray = [...sports];
      // for (let i = 0; i < concatedArray.length; i++) {
      //   let index = concatedArray[i].index;
      //   if (i === 0) {
      //     index = index;
      //   } else {
      //     index = index - i;
      //   }
      //   currrentArray.splice(index > 0 ? index : 0, 1);
      // }
      setSports(currrentArray);
      setSports2(concatedArray);
      setSelectedItemsToPop(concatedArray);
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

      setSports2(selectedItemsToPop);
      // let orignalArrCopy = [...sports];
      // let arrWithCheckedItems = [...checkedList.selectedTestList];
      // let concatedArray: any = orignalArrCopy.concat(arrWithCheckedItems);
      // let currrentArray = [...sports2];
      // for (let i = 0; i < concatedArray.length; i++) {
      //   
      //   let index = concatedArray[i].index;
      //   if (i === 0) {
      //     index = index;
      //   } else {
      //     index = index - i;
      //   }
      //   currrentArray.splice(index > 0 ? index : 0, 1);
      // }
      // setSports2(currrentArray);
      // setSports(concatedArray);
      // setCheckedList((preVal: any) => {
      //   return {
      //     ...preVal,
      //     selectedTestList: [],
      //   };
      // });
      setisCheckedSelectedList([]);
    }
  };


  return (
   
      <div className="card shadow-sm mb-3 rounded border border-warning">
        <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-warning">
          <h6 className="text-warning">{t("Test Assignment")}</h6>
        </div>
        <div className="card-body py-md-4 py-3">
          <div className="row">
            <div className="mb-5 mt-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 ">
              <span className=" mb-2 fw-bold">{t("Performing Lab")}</span>
            </div>
            <div className="mb-5 col-xl-3 col-lg-3 col-md-3 col-sm-12 ">
              <select className="form-select" data-kt-select2="true" data-placeholder={t("Select option")}>
                <option>{t("---TrueMedIT ---")}</option>
                <option value="1">{t("option 1")}</option>
                <option value="2">{t("option 2")}</option>
                <option value="3">{t("option 3")}</option>
                <option value="4">{t("option 4")}</option>
              </select>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
            <div className="row">
              <div className="col-xl-5_5 col-lg-5_5 col-md-12 col-sm-12 ">
                <input
                  type="text"
                  name=""
                  className="form-control bg-transparent mb-5 mb-sm-0"
                  placeholder="Search"
                  value=""
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
                    <span className="fw-bold">{t("Test List")}</span>
                  </div>

                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {sports?.map(({ name, id, list }, index) => (
                      <li
                        key={index}
                        className={
                          dragOverItemIndex?.listone === index
                            ? "list-group-item next-position py-2 px-3 cursor-pointer "
                            : "list-group-item py-2 px-3  border-0 cursor-pointer"
                        }
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index, id, list)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragLeave={handleDragLeave}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="d-flex">
                          <React.Fragment key={id}>
                            <Checkbox
                              type="checkbox"
                              name={name}
                              id={id}
                              handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleChangeTestList(e, id, name, index)}
                              isChecked={isCheckTestList.includes(id)}
                            />
                            {t(name)}
                          </React.Fragment>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xl-1 col-lg-1 col-md-12 col-sm-12 gap-2 d-flex flex-column justify-content-center align-items-center">
                <button
                  onClick={forwardPush}
                  className="btn btn-icon btn-sm fw-bold btn-warning mb-2"
                >
                  <i
                    className="fa fa-angle-double-right"
                    aria-hidden="true"
                  ></i>
                </button>
                <button
                  onClick={backwardPush}
                  className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                >
                  <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                </button>
              </div>
              <div className="mb-2 col-xl-5_5 col-lg-5_5 col-md-12 col-sm-12 ">
                <input
                  type="text"
                  name=""
                  className="form-control bg-transparent mb-5 mb-sm-0"
                  placeholder="Search"
                  value=""
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
                    <span className="fw-bold">{t("Selected Test List")}</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {sports2.map(({ name, id, list }: any, index: number) => (
                      <li
                        key={index}
                        className={
                          dragOverItemIndex?.listtwo === index
                            ? "list-group-item next-position py-2 px-3 cursor-pointer "
                            : "list-group-item py-2 px-3  border-0 cursor-pointer"
                        }
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop2(index, id, list)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragLeave={handleDragLeave}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="d-flex">
                          <React.Fragment key={id}>
                            <Checkbox
                              type="checkbox"
                              name={name}
                              id={id}
                              handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
                                handleChangeSelectedTestList(e, id, name, index)
                              }
                              isChecked={isCheckedSelectedList.includes(id)}
                            />
                            {name}
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
 
  );
};

export default TestAssignment;
