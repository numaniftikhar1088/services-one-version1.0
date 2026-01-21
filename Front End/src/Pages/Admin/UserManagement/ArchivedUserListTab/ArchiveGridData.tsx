import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

function ArchiveGridData(props: {
  rows: any;
  loading: boolean;
  sort: any;
  searchRequest: any;
  onInputChangeSearch: any;
  handleKeyPress: Function;
  handleSort: Function;
  searchRef: any;
  loadData: Function;
}) {
  const {
    rows,
    loading,
    sort,
    searchRequest,
    onInputChangeSearch,
    handleKeyPress,
    handleSort,
    searchRef,
    loadData,
  } = props;

  const { t } = useLang();
  const isMobile = useIsMobile();

  return (
    <div className="table_bordered overflow-hidden">
      <TableContainer
        sx={
          
          isMobile ? {}:
          {
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
                  id={`AdminArchivedSearchFirstName`}
                  type="text"
                  name="firstName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.firstName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`AdminArchivedSearchLastname`}
                  type="text"
                  name="lastName"
                  className="form-control bg-white  min-w-125px rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.lastName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`AdminArchivedSearchEmail`}
                  type="text"
                  name="adminEmail"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.adminEmail}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`AdminArchivedSearchAdminType`}
                  type="text"
                  name="adminType"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.adminType}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
            </TableRow>
            <TableRow className="h-30px">
              <TableCell className="min-w-50px">{t("Actions")}</TableCell>
              <TableCell className="min-w-50px">
                <div
                  onClick={() => handleSort("firstName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("First Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "firstName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "firstName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("lastName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Last Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "lastName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "lastName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("adminEmail")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Admin Email")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "adminEmail"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "adminEmail"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("adminType")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("User Type")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "adminType"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "adminType"
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
              <TableCell colSpan={7} className="">
                <Loader />
              </TableCell>
            ) : rows?.length ? (
              rows?.map((row: any, index: any) => (
                <Row row={row} loadData={loadData} key={row.id} />
              ))
            ) : (
              <NoRecord colSpan={7} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ArchiveGridData;
