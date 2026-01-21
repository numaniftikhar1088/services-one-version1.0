import { Box, MenuItem, Tooltip } from '@mui/material';
import { AxiosError, AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import InsuranceService from '../../../Services/InsuranceService/InsuranceService';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import PermissionComponent, { AnyPermission } from '../../../Shared/Common/Permissions/PermissionComponent';
import ArrowBottomIcon from '../../../Shared/SVG/ArrowBottomIcon';
import { StringRecord } from '../../../Shared/Type';
import usePagination from '../../../Shared/hooks/usePagination';
import BreadCrumbs from '../../../Utils/Common/Breadcrumb';
import {
  StyledDropButton,
  StyledDropMenu,
} from '../../../Utils/Style/Dropdownstyle';
import { SortingTypeI } from '../../../Utils/consts';
import AddNewItem from './AddNewItem';
import ManageInventoryGridData from './ManageInventoryGridData';
import useLang from '../../../Shared/hooks/useLanguage';
import CustomPagination from '../../../Shared/JsxPagination';

interface FileData {
  fileName: string;
  contents: string;
}

function ManageInventory() {
  const initialSearchQuery = {
    id: 0,
    itemName: '',
    itemDescription: '',
    itemBarCode: '',
    itemType: '',
    quantityPerItemSet: null,
    isPhlebotomist: true,
    quantity: null,
    lowQuantityAlert: null,
    requisitionTypeName: '',
  };

  const { t } = useLang();

  const queryDisplayTagNames: StringRecord = {
    itemName: t('Item Name'),
    itemDescription: t('Description'),
    itemBarCode: t('Item Bar Code'),
    itemType: t('Item Type'),
    quantityPerItemSet: t('Quantity Per Item Set'),
    quantity: t('Quantity'),
    lowQuantityAlert: t('Minimum Level'),
    requisitionTypeName: t('Requisition Type'),
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
  const [dropdown, setDropdown] = useState([{ value: 0, label: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBox, setSelectedBox] = useState<any>({
    ids: [],
  });
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const itemTypes = [
    { value: 'Testing Supplies', label: t('Testing Supplies') },
    { value: 'Shipping Supplies', label: t('Shipping Supplies') },
  ];
  const initialTestingSupplies = {
    id: 0,
    itemName: '',
    itemDescription: '',
    itemBarCode: '',
    itemType: '',
    quantityPerItemSet: '',
    isPhlebotomist: 'true',
    quantity: '',
    lowQuantityAlert: '',
    requisitionTypeId: '',
    requisitionTypeName: '',
  };
  const [testingSupplies, setTestingSupplies] = useState(
    initialTestingSupplies
  );
  let {
    itemName,
    itemDescription,
    itemBarCode,
    itemType,
    quantityPerItemSet,
    quantity,
    lowQuantityAlert,
    requisitionTypeId,
  } = testingSupplies;
  // React hook form start
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset: HookFormReset,
    formState: { errors },
  } = useForm<any>();

  const handleKeyPressed = (e: any) => {
    const keyCode = e.charCode || e.keyCode;
    const allowedKeyCodes = [8, 9, 37, 38, 39, 40, 46]; // 8: backspace, 9: tab, 37: left arrow, 38: up arrow, 39: right arrow, 40: down arrow, 40: delete
    if ((keyCode < 48 || keyCode > 57) && !allowedKeyCodes.includes(keyCode)) {
      e.preventDefault();
    }
  };

  const handleEnterPress = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };
  // React hook form end
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
    setCurPage,
  } = usePagination();

  useEffect(() => {
    if (initialRender) {
      loadData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  //Sorting Start
  const sortById = {
    clickedIconData: 'Id',
    sortingOrder: 'desc',
  };
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const searchRef = useRef<any>(null);
  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc');

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };
  useEffect(() => {
    if (initialRender2) {
      loadData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    setCurPage(1);
  }, [pageSize]);
  //Sorting End
  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
  });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  // *********** All Dropdown Function END ***********
  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadData(true, true, sortById);
  }
  ////////////-----------------Delete a Row-------------------///////////////////
  const deleteRecord = (id: number) => {
    InsuranceService?.deleteRecordInventory(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          loadData(true, false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  ////////////-----------------Delete a Row-------------------///////////////////
  /////Start Selected Box
  const handleAllSelect = (checked: boolean, rows: any) => {
    setSelectAll(checked);
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.id);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: [],
        };
      });
    }
  };

  const handleChangeSelectedIds = (checked: boolean, id: number) => {
    setSelectedBox((prev: any) => ({
      ...prev,
      ids: Array.isArray(prev.ids)
        ? checked
          ? [...prev.ids, id]
          : prev.ids.filter((item: number) => item !== id)
        : [id],
    }));
  };

  /////End Selected Box
  const base64ToExcel = (base64: string, filename: string) => {
    const decodedBase64 = atob(base64);
    const workbook = XLSX.read(decodedBase64, { type: 'binary' });
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(excelBlob, `${filename}.xlsx`);
  };

  const downloadAll = () => {
    const obj = {
      status: '',
      selectedRows: [],
      queryModel: searchRequest,
    };
    InsuranceService.AllRecordsExportToExcel(obj).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        base64ToExcel(res.data.data.fileContents, 'Inventory Item');
        setSelectAll(false);
        setSelectedBox([]);
      } else {
        toast.error(res?.data?.message);
      }
    });
  };

  const downloadSelected = () => {
    const obj = {
      status: '',
      selectedRows: selectedBox.ids,
      queryModel: searchRequest,
    };
    if (selectedBox.ids.length > 0) {
      InsuranceService.SelectedRecordsExportToExcel(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            base64ToExcel(res.data.data.fileContents, 'Inventory Item');
            setSelectAll(false);
            setSelectedBox([]);
          } else {
            toast.error(res?.data?.message);
          }
        }
      );
    } else {
      toast.error(t('Select atleast one record'));
    }
  };

  const loadData = (loader: boolean, reset: boolean, sortingState?: any) => {
    setLoading(true);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    InsuranceService.getInventoryItemAllData({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: any) => {
        setRows(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };

  const reqTypeLookup = () => {
    RequisitionType.GetRequisitionTypeLookup()
      .then((res: AxiosResponse) => {
        setDropdown(res.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const AddNew = () => {
    setModalShow(true);
  };

  const reset = () => {
    setModalShow(false);
    setTestingSupplies(initialTestingSupplies);
    clearErrors();
    HookFormReset(initialTestingSupplies);
  };

  const onInputChange = (event: any) => {
    const { name, value } = event.target;
    setTestingSupplies({
      ...testingSupplies,
      [name]: value,
    });
    setValue(name, value);
    clearErrors(name);
  };

  const handleChange = (e: any, name: string) => {
    setTestingSupplies(prev => ({
      ...prev,
      [name]: e.value,
    }));
    setValue(name, e.value);
    clearErrors(name);
  };

  const addTestingSupplies = (e: any) => {
    if (
      itemName !== '' &&
      itemDescription !== '' &&
      itemBarCode !== '' &&
      itemType !== '' &&
      quantityPerItemSet !== '' &&
      quantity !== '' &&
      lowQuantityAlert !== '' &&
      requisitionTypeId !== ''
    ) {
      setIsSubmitting(true);
      (testingSupplies as any).isPhlebotomist =
        testingSupplies.isPhlebotomist === 'true' ? true : false;

      InsuranceService.AddTestingSupplies(testingSupplies)
        .then((res: any) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            reset();
            loadData(true, false);
            setIsSubmitting(false);
          } else {
            toast.error(res?.data?.message);
            setIsSubmitting(false);
          }
        })
        .catch((err: any) => {
          console.log(err, t('err while creating Insurance Provide Assigment'));
          setIsSubmitting(false);
        });
    } else {
      toast.error(t('Please fill all the required details'));
    }
  };

  const DownloadTemplate = () => {
    InsuranceService.DownloadTemplate()
      .then((res: any) => {
        const fileContent = res.data;
        const downloadLink = document.createElement('a');
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
        downloadLink.download = 'Inventory Items Template.xlsx';
        downloadLink.click();
      })
      .catch((error: AxiosError) => {
        console.error(t('Error downloading template:'), error);
      });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...byteArray));

        const filedata: FileData = {
          fileName: '',
          contents: base64String,
        };
        InsuranceService.BulkItemSupplyUpload(filedata).then(
          (res: AxiosResponse) => {
            if (res?.data?.httpStatusCode === 200) {
              toast.success(t('File Uploaded Successfully'));
              loadData(true, false);
            } else {
              toast.error(res?.data?.message);
            }
          }
        );
      };
      reader.readAsArrayBuffer(file);
    }

    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  useEffect(() => {
    loadData(false, false);
    reqTypeLookup();
  }, []);
  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 1) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div id="kt_app_toolbar" className="app-toolbar py-2 pt-lg-3">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <BreadCrumbs />
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <PermissionComponent
              moduleName="Supply Management"
              pageName="Manage Inventory"
              permissionIdentifier="Download"
            >
              <Tooltip title={t('Download Template')} arrow placement="top">
                <button
                  id={`ManageInventoryDownload`}
                  className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                  onClick={DownloadTemplate}
                >
                  <i className="bi bi-download"></i>
                </button>
              </Tooltip>
            </PermissionComponent>
            <PermissionComponent
              moduleName="Supply Management"
              pageName="Manage Inventory"
              permissionIdentifier="Upload"
            >
              <Tooltip title={t('Upload')} arrow placement="top">
                <button
                  id={`ManageInventoryUpload`}
                  className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light"
                  onClick={() =>
                    document.getElementById('ManageInventoryExcelFile')?.click()
                  }
                >
                  <i className="bi bi-cloud-upload"></i>
                </button>
              </Tooltip>
            </PermissionComponent>
            <input
              id={`ManageInventoryExcelFile`}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
      <div className="app-container container-fluid">
        <AddNewItem
          modalShow={modalShow}
          testingSupplies={testingSupplies}
          isSubmitting={isSubmitting}
          addTestingSupplies={addTestingSupplies}
          onInputChange={onInputChange}
          handleChange={handleChange}
          dropdown={dropdown}
          reset={reset}
          itemTypes={itemTypes}
          register={register}
          handleSubmit={handleSubmit}
          handleEnterPress={handleEnterPress}
          handleKeyPressed={handleKeyPressed}
          errors={errors}
        />
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-body py-2">
              <div className="d-flex gap-4 flex-wrap mb-2">
                {searchedTags.map(tag =>
                  tag === 'isPhlebotomist' ? (
                    ''
                  ) : (
                    <div
                      className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light pe-1"
                      onClick={() => handleTagRemoval(tag)}
                    >
                      <span className="fw-bold">
                        {t(queryDisplayTagNames[tag])}
                      </span>
                      <i className="bi bi-x"></i>
                    </div>
                  )
                )}
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
                <div className="d-flex gap-2 responsive-flexed-actions">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-3">{t('Records')}</span>
                    <select
                      className="form-select w-125px h-33px rounded py-2"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-dropdown-parent="#kt_menu_63b2e70320b73"
                      data-allow-clear="true"
                      onChange={e => {
                        setPageSize(parseInt(e.target.value));
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="50" selected>
                        50
                      </option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
                    <div className="mt-0">
                      <PermissionComponent
                        moduleName="Supply Management"
                        pageName="Manage Inventory"
                        permissionIdentifier="AddNew"
                      >
                        <button
                          className="btn btn-primary btn-sm btn-primary--icon px-7"
                          onClick={e => AddNew()}
                        >
                          <span>
                            <i style={{ fontSize: '15px' }} className="fa">
                              &#xf067;
                            </i>
                            <span>{t('Add New')}</span>
                          </span>
                        </button>
                      </PermissionComponent>
                    </div>
                    <div>
                      <AnyPermission
                        moduleName="Supply Management"
                        pageName="Manage Inventory"
                        permissionIdentifiers={[
                          "ExportAllRecords",
                          "ExportSelectedRecords",
                        ]}
                      >
                        <StyledDropButton
                          id="demo-positioned-button2"
                          aria-controls={
                            openDrop ? 'demo-positioned-menu2' : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openDrop ? 'true' : undefined}
                          onClick={event => handleClick(event, 'dropdown2')}
                          className="btn btn-excle btn-sm"
                        >
                          <i
                            style={{
                              color: 'white',
                              fontSize: '20px',
                              paddingLeft: '2px',
                            }}
                            className="fa"
                          >
                            &#xf1c3;
                          </i>
                          <span className="svg-icon svg-icon-5 m-0">
                            <ArrowBottomIcon />
                          </span>
                        </StyledDropButton>
                        <StyledDropMenu
                          id="demo-positioned-menu2"
                          aria-labelledby="demo-positioned-button2"
                          anchorEl={anchorEl.dropdown2}
                          open={Boolean(anchorEl.dropdown2)}
                          onClose={() => handleClose('dropdown2')}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <PermissionComponent
                            moduleName="Supply Management"
                            pageName="Manage Inventory"
                            permissionIdentifier="ExportAllRecords"
                          >
                            <MenuItem
                              onClick={() => {
                                handleClose('dropdown2');
                                downloadAll();
                              }}
                            >
                              <i className="fa text-excle mr-2  w-20px">
                                &#xf1c3;
                              </i>
                              {t('Export All Records')}
                            </MenuItem>
                          </PermissionComponent>
                          <PermissionComponent
                            moduleName="Supply Management"
                            pageName="Manage Inventory"
                            permissionIdentifier="ExportSelectedRecords"
                          >
                            <MenuItem
                              onClick={() => {
                                handleClose('dropdown2');
                                downloadSelected();
                              }}
                            >
                              <i className="fa text-success mr-2 w-20px">
                                &#xf15b;
                              </i>
                              {t('Export Selected Records')}
                            </MenuItem>
                          </PermissionComponent>
                        </StyledDropMenu>
                      </AnyPermission>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2 gap-lg-3 mb-sm-0 mb-2">
                  <button
                    onClick={() => {
                      setCurPage(1);
                      setTriggerSearchData(prev => !prev);
                    }}
                    className="btn btn-linkedin btn-sm fw-500"
                    aria-controls="Search"
                  >
                    {t('Search')}
                  </button>
                  <button
                    onClick={resetSearch}
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                    id="kt_reset"
                  >
                    <span>
                      <span>{t('Reset')}</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="card">
                <Box sx={{ height: 'auto', width: '100%' }}>
                  <ManageInventoryGridData
                    rows={rows}
                    loading={loading}
                    sort={sort}
                    searchRef={searchRef}
                    handleSort={handleSort}
                    setModalShow={setModalShow}
                    setRows={setRows}
                    handleChangeSelectedIds={handleChangeSelectedIds}
                    setTestingSupplies={setTestingSupplies}
                    selectedBox={selectedBox}
                    handleDelete={deleteRecord}
                    searchRequest={searchRequest}
                    onInputChangeSearch={onInputChangeSearch}
                    handleKeyPress={handleKeyPress}
                    handleAllSelect={handleAllSelect}
                    setValue={setValue}
                    selectAll={selectAll}
                  />
                  {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                  <CustomPagination
                    curPage={curPage}
                    nextPage={nextPage}
                    pageNumbers={pageNumbers}
                    pageSize={pageSize}
                    prevPage={prevPage}
                    showPage={showPage}
                    total={total}
                    totalPages={totalPages}
                  />
                  {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageInventory;
