import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PanelSetupData from "../../../Services/Compendium/PanelSetup";
import LabManagementService from "../../../Services/LabManagement/LabManagementService";
import useLang from "Shared/hooks/useLanguage";
import Popup from "../../../Shared/Modal";
import { NavigatorsArray } from "../../../Utils/Compendium/NavigatorsDetail";
import { RouteSlice } from "../../../Utils/Compendium/RouteSlicer";
import AddPanelSetup from "./AddPanelSetup";
import PanelSetupGrid from "./PanelSetup";
interface IPanelSetup {
  id: number;
  name: string;
  displayName: string;
  requisitionType: number;
  requisitionTypeName: string;
  panelType: number;
  tmiT_Code: string;
  isActive: string | boolean;
}
export interface IFormValues {
  name: string;
  displayName: string;
  panelType: number;
  tmiT_Code: string;
  requisitionType: string;
  isActive: string | boolean;
  [key: string | number]: string | number | boolean;
}

export interface IData {
  requisitionList: array[] | null;
}
export interface array {
  reqTypeId: number;
  requisitionTypeName: string;
}

interface IRequisition {
  reqTypeId: string;
  requisitionTypeName: string;
}

const PanelSetup = () => {
  const { t } = useLang()
  const [panelSetupData, setPanelSetupData] = useState([]);
  const [data, setdata] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    loadData(false);
    getRequisitionDropdownItems();
  }, []);
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [values, setValues] = useState<IFormValues>({
    name: "",
    displayName: "",
    panelType: 0,
    tmiT_Code: "",
    requisitionType: "",
    isActive: true,
  });
  const [searchRequest, setSearchRequest] = useState({
    name: "",
    displayName: "",
    tmiT_Code: "",
    isActive: null,
  });
  const [requisitionList, setRequisitionList] = useState<
    {
      reqTypeId: number;
      requisitionTypeName: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false)
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);
  const loadData = (reset: boolean) => {
    setLoading(true)
    const nullObj = {
      id: null,
      name: "",
      displayName: "",
      isActive: null,
    };
    if (reset) {
      setSearchRequest({
        name: "",
        displayName: "",
        isActive: null,
        tmiT_Code: "",
      });
    }
    PanelSetupData.getPanelSetup({
      pageNumber: 1,
      pageSize: 200,
      queryModel: reset ? nullObj : searchRequest,
    }).then((res: AxiosResponse) => {
      setPanelSetupData(res?.data?.data?.data);
      setLoading(false)
    }).catch((err: any) => {
      console.trace(err);
      setLoading(false);
    });;
    LabManagementService?.getRequsitionTypeDropdownValues()
      .then((res: any) => {
        setdata(res?.data?.data);
      })
      .catch((err: any) => { });
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    if (type === "checkbox") {
      setValues((preVal: any) => {
        return {
          ...preVal,
          isActive: e.target.checked,
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
  const statusChange = async (id: string, status: boolean) => {
    const objToSend = {
      id: id,
      status: status ? false : true,
    };
    await PanelSetupData.changePanelSetupStatus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          toast.success(res?.data?.title);
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => { });
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const objToSend = {
      ...values,
      isActive: values.isActive ? true : false,
      panelType: 0,
    };
    if (!editGridHeader) {
      PanelSetupData.savePanelSetup(objToSend)
        .then((res: AxiosResponse) => {
          if (res?.data?.data?.status === 200) {
            toast.success(res?.data?.data?.message);
            setOpenModal(false);
            setValues({
              name: "",
              displayName: "",
              panelType: 0,
              tmiT_Code: "",
              requisitionType: "",
              isActive: true,
            });
            setEditGridHeader(false);
            loadData(true);
          }
        })
        .catch((err: string) => {
          setEditGridHeader(false);
        });
    }
    if (editGridHeader) {
      PanelSetupData.updatePanelSetup(objToSend)
        .then((res: AxiosResponse) => {
          if (res?.data?.data?.status === 200) {
            toast.success(res?.data?.data?.message);
            setOpenModal(false);
            setValues({
              name: "",
              displayName: "",
              panelType: 0,
              tmiT_Code: "",
              requisitionType: "",
              isActive: true,
            });
            setEditGridHeader(false);
            loadData(true);
          }
        })
        .catch((err: string) => {
          setEditGridHeader(false);
        });
    }
  };

  const getRequisitionDropdownItems = () => {
    PanelSetupData.requisitionLookUpDropDown().then((res: AxiosResponse) => {
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
      <Popup
        modalheader={editGridHeader ? t("Edit Panel Setup") : t("Add Panel Setup")}
        openModal={openModal}
        setValues={setValues}
        setOpenModal={setOpenModal}
        setEditGridHeader={setEditGridHeader}
        handleSubmit={handleSubmit}
      >
        <AddPanelSetup
          values={values}
          setValues={setValues}
          requisitionList={requisitionList}
          handleOnChange={handleOnChange}
        />
      </Popup>
      <PanelSetupGrid
        rows={
          panelSetupData?.length > 0
            ? panelSetupData?.map((val: IPanelSetup, index: number) => ({
              id: val?.id,
              name: val?.name,
              displayName: val?.displayName,
              requisitionType: val?.requisitionType,
              requisitionTypeName: val?.requisitionTypeName,
              panelType: val?.panelType,
              tmiT_Code: val?.tmiT_Code,
              isActive: val?.isActive,
            }))
            : []
        }
        requisitionList={requisitionList}
        NavigatorsArray={updatedNavigatorsArray}
        setOpenModal={setOpenModal}
        setValues={setValues}
        setEditGridHeader={setEditGridHeader}
        statusChange={statusChange}
        setSearchRequest={setSearchRequest}
        searchRequest={searchRequest}
        loading={loading}
        loadData={loadData}
      />
    </>
  );
};

export default PanelSetup;
