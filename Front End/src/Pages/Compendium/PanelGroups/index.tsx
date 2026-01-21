import React, { useEffect, useState } from "react";

import { AxiosResponse } from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PanelGroups from "../../../Services/Compendium/PanelGroups";
import useLang from "Shared/hooks/useLanguage";
import Popup from "../../../Shared/Modal";
import { NavigatorsArray } from "../../../Utils/Compendium/NavigatorsDetail";
import { RouteSlice } from "../../../Utils/Compendium/RouteSlicer";
import AddPanelGroup from "./AddPanelGroup";
import PanelGroupGrid from "./PanelGroups";
export interface mapData {
  id: number;
  name: string;
  displayName: string;
  isActive: boolean;
}
export interface IFormValues {
  name: string;
  displayName: string;
  isActive: boolean;
  [key: string]: string | boolean;
}
const Compendium: React.FC = () => {
  const { t } = useLang()
  const [panelGroups, setPanelGroups] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchRequest, setSearchRequest] = useState({
    id: null,
    name: "",
    displayName: "",
    isActive: null,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadData(false);
  }, []);
  const [values, setValues] = useState<IFormValues>({
    name: "",
    displayName: "",
    isActive: true,
  });
  const [editGridHeader, setEditGridHeader] = useState(false);
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);
  const loadData = (reset: boolean) => {
    setLoading(true)
    const nullDataObj = {
      id: null,
      name: "",
      displayName: "",
      isActive: null,
    };
    if (reset) {
      setSearchRequest({
        id: null,
        name: "",
        displayName: "",
        isActive: null,
      });
    }
    PanelGroups.getAllPanelGroups({
      pageNumber: 1,
      pageSize: 200,
      queryModel: reset ? nullDataObj : searchRequest,
    }).then((res: AxiosResponse) => {
      setPanelGroups(res.data.data.data);
      setLoading(false)
    }).catch((err: any) => {
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
    await PanelGroups.changePanelGroupStatus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          toast.success(res?.data?.title);
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {
      });
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const objToSend = {
      ...values,
      id: values?.id ? values?.id : 0,
      isActive: values?.isActive ? values?.isActive : false,
    };
    if (!editGridHeader) {
      PanelGroups.savePanelGroup(objToSend)
        .then((res: AxiosResponse) => {
          if (res?.data?.data?.status === 200) {
            toast.success(res?.data?.data?.message);
            loadData(true);
            setOpenModal(false);
            setEditGridHeader(false);
            setValues({
              id: "",
              name: "",
              displayName: "",
              isActive: true,
            });
          }
        })
        .catch((err: string) => {
          setEditGridHeader(false);
        });
    }

    if (editGridHeader) {
      PanelGroups.updatePanelGroup(objToSend)
        .then((res: AxiosResponse) => {
          if (res?.data?.data?.status === 200) {
            toast.success(res?.data?.data?.message);
            loadData(true);
            setOpenModal(false);
            setEditGridHeader(false);
            setValues({
              id: "",
              name: "",
              displayName: "",
              isActive: true,
            });
          }
          if (res?.data?.errors?.Name.length > 0) {
            toast.error(res?.data?.errors?.Name[0]);
          }
        })
        .catch((err: string) => {
          setEditGridHeader(false);
        });
    }
  };
  return (
    <>
      {openModal && (
        <Popup
          modalheader={editGridHeader ? t("Edit Group") : t("Add Group")}
          openModal={openModal}
          setValues={setValues}
          setOpenModal={setOpenModal}
          setEditGridHeader={setEditGridHeader}
          handleSubmit={handleSubmit}
        >
          <AddPanelGroup values={values} handleOnChange={handleOnChange} />
        </Popup>
      )}
      <PanelGroupGrid
        rows={
          panelGroups?.length > 0
            ? panelGroups?.map((val: mapData, index: number) => ({
              id: val?.id,
              name: val?.name,
              displayName: val?.displayName,
              isActive: val?.isActive,
            }))
            : []
        }
        NavigatorsArray={updatedNavigatorsArray}
        setValues={setValues}
        setOpenModal={setOpenModal}
        setEditGridHeader={setEditGridHeader}
        statusChange={statusChange}
        setSearchRequest={setSearchRequest}
        searchRequest={searchRequest}
        loadData={loadData}
        loading={loading}
      />
    </>
  );
};

export default Compendium;
