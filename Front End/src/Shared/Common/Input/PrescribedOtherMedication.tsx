import { useEffect, useRef, useState } from 'react';
import useLang from 'Shared/hooks/useLanguage';
import { assignFormValues } from '../../../Utils/Auth';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import UseDrugBankAutoComplete from 'Shared/hooks/Requisition/useDrugBank';



const PrescribedOtherMedication = ({
    Inputs,
    index,
    options = [],
    sysytemFieldName,
    displayFieldName,
    depControlIndex,
    fieldIndex,
    isDependency,
    repeatFieldSection,
    isDependencyRepeatFields,
    repeatFieldIndex,
    repeatDependencySectionIndex,
    repeatDepFieldIndex,
    setInputs,
    infectiousData,
    setInfectiousData,
    ArrayReqId,
    noActiveMedication,
    defaultValue,
}: any) => {
    const { t } = useLang();
    const location = useLocation();
    const inputSearchRef = useRef<HTMLInputElement>(null);
    const suggestionRef = useRef<HTMLDivElement>(null); // Ref for suggestion dropdown
    const {
        suggestions,
        handleChange,
        handleKeyDown,
        handleClick,
        searchedValue,
        setSearchedValue,
        setTouched,
        setSuggestions,
    } = UseDrugBankAutoComplete(inputSearchRef);

    // Store only a single selected medication
    const [selectedMedication, setSelectedMedication] = useState<any>(
        defaultValue && Array.isArray(defaultValue) && defaultValue.length > 0
            ? defaultValue[0]
            : null
    );

    function FindIndex(arr: any[], text: any): number {
        return arr.findIndex(item => item.reqId === text);
    }

    const updateFields = async (medication: any) => {
        Inputs[index]?.fields?.forEach((i: any) => {
            if (i?.systemFieldName === 'MedicationPanel' || i?.systemFieldName === 'OtherMedication') {
                i.defaultValue = medication ? [medication] : [];
            }
        });

        const newInputs = await assignFormValues(
            Inputs,
            index,
            depControlIndex,
            fieldIndex,
            medication ? [medication] : [],
            isDependency,
            repeatFieldSection,
            isDependencyRepeatFields,
            repeatFieldIndex,
            repeatDependencySectionIndex,
            repeatDepFieldIndex,
            undefined,
            setInputs
        );

        const infectiousDataCopy = JSON.parse(JSON.stringify(infectiousData));
        infectiousDataCopy[FindIndex(infectiousData, ArrayReqId)].sections = newInputs;
        if (setInfectiousData) setInfectiousData([...infectiousDataCopy]);
    };

    const handleOtherMedication = async (item: any) => {
        if (selectedMedication && selectedMedication.drugbank_id
            === item.drugbank_id
        ) {
            toast.error('This medication is already selected.');
            return;
        }

        const medicationObj = {
            name: item.name,
            drugbank_id: item.drugbank_id,
        };
        setSelectedMedication(medicationObj);
        setSearchedValue(item.name); // Display selected medication in input
        setSuggestions([]); // Clear suggestions to close dropdown
        setTouched(false); // Prevent suggestions from reappearing

        await updateFields(medicationObj);
    };

    const clearSelection = async () => {
        setSelectedMedication(null);
        setSearchedValue('');
        setSuggestions([]);
        setTouched(false);
        await updateFields(null);
    };

    // Filter suggestions to exclude the selected medication
    const filteredSuggestions = suggestions.filter(
        (item: any) => !selectedMedication || item.drugbank_id !== selectedMedication.drugbank_id
    );

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputSearchRef.current &&
                suggestionRef.current &&
                !inputSearchRef.current.contains(event.target as Node) &&
                !suggestionRef.current.contains(event.target as Node)
            ) {
                setSuggestions([]); // Clear suggestions to close dropdown
                setTouched(false); // Prevent suggestions from reappearing
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Initialize searchedValue based on defaultValue
    useEffect(() => {
        if (defaultValue && Array.isArray(defaultValue) && defaultValue.length > 0 && defaultValue[0]?.name) {
            setSearchedValue(defaultValue[0].name);
            setSelectedMedication(defaultValue[0]);
        } else if (!defaultValue || defaultValue === false || (Array.isArray(defaultValue) && defaultValue.length === 0)) {
            // Reset to empty when defaultValue is falsy or empty array
            setSearchedValue('');
            setSelectedMedication(null);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (sysytemFieldName === 'MedicationDrug' &&
            Array.isArray(options) &&
            location?.state?.reqId) {
            const initialValue = Array.isArray(defaultValue) && defaultValue.length > 0 && defaultValue[0]?.name
                ? defaultValue[0].name
                : '';
            setSearchedValue(initialValue);
            Inputs[index]?.fields?.forEach((i: any) => {
                if (
                    i?.systemFieldName === 'MedicationPanel' ||
                    i?.systemFieldName === 'MedicationDrug'
                ) {
                    i.defaultValue = defaultValue;
                }
            });
        }
    }, []);
    console.log(defaultValue, Inputs, "PPPPP");

    return (
        <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
            <span className="mb-3 fw-500">{t(displayFieldName)}</span>
            <div className="d-flex flex-wrap gap-2 mt-2">
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <input
                        type="text"
                        name="Medications"
                        placeholder={t('Medications')}
                        className={
                            noActiveMedication
                                ? 'form-control bg-secondary position-relative'
                                : 'form-control bg-transparent position-relative'
                        }
                        value={searchedValue || ''}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        ref={inputSearchRef}
                        disabled={noActiveMedication}
                    />
                    {filteredSuggestions.length > 0 && (
                        <div
                            ref={suggestionRef}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                width: '100%',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                zIndex: 1000,
                                backgroundColor: 'white',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                borderRadius: '0.375rem',
                                marginTop: '5px',
                            }}
                        >
                            {filteredSuggestions.map((item: any) => (
                                <div
                                    key={item.drugbank_id}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        cursor: 'pointer',
                                        backgroundColor: 'white',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor = '#f3f4f6')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor = 'white')
                                    }
                                    onClick={() => {
                                        handleClick(item);
                                        handleOtherMedication(item);
                                    }}
                                >
                                    <span id={item.drugbank_id}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedMedication && (
                        <i
                            className="bi bi-x-lg cursor-pointer"
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                            onClick={clearSelection}
                        ></i>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescribedOtherMedication;