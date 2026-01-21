import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Table from '@mui/material/Table';
import { useEffect, useMemo, useState } from 'react';
import PatientService from '../../Services/PatientService/PatientService';
import { Loader } from '../../Shared/Common/Loader';
import NoRecord from '../../Shared/Common/NoRecord';
import useLang from 'Shared/hooks/useLanguage';
export const NormalizedData = (obj: any, key: any) => {
  if (!obj || !key) return undefined;
  const normalizedKey = Object.keys(obj).find(
    (k: any) => k.toLowerCase() === key.toLowerCase()
  );
  return normalizedKey ? obj[normalizedKey] : undefined;
};
interface PatientReqOrderProps {
  patientId: number;
  expandableColumnsHeader: any;
}

function PatientReqOrder({
  patientId,
  expandableColumnsHeader,
}: PatientReqOrderProps) {
  const { t } = useLang();
  const [expandedTbData, setExpandedTbData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getPatientReqOrder = async () => {
    const response = await PatientService.getPatientRequisitionOrder(patientId);
    if (response?.data?.data) {
      setExpandedTbData(response?.data?.data);
      setLoading(false);
    }
  };
  const visibleColumns = useMemo(
    () =>
      (expandableColumnsHeader ?? []).filter(
        (c: any) => c.isShowOnUi && c.isExpandData
      ),
    [expandableColumnsHeader]
  );
  const openInNewTab = (url: any) => {
    window.open(url, '_blank', 'noreferrer');
  };
  const columnCount = visibleColumns.length + 1;
  useEffect(() => {
    getPatientReqOrder();
  }, []);

  return (
    <div
      id="kt_app_content_container"
      className="app-container container-fluid"
    >
      <div className="table_bordered overflow-hidden">
        <TableContainer
          sx={{
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
          component={Paper}
          className="shadow-none"
        >
          <Table
            stickyHeader
            aria-label="sticky table collapsible"
            className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
          >
            <TableHead
              className="h-35px"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <TableRow>
                {visibleColumns.map((column: any) => (
                  <TableCell className="min-w-200px" key={column.columnKey}>
                    {t(column.columnLabel)}
                  </TableCell>
                ))}
                {/* Append the static View column header */}
                <TableCell
                  className="min-w-120px"
                  key="__view_header"
                  align="center"
                >
                  {t('View')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableCell colSpan={columnCount}>
                  <Loader />
                </TableCell>
              ) : !expandedTbData.length ? (
                <NoRecord
                  message={'No Open Requisition Orders Found For This Patient.'}
                />
              ) : (
                expandedTbData.map((item: any, rowIdx: number) => {
                  return (
                    <TableRow key={item?.RequisitionId ?? rowIdx}>
                      {visibleColumns.map((column: any) => (
                        <TableCell
                          className="min-w-200px"
                          key={`${column.columnKey}-${rowIdx}`}
                        >
                          {item[column?.columnKey] ?? null}
                        </TableCell>
                      ))}

                      {/* Append the static View action cell */}
                      <TableCell
                        className="min-w-120px"
                        key={`__view_cell-${rowIdx}`}
                        align="center"
                      >
                        <button
                          id={`PatientDemoGraphicOrderView-${item?.RequisitionId ?? rowIdx}`}
                          className="btn btn-warning btn-sm fw-500 text-white"
                          onClick={() => {
                            openInNewTab(
                              `/OrderView/${btoa(item?.RequisitionId)}/${btoa(
                                item?.RequisitionOrderID
                              )}`
                            );
                          }}
                        >
                          {t('View')}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default PatientReqOrder;
