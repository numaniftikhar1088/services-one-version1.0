import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";

const UseMedicationAutoComplete = (inputSearchRef: any) => {
  const [searchedValue, setSearchedValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchedValue, 500);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [focusOut, setFocusOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  /** ==============================================
   *   API CALL – Only triggers after debounce AND min 3 chars
   *  ============================================== */
  useEffect(() => {
    if (debouncedValue.trim().length >= 3) {
      getDrugAllergies(debouncedValue.trim());
    } else {
      setSuggestions([]); // Clear suggestions if less than 3 characters
    }
  }, [debouncedValue]);

  const getDrugAllergies = (value: string) => {
    setLoading(true);
    RequisitionType.GetToxMedication(value)
      .then((res: any) => {
        setSuggestions(res.data.data || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  /** =====================
   *   HANDLE CHANGE
   *  =====================*/
  const handleChange = (event: { target: { value: string } }): void => {
    const value = event.target.value.trim();
    setTouched(true);

    // If empty → reset everything
    if (value === "") {
      setSearchedValue("");
      setSuggestions([]);
      setSelectedSuggestion("");
      setActiveSuggestion(0);
      return;
    }

    // If 1–2 characters → update input but don't search
    if (value.length < 3) {
      setSearchedValue(value);
      setSuggestions([]);
      return;
    }

    // If 3+ characters → allow search to run (debounced)
    setSearchedValue(value);
  };

  /** =====================
   *   HANDLE KEYDOWN
   *  =====================*/
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "ArrowDown" && activeSuggestion < suggestions.length) {
      setActiveSuggestion(activeSuggestion + 1);
    } else if (event.key === "ArrowUp" && activeSuggestion > 1) {
      setActiveSuggestion(activeSuggestion - 1);
    } else if (event.key === "Enter" && suggestions.length > 0) {
      const selected = suggestions[activeSuggestion - 1];
      if (!selected) return;

      const name = selected.name?.common || "";
      setSearchedValue(name);
      setSelectedSuggestion(name);
      setSuggestions([]);
      setActiveSuggestion(0);
    }
  };

  /** =====================
   *   HANDLE CLICK
   *  =====================*/
  const handleClick = (drug: any) => {
    setSuggestions([]);
    setSelectedSuggestion(drug);
    setSearchedValue(drug);
    setActiveSuggestion(0);
    setTouched(false);
  };

  return {
    setTouched,
    setActiveSuggestion,
    setSelectedSuggestion,
    searchedValue,
    setSearchedValue,
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
  };
};

export default UseMedicationAutoComplete;
