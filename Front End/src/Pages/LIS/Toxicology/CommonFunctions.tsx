interface DataObject {
  [key: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  invalidField: string | null;
}

export const validateFields = (data: DataObject, ignoreFields: string[] = []): ValidationResult => {
  const keysArr: string[] = [];

  for (const [key] of Object.entries(data)) {
    if (key !== "ID" && !ignoreFields.includes(key)) {
      keysArr.push(key);
    }
  }

  for (const field of keysArr) {
    if (!data[field]) {
      return { isValid: false, invalidField: field };
    }
  }

  return { isValid: true, invalidField: null };
};
 