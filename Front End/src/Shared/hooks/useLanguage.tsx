import i18next from "i18next";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const useLang = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
  };

  return {
    t,
    i18n,
    i18next,
    changeLanguage,
  };
};

export default useLang;
