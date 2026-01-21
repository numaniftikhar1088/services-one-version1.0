import { Button, Menu } from '@mui/material';
import { styled } from '@mui/material/styles';
// ******************* Grid Style *******************


export const StyledDropButton = styled(Button)(
    ({ theme }) => `
    text-transform: capitalize;
    border-radius: var(--bs-btn-border-radius);
    display: block;
     width: max-content !important; 
    `
);
export const StyledDropButtonThreeDots = styled(Button)(
    ({ theme }) => `
    text-transform: capitalize;
    border-radius: var(--bs-btn-border-radius);
    display: block;
    width: 30px !important; /* Set height value as width */
    height: 15px !important; /* Set width value as height */
    .icon {
        transform: rotate(90deg); /* Rotate the icon 90 degrees clockwise */
      }
     width: max-content !important; 
      `
 
);

export const StyledDropMenu = styled(Menu)(
    ({ theme }) => `
    & .MuiPaper-root{
        transition: none !important;
        margin-top: 42px !important;
        border-radius: 0.475rem;
        background-color: var(--kt-menu-dropdown-bg-color);
        box-shadow: 0px 0px 11px 2px rgba(82, 63, 105, 0.05);
        border: 1px solid var(--kt-gray-300) !important;
        z-index: 107;
        display: flex;
       
        will-change: transform;
        animation: menu-sub-dropdown-animation-fade-in .3s ease 1, menu-sub-dropdown-animation-move-up .3s ease 1;
        position: absolute;
        inset: 0px auto auto 0px;
        transform: translate3d(0px, 37.3333px, 0px);
         width: max-content !important; // Set width to max-content
         //min-width: 200px !important; // Set minimum width
        // max-width: 220px !important; // Set maximum width
        // width: auto !important; // Allow width to adjust based on content
        // white-space: normal !important; // Allow text to wrap
        

        & .MuiList-root{
            & .MuiMenuItem-root:hover{
                transition: color .2s ease;
                background-color: ${theme.palette.mode === "light" ? "var(--kt-primary-light)" : "var(--kt-primary-light)"};
                border-radius: 0.475rem;
                // width: max-content !important; 
                
            }
            & .MuiMenuItem-root {
                & a{
                padding: 6px 16px !important;
                width: max-content !important; // Set width to max-content
                }
            }
        }
    }
   

    `
);
export const StyledDropMenuMoreAction = styled(Menu)(
    ({ theme }) => `
    & .MuiPaper-root{
        transition: none !important;
        margin-left: 16px !important;   
        border-radius: 0.475rem;
        background-color: var(--kt-menu-dropdown-bg-color);
        box-shadow: 0px 0px 11px 2px rgba(82, 63, 105, 0.05);
        border: 1px solid var(--kt-gray-300) !important;
        z-index: 107;
        display: flex;
        will-change: transform;
        animation: menu-sub-dropdown-animation-fade-in .3s ease 1, menu-sub-dropdown-animation-move-up .3s ease 1;
        position: absolute;
        inset: 0px auto auto 0px;
        transform: translate3d(0px, 37.3333px, 0px);
         width: max-content !important; 


        & .MuiList-root{
            & .MuiMenuItem-root:hover{
                transition: color .2s ease;
                background-color: ${theme.palette.mode === "light" ? "var(--kt-primary-light)" : "var(--kt-primary-light)"};
                border-radius: 0.475rem;
                // width: max-content !important; 
                
            }
            & .MuiMenuItem-root {
                & a{
                padding: 6px 16px !important;
                  width: max-content !important; // Set width to max-content
                }
            }
        }
    }
   

    `
);

