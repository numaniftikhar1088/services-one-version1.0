import { TreeItem } from '@mui/lab';
import { styled } from '@mui/material/styles';


export const StyledTreeItem = styled(TreeItem)(
    ({ theme }) => `
    & .MuiTreeItem-root, & .Mui-selected, & .Mui-focused {
        background: ${theme.palette.mode === "light" ? "transparent" : "transparent"};
    }
    & .MuiTreeItem-content{
        align-items: flex-start;
        & .MuiTreeItem-iconContainer {
            margin-top: 11px;
        }
    & .MuiFormControlLabel-root {
        align-items: flex-start;
        & .MuiTypography-root {
            padding-top: 13px !important;
            font-weight: 700;
            & p {
                margin-top: 6px;
                font-weight: 400;
                font-size: 10px;
            }
        }
    }
    }
    `
);