import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";

const UseDrugBankAutoComplete = (inputSearchRef: any) => {
    const [searchedValue, setSearchedValue] = useState<any>("");
    const debouncedValue = useDebounce<string>(searchedValue, 500);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState("");
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [focusOut, setFocusOut] = useState(false);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    useEffect(() => {
        getDrugAllergies();
    }, [debouncedValue]);
    const getDrugAllergies = () => {
        if (!searchedValue) return;
        RequisitionType.GetDrugBankData(searchedValue)
            .then((res: any) => {
                setSuggestions(res.data.data);
            })
            .catch((err: any) => { })
            .finally(() => { });
    };
    const handleChange = (event: { target: { value: any } }): void => {
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
    const handleClick = (drug: any) => {
        setSuggestions([]);
        setSelectedSuggestion(drug);
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
export default UseDrugBankAutoComplete;
