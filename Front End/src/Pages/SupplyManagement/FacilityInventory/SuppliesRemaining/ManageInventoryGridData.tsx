import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import NoRecord from "../../../../Shared/Common/NoRecord";
import { Loader } from "../../../../Shared/Common/Loader";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";

function ManageInventoryGridData(props: {
  rows: any;
  setRows: any;
  loading: boolean;
  sort: any;
  searchRequest: any;
  onInputChangeSearch: any;
  handleKeyPress: any;
  handleSort: any;
  searchRef: any;
}) {
  const { t } = useLang();

  const {
    rows,
    loading,
    sort,
    searchRequest,
    onInputChangeSearch,
    handleKeyPress,
    handleSort,
    searchRef,
  } = props;

  return (
    <div className="table_bordered overflow-hidden">
      <TableContainer
        sx={{
          maxHeight: "calc(100vh - 100px)",
          "&::-webkit-scrollbar": {
            width: 7,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#fff",
          },
          "&:hover": {
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--kt-gray-400)",
              borderRadius: 2,
            },
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--kt-gray-400)",
            borderRadius: 2,
          },
        }}
        // component={Paper}
        className="shadow-none"
        // sx={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        <Table
          aria-label="sticky table collapsible"
          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
        >
          <TableHead>
            <TableRow className="h-40px">
              <TableCell></TableCell>
              <TableCell>
                <input
                  id={`FaclityInventorySearchFacilityName`}
                  type="text"
                  name="name"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.name}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
            </TableRow>
            <TableRow className="h-30px">
              <TableCell></TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("label")}
                  className="d-flex justify-content-between cursor-pointer min-w-250px"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Facility Name")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "label"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "label"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableCell colSpan={11} className="">
                {/* <Splash /> */}
                <Loader />
              </TableCell>
            ) : rows.length ? (
              rows?.map((row: any) => <Row row={row} key={row.value} />)
            ) : (
              <NoRecord colSpan={11} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageInventoryGridData;
