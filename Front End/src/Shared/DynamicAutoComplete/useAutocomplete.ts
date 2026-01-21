import { SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import Commonservice from "../../Services/CommonService";
import { isJson } from "../../Utils/Common/Requisition";

const useAutocomplete = (props: any) => {
  const [searchedValue, setSearchedValue] = useState<any>("");
  const debouncedValue = useDebounce<string>(searchedValue, 500);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [focusOut, setFocusOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const [autoOptions, setAutoOptions] = useState<any>();
  const [apiCallDetails, setapiCallDetails] = useState<any>();

  useEffect(() => {
    setAutoCompleteCredentials();
  }, []);
  const setAutoCompleteCredentials = () => {
    let autoCompleteData = props?.data?.autoCompleteOption;

    let isJSON = isJson(autoCompleteData);
    let parsedAutoCompleteData: any = "";
    if (isJSON) {
      parsedAutoCompleteData = JSON.parse(props?.data?.autoCompleteOption);
    }

    setAutoOptions(parsedAutoCompleteData);
    return parsedAutoCompleteData;
  };
  const apiCall = (
    query: SetStateAction<string>,
    key: number | string,
    name: number | string
  ) => {
    setLoading(true);
    Commonservice?.getAutoCompleteData(query, autoOptions?.Uri, name)
      .then((res: any) => {
        setSuggestions(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const apiCallForDynamicFormDynamicControl = (
    query: any,
    fieldName: string
  ) => {
    let payload = {
      systemFieldName: fieldName,
      text: query,
    };

    setLoading(true);
    Commonservice?.getDynamicAutoCompleteData(query, autoOptions?.Uri, payload)
      .then((res: any) => {
        setSuggestions(res?.data?.responseModel);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const apiCallForDynamicControlDropdown = (
    fieldName: string,
    autoOptions: any
  ) => {
    if (!Object.keys(autoOptions || {}).length) return;
    let payload = {
      systemFieldName: fieldName,
    };
    setLoading(true);
    Commonservice?.getDynamicAutoCompleteData(
      "query",
      autoOptions?.Uri,
      payload
    )
      .then((res: any) => {
        setSuggestions(res?.data?.responseModel);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const apiCallForServerSideDropDown = (
    fieldName: string,
    autoOptions: any
  ) => {
    if (!Object.keys(autoOptions || {}).length) return;
    let payload = {
      systemFieldName: fieldName,
    };
    setLoading(true);
    Commonservice?.getDynamicAutoCompleteData(
      "query",
      autoOptions?.Uri,
      payload
    )
      .then((res: any) => {
        setSuggestions(res?.data?.responseModel);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }): void => {
    setTouched(true);
    if (event.target.value !== "") {
      setSearchedValue(event.target.value);
    } else {
      setSearchedValue("");
      setSuggestions([]);
      setSelectedSuggestion("");
      setActiveSuggestion(0);
    }
  };
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "ArrowDown" && activeSuggestion < suggestions.length) {
      setActiveSuggestion(activeSuggestion + 1);
    } else if (event.key === "ArrowUp" && activeSuggestion > 1) {
      setActiveSuggestion(activeSuggestion - 1);
    } else if (event.key === "Enter") {
      setSearchedValue(suggestions[activeSuggestion - 1].name.common);
      setSelectedSuggestion(suggestions[activeSuggestion - 1].name.common);
      setSuggestions([]);
      setActiveSuggestion(0);
    }
  };

  const handleClick = (value: any) => {
    setSearchedValue(value);
    setSuggestions([]);
    setSelectedSuggestion(value);
    setActiveSuggestion(0);
    setTouched(false);
    //do something else
  };

  return {
    setTouched,
    setActiveSuggestion,
    setSelectedSuggestion,
    searchedValue,
    setSearchedValue,
    setapiCallDetails,
    setSuggestions,
    suggestions,
    selectedSuggestion,
    activeSuggestion,
    loading,
    touched,
    handleChange,
    handleKeyDown,
    handleClick,
    focusOut,
    apiCall,
    autoOptions,
    apiCallForDynamicFormDynamicControl,
    apiCallForDynamicControlDropdown,
  };
};

export default useAutocomplete;
