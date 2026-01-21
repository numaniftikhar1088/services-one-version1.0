import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import {
  getValueFromSessionStorage,
  setValueIntoSessionStorage,
} from "../../Utils/Common/CommonMethods";
import useLang from "../hooks/useLanguage";

export default function TranslationMenu({ handleClose }: any) {
  const { t } = useLang();
  const { changeLanguage, i18n } = useLang();
  const [language, setLanguage] = React.useState(
    getValueFromSessionStorage("lng") || "en"
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setValueIntoSessionStorage("lng", selectedLanguage);
    changeLanguage(selectedLanguage);
    const dir = i18n.dir(i18n.language);
    document.documentElement.dir = dir;
    handleClose();
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("Translation Language")}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          label="Translation Language"
          onChange={handleChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="pt">Portuguese</MenuItem>
          <MenuItem value="fr">French</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
