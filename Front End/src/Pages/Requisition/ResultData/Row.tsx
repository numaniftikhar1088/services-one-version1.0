import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Status from 'Shared/Common/Status';
import useLang from 'Shared/hooks/useLanguage';
import { savePdfUrls } from '../../../Redux/Actions/Index';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import { AddIcon, RemoveICon } from '../../../Shared/Icons';
import { useResultDataContext } from '../../../Shared/ResultDataContext';
import { dateFormatConversion } from '../../../Utils/Common/viewRequisitiontabs';
import ResultDataExpandableRow from './ResultDataExpandableRow';

const Row = (props: any) => {
  const { t } = useLang();
  const {
    selectedBox,
    setSelectedBox,
    filterData,
    rowsToExpand,
    setRowsToExpand,
  } = useResultDataContext();

  const dispatch = useDispatch();

  const handleSelectedResultDataIds = (checked: boolean, item: any) => {
    const {
      requisitionId,
      requisitionTypeId,
      facilityId,
      requisitionOrderId,
      resultFile,
    } = item; // Destructure id and accessionNumber from item
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: [
            ...pre.requisitionOrderId,
            {
              requisitionId,
              reqTypeId: requisitionTypeId,
              facilityId,
              requisitionOrderId,
              resultFile,
            },
          ], // Add an object with id and accessionNumber
        };
      });
    } else {
      setSelectedBox((prev: any) => ({
        ...prev,
        requisitionOrderId: prev.requisitionOrderId.filter(
          (selectedItem: any) =>
            selectedItem.requisitionId !== item.requisitionId ||
            selectedItem.reqTypeId !== item.requisitionTypeId ||
            selectedItem.facilityId !== item.facilityId ||
            selectedItem.requisitionOrderId !== item.requisitionOrderId
        ),
      }));
    }
  };

  const openInNewTab = (url: any) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {filterData.tabId === 1 || filterData.tabId === 2 ? (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
            >
              {rowsToExpand?.includes(props?.RowData?.requisitionOrderId) ? (
                <button
                  onClick={() => {
                    if (
                      rowsToExpand?.includes(props?.RowData?.requisitionOrderId)
                    ) {
                      setRowsToExpand(
                        rowsToExpand.filter(
                          val => val !== props?.RowData?.requisitionOrderId
                        )
                      );
                    }
                  }}
                  id={`ResultDataHide_${props?.RowData.requisitionOrderId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRowsToExpand(prev => [
                      ...prev,
                      props?.RowData?.requisitionOrderId,
                    ]);
                  }}
                  id={`ResultDataShow_${props?.RowData.requisitionOrderId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          </TableCell>
        ) : null}
        <TableCell style={{ width: '49px' }}>
          <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
            <input
              id={`ResultDataCheckBox_${props?.RowData.requisitionOrderId}`}
              className="form-check-input"
              type="checkbox"
              checked={selectedBox?.requisitionOrderId?.find(
                (item: any) =>
                  item?.requisitionOrderId ===
                  props?.RowData?.requisitionOrderId
              )}
              onChange={e =>
                handleSelectedResultDataIds(e.target.checked, props?.RowData)
              }
            />
          </label>
        </TableCell>
        {props?.tabsInfo &&
          props?.tabsInfo.map((tabData: any) => (
            <>
              {tabData.isShowOnUi && !tabData.isExpandData && tabData.isShow ? (
                <>
                  {tabData?.columnKey === 'view' ? (
                    <TableCell className="text-center">
                      <div className="d-flex justify-content-center">
                        <PermissionComponent
                          moduleName="ID LIS"
                          pageName="Result Data"
                          permissionIdentifier="View"
                        >
                          <button
                            id={`ResultDataView_${props?.RowData.requisitionOrderId}`}
                            role="link"
                            className="btn btn-sm fw-bold btn-warning fs-12px py-0 fw-500 align-items-center d-flex"
                            onClick={() => {
                              const tokenData: any =
                                sessionStorage.getItem('userinfo');
                              localStorage.setItem('userinfo', tokenData);
                              openInNewTab(
                                `/OrderView/${btoa(
                                  props?.RowData?.requisitionId
                                )}/${btoa(props.RowData?.requisitionOrderId)}`
                              );
                            }}
                          >
                            {t('View')}
                          </button>
                        </PermissionComponent>
                      </div>
                    </TableCell>
                  ) : props?.RowData?.[tabData?.columnKey]?.includes(
                      'https://truemedpo.blob.core.windows.net'
                    ) ||
                    props?.RowData?.[tabData?.columnKey]?.includes(
                      'https://digitalrequsitions.blob.core.windows.net'
                    ) ? (
                    <TableCell
                      id={`ResultDataResultFileCell_${props?.RowData.requisitionOrderId}`}
                    >
                      <div className="d-flex justify-content-center">
                        {props.RowData?.resultFile && filterData.tabId !== 1 ? (
                          <Link to={`/docs-viewer`} target="_blank">
                            <i
                              id={`ResultDataResultFile_${props?.RowData.requisitionOrderId}`}
                              className="bi bi-file-earmark-pdf text-danger fa-2x cursor-pointer"
                              onClick={() => {
                                dispatch(
                                  savePdfUrls(props?.RowData?.resultFile)
                                );
                              }}
                            ></i>
                          </Link>
                        ) : null}
                      </div>
                    </TableCell>
                  ) : tabData?.columnKey === 'lisStatus' ? (
                    <TableCell
                      id={`ResultDataStatus_${props?.RowData.requisitionOrderId}`}
                    >
                      <Status
                        cusText={props?.RowData?.[tabData?.columnKey]}
                        cusClassName={
                          props?.RowData?.[tabData?.columnKey] === t('Pending')
                            ? 'badge-status-pending'
                            : props?.RowData?.[tabData?.columnKey] ===
                                t('Ready to Publish')
                              ? 'badge-status-ready-to-publish'
                              : props?.RowData?.[tabData?.columnKey] ===
                                  t('Final')
                                ? 'badge-status-final'
                                : props?.RowData?.[tabData?.columnKey] ===
                                    t('Corrected')
                                  ? 'badge-status-corrected'
                                  : 'badge-status-default'
                        }
                      />
                    </TableCell>
                  ) : (
                    <TableCell
                      id={`ResultData${tabData?.columnKey}_${props?.RowData.requisitionOrderId}`}
                    >
                      {dateFormatConversion(props?.RowData, tabData?.columnKey)}
                    </TableCell>
                  )}
                </>
              ) : null}
            </>
          ))}
      </TableRow>
      <TableRow>
        <TableCell colSpan={13} className="padding-0">
          <Collapse
            in={rowsToExpand?.includes(props?.RowData?.requisitionOrderId)}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white">
                    <ResultDataExpandableRow
                      row={props?.RowData}
                      requisitionId={props?.RowData.requisitionId}
                      reqTypeId={props?.RowData.requisitionTypeId}
                      facilityId={props?.RowData.facilityId}
                      requisitionOrderId={props?.RowData?.requisitionOrderId}
                      PathogensList={props?.RowData?.pathogens}
                      key={props?.RowData?.requisitionOrderId}
                    />
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default memo(Row);
