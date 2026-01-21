import { Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getIntegrationCategories } from "Services/MarketPlace";

export function MarketplaceSidebar({
  loadData,
  setSearchRequest,
}: {
  loadData: Function;
  setSearchRequest: Function;
}) {
  const [integrationsCategories, setIntegrationCategories] = useState([]);
  const [dataLoader, setDataLoader] = useState(false);

  const getIntegrationCategoriesApi = () => {
    setDataLoader(true);
    getIntegrationCategories()
      .then((res: any) => {
        setIntegrationCategories(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setDataLoader(false);
      });
  };

  const handleSelectCategory = (category: any, loadData: Function) => {
    const payload = {
      searchString: "",
      integrationType: category,
    };
    setSearchRequest((prev: any) => ({
      ...prev,
      searchString: category,
    }));
    loadData(false, payload);
  };

  useEffect(() => {
    getIntegrationCategoriesApi();
  }, []);

  return (
    <div className="bg-white shadow-sm rounded-2" style={{ height: "90vh", position: "sticky" }}>
      {/* Header - Fixed at top */}
      <div className="px-2 pt-6 pb-4">
        <span className="p-3" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
          Categories
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-auto" style={{ height: "calc(100% - 80px)" }}>
        <div className="p-2">
          {["All Categories", ...integrationsCategories].map(
            (category, index) => (
              <div key={index} className="mb-1">
                <Typography
                  sx={{
                    minHeight: "40px",
                    padding: "8px 8px 0px 8px",
                    "&:hover": { color: "#69A54B" },
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onClick={() =>
                    handleSelectCategory(
                      category === "All Categories" ? "" : category,
                      loadData
                    )
                  }
                >
                  {category}
                  {index === integrationsCategories.length ? null : (
                    <Divider
                      sx={{
                        borderColor: "black",
                        borderStyle: "dotted",
                        marginTop: "8px",
                        // borderWidth: "2px",
                        // borderRadius: "1px",
                        borderDasharray: "1, 6",
                      }}
                    />
                  )}
                </Typography>
                {/* <Accordion
                defaultExpanded={category.name === "Software & IT Solutions"}
                elevation={0}
                sx={{
                  boxShadow: "none",
                  "&:before": { display: "none" },
                  backgroundColor: "transparent",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    minHeight: "40px",
                    "& .MuiAccordionSummary-content": { margin: "8px 0" },
                    padding: "0 8px",
                    "&:hover": { backgroundColor: "#f8f9fa" },
                  }}
                >
                  {category.name}
                </AccordionSummary>
                <AccordionDetails sx={{ padding: "0 0 8px 24px" }}>
                  <List dense sx={{ padding: 0 }}>
                    {category.subcategories.map((sub, subIndex) => (
                      <ListItem key={subIndex} sx={{ padding: "2px 0" }}>
                        <ListItemIcon sx={{ minWidth: "32px" }}>
                          <Checkbox
                            checked={sub.active}
                            size="small"
                            sx={{
                              padding: "2px",
                              color: "#28a745",
                              "&.Mui-checked": { color: "#28a745" },
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={sub.name}
                          primaryTypographyProps={{
                            variant: "body2",
                            className: sub.active ? "text-dark" : "text-muted",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion> */}
              </div>
            )
          )}
        </div>
      </div>

      {/* <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
      `}</style> */}
    </div>
  );
}
