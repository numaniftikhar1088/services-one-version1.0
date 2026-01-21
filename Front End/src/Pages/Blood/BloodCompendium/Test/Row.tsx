import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { validateFields } from 'Pages/LIS/Toxicology/CommonFunctions';
import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import useLang from 'Shared/hooks/useLanguage';
import { saveAllTestsSetup } from '../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium';
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from '../../../../Shared/Icons';
import { reactSelectSMStyle, styles } from '../../../../Utils/Common';
import ExpandRow from './ExpandRow';

function Row(props: any) {
  const { t } = useLang();

  const {
    row,
    rows,
    index,
    setRows,
    lookups,
    getAllTestsSetup,
    queryDisplayTagNames,
    setIsAddButtonDisabled,
  } = props;

  const { labRef, TestTypesLookup, resultMethodNameLookups } = lookups;

  const [open, setOpen] = useState(false);

  const getValues = (r: any) => {
    const rowIndex = rows.findIndex((row: any) => row.testId === r.testId);

    if (rowIndex !== -1) {
      const updatedRows = rows.map((row: any) => {
        if (row.testId === r.testId) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const handleChange = (
    name: string,
    value: string,
    testId: number,
    masterId?: number
  ) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.testId === testId
          ? {
              ...x,
              ...(name === 'testType' &&
                value === 'Panel' && {
                  resultMethod: '',
                  instrumentName: '',
                }),
              ...(masterId && {
                instrumentMasterId: String(masterId),
              }),
              [name]: value,
            }
          : x
      )
    );
  };

  const saveBloodTestSetups = async () => {
    const objIndividual = {
      testName: row.testName,
      testType: row.testType,
      labId: row.labId,
      testCode: row.testCode,
    };
    const objPanel = {
      testName: row.testName,
      testType: row.testType,
      labId: row.labId,
      testCode: row.testCode,
    };
    const { isValid, invalidField } = validateFields(
      row?.testType === 'Panel' ? objPanel : objIndividual
    );

    if (isValid) {
      try {
        const labName = labRef.find(function (option: any) {
          return option.value === row?.labId;
        }).label;
        const response = await saveAllTestsSetup({ ...row, labName });

        if (response?.data?.httpStatusCode === 200) {
          toast.success(t('Successfully added'));
          setIsAddButtonDisabled(false);
          getAllTestsSetup(false);
        } else if (response?.data?.httpStatusCode === 400) {
          toast.error(t(response?.data?.status));
          setIsAddButtonDisabled(false);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const errorMessage = invalidField
        ? t(`Please Fill ${queryDisplayTagNames[invalidField] ?? ''} field`)
        : t('Invalid field found');
      toast.error(t(errorMessage));
    }
  };
  console.log(row, 'rowrow');

  return (
    <>
      <TableRow className="h-30px" key={row.testId}>
        <TableCell>
          {row.rowStatus ? null : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
              }}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
            >
              {open ? (
                <button
                  id={`BloodCompendiumDataTestSetupExpandClose_${row.testId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`BloodCompendiumDataTestSetupExpandOpen_${row.testId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          )}
        </TableCell>
        <TableCell className="text-center">
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  <button
                    id={`BloodCompendiumDataTestSetupSave`}
                    onClick={() => saveBloodTestSetups()}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    id={`BloodCompendiumDataTestSetupCancel`}
                    onClick={() => {
                      if (row.testId !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.testId === row.testId) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        getAllTestsSetup(false);
                      } else {
                        const newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                    }}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                </div>
              </>
            ) : (
              <div className="rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`BloodCompendiumDataTestSetup3Dots_${row.testId}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <Dropdown.Item
                    id={`BloodCompendiumDataTestSetupEdit`}
                    className="w-auto"
                    eventKey="2"
                    onClick={() => getValues(row)}
                  >
                    <i className={'fa fa-edit text-primary mr-2'}></i>
                    {t('Edit')}
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`BloodCompendiumDataTestSetupTestName_${row.testId}`}
          sx={{ width: 'max-content', whiteSpace: 'nowrap' }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`BloodCompendiumDataTestSetupTestName`}
                  type="text"
                  name="testName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t('Test Name')}
                  value={row.testName}
                  onChange={(event: any) =>
                    handleChange('testName', event.target.value, row?.testId)
                  }
                />
              </div>
            </div>
          ) : (
            row?.testName
          )}
        </TableCell>
        <TableCell
          id={`BloodCompendiumDataTestSetupTestType_${row.testId}`}
          sx={{ width: 'max-content', whiteSpace: 'nowrap' }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`BloodCompendiumDataTestSetupTestType`}
                  menuPortalTarget={document.body}
                  placeholder={t('Select...')}
                  name="testType"
                  theme={theme => styles(theme)}
                  options={TestTypesLookup}
                  styles={reactSelectSMStyle}
                  onChange={(event: any) =>
                    handleChange('testType', event.value, row?.testId)
                  }
                  value={TestTypesLookup.filter(function (option: any) {
                    return option.value === row?.testType;
                  })}
                />
              </div>
            </div>
          ) : (
            row?.testType
          )}
        </TableCell>
        <TableCell
          id={`BloodCompendiumDataTestSetupPerformingLab_${row.testId}`}
          sx={{ width: 'max-content', whiteSpace: 'nowrap' }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`BloodCompendiumDataTestSetupPerformingLab`}
                  menuPortalTarget={document.body}
                  name="labId"
                  theme={theme => styles(theme)}
                  placeholder={t('Select...')}
                  options={labRef}
                  styles={reactSelectSMStyle}
                  onChange={(event: any) =>
                    handleChange('labId', event.value, row?.testId)
                  }
                  value={labRef.filter(function (option: any) {
                    return option.value === row?.labId;
                  })}
                />
              </div>
            </div>
          ) : (
            row?.labName
          )}
        </TableCell>
        <TableCell
          id={`BloodCompendiumDataTestSetupResultMethod_${row.testId}`}
          sx={{ width: 'max-content', whiteSpace: 'nowrap' }}
        >
          {row?.rowStatus ? (
            <div className="d-flex gap-1">
              <Select
                inputId={`BloodCompendiumDataTestSetupResultMeethodName`}
                menuPortalTarget={document.body}
                theme={theme => styles(theme)}
                options={resultMethodNameLookups}
                styles={reactSelectSMStyle}
                placeholder={t('Select...')}
                value={resultMethodNameLookups.filter(function (option: any) {
                  return option.label === row?.testMethod;
                })}
                isDisabled={true}
              />
            </div>
          ) : (
            row?.testMethod
          )}
        </TableCell>
        <TableCell id={`BloodCompendiumDataTestSetupTestCode_${row.testId}`}>
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`BloodCompendiumDataTestSetupTestCode`}
                type="text"
                name="testCode"
                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                placeholder={t('Test Code')}
                value={row.testCode}
                onChange={(event: any) =>
                  handleChange('testCode', event.target.value, row?.testId)
                }
              />
            </div>
          ) : (
            row?.testCode
          )}
        </TableCell>
        <TableCell id={`BloodCompendiumDataTestSetupOrderCode_${row.testId}`}>
          {row?.rowStatus ? (
            <input
              id={`BloodCompendiumDataTestSetupOrderCode`}
              type="text"
              name="orderCode"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
              placeholder={t('Order Code')}
              value={row.orderCode}
              onChange={(event: any) =>
                handleChange('orderCode', event.target.value, row?.testId)
              }
            />
          ) : (
            row?.orderCode
          )}
        </TableCell>
        <TableCell id={`BloodCompendiumDataTestSetupTmitCode_${row.testId}`}>
          {row?.rowStatus ? (
            <input
              id={`BloodCompendiumDataTestSetupTmitCode`}
              type="text"
              name="tmitCode"
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
              placeholder={t('TMIT Code')}
              value={row.tmitCode}
              onChange={(event: any) =>
                handleChange('tmitCode', event.target.value, row?.testId)
              }
            />
          ) : (
            row?.tmitCode
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={12} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-9 bg-white">
                    <ExpandRow
                      row={row}
                      setOpen={setOpen}
                      getAllTestsSetup={getAllTestsSetup}
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
}

export default Row;
