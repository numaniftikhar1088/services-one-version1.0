import React, { useState } from "react";
import useLang from "Shared/hooks/useLanguage";

interface IValues {
  listone: string | number | undefined;
  listtwo: string | number | undefined;
}

const TestAssignment = () => {
  const { t } = useLang()
  const [sports, setSports] = useState([
    { id: "0", text: t("% Basophils"), list: true },
    { id: "1", text: t("% Eosinophils"), list: true },
    { id: "2", text: t("% Lymphocytes"), list: true },
    { id: "3", text: t("% Monocytes"), list: true },
    { id: "4", text: t("% Free PSA"), list: true },
    { id: "5", text: t("% Free Testosterone"), list: true },
    { id: "6", text: t("% Saturation"), list: true },
    { id: "7", text: t("% Neutrophils"), list: true },
  ]);

  const [sports2, setSports2] = useState([
    { id: "4", text: t("% Free Testosterone Index (FTI)"), list: false },
    { id: "5", text: t("A/G Ratio"), list: false },
  ]);
  const [dragItemIndex, setDragItemIndex] = useState<any>();

  const [dragOverItemIndex, setDragOverItemIndex] = useState<IValues>({
    listone: "",
    listtwo: "",
  });
  const [listName, setListName] = useState();
  const handleDragStart = (index: any, list: any) => {
    setDragItemIndex(index);
    setListName(list);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };
  const handleDragEnter = (index: any, list: any) => {
    setDragOverItemIndex(index);
    setDragOverItemIndex((preVal) => {
      return {
        ...preVal,
        listone: list ? index : "",
        listtwo: !list ? index : "",
      };
    });
  };
  const handleDrop = (index: number, list: any, id: any) => {
    if (listName === list) {
      const _sports = [...sports];
      const dragItem = _sports.splice(dragItemIndex, 1);
      const newObj = {
        id: dragItem[0].id,
        text: dragItem[0].text,
        list: dragItem[0].list,
      };
      _sports.splice(index, 0, newObj);
      setSports(_sports);
    }
    if (listName !== list) {
      let _sports = [...sports];
      let _sports2 = [...sports2];
      const dragItemFromOppositeList = _sports2.splice(dragItemIndex, 1);
      setSports2(_sports2);
      const newObj = {
        id: dragItemFromOppositeList[0].id,
        text: dragItemFromOppositeList[0].text,
        list: true,
      };
      _sports = [..._sports, newObj];
      setSports(_sports);
    }
  };
  const handleDrop2 = (index: any, list: any, id: any) => {
    if (listName === list) {
      const _sports = [...sports2];
      const dragItem = _sports.splice(dragItemIndex, 1);
      const newObj = {
        id: dragItem[0].id,
        text: dragItem[0].text,
        list: dragItem[0].list,
      };
      _sports.splice(index, 0, newObj);
      setSports2(_sports);
    }
    if (listName !== list) {
      let _sports = [...sports];
      let _sports2 = [...sports2];
      const dragItemFromOppositeList = _sports.splice(dragItemIndex, 1);
      setSports(_sports);
      const newObj = {
        id: dragItemFromOppositeList[0].id,
        text: dragItemFromOppositeList[0].text,
        list: false,
      };
      _sports2 = [..._sports2, newObj];
      setSports2(_sports2);
    }
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
            <select
              className="form-select"
              data-kt-select2="true"
              data-placeholder="Select option"
            >
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
                placeholder={t("Search")}
                value=""
              />

              <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                  <label className="form-check form-check-sm form-check-solid me-5">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1"
                    />
                  </label>
                  <span className="fw-bold">{t("Test List")}</span>
                </div>
                <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                  {sports?.map(({ text, list, id }, index) => (
                    <li
                      key={index}
                      className={
                        dragOverItemIndex?.listone === index
                          ? "list-group-item next-position py-2 px-3 cursor-pointer "
                          : "list-group-item py-2 px-3  border-0 cursor-pointer"
                      }
                      draggable
                      onDragStart={() => handleDragStart(index, list)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index, list, id)}
                      onDragEnter={() => handleDragEnter(index, list)}
                      onDragLeave={handleDragLeave}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="d-flex">
                        <label className="form-check form-check-sm form-check-solid me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={id}
                            onChange={(e: any) => console.log(e.target.value)}
                          />
                        </label>
                        <span>{t(text)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xl-1 col-lg-1 col-md-12 col-sm-12 gap-2 d-flex flex-column justify-content-center align-items-center">
              <button className="btn btn-icon btn-sm fw-bold btn-warning mb-2">
                <i
                  className="fa fa-angle-double-right"
                  aria-hidden="true"
                ></i>
              </button>
              <button className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light">
                <i className="fa fa-angle-double-left" aria-hidden="true"></i>
              </button>
            </div>
            <div className="mb-2 col-xl-5_5 col-lg-5_5 col-md-12 col-sm-12 ">
              <input
                type="text"
                name=""
                className="form-control bg-transparent mb-5 mb-sm-0"
                placeholder={t("Search")}
                value=""
              />
              <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                  <label className="form-check form-check-sm form-check-solid me-5">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1"
                    />
                  </label>
                  <span className="fw-bold">{t("Selected Test List")}</span>
                </div>
                <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                  {sports2.map(({ text, list, id }, index) => (
                    <li
                      key={index}
                      className={
                        dragOverItemIndex?.listtwo === index
                          ? "list-group-item next-position py-2 px-3 cursor-pointer "
                          : "list-group-item py-2 px-3  border-0 cursor-pointer"
                      }
                      draggable
                      onDragStart={() => handleDragStart(index, list)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop2(index, list, id)}
                      onDragEnter={() => handleDragEnter(index, list)}
                      onDragLeave={handleDragLeave}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="d-flex">
                        <label className="form-check form-check-sm form-check-solid me-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value="1"
                          />
                        </label>
                        <span>{text}</span>
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
function useEffect(arg0: () => void, arg1: never[][]) {
  throw new Error("Function not implemented.");
}
