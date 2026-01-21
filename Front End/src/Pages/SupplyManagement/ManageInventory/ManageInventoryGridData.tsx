import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Row from "./Row";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import NoRecord from "../../../Shared/Common/NoRecord";
import { Loader } from "../../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";

function ManageInventoryGridData(props: {
  rows: any;
  setRows: any;
  handleDelete: Function;
  handleChangeSelectedIds: Function;
  selectedBox: any;
  setModalShow: Function;
  setTestingSupplies: Function;
  loading: boolean;
  sort: any;
  searchRequest: any;
  onInputChangeSearch: any;
  handleKeyPress: Function;
  handleAllSelect: Function;
  handleSort: Function;
  searchRef: any;
  setValue: any;
  selectAll: boolean;
}) {
  const { t } = useLang();

  const {
    handleDelete,
    handleChangeSelectedIds,
    selectedBox,
    rows,
    setModalShow,
    setTestingSupplies,
    loading,
    setRows,
    sort,
    searchRequest,
    onInputChangeSearch,
    handleKeyPress,
    handleAllSelect,
    handleSort,
    searchRef,
    setValue,
    selectAll,
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
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchItemName`}
                  type="text"
                  name="itemName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.itemName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchItemDescription`}
                  type="text"
                  name="itemDescription"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.itemDescription}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchItemBarCode`}
                  type="text"
                  name="itemBarCode"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.itemBarCode}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchItemType`}
                  type="text"
                  name="itemType"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.itemType}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchQuantityPerItem`}
                  type="text"
                  name="quantityPerItemSet"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={
                    searchRequest.quantityPerItemSet === null
                      ? ""
                      : searchRequest.quantityPerItemSet
                  }
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchQuantity`}
                  type="text"
                  name="quantity"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={
                    searchRequest.quantity === null
                      ? ""
                      : searchRequest.quantity
                  }
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchLowQuantityAlert`}
                  type="text"
                  name="lowQuantityAlert"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={
                    searchRequest.lowQuantityAlert === null
                      ? ""
                      : searchRequest.lowQuantityAlert
                  }
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageInventorySearchRequisitionType`}
                  type="text"
                  name="requisitionTypeName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.requisitionTypeName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
            </TableRow>
            <TableRow className="h-30px">
              <TableCell></TableCell>
              <TableCell className="w-20px min-w-20px">
                <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                  <input
                    id={`ManageInventoryCheckAll`}
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e: any) =>
                      handleAllSelect(e.target.checked, rows)
                    }
                    checked={selectAll}
                  />
                </label>
              </TableCell>
              <TableCell className="min-w-50px">{t("Actions")}</TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("itemName")}
                  className="d-flex justify-content-between cursor-pointer min-w-250px"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Item")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "itemName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "itemName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("itemDescription")}
                  className="d-flex justify-content-between cursor-pointer min-w-250px"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Description")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "itemDescription"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "itemDescription"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("itemBarCode")}
                  className="d-flex justify-content-between cursor-pointer min-w-250px"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Item Bar Code")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "itemBarCode"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "itemBarCode"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div
                  onClick={() => handleSort("itemType")}
                  className="d-flex justify-content-between cursor-pointer "
                  id=""
                  ref={searchRef}
                >
                  <div className="d-flex justify-content-between align-items-center min-w-100px">
                    <div style={{ width: "max-content" }}>{t("Item Type")}</div>
                    <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                      <ArrowUp
                        CustomeClass={`${
                          sort.sortingOrder === "desc" &&
                          sort.clickedIconData === "itemType"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                      />
                      <ArrowDown
                        CustomeClass={`${
                          sort.sortingOrder === "asc" &&
                          sort.clickedIconData === "itemType"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                      />
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  onClick={() => handleSort("quantityPerItemSet")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Quantity Per Item Set")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "quantityPerItemSet"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "quantityPerItemSet"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("quantity")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Quantity")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "quantity"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "quantity"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("lowQuantityAlert")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Minimum Level")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "lowQuantityAlert"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "lowQuantityAlert"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("requisitionTypeName")}
                  className="d-flex justify-content-between cursor-pointer min-w-100px"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Requisition Type")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "requisitionTypeName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "requisitionTypeName"
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
              rows?.map((row: any, index: any) => (
                <Row
                  row={row}
                  index={index}
                  rows={rows}
                  setRows={setRows}
                  handleChangeSelectedIds={handleChangeSelectedIds}
                  setTestingSupplies={setTestingSupplies}
                  selectedBox={selectedBox}
                  handleDelete={handleDelete}
                  setModalShow={setModalShow}
                  setValue={setValue}
                />
              ))
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
