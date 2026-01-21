import { yupResolver } from "@hookform/resolvers/yup";
import { setWebInfo } from "Redux/Actions/Index";
import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import ReCAPTCHA from "react-google-recaptcha";
import { Resolver, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import LoadButton from "../../Shared/Common/LoadButton";
import useLang from "./../../Shared/hooks/useLanguage";
import { dateFormatSetter } from "Utils/Common/Requisition";
import { setFaviconAndTitle } from "Utils/Common/CommonMethods";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import Commonservice from "Services/CommonService";

interface FormData {
    firstName: string;
    lastName: string;
    dateOfBirth: Date | null;
    accessionNo: string;
    dateOfCollection: Date | null;
}

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    dateOfBirth: Yup.date()
        .typeError("Please select a valid date of birth")
        .nullable()
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future"),
    dateOfCollection: Yup.date()
        .typeError("Please select a valid date of collection")
        .nullable()
        .required("Date of collection is required")
        .max(new Date(), "Date of collection cannot be in the future"),
    accessionNo: Yup.string()
        .required("Barcode is required")
        .matches(
            /^[0-9A-Za-z-]+$/,
            "Barcode can only contain numbers, letters, and hyphens"
        ),
});

const PatientDataForm = () => {
    const { t } = useLang();
    const dispatch = useDispatch();

    const [key, setKey] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const REACT_APP_URL = useSelector((state: any) => state.Reducer.baseUrl);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema) as Resolver<FormData>,
        defaultValues: {
            firstName: "",
            lastName: "",
            dateOfBirth: null,
            accessionNo: "",
            dateOfCollection: null,
        },
    });

    const dateOfBirth = watch("dateOfBirth"); // Watch the dateOfBirth field for DatePicker value
    const dateOfCollection = watch("dateOfCollection"); // Watch the dateOfCollection field for DatePicker value

    // Prevent browser navigation (back/forward/address bar) with beforeunload
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty && !isSubmitted) {
                event.preventDefault();
                event.returnValue =
                    "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty, isSubmitted]);

    const getLogoUrl = () => {
        setLoading(true);
        Commonservice.getLoginPageLogo()
            .then((res: any) => {
                setLogoUrl(res.data.logo);
                dispatch(
                    setWebInfo({
                        smartLogoUrl: res.data?.smartLogo,
                        title: res.data?.labName,
                    })
                );
                setFaviconAndTitle(res.data?.smartLogo, res.data?.labName);
            })
            .catch((err: any) => {
                console.trace(err);
            })
            .finally(() => setLoading(false));
    };

    const getPortalKey = () => {
        setLoading(true);
        Commonservice.getPortalKey()
            .then((res: any) => {
                setKey(res?.data);
            })
            .catch((err: any) => {
                console.trace(err);
            })
            .finally(() => setLoading(false));
    };

    useLayoutEffect(() => {
        getLogoUrl();
        getPortalKey();
    }, []);

    const onSubmit = async (data: FormData) => {
        if (!captchaToken) {
            toast.error(
                "ReCAPTCHA verification failed. Please complete the verification and try again."
            );
            return;
        }
        setLoading(true);
        setErrorMessage(null);
        try {
            // Format dateOfBirth & dateOfCollection YYYY-MM-DD string format
            let formattedDateOfBirth: string | null = null;
            let formattedDateOfCollection: string | null = null;
            if (data?.dateOfBirth) {
                const year = data?.dateOfBirth?.getFullYear();
                const month = String(data?.dateOfBirth?.getMonth() + 1).padStart(
                    2,
                    "0"
                );
                const day = String(data.dateOfBirth?.getDate()).padStart(2, "0");
                formattedDateOfBirth = `${year}-${month}-${day}`;
            }
            if (data?.dateOfCollection) {
                const year = data?.dateOfCollection?.getFullYear();
                const month = String(data?.dateOfCollection?.getMonth() + 1).padStart(
                    2,
                    "0"
                );
                const day = String(data.dateOfCollection?.getDate()).padStart(2, "0");
                formattedDateOfCollection = `${year}-${month}-${day}`;
            }

            const submitData = {
                ...data,
                dateOfBirth: formattedDateOfBirth,
                dateOfCollection: formattedDateOfCollection,
            };

            const response = await axios.post(
                `${REACT_APP_URL}/api/Requisition/PatientSubmitRequisitionOrder`,
                submitData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Portal-Key": key,
                    },
                }
            );
            if (response?.data?.status === 404) {
                toast.error(response.data.message);
            }
            if (response?.data?.status === 200) {
                setIsSubmitted(true);
            }
        } catch (error: any) {
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (value: any) => {
        const date = Array.isArray(value) ? value[0] : value;
        const updatedDate = dateFormatSetter(date);
        setValue("dateOfBirth", updatedDate, { shouldValidate: true });
    };

    const handleCollectionChange = (value: any) => {
        const date = Array.isArray(value) ? value[0] : value;
        const updatedDate = dateFormatSetter(date);
        setValue("dateOfCollection", updatedDate, { shouldValidate: true });
    };

    const ShowBlob = (Url: string) => {
        RequisitionType.ShowBlob(Url).then((res: any) => {
            window.open(res?.data?.Data.replace("}", ""), "_blank");
        });
    };
    const handleSubmitAnother = () => {
        reset(); // Reset the form to its default values
        setIsSubmitted(false); // Show the form again
        setErrorMessage(null); // Clear any error messages
    };

    if (isSubmitted) {
        return (
            <div
                className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
                style={{
                    backgroundImage: 'url("/media/illustrations/login/sketch-1.png")',
                }}
            >
                <div
                    className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="w-lg-550px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto text-center">
                        <i
                            className="text-primary fa fa-check-circle"
                            style={{ fontSize: "48px", marginBottom: "20px" }}
                        >
                            {" "}
                        </i>
                        <h2 className="fw-bold mb-4">
                            {t("Thank you for your response!")}
                        </h2>
                        <p className="text-muted">
                            {t("Your information has been successfully submitted.")}
                        </p>
                        <div className="text-center" id="returnToForm">
                            <button
                                className="btn btn-primary b-0 w-50 mb-5 h-45px"
                                onClick={handleSubmitAnother}
                            >
                                {t("Submit Another Form")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div
                className="d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed"
                style={{
                    backgroundImage: 'url("/media/illustrations/login/sketch-1.png")',
                }}
            >
                <div
                    className="d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="w-lg-550px bg-body rounded shadow-sm p-10 p-lg-15 mx-auto">
                        {errorMessage && (
                            <div className="text-danger mb-4 text-center">{errorMessage}</div>
                        )}
                        <form
                            className="form w-100"
                            id="kt_login_signin_form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <a href="#" className="mb-12 d-flex justify-content-center">
                                {logoUrl && <img alt="Logo" src={logoUrl} className="h-45px" />}
                            </a>

                            <div className="mb-4">
                                <label className="required mb-2 fw-500">
                                    {t("First Name")}
                                </label>
                                <div className="d-flex justify-content-between border rounded m-auto">
                                    <input
                                        {...register("firstName")}
                                        type="text"
                                        className={`form-control border-0 ${errors.firstName ? "is-invalid" : ""}`}
                                        placeholder={t("First Name")}
                                    />
                                </div>
                                {errors.firstName && (
                                    <div className="text-danger mt-1">
                                        {errors.firstName.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="required mb-2 fw-500">{t("Last Name")}</label>
                                <div className="d-flex justify-content-between border rounded m-auto">
                                    <input
                                        {...register("lastName")}
                                        type="text"
                                        className={`form-control border-0 ${errors.lastName ? "is-invalid" : ""}`}
                                        placeholder={t("Last Name")}
                                    />
                                </div>
                                {errors.lastName && (
                                    <div className="text-danger mt-1">
                                        {errors.lastName.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="required mb-2 fw-500">
                                    {t("Date of birth")}
                                </label>
                                <DatePicker
                                    format="MM/dd/yyyy"
                                    dayPlaceholder="dd"
                                    monthPlaceholder="mm"
                                    yearPlaceholder="yyyy"
                                    className={`w-100 border rounded p-2 ${errors.dateOfBirth ? "is-invalid" : ""}`}
                                    onChange={handleDateChange}
                                    value={dateOfBirth ?? null}
                                />
                                {errors.dateOfBirth && (
                                    <div className="text-danger mt-1">
                                        {errors.dateOfBirth.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="required mb-2 fw-500">
                                    {t("Date of Collection")}
                                </label>
                                <DatePicker
                                    format="MM/dd/yyyy"
                                    dayPlaceholder="dd"
                                    monthPlaceholder="mm"
                                    yearPlaceholder="yyyy"
                                    className={`w-100 border rounded p-2 ${errors.dateOfCollection ? "is-invalid" : ""}`}
                                    onChange={handleCollectionChange}
                                    value={dateOfCollection ?? null}
                                />
                                {errors.dateOfCollection && (
                                    <div className="text-danger mt-1">
                                        {errors.dateOfCollection.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="required mb-2 fw-500">
                                    {t("Accession ID / Barcode #")}
                                </label>
                                <div className="d-flex justify-content-between border rounded m-auto">
                                    <input
                                        {...register("accessionNo")}
                                        type="text"
                                        className={`form-control border-0 ${errors.accessionNo ? "is-invalid" : ""}`}
                                        placeholder={t("Accession ID / Barcode #")}
                                    />
                                </div>
                                {errors.accessionNo && (
                                    <div className="text-danger mt-1">
                                        {errors.accessionNo.message}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <ReCAPTCHA
                                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
                                    onChange={(token: string | null) => setCaptchaToken(token)}
                                    onExpired={() => setCaptchaToken(null)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="mb-4 d-flex gap-2">
                                <span className="fw-bold">View Kit Instructions.</span>
                                <a
                                    href="#"
                                    className="text-success fw-bold text-decoration-underline d-block"
                                    onClick={() =>
                                        ShowBlob(
                                            "https://truemedpo.blob.core.windows.net/ixpressgenes-pdf/tai-instructions-Zh9U8HUm7EeEhzbrHjjzQ-638956053260850382.pdf"
                                        )
                                    }
                                >
                                    Click here
                                </a>
                            </div>

                            <div className="text-center" id="PatientSubmit">
                                <LoadButton
                                    loading={loading}
                                    btnText={t("Submit")}
                                    loadingText="Submitting"
                                    className="btn btn-primary b-0 w-100 mb-5 h-45px"
                                    disabled={loading}
                                />
                            </div>
                            <hr />
                            <div className="text-center">
                                <span className="fw-bold">Need Help? Call IXG Support: </span>
                                <i
                                    className="fa fa-phone text-primary"
                                    style={{ fontSize: "14px" }}
                                ></i>
                                <a
                                    href="tel:+12569476133"
                                    className="text-primary fw-bold text-decoration-underline"
                                >
                                    (256) 947-6133
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDataForm;
