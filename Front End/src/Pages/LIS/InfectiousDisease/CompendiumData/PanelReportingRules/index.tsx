import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import PanelReportingRulesService from '../../../../../Services/InfectiousDisease/PanelReportingRulesService';
import { Loader } from '../../../../../Shared/Common/Loader';
import NoRecord from '../../../../../Shared/Common/NoRecord';
import PermissionComponent, { AnyPermission } from '../../../../../Shared/Common/Permissions/PermissionComponent';
import { ArrowDown, ArrowUp } from '../../../../../Shared/Icons';
import ArrowBottomIcon from '../../../../../Shared/SVG/ArrowBottomIcon';
import { StringRecord } from '../../../../../Shared/Type';
import useLang from 'Shared/hooks/useLanguage';
import {
  StyledDropButton,
  StyledDropMenu,
} from '../../../../../Utils/Style/Dropdownstyle';
import { SortingTypeI, sortById } from '../../../../../Utils/consts';
import Row, { ITableObj } from './Row';
import useIsMobile from 'Shared/hooks/useIsMobile';
export interface IRows {
  id: number;
  name: string;
  ageRange: string;
  negative: string;
  low: string;
  medium: string;
  high: string;
  criticalhigh: string;
  ampScore: number;
  cqConf: number;
  createDate: string;
  rowStatus: boolean | undefined;
  lowQualitative: string;
  mediumQualitative: string;
  highQualitative: string;
  criticalHighQualitative: string;
}
export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

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
    loadGridData(true, false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>(() => []);

  useEffect(() => {
    loadGridData(true, true);
  }, []);

  const handleChange = (name: string, value: string, id: number) => {
    setRows(curr =>
      curr.map(x =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };

  ////////////-----------------Section For Searching-------------------///////////////////
  const initialSearchQuery = {
    name: '',
    ageRange: '',
    negative: '',
    low: '',
    medium: '',
    high: '',
    criticalhigh: '',
    ampScore: null,
    cqConf: null,
    ampStatus: null,
    roxSignal: null,
    lowQualitative: '',
    mediumQualitative: '',
    highQualitative: '',
    criticalHighQualitative: '',
  };
  const queryDisplayTagNames: StringRecord = {
    name: 'Reporting Rule Name',
    ageRange: 'Age Range',
    negative: 'Negative',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    criticalhigh: 'Critical High',
    ampScore: 'Amp Score',
    cqConf: 'Cq Conf',
    ampStatus: 'Amp Status',
    roxSignal: 'Rox Signal',
    lowQualitative: 'Low Qualitative',
    mediumQualitative: 'Medium Qualitative',
    highQualitative: 'High Qualitative',
    criticalHighQualitative: 'Critical High Qualitative',
  };

  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }

  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    setIsAddButtonDisabled(false);

    const nullObj = {
      name: '',
      ageRange: '',
      negative: '',
      low: '',
      medium: '',
      high: '',
      criticalhigh: '',
      ampScore: 0,
      cqConf: 0,
      lowQualitative: '',
      mediumQualitative: '',
      highQualitative: '',
      criticalHighQualitative: '',
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );

    PanelReportingRulesService.getPanelReportingRules({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);

        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  ////////////-----------------Get All Data-------------------//////////////////

  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: ITableObj) => {
    const isValidRange = (value: string) => {
      // Check if the format is exactly xx.xx-xx.xx
      const regex = /^\d{2}\.\d{2}-\d{2}\.\d{2}$/;
      // const regex = /^(\d{2}\.\d{2}-\d{2}\.\d{2}|)$/ ;
      return regex.test(value);
    };

    if (
      !row?.name ||
      !row?.negative ||
      // !row?.low ||
      // !row?.medium ||
      !row?.high
      // !row?.criticalhigh ||
      // !row?.ampScore
    ) {
      toast.error(t('Please Enter All The Required Fields'));
      return;
    }

    // Array of all the range values
    const ranges = [
      row?.low,
      row?.medium,
      row?.high,
      row?.criticalhigh,
      row?.negative,
    ];

    // Check if any of the ranges are empty or not in the correct format
    const allRangesValid = ranges.every(range => range && isValidRange(range));

    if (row?.low && row?.medium && row?.criticalhigh && !allRangesValid) {
      toast.error(
        t('Please Enter Fields in correct format. Expected format: xx.xx-xx.xx')
      );
      return;
    }
    const queryModel = {
      id: row.id,
      name: row.name,
      ageRange: row.ageRange,
      negative: row.negative,
      low: row.low,
      medium: row.medium,
      high: row.high,
      criticalhigh: row.criticalhigh,
      ampScore: row.ampScore ? row.ampScore : null,
      cqConf: row.cqConf,
      ampStatus: row.ampStatus,
      roxSignal: row.roxSignal,
      lowQualitative: row.lowQualitative,
      mediumQualitative: row.mediumQualitative,
      highQualitative: row.highQualitative,
      criticalHighQualitative: row.criticalHighQualitative,
    };
    PanelReportingRulesService.createOrUpdatePanelReportingRules(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
          setIsAddButtonDisabled(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  ////////////-----------------Save a Row-------------------///////////////////

  ////////////-----------------Delete a Row-------------------///////////////////
  const deleteRow = (id: number) => {};
  ////////////-----------------Delete a Row-------------------///////////////////

  const handleAllSelect = (checked: boolean, rows: any) => {
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.id);
    });

    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: [],
        };
      });
    }
  };
  const handleChangePanelReportingId = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: [...selectedBox.id, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: selectedBox.id.filter((item: any) => item !== id),
        };
      });
    }
  };

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
  const [selectedBox, setSelectedBox] = useState<any>({
    id: [],
  });
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
    PanelReportingRulesService.panelReportingExportToExcel({
      queryModel: searchRequest,
    }).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res?.data?.message));
        base64ToExcel(res.data.data.fileContents, 'Panel Reporting Rule');
      } else {
        toast.error(t(res?.data?.message));
      }
    });
  };

  const downloadSelected = () => {
    if (selectedBox.id.length > 0) {
      const payLoad = {
        selectedRow: selectedBox.id,
        queryModel: searchRequest,
      };
      PanelReportingRulesService.panelReportingExportToExcel(payLoad).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(res.data.data.fileContents, 'Panel Reporting Rule');
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t('Select atleast one record'));
    }
  };
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  useEffect(() => {
    loadGridData(true, false);
  }, [sort]);

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest(prevSearchRequest => {
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
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-1">
        {searchedTags.map(tag => (
          <div
            className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
            onClick={() => handleTagRemoval(tag)}
          >
            <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
            <i className="bi bi-x"></i>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-2">{t('Records')}</span>
            <select
              id={`IDCompendiumDataPanelReportingRecords`}
              className="form-select w-sm-125px w-90px h-33px rounded py-2"
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
          <div>
            <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
              <div className="mt-0">
                <PermissionComponent
                  moduleName="ID LIS"
                  pageName="Compendium Data"
                  permissionIdentifier="AddNew"
                >
                  <Button
                    id={`IDCompendiumDataPanelReportingAddRow`}
                    onClick={() => {
                      if (!isAddButtonDisabled) {
                        setRows((prevRows: any) => [
                          //createData("", "", "", "--select", "", "", "--select", "", true),
                          {
                            id: 0,
                            name: '',
                            ageRange: '',
                            negative: '',
                            low: '',
                            medium: '',
                            high: '',
                            criticalhigh: '',
                            ampScore: null,
                            cqConf: null,
                            ampStatus: null,
                            roxSignal: null,
                            lowQualitative: '',
                            mediumQualitative: '',
                            highQualitative: '',
                            criticalHighQualitative: '',
                            rowStatus: true,
                          },
                          ...prevRows,
                        ]);
                        setIsAddButtonDisabled(true);
                      }
                    }}
                    variant="contained"
                    color="success"
                    className="btn btn-primary btn-sm text-capitalize fw-400"
                    disabled={loading}
                    sx={{
                      '&.Mui-disabled': {
                        opacity: '0.65',
                        backgroundColor: '#69A54B',
                        color: 'white',
                      },
                    }}
                  >
                    <i className="bi bi-plus-lg"></i>
                    {t('Add New')}
                  </Button>
                </PermissionComponent>
              </div>
              <AnyPermission
                moduleName="ID LIS"
                pageName="Compendium Data"
                permissionIdentifiers={[
                  "ExportAllRecords",
                  "ExportSelectedRecords",
                ]}
              >
                <StyledDropButton
                  id={`IDCompendiumDataPanelReportingExportRecords`}
                  aria-controls={openDrop ? 'demo-positioned-menu2' : undefined}
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
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="ExportAllRecords"
                  >
                    <MenuItem className="p-0">
                      <a
                        id={`IDCompendiumDataPanelReportingExportAllRecords`}
                        className="p-0 w-200px text-dark"
                        onClick={() => {
                          handleClose('dropdown2');
                          downloadAll();
                        }}
                      >
                        {t('Export All Records')}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="ExportSelectedRecords"
                  >
                    <MenuItem className="p-0">
                      <a
                        className="p-0 text-dark w-200px"
                        onClick={() => {
                          handleClose('dropdown2');
                          downloadSelected();
                        }}
                      >
                        {t('Export Selected Records')}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                </StyledDropMenu>
              </AnyPermission>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`IDCompendiumDataPanelReportingSearch`}
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
              id={`IDCompendiumDataPanelReportingReset`}
            >
              <span>
                <span>{t('Reset')}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div
            className="table_bordered overflow-hidden "
            style={{ borderBottom: 'none' }}
          >
            <TableContainer
              sx={
                
                isMobile ? {}:
                
                {
                maxHeight: 'calc(100vh - 100px)',
                '&::-webkit-scrollbar': {
                  width: 7,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#fff',
                },
                '&:hover': {
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--kt-gray-400)',
                    borderRadius: 2,
                  },
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'var(--kt-gray-400)',
                  borderRadius: 2,
                },
              }}
              // component={Paper}
              className="shadow-none"
            // sx={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <Table
                // stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingRuleName`}
                        type="text"
                        name="name"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.name}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingAgeRange`}
                        type="text"
                        name="ageRange"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.ageRange}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingNegative`}
                        type="text"
                        name="negative"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.negative}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingLow`}
                        type="text"
                        name="low"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.low}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingMedium`}
                        type="text"
                        name="medium"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.medium}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingHigh`}
                        type="text"
                        name="high"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.high}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingCriticalhigh`}
                        type="text"
                        name="criticalhigh"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.criticalhigh}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingAmpScore`}
                        type="text"
                        name="ampScore"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={
                          searchRequest.ampScore == null
                            ? ''
                            : searchRequest.ampScore
                        }
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingCqConf`}
                        type="text"
                        name="cqConf"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={
                          searchRequest.cqConf == null
                            ? ''
                            : searchRequest.cqConf
                        }
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingAmpStatus`}
                        type="text"
                        name="ampStatus"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={
                          searchRequest.ampStatus == null
                            ? ''
                            : searchRequest.ampStatus
                        }
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingroxSignal`}
                        type="text"
                        name="roxSignal"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={
                          searchRequest.roxSignal == null
                            ? ''
                            : searchRequest.roxSignal
                        }
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingLowQualitative`}
                        type="text"
                        name="lowQualitative"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.lowQualitative}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingMediumQualitative`}
                        type="text"
                        name="mediumQualitative"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.mediumQualitative}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingHighQualitative`}
                        type="text"
                        name="highQualitative"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.highQualitative}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingCriticalHighQualitative`}
                        type="text"
                        name="criticalHighQualitative"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.criticalHighQualitative}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell className="w-20px min-w-20px" />
                    <TableCell className="w-25px min-w-25px">
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          id={`IDCompendiumDataPanelReportingCheckAll`}
                          className="form-check-input"
                          type="checkbox"
                          onChange={e =>
                            handleAllSelect(e.target.checked, rows)
                          }
                        />
                      </label>
                    </TableCell>
                    <TableCell className="min-w-50px">{t('Actions')}</TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('name')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Reporting Rule Name')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'name'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'name'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('ageRange')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Age Range')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'ageRange'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'ageRange'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('negative')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Negative')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'negative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'negative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('low')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('Low')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'low'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'low'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('medium')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Medium')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'medium'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'medium'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('high')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('High')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'high'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'high'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('criticalhigh')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Critical High')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'criticalhigh'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'criticalhigh'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('ampScore')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Amp Score')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'ampScore'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'ampScore'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('cqConf')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Cq Conf')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'cqConf'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'cqConf'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('ampStatus')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Amp Status')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'ampStatus'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'ampStatus'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('roxSignal')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Rox Signal')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                                sort.clickedIconData === 'roxSignal'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                                sort.clickedIconData === 'roxSignal'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('lowQualitative')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Low Qualitative')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'lowQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'lowQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('mediumQualitative')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Medium Qualitative')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'mediumQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'mediumQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('highQualitative')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('High Qualitative')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'highQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'highQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('criticalHighQualitative')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Critical High Qualitative')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'criticalHighQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'criticalHighQualitative'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={18} className="">
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((item: any, index) => {
                      return (
                        <Row
                          row={item}
                          index={index}
                          rows={rows}
                          setRows={setRows}
                          handleChange={handleChange}
                          handleDelete={deleteRow}
                          handleSubmit={handleSubmit}
                          loadGridData={loadGridData}
                          handleChangePanelReportingId={
                            handleChangePanelReportingId
                          }
                          selectedBox={selectedBox}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={18} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
      <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
        <p className="pagination-total-record mb-0">
          {Math.min(pageSize * curPage, total) === 0 ? (
            <span>
              {t('Showing 0 to 0 of')} {total} {t('entries')}
            </span>
          ) : (
            <span>
              {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}
              {Math.min(pageSize * curPage, total)} {t('of Total')}
              <span> {total} </span> {t('entries')}
            </span>
          )}
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
          <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
            <i className="fa fa-angle-double-left"></i>
          </li>
          <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
            <i className="fa fa-angle-left"></i>
          </li>

          {pageNumbers.map(page => (
            <li
              key={page}
              className={`px-2 ${
                page === curPage
                  ? 'font-weight-bold bg-primary text-white h-33px'
                  : ''
                }`}
              style={{ cursor: 'pointer' }}
              onClick={() => showPage(page)}
            >
              {page}
            </li>
          ))}

          <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
            <i className="fa fa-angle-right"></i>
          </li>
          <li
            className="btn btn-lg p-2 h-33px"
            onClick={() => {
              if (totalPages === 0) {
                showPage(curPage);
              } else {
                showPage(totalPages);
              }
            }}
          >
            <i className="fa fa-angle-double-right"></i>
          </li>
        </ul>
      </div>

      {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
    </>
  );
}
