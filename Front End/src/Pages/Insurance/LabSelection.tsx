import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService"; // Ensure this service is correctly set up
import InsuranceService from "Services/InsuranceService/InsuranceService";
import { Loader } from "Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage"; // Ensure this hook is correctly set up

// Define the interface for a Reference Lab
export interface ReferenceLab {
    label: string;
    value: number;
}

type LabSelectionProps = {
    setOpenRows: any;
    id: number;
    item: any
    loadData: () => void;
};


const LabSelection: React.FC<LabSelectionProps> = ({ setOpenRows, id, loadData, item }) => {
    const [loadingLookup, setLoadingLookup] = useState(true);
    const [referenceLab, setReferenceLab] = useState<ReferenceLab[]>([]);
    const [selectedLabs, setSelectedLabs] = useState<ReferenceLab[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState<string>("");
    const { t } = useLang();

    // Fetch reference labs from the service
    const fetchReferenceLab = async () => {
        setLoadingLookup(true);
        try {
            const res: AxiosResponse = await FacilityService.referenceLabLookup(); // API call to fetch labs
            const referenceArray: ReferenceLab[] =
                res?.data?.data?.map((lab: any) => ({
                    value: lab?.labId,
                    label: lab?.labDisplayName,
                })) || [];
            setReferenceLab(referenceArray); // Set the fetched labs in state
        } catch (err: any) {
            console.error(t("Error fetching reference labs:"), err.message);
        } finally {
            setLoadingLookup(false);
        }
    };

    // Move a lab from "All Labs" to "Selected Labs"
    const handleFacilitySelected = (lab: ReferenceLab) => {
        setSelectedLabs((prev) => [...prev, lab]);
        setReferenceLab((prev) => prev.filter((item) => item.value !== lab.value));
    };

    // Move a lab from "Selected Labs" back to "All Labs"
    const handleFacilityBack = (lab: ReferenceLab) => {
        setReferenceLab((prev) => [...prev, lab]); // Add back to all labs
        setSelectedLabs((prev) => prev.filter((item) => item.value !== lab.value)); // Remove from selected labs
    };


    // Function to remove duplicates from an array based on 'value'
    const removeDuplicates = (arr: any[]): any[] => {
        const uniqueValues = new Set<number>();
        return arr.filter((item) => {
            if (uniqueValues.has(item.value)) {
                return false;
            } else {
                uniqueValues.add(item.value);
                return true;
            }
        });
    };
    // Remove duplicates from the lookup array
    const uniqueLookup = removeDuplicates(referenceLab);

    const lookupForEdit = uniqueLookup.filter(
        (lookupItem: any) =>
            !selectedLabs.some(
                (selectedItem: any) => selectedItem.value === lookupItem.value
            )
    );

    // Filter labs based on search term
    const filteredLabs = lookupForEdit.filter((lab) =>
        lab.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter selected labs based on search term
    const filteredSelectedLabs = selectedLabs.filter((lab) =>
        lab.label.toLowerCase().includes(selectedSearchTerm.toLowerCase())
    );

    // Close the modal or row handler
    const handleClose = () => {
        setOpenRows(false);
    };

    // Handle submit action
    const handleSubmit = () => {
        if (selectedLabs.length === 0) {
            toast.error(t("Please select at least one lab"));
            return;
        }

        const queryModel = {
            id: id, // The record ID passed as prop
            labIds: selectedLabs.map((lab) => lab.value), // Array of selected lab IDs
        };

        InsuranceService.SaveLabsInInsurance(queryModel)
            .then((res: AxiosResponse) => {
                if (res?.status === 200) {
                    toast.success(t('Labs Successfully Saved'));
                    handleClose()
                    loadData(); // Reload data after successful submission
                    setSelectedLabs([]); // Clear selected labs after submission
                    setSearchTerm(''); // Reset search term for all labs
                    setSelectedSearchTerm(''); // Reset search term for selected labs
                }
            })
            .catch((err: any) => {
                console.error(t("Error saving labs:"), err);
                toast.error(t("Failed to save labs"));
            });
    };

    // Fetch labs on component mount
    useEffect(() => {
        fetchReferenceLab();
        format();
    }, []);



    const format = () => {
        try {
            const formattedArray =
                item?.labs?.map((lab: any) => ({
                    value: lab?.labId,
                    label: lab?.displayName,
                })) || [];
            setSelectedLabs(formattedArray); // Set the fetched labs in state
        } catch (err: any) {
            console.error(t("Error fetching reference labs:"), err.message);
        }
    };
    // console.log(selectedLabs, "asdf")



    return (
        <>
            {/* Header Section */}
            <div className=" d-flex justify-content-between align-items-center mt-0 ">
                <div className="m-0 fs-4 lead fw-500"></div>
                <div className="d-flex align-items-center justify-content-end mb-2">
                    <button
                        className="btn btn-secondary btn-sm btn-secondary--icon mr-3"
                        aria-controls="Search"
                        onClick={handleClose}
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        className="btn btn-primary btn-sm fw-500"
                        aria-controls="Search"
                        onClick={handleSubmit}
                    >
                        {t("Save")}
                    </button>
                </div>
            </div>

            {/* Labs Selection Card */}
            <div className="py-0">
                <div className="card shadow-sm rounded border border-warning">
                    <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
                        <h6 className="text-warning mb-0">{t("Labs")}</h6>
                    </div>

                    <div className="card-body py-md-4 py-3 px-4">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="row">
                                <div className="col-lg-6 col-md-12 col-sm-12">
                                    <span className="fw-bold">{t("All Labs")}</span>
                                    <input
                                        className="form-control bg-transparent mb-5 mb-sm-0"
                                        placeholder={t("Search...")}
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                                        <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                                            <span className="fw-bold">{t("All List")}</span>
                                        </div>
                                        {loadingLookup ? (
                                            <div className="h-325px d-flex justify-content-center align-items-center">
                                                <Loader />
                                            </div>
                                        ) : (
                                            <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                                                {filteredLabs.map((lab) => (
                                                    <li
                                                        key={lab.value}
                                                        onClick={() => handleFacilitySelected(lab)}
                                                        className="list-group-item px-2 py-1 border-0 cursor-pointer"
                                                    >
                                                        <div className="d-flex">{lab.label}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                    </div>
                                </div>

                                {/* Selected Labs Section */}
                                <div className="mb-2 col-lg-6 col-md-12 col-sm-12">
                                    <span className="fw-bold required">{t("Selected Labs")}</span>
                                    <input
                                        className="form-control bg-transparent mb-5 mb-sm-0"
                                        placeholder={t("Search...")}
                                        type="text"
                                        value={selectedSearchTerm}
                                        onChange={(e) => setSelectedSearchTerm(e.target.value)}
                                    />
                                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                                        <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                                            <span className="fw-bold">{t("Selected List")}</span>
                                        </div>
                                        <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                                            {filteredSelectedLabs.map((lab) => (
                                                <li
                                                    key={lab.value}
                                                    onClick={() => handleFacilityBack(lab)}
                                                    className="list-group-item next-position px-2 py-1 cursor-pointer"
                                                >
                                                    <div className="d-flex">{lab.label}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LabSelection;
