import { AxiosError, AxiosResponse } from "axios";
import { setAddUserManegementFormState } from "Pages/Admin/InitialState";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import Commonservice from "Services/CommonService";
import UserManagementService from "Services/UserManagement/UserManagementService";
import useForm from "Shared/hooks/useForm";
import useLang from "Shared/hooks/useLanguage";
import { InputChangeEvent } from "Shared/Type";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";
import { sortByCreationDate, SortingTypeI } from "Utils/consts";
import validate from "Utils/validate";
import { IAdminType, ITableObj } from "../UserList";

type SearchQueryType = {
  firstName: string;
  lastName: string;
  adminEmail: string;
  adminType: string;
  userGroup: string;
};

type ContextTypes = {
  open: boolean;
  setOpen: any;
  editGridHeader: boolean;
  setEditGridHeader: (edit: boolean) => void;
  setDataAndErrors: (data: any, errors: any) => void;
  errors: Record<string, string> | null;
  setErrors: any;
  changeHandler: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  changeHandlerForNames: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  setFormData: (formData: any) => void;
  handleSubmit: any;
  dropDownValues: {
    UserGroupList: any[];
    AdminTypeList: any[];
  };
  GetDataAgainstRoles: (RoleId: number) => Promise<void>;
  GetDataAgainstRolesByUserId: (userId: string) => Promise<void>;
  onClose: () => void;
  checkboxes: any[];
  setCheckboxes: (checkboxes: any[]) => void;
  ValidEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmailExistError: string;
  setAdminEmail: any;
  adminEmail: string;
  setRows: any;
  loadData: any;
  loadGridData: (loader: boolean, reset: boolean, sortingState?: any) => void;
  setSearchRequest: (request: any) => void;
  searchRequest: any;
  setPageSize: (size: number) => void;
  setCurPage: (page: number) => void;
  setTriggerSearchData: any;
  rows: any[];
  loading: boolean;
  pageSize: number;
  curPage: number;
  showPage: any;
  prevPage: () => void;
  pageNumbers: number[];
  initialSearchQuery: SearchQueryType;
  nextPage: () => void;
  totalPages: number;
  total: number;
};

const Context = createContext<ContextTypes>({} as ContextTypes);
const initialSearchQuery = {
  firstName: "",
  lastName: "",
  adminEmail: "",
  adminType: "",
  userGroup: "",
};

export default function UserListContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = useLang();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [isEmailExistError, setIsEmailExistError] = useState("");
  const [sort, setSorting] = useState<SortingTypeI>(sortByCreationDate);
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);
  const [rows, setRows] = useState<ITableObj[]>(() => []);
  const [dropDownValues, setDropDownValues] = useState({
    UserGroupList: [],
    AdminTypeList: [],
  });
  const [adminEmail, setAdminEmail] = useState("");
  const initialState = setAddUserManegementFormState;

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [initialRender, setinitialRender] = useState(false);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };

  const showPage = (i: number) => {
    setCurPage(i);
  };

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    if (initialRender) {
      loadGridData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const {
    formData,
    setFormData,
    setDataAndErrors,
    errors,
    changeHandler,
    setErrors,
  }: any = useForm(initialState, validate);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isEmailExistError !== "") return;

    const formErrors = validate(formData, true);
    setErrors(formErrors);
    if (Object.keys(formErrors).length) return;

    const queryModel = {
      ...formData,
      id: formData.id.value,
      firstName: formData.firstName.value,
      lastName: formData.lastName.value,
      adminEmail: formData.adminEmail.value,
      adminType: formData.adminType.value,
      modules: checkboxes,
      phoneNumber: formData.phoneNumber.value,
    };

    if (!queryModel.modules.some((module: any) => module.isSelected)) {
      toast.error(t("Select at least one role"));
      return;
    }

    try {
      const res: AxiosResponse =
        await UserManagementService.saveAminUserManagment(queryModel);
      if (res?.data?.statusCode === 200) {
        toast.success(t(res?.data?.responseMessage));
        loadGridData(true, true);
        setOpen(false);
        setEditGridHeader(false);
        setFormData(initialState);
        setCheckboxes([]);
      } else {
        toast.error(t(res?.data?.responseMessage));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const alphabeticPattern = /^[A-Za-z]+$/;
  const changeHandlerForNames = (e: any) => {
    const { name, value } = e.target;

    // Check if the input value matches the alphabetic pattern
    if (alphabeticPattern.test(value) || value === "") {
      setFormData({
        ...formData,
        [name]: {
          ...formData[name],
          value: value,
        },
      });
    }
  };

  ////////////-----------------Get Data Against Roles and rights-------------------///////////////////
  const [checkboxes, setCheckboxes] = useState<any>([]);
  const GetDataAgainstRoles = async (RoleId: number) => {
    // UserManagementService?.GetDataAgainstRoles(RoleId)
    await UserManagementService?.getByIdAllUserRolesAndPermissions(RoleId)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          setCheckboxes(res?.data?.data.modules);
        } else if (res?.data?.status === 400) {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  ////////////-----------------Get Data Against Roles and rights by id- -------------------///////////////////
  const GetDataAgainstRolesByUserId = async (userId: string) => {
    await UserManagementService?.getByIdAllUserRolesAndPermissions(userId)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          setCheckboxes(res?.data?.data.modules);
        } else if (res?.data?.status === 400) {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const onClose = () => {
    setFormData(initialState);
    setErrors(false);
    setEditGridHeader(false);
    setCheckboxes([]);
    setOpen(false);
  };

  const ValidEmail = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      var validEmailRequest = {
        keyValue: e.target.value,
        id: null,
      };
      if (adminEmail === formData?.adminEmail?.value) {
        setIsEmailExistError("");
        return false;
      }

      Commonservice.isValidEmail(validEmailRequest)
        .then((res: AxiosResponse) => {
          if (res.data) {
            toast.error(t("Email Already Exist"));
            setIsEmailExistError(t("Email Already Exist"));
            // setIsEmailExistError('Email Already Exist')
          } else {
            setIsEmailExistError("");
          }
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  };
  //--------- get admin type -----------
  const loadData = () => {
    UserManagementService.GetAllUserRoleList(PortalTypeEnum.Admin)
      .then((res: AxiosResponse) => {
        setDropDownValues((pre: any) => {
          return {
            ...pre,
            UserGroupList: res?.data?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const nullObj = {
      id: "",
      firstName: "",
      lastName: "",
      adminEmail: "",
      adminType: "",
      userGroup: "",
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    UserManagementService.GetAllUser({
      pageIndex: curPage,
      pageSize: pageSize,
      requestModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total);
        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  return (
    <Context.Provider
      value={{
        open,
        setOpen,
        editGridHeader,
        setDataAndErrors,
        errors,
        changeHandler,
        changeHandlerForNames,
        formData,
        handleSubmit,
        dropDownValues,
        GetDataAgainstRoles,
        GetDataAgainstRolesByUserId,
        onClose,
        checkboxes,
        setCheckboxes,
        ValidEmail,
        isEmailExistError,
        setAdminEmail,
        adminEmail,
        setRows,
        loadData,
        loadGridData,
        setSearchRequest,
        searchRequest,
        setErrors,
        setEditGridHeader,
        setFormData,
        setPageSize,
        setCurPage,
        setTriggerSearchData,
        rows,
        loading,
        pageSize,
        curPage,
        showPage,
        prevPage,
        pageNumbers,
        initialSearchQuery,
        nextPage,
        totalPages,
        total,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useUserListContext = () => useContext(Context);
