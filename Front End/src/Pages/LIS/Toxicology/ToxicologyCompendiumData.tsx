import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { AxiosResponse } from 'axios';
import * as React from 'react';
import { useState } from 'react';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import { useDataContext } from '../../../Shared/DataContext';
import usePagination from '../../../Shared/hooks/usePagination';
import { SortingTypeI, sortById } from '../../../Utils/consts';
import { AutocompleteStyle } from '../../../Utils/MuiStyles/AutocompleteStyles';
import ConfirmationData from './ConfirmationData';
import { Nav } from './Nav';
import { PanelMappingTable } from './PanelMapping';
import ReflexRules from './ReflexRules';
import { ScreenData } from './ScreenData/ScreenData';
import ScreenTestSetup from './ScreenTestSetup';
import { ValidityData } from './ValidityData/ValidityData';
import useLang from 'Shared/hooks/useLanguage';

const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const ToxicologyCompendiumData: React.FC<{}> = () => {
  const { t } = useLang();
  const [loading, setLoading] = useState<boolean>(true);
  const initialSearchQuery = {
    PerformingLabId: 0,
    PanelTypeId: 0,
    PanelName: '',
    PanelCode: '',
    SpecimenTypeID: 0,
    TestName: '',
    DrugClass: '',
    TestCode: '',
    GroupName: '',
    Unit: '',
    Cutoff: 0,
    Linearity: 0,
    Id: 0,
  };
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [toxPanelMappingData, setToxPanelMappingData] = useState<any>([]);
  const {
    curPage,
    pageSize,
    setTotal,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setCurPage,
  } = usePagination();
  const LoadPanelMappingData = async (reset: boolean) => {
    setLoading(true);

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchQuery).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    await RequisitionType.ToxCompendiumGetAll({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: sort?.clickedIconData,
      sortDirection: sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          setTotal(res?.data?.totalRecord);
          setToxPanelMappingData(res?.data.result);
        }
      })
      .catch((err: any) => {
        console.trace(err, 'err');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { value1, handleChange, a11yProps } = useDataContext();
  console.log(value1, 'oiuytr9878');
  React.useLayoutEffect(() => {
    if (value1 === 0) {
      setSearchQuery(initialSearchQuery);
    }
  }, [value1]);

  return (
    <>
      <Nav tabIndex={value1} LoadPanelMappingData={LoadPanelMappingData} />
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            <Tabs
              value={value1}
              onChange={handleChange}
              TabIndicatorProps={{ style: { background: 'transparent' } }}
              className="min-h-auto"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-scrollButtons': {
                  width: 0,
                  transition: 'width 0.7s ease',
                  '&:not(.Mui-disabled)': {
                    width: '48px',
                  },
                },
              }}
            >
              <TabSelected
                label={t('Panel Mapping')}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id="PanelMaping"
              />
              <TabSelected
                label={t('Confirmation Data')}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id="ConfirmationData"
              />
              <TabSelected
                label={t('Screen Test Setup')}
                {...a11yProps(2)}
                className="fw-bold text-capitalize"
                id="ScreenTestSetup"
              />
              <TabSelected
                label={t('Screen Data')}
                {...a11yProps(3)}
                className="fw-bold text-capitalize"
                id="ScreenData"
              />
              <TabSelected
                label={t('Validity Data')}
                {...a11yProps(4)}
                className="fw-bold text-capitalize"
                id="ValidityData"
              />
              <TabSelected
                label={t('Reflex Rules')}
                {...a11yProps(5)}
                className="fw-bold text-capitalize"
                id="ReflexRules"
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body py-2">
                <TabPanel value={value1} index={0}>
                  <PanelMappingTable
                    LoadPanelMappingData={LoadPanelMappingData}
                    setTotal={setTotal}
                    setToxPanelMappingData={setToxPanelMappingData}
                    toxPanelMappingData={toxPanelMappingData}
                    setLoading={setLoading}
                    loading={loading}
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                    curPage={curPage}
                    pageSize={pageSize}
                    setSorting={setSorting}
                    sort={sort}
                    total={total}
                    initialSearchQuery={initialSearchQuery}
                    totalPages={totalPages}
                    pageNumbers={pageNumbers}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    showPage={showPage}
                    setPageSize={setPageSize}
                    setCurPage={setCurPage}
                  />
                </TabPanel>
                <TabPanel value={value1} index={1}>
                  <ConfirmationData />
                </TabPanel>
                <TabPanel value={value1} index={2}>
                  <ScreenTestSetup />
                </TabPanel>
                <TabPanel value={value1} index={3}>
                  <ScreenData />
                </TabPanel>
                <TabPanel value={value1} index={4}>
                  <ValidityData />
                </TabPanel>
                <TabPanel value={value1} index={5}>
                  <ReflexRules />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToxicologyCompendiumData;
