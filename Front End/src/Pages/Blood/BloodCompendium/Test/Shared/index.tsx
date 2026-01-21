export const closeMenuOnScroll = (e: any) => {
  const target = e.target as any;

  // Get the table container (adjust the selector if your table has a specific class or ID)
  const tableContainer = document.querySelector(".MuiTable-root");

  // Ensure we always return a boolean
  return (
    target === document.body ||
    target === document.documentElement ||
    target === window ||
    (tableContainer ? tableContainer.contains(target) : false)
  );
};
