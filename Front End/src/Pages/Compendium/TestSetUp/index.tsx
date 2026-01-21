import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import TestSetUpService from "../../../Services/Compendium/TestSetUpService";
import Popup from "../../../Shared/Modal";
import { NavigatorsArray } from "../../../Utils/Compendium/NavigatorsDetail";
import { RouteSlice } from "../../../Utils/Compendium/RouteSlicer";
import AddTestSetup from "./AddTestSetUp";
import TestSetUpGrid from "./TestSetUp";
import useLang from "../../../Shared/hooks/useLanguage";
export interface mapData {
  testId: number;
  testName: string;
  testDisplayName: string;
  tmitCode: string;
  testType: string;
  requsitionType: string;
  testStatus: boolean;
}
export interface IFormValues {
  testName: string;
  testTypeId: number;
  tmitcode: string;
  testStatus: boolean | null;
  reqTypeId: number;
  [key: string]: string | number | boolean | null;
}
export interface IData {
  requisitionList: array[] | null;
}
export interface array {
  reqTypeId: number;
  requisitionTypeName: string;
}

interface IRequisition {
  reqTypeId: number;
  requisitionTypeName: string;
}
const TestSetUpIndex: React.FC = () => {
  const { t } = useLang();
  const [testSetUp, setTestSetUp] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchRequest, setSearchRequest] = useState({
    testName: "",
    testDisplayName: "",
    tmitCode: "",
    testType: "",
    testStatus: true,
    requsitionType: "",
  });

  const [values, setValues] = useState<IFormValues>({
    testName: "",
    testDisplayName: "",
    testTypeId: 0,
    tmitcode: "",
    testStatus: true,
    reqTypeId: 0,
  });
  const [requisitionList, setRequisitionList] = useState<
    {
      reqTypeId: number;
      requisitionTypeName: string;
    }[]
  >([]);
  const [editGridHeader, setEditGridHeader] = useState(false);
  useEffect(() => {
    loadData(true);
    getRequisitionDropdownItems();
  }, []);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);
  const loadData = (reset: boolean) => {
    setLoading(true);
    const nullObj = {
      testId: 0,
      testName: "",
      testDisplayName: "",
      tmitCode: "",
      testType: "",
      requsitionType: "",
      testStatus: null,
    };
    TestSetUpService.getTestSetUp({
      pageNumber: 1,
      pageSize: 1000,
      queryModel: reset ? nullObj : searchRequest,
    })
      .then((res: AxiosResponse) => {
        setTestSetUp(res.data.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    if (type === "checkbox") {
      setValues((preVal: any) => {
        return {
          ...preVal,
          testStatus: e.target.checked,
        };
      });
    } else {
      setValues((preVal: any) => {
        return {
          ...preVal,
          [name]: value,
        };
      });
    }
  };
  const statusChange = async (testId: number, testStatus: boolean) => {
    const objToSend = {
      testId: testId,
      testStatus: testStatus ? false : true,
    };
    await TestSetUpService.changeTestSetUpStatus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {});
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const objToSend = {
      ...values,
      testId: values?.testId ? values?.testId : 0,
      testStatus: values.testStatus ? values?.testStatus : false,
    };

    TestSetUpService.saveTestSetUp(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          setOpenModal(false);
          setEditGridHeader(false);
          loadData(true);
          setValues({
            testName: "",
            testDisplayName: "",
            testTypeId: 0,
            tmitcode: "",
            testStatus: true,
            reqTypeId: 0,
          });
        }
      })
      .catch((err: string) => {
        setEditGridHeader(false);
      });
  };
  const getRequisitionDropdownItems = () => {
    TestSetUpService.requisitionLookUpDropDown().then((res: AxiosResponse) => {
      let RequisitionArray: any = [];
      res?.data?.data?.forEach((val: IRequisition) => {
        let requisitionDetails = {
          value: val?.reqTypeId,
          label: val?.requisitionTypeName,
        };
        RequisitionArray.push(requisitionDetails);
      });
      setRequisitionList(RequisitionArray);
    });
  };
  return (
    <>
      {openModal && (
        <Popup
          modalheader={editGridHeader ? t("Edit Test Setup") : t("Add Test Setup")}
          openModal={openModal}
          setValues={setValues}
          setOpenModal={setOpenModal}
          setEditGridHeader={setEditGridHeader}
          handleSubmit={handleSubmit}
        >
          <AddTestSetup
            values={values}
            setValues={setValues}
            requisitionList={requisitionList}
            handleOnChange={handleOnChange}
          />
        </Popup>
      )}
      <TestSetUpGrid
        rows={
          testSetUp?.length > 0
            ? testSetUp?.map((val: mapData, index: number) => ({
                testId: val?.testId,
                testName: val?.testName,
                testDisplayName: val?.testDisplayName,
                tmitCode: val?.tmitCode,
                testType: val?.testType,
                requsitionType: val?.requsitionType,
                testStatus: val?.testStatus,
              }))
            : []
        }
        NavigatorsArray={updatedNavigatorsArray}
        setOpenModal={setOpenModal}
        setEditGridHeader={setEditGridHeader}
        values={values}
        setValues={setValues}
        statusChange={statusChange}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loading={loading}
        loadData={loadData}
      />
    </>
  );
};

export default TestSetUpIndex;
