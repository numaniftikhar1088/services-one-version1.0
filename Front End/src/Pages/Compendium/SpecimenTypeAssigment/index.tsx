import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpecimenTypeAssigmentService from '../../../Services/Compendium/SpecimenTypeAssigmentService';
import { NavigatorsArray } from '../../../Utils/Compendium/NavigatorsDetail';
import { RouteSlice } from '../../../Utils/Compendium/RouteSlicer';
import SpecimenTypeAssigmentGrid from './SpecimenTypeAssigment';
import useLang from 'Shared/hooks/useLanguage';

interface PanelSetup {
  value: number | string;
  label: string;
}
const SpecimenTypeAssigment = () => {
  const { t } = useLang();

  const initialSearchRequestObj = {
    specimenType: '',
    panelDisplayName: '',
    requisitionTypeName: '',
    isactive: null,
  };

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const [request, setRequest] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };
  const showPage = (i: number) => {
    setCurPage(i);
  };
  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [selectedPanels, setSelectedPanels] = useState<any>([]);
  const [specimenTypeAssigmentList, setSpecimenTypeAssigmentList] =
    useState<any>({
      id: 0,
      specimenTypeId: 0,
      specimenType: '',
      panelId: 0,
      panelDisplayName: '',
      reqTypeId: 0,
      requisitionTypeName: '',
      isactive: null,
      isSpecimenSourceFieldShow: null,
    });
  const [values, setValues] = useState<any>({
    id: 0,
    reqTypeId: 0,
    panels: [],
    specimenTypeId: 0,
    isactive: true,
    isSpecimenSourceFieldShow: true,
  });

  const [check, setCheck] = useState(false);
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [PanelSetupList, setPanelSetupList] = useState<PanelSetup[]>([]);
  const [sports2, setSports2] = useState<any>([]);
  const [panels, setPanels] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [searchRequest, setSearchRequest] = useState<any>(
    initialSearchRequestObj
  );

  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);

  const loadData = (reset: boolean) => {
    setLoading(true);

    if (reset) {
      setSearchRequest(initialSearchRequestObj);
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    SpecimenTypeAssigmentService.getSpecimenTypeAssigment({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchRequestObj : trimmedSearchRequest,
      sortColumn: reset ? initialSorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setSpecimenTypeAssigmentList(res?.data?.result);
        setTotal(res?.data?.totalRecord);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////
  const initialSorting = {
    sortColumn: 'id',
    sortDirection: 'desc',
  };
  const [sort, setSorting] = useState<any>(initialSorting);
  const searchRef = useRef<any>(null);

  const handleSort = async (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc');
    sort.sortColumn = columnName;
    sort.sortDirection = searchRef.current.id;
    setSorting((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef?.current?.id,
        clickedIconData: columnName,
      };
    });
    loadData(false);
  };

  ////////////-----------------Sorting-------------------///////////////////

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    if (type === 'checkbox') {
      if (name === 'isActive') {
        setValues((preVal: any) => {
          return {
            ...preVal,
            isActive: e.target.checked,
          };
        });
      }
      if (name === 'isSpecimenSourceFieldShow') {
        setValues((preVal: any) => {
          return {
            ...preVal,
            isSpecimenSourceFieldShow: e.target.checked,
          };
        });
      }
    } else {
      setValues((preVal: any) => {
        return {
          ...preVal,
          [name]: value,
        };
      });
    }
  };

  const statusChange = async (id: 0, isactive: boolean) => {
    const objToSend = {
      id: id,
      isactive: isactive ? false : true,
    };
    await SpecimenTypeAssigmentService.changeSpecimenTypeAssigmentStatus(
      objToSend
    )
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {});
  };

  const DeleteSpecimenTypeAssignmentById = async (id: number) => {
    setCheck(true);
    await SpecimenTypeAssigmentService.DeleteSpecimenTypeAssignmentById(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
          setCheck(false);
        }
      })
      .catch((err: string) => {
        setCheck(false);
      });
  };

  //===================================  SECTION ERRORS====================
  const [errors, setErrors] = useState({
    panelError: '',
    requisitionError: '',
    specimenError: '',
    referenceLabError: '',
  });

  const validateForm = () => {
    let formIsValid = true;
    const newErrors: any = {};

    if (!values.reqTypeId) {
      newErrors.requisitionError = t('Please select a requisition Type');
      formIsValid = false;
    }
    if (!values.specimenTypeId) {
      newErrors.specimenError = t('Please select a Specimen Type');
      formIsValid = false;
    }

    if (!values.refLabId) {
      newErrors.referenceLabError = t('Please select a Reference Lab.');
      formIsValid = false;
    }

    setErrors(newErrors);

    return formIsValid;
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!selectedPanels.length) {
      toast.error(t('Select At least One Panel'));
      return;
    }
    setRequest(true);
    const selectedPanel = selectedPanels.map((panel: any) => ({
      panelId: panel.id ?? panel.panelId,
      panelDisplayName: panel.facilityName ?? panel.panelDisplayName,
    }));

    const objToSend = {
      id: editGridHeader ? values?.id : 0,
      reqTypeId: values.reqTypeId,
      panels: selectedPanel,
      specimenTypeId: values.specimenTypeId,
      isactive: values.isActive,
      refLabId: values.refLabId,
      isSpecimenSourceFieldShow: values.isSpecimenSourceFieldShow,
    };
    SpecimenTypeAssigmentService.createOrUpdateSpecimenTypeAssigment(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
          setRequest(false);
          setEditGridHeader(false);
          setValues({
            reqTypeId: 0,
            panels: [],
            specimenTypeId: 0,
            isactive: true,
            isSpecimenSourceFieldShow: true,
          });
          setSelectedPanels([]);
          setSports2([]);
        } else if (res?.data?.httpStatusCode === 400) {
          toast.error(t(res?.data?.error[0]));
          setRequest(false);
        }
      })
      .catch((err: any) => {
        console.error(t('Error submitting form:'), err);
        setRequest(false);
      });
  };

  const Edit = (item: any) => {
    setOpenModal(true);
    setValues((preVal: any) => {
      return {
        ...preVal,
        id: item.id,
        reqTypeId: item.reqTypeId,
        panels: item.panels,
        specimenTypeId: item.specimenTypeId,
        isactive: item.isactive,
        refLabId: item.refLabId,
        isSpecimenSourceFieldShow: item.isSpecimenSourceFieldShow,
      };
    });
    setSports2(
      item.panels.map((panel: any) => ({
        id: panel.panelId,
        facilityName: panel.panelDisplayName,
      }))
    );
    setSelectedPanels(item.panels);
    setEditGridHeader(true);
    setErrors((pre: any) => {
      return {
        ...pre,
        panelError: '',
        requisitionError: '',
        specimenError: '',
      };
    });
  };

  const handleOpen = () => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        id: 0,
        reqTypeId: 0,
        panels: [],
        specimenTypeId: 0,
        isactive: true,
      };
    });
    setErrors((pre: any) => {
      return {
        ...pre,
        panelError: '',
        requisitionError: '',
        specimenError: '',
      };
    });
    setEditGridHeader(false);
    setOpenModal(true);
  };

  useEffect(() => {
    loadData(false);
  }, [pageSize, curPage, triggerSearchData]);

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    loadData(true);
  }, []);

  return (
    <>
      <SpecimenTypeAssigmentGrid
        rows={
          specimenTypeAssigmentList?.length > 0
            ? specimenTypeAssigmentList?.map((val: any, index: any) => ({
                ...val,
                id: val.id,
                specimenTypeId: val?.specimenTypeId,
                specimenType: val?.specimenType,
                panels: val.panels,
                reqTypeId: val?.reqTypeId,
                requisitionTypeName: val?.requisitionTypeName,
                isactive: val?.isactive,
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
        DeleteSpecimenTypeAssignmentById={DeleteSpecimenTypeAssignmentById}
        loading={loading}
        curPage={curPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        nextPage={nextPage}
        showPage={showPage}
        prevPage={prevPage}
        Edit={Edit}
        editGridHeader={editGridHeader}
        handleOpen={handleOpen}
        handleOnChange={handleOnChange}
        errors={errors}
        setErrors={setErrors}
        PanelSetupList={PanelSetupList}
        setPanelSetupList={setPanelSetupList}
        openModal={openModal}
        modalheader={
          editGridHeader
            ? t('Edit Specimen Type Assignment')
            : t('Add Specimen Type Assignment')
        }
        handleSubmit={handleSubmit}
        setRequest={setRequest}
        request={request}
        panels={panels}
        setPanels={setPanels}
        sports2={sports2}
        setSports2={setSports2}
        loadData={loadData}
        selectedPanels={selectedPanels}
        setSelectedPanels={setSelectedPanels}
        check={check}
        sort={sort}
        handleSort={handleSort}
        searchRef={searchRef}
        setSorting={setSorting}
        setCurPage={setCurPage}
        setTriggerSearchData={setTriggerSearchData}
      />
    </>
  );
};
export default SpecimenTypeAssigment;
