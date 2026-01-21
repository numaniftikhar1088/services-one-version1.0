import { SetStateAction, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import AssigmentService from "../../Services/AssigmentService/AssigmentService";

const useComorAutocomplete = (inputSearchRef: HTMLInputElement | null, Inputs: any) => {
  const [searchedValue, setSearchedValue] = useState<any>("");
  const debouncedValue = useDebounce<string>(searchedValue, 500);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [apiCallDetails, setapiCallDetails] = useState({
    apiCallName: "",
  });

  useEffect(() => {
    if (inputSearchRef) {
      inputSearchRef?.focus();
    }
  }, []);

  useEffect(() => {
    apiCall(searchedValue);
  }, [debouncedValue]);

  const apiCall = (query: SetStateAction<string>) => {
    try {
      if (!touched) return;

      const facilityIndex = Inputs?.findIndex(
        (input: any) => input?.sectionId === 2
      );
      const facilityId =
        Inputs?.length &&
        Inputs[facilityIndex]?.fields?.find(
          (f: any) => f?.systemFieldName === "FacilityID"
        )?.defaultValue;

      setLoading(true);
      AssigmentService.SearchComorbidity(query, facilityId ?? 0)
        .then((res: any) => setSuggestions(res?.data))
        .catch((err: any) => console.log(err))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
    if (event.key === "Tab") {
      setSuggestions([]);
      return;
    }

    if (event.key === "ArrowDown" && activeSuggestion < suggestions.length) {
      setActiveSuggestion(activeSuggestion + 1);
    } else if (event.key === "ArrowUp" && activeSuggestion > 1) {
      setActiveSuggestion(activeSuggestion - 1);
    } else if (event.key === "Enter") {
      // Make sure suggestions exist to avoid errors
      if (suggestions[activeSuggestion - 1]) {
        setSearchedValue(suggestions[activeSuggestion - 1].code || "");
        setSelectedSuggestion(suggestions[activeSuggestion - 1].code || "");
        setSuggestions([]);
        setActiveSuggestion(0);
      }
    }
  };

  const handleClick = (item: any) => {
    setSearchedValue(item.code || "");
    setSuggestions([]);
    setSelectedSuggestion(item.code || "");
    setActiveSuggestion(0);
    setTouched(false);
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
  };
};

export default useComorAutocomplete;
