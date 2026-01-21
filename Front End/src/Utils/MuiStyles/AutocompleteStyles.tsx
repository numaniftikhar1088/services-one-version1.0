export const AutocompleteStyle = () => ({
  "&  .MuiInputBase-root .MuiOutlinedInput-notchedOutline": {
    height: "calc(1.5em + 1.3rem + 2px) !important",
    padding: "0.97rem 1rem",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "2",
    backgroundClip: "padding-box",
    borderRadius: "0.85rem !important",
    border: "1px solid #E4E6EF",
    "&  .Mui-focused &:hover": {
      border: "none",
      outline: "none",
    },
  },
  "&  .MuiInputBase-input": {
    padding: "0 !important",
    width: "100% !important",
    border: "none",
    outline: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderWidth: "1px",
    borderColor: "#E4E6EF !important",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: "0.5px !important",
    borderColor: "#A9E08D !important",
  },
  "&.Mui-selected ": {
    background: "#FFFFFF",
    textTransform: "none",
    color: "green",
    borderTopRightRadius: '0.625rem',
    borderTopLeftRadius: '0.625rem',
  },
  "&..MuiTabPanel-root":{
    padding: 0
  }
});
