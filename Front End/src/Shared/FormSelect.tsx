import useLang from "./hooks/useLanguage"
const FormSelect = () => {
  const { t } = useLang()
  return (
    <select name="cars" id="cars">
      <option value="">{t("Select Option")}</option>
      <option value="true">{t("Active")}</option>
      <option value="false">{t("InActive")}</option>
    </select>
  )
}

export default FormSelect
