// Helper function to retrieve the billing data from sessionStorage or return an empty object if not available
const getStoredBillingData = (): Record<string, any> => {
  const storedData = sessionStorage.getItem("billingInsurances");
  return storedData ? JSON.parse(storedData) : {};
};

// Function to update sessionStorage with billing data
const updateSessionStorage = (billingInsurances: Record<string, any>) => {
  sessionStorage.setItem(
    "billingInsurances",
    JSON.stringify(billingInsurances)
  );
};

export const useBilling = () => {
  // Function to get current billing data directly from sessionStorage
  const getBillingData = () => getStoredBillingData();

  // Add billing info to sessionStorage
  // const addBillingInfo = (key: string, data: any) => {
  //   const currentData = getBillingData();
  //   const updatedData = { ...currentData, [key]: data };
  //   updateSessionStorage(updatedData);
  // };
  const addBillingInfo = async (key: string, data: any) => {
    const resolvedData = data instanceof Promise ? await data : data;
    const currentData = getBillingData();
    const updatedData = { ...currentData, [key]: resolvedData };
    updateSessionStorage(updatedData);
  };

  const removeBillingInfo = (key: string) => {
    const currentData = getBillingData();
    const { [key]: _, ...remainingInsurances } = currentData;
    const reIndexedInsurances = Object.values(remainingInsurances).reduce(
      (acc, item, index) => {
        acc[index] = item;
        return acc;
      },
      {} as Record<string, any>
    );
    updateSessionStorage(reIndexedInsurances);
  };

  // Clear all billing info from sessionStorage
  const clearBillingInfo = () => {
    updateSessionStorage({});
  };

  // Return functions to interact with billing data
  return {
    getBillingData,
    addBillingInfo,
    removeBillingInfo,
    clearBillingInfo,
  };
};
