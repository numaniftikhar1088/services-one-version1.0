import moment from "moment";
import React, { SetStateAction, useEffect, useState, useRef } from "react";
export const usePatientSmartSearch = (
    facilityId: number,
    setLoading: (loading: boolean) => void,
    searchPatientsService: (filters: any) => Promise<any>
) => {
    const [patientSuggestions, setPatientSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
    const [currentSearchField, setCurrentSearchField] = useState<'firstName' | 'lastName' | null>(null);
    const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const searchPatients = (searchTerm: string, searchType: 'firstName' | 'lastName') => {
        if (!facilityId || !searchTerm.trim() || searchTerm.length < 2) {
            setPatientSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        const searchObj = {
            facilityId,
            firstName: searchType === 'firstName' ? searchTerm : '',
            lastName: searchType === 'lastName' ? searchTerm : '',
        };

        const delayDebounceFn = setTimeout(() => {
            searchPatientsService(searchObj)
                .then((res: any) => {
                    if (res?.data?.data && Array.isArray(res.data.data)) {
                        setPatientSuggestions(res.data.data);
                        setShowSuggestions(res.data.data.length > 0);
                        setActiveSuggestionIndex(-1);
                    } else {
                        setPatientSuggestions([]);
                        setShowSuggestions(false);
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                    setPatientSuggestions([]);
                    setShowSuggestions(false);
                })
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    };

    const handlePatientSelect = (
        patient: any,
        currentField: 'firstName' | 'lastName',
        setData: React.Dispatch<SetStateAction<any>>
    ) => {
        setData((prev: any) => ({
            ...prev,
            firstName: patient?.FirstName || prev?.firstName,
            lastName: patient?.LastName || prev?.lastName,
            dob: patient?.DOB ? moment(patient.DOB)?.format("YYYY-MM-DD") : '',
        }));
        setShowSuggestions(false);
        setPatientSuggestions([]);
        setActiveSuggestionIndex(-1);
        setCurrentSearchField(null);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent,
        inputType: 'firstName' | 'lastName',
        setData: React.Dispatch<SetStateAction<any>>
    ) => {
        if (!showSuggestions || patientSuggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = activeSuggestionIndex < patientSuggestions.length - 1
                    ? activeSuggestionIndex + 1
                    : 0;
                setActiveSuggestionIndex(nextIndex);
                suggestionRefs.current[nextIndex]?.scrollIntoView({ block: 'nearest' });
                break;

            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = activeSuggestionIndex > 0
                    ? activeSuggestionIndex - 1
                    : patientSuggestions.length - 1;
                setActiveSuggestionIndex(prevIndex);
                suggestionRefs.current[prevIndex]?.scrollIntoView({ block: 'nearest' });
                break;

            case 'Enter':
                e.preventDefault();
                if (activeSuggestionIndex >= 0 && activeSuggestionIndex < patientSuggestions.length) {
                    handlePatientSelect(patientSuggestions[activeSuggestionIndex], inputType, setData);
                }
                break;

            case 'Escape':
                setShowSuggestions(false);
                setActiveSuggestionIndex(-1);
                setCurrentSearchField(null);
                break;
        }
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.patient-search-container')) {
                setShowSuggestions(false);
                setActiveSuggestionIndex(-1);
                setCurrentSearchField(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return {
        patientSuggestions,
        showSuggestions,
        activeSuggestionIndex,
        setActiveSuggestionIndex, // Added to return object
        currentSearchField,
        suggestionRefs,
        searchPatients,
        handlePatientSelect,
        handleKeyDown,
        setCurrentSearchField,
    };
};