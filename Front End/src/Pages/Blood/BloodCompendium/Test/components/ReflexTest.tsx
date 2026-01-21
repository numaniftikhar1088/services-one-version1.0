import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Popover from "@mui/material/Popover";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { AddIcon } from "../../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import { closeMenuOnScroll } from "../Shared";
import useLang from "Shared/hooks/useLanguage";
import {
  GetReflexTexts,
  GetResultOnLookup,
} from "Services/Compendium/BloodLisCompendium/BloodLisCompendium";

function ReflexTest({ formData, setFormData }: any) {
  const { t } = useLang();

  // State to hold form input values
  const [testName, setTestName] = useState("");
  const [resultOn, setResultOn] = useState<any>(null);
  const [selectedReflexTests, setSelectedReflexTests] = useState<any>(null);
  const [textReflexData, setTextReflexData] = useState<any[]>([]);
  const [typing, setTyping] = useState(true);

  // State to hold table data
  const [resultOnOptions, setResultOnOptions] = useState<any>([]);

  // Handle Add Button Click
  const handleAddClick = () => {
    // Don't add empty rows
    if (!selectedReflexTests) {
      toast.error(t("Please Select Test to Reflex"));
      return;
    }

    if (!resultOn) {
      toast.error(t("Please Select Reflex On"));
      return;
    }
    if (!selectedReflexTests?.value) {
      toast.error(
        t("Invalid input. Please select a valid test from the list.")
      );
      return;
    }

    if (selectedReflexTests?.value && resultOn) {
      setFormData((prevData: any) => ({
        ...prevData,
        reflexTests: [
          ...prevData.reflexTests,
          {
            id: 0,
            reflexTestId: selectedReflexTests.value,
            resultOn: resultOn.value,
            reflexTestName: selectedReflexTests.label,
            resultOnName: resultOn.label,
          },
        ],
      }));

      // Clear input fields after adding the row
      setTestName("");
      setResultOn(null);
      setSelectedReflexTests(null);
    }
  };

  // Handle Row Deletion
  const handleDeleteRow = (index: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      reflexTests: prevData.reflexTests.filter((_: any, i: any) => i !== index),
    }));
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const response = await GetResultOnLookup();

        setResultOnOptions(response.data);
      } catch (error) {
        console.error(t("Failed to fetch lookup data:"), error);
      }
    };

    fetchLookupData();
  }, []);

  const handleProviderSelect = (provider: any) => {
    setTestName(provider.label); // Set testName to the selected provider's label
    setSelectedReflexTests(provider); // Save selected provider information
    closeSuggestions(); // Close the popover
    setTyping(false); // Prevent API call
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (testName && typing) {
          const { data: providerData } = await GetReflexTexts(testName);
          setTextReflexData(providerData);
          if (providerData?.length) {
            setAnchorEl(inputRef.current);
            inputRef.current?.focus();
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [testName, typing]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // State to store anchor element reference
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Function to close the popover
  const closeSuggestions = () => {
    setAnchorEl(null); // Close the popover
  };

  const open = Boolean(anchorEl); // Popover opens when anchorEl is not null

  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleScroll = (event: Event) => {
      if (
        popoverRef.current &&
        popoverRef.current.contains(event.target as Node)
      ) {
        return; // scrolling inside popover → ignore
      }
      closeSuggestions();
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  const SearchedDataOutsiderAlert = React.memo(() => {
    return (
      <>
        {textReflexData?.length ? (
          <Popover
            ref={popoverRef}
            id="simple-popover"
            open={open}
            anchorEl={anchorEl}
            onClose={closeSuggestions}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{ maxHeight: 200, height: "200px" }}
          >
            {textReflexData?.map((provider: any, index) => (
              <div
                onClick={() => handleProviderSelect(provider)}
                key={index}
                className="bg-hover-light-primary d-flex gap-2 flex-wrap py-2 px-4 rounded-4"
                style={{
                  borderBottom: "1.5px solid var(--kt-primary)",
                }}
              >
                <div className="text-hover-primary d-flex">
                  <span className="pl-2 fs-7">{provider?.label}</span>
                  <br />
                </div>
              </div>
            ))}
          </Popover>
        ) : null}
      </>
    );
  });

  SearchedDataOutsiderAlert.displayName = "SearchedDataOutsiderAlert";

  return (
    <div
      className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
      style={{ border: "2px solid red" }}
    >
      <div className="card mb-4 border">
        <div className="card-header bg-light-danger d-flex justify-content-between align-items-center px-4 min-h-40px">
          <h5 className="m-0" style={{ color: "red" }}>
            {t("Reflex Tests")}
          </h5>
        </div>
        <div className="d-flex p-5">
          <div className="d-flex align-items-end gap-5 w-75">
            <div>
              <label htmlFor="ReflexTestSelectTextToReflex">
                {t("Select Test To Reflex")}
              </label>
              <input
                id={`ReflexTestSelectTextToReflex`}
                ref={inputRef}
                type="text"
                className="form-control h-30px rounded"
                aria-describedby="simple-popover"
                value={testName}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSelectedReflexTests(null);
                  }
                  setTestName(e.target.value); // Update state when typing
                  setTyping(true); // Mark as typing
                }}
              />
              <SearchedDataOutsiderAlert />
            </div>
            <div>
              <label htmlFor="">{t("Reflex On")}</label>
              <Select
                inputId={`ReflexTestReflexOn`}
                theme={(theme: any) => styles(theme)}
                options={resultOnOptions} // Example options
                name="resultOn"
                styles={reactSelectSMStyle}
                placeholder={t("---Select---")}
                menuPortalTarget={document.body}
                value={resultOn}
                onChange={(option) => setResultOn(option)} // Update state on selection
                isSearchable={true}
                className="z-index-3"
                isClearable
                closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
              />
            </div>
            <div>
              <button
                id={`ReflexTestAdd`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded w-25px"
                onClick={handleAddClick}
              >
                <AddIcon />
              </button>
            </div>
          </div>
          {formData?.reflexTests.length ? (
            <div className="table_bordered overflow-hidden w-75">
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
                component={Paper}
                className="shadow-none"
              >
                <Table
                  stickyHeader
                  aria-label="sticky table collapsible"
                  className="mb-1"
                >
                  <TableHead className="h-35px">
                    <TableRow>
                      <TableCell className="max-w-10px w-10px"></TableCell>
                      <TableCell className="min-w-125px w-125px">
                        {t("Test Name")}
                      </TableCell>
                      <TableCell className="min-w-250px w-250px">
                        {t("Reflex On")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData?.reflexTests?.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="align-items-end">
                            <IconButton
                              id={`ReflexTestDeleteRow`}
                              sx={{
                                height: "30px",
                                width: "30px",
                                borderRadius: "5px",
                              }}
                              className="bg-light-danger"
                              color="error"
                              onClick={() => handleDeleteRow(index)} // Call delete handler
                            >
                              <i className="fa fa-trash text-danger"></i>
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell id={`ReflexTestName`}>
                          {row.reflexTestName}
                        </TableCell>
                        <TableCell id={`ResultOnName`}>
                          {row.resultOnName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ReflexTest;
