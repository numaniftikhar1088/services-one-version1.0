import { Decrypt, Encrypt } from "../Auth";

export const GetElementsFromArray = (array: any[], condition: any) => {
  return array.filter(condition);
};
export const GetSingleElementFromArray = (array: any[], condition: any) => {
  return array.find(condition);
};
export const checkPermissions = (array: any[], link: string) => {
  return array.some((i: any) => {
    return i.claims.some((j: any) => {
      return j.linkUrl === link;
    });
  });
};

/**
 * Function for setting a value into sessionStorage with encryption.
 * @param key - The key under which the value will be stored.
 * @param value - The value to be stored. It can be any type.
 */
export const setValueIntoSessionStorage = (key: string, value: any) => {
  if (value === undefined || value === null) return;

  try {
    const stringValue = JSON.stringify(value);
    const encryptedValue = Encrypt(stringValue);
    sessionStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error(
      `Error storing value in sessionStorage for key "${key}":`,
      error
    );
  }
};

/**
 * Function for retrieving a value from sessionStorage with decryption.
 * @param key - The key under which the value is stored.
 * @returns The decrypted value or null if not found or if an error occurs.
 */
export const getValueFromSessionStorage = (key: string): any | null => {
  try {
    const encryptedValue = sessionStorage.getItem(key);
    if (!encryptedValue) return null;

    const decryptedValue = Decrypt(encryptedValue);
    return JSON.parse(decryptedValue);
  } catch (error) {
    console.error(
      `Error retrieving or parsing value from sessionStorage for key "${key}":`,
      error
    );
    return null;
  }
};

export function setFaviconAndTitle(url: string, title: string): void {
  if (!url || !title) return;

  // Helper function to remove an existing element by ID
  const removeElementById = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      document.head.removeChild(element);
    }
  };

  // Remove any existing favicon elements
  removeElementById("dynamic-favicon");
  removeElementById("apple-touch-icon");

  // Create and configure new favicon elements
  const createFavicon = (
    id: string,
    rel: string,
    href: string
  ): HTMLLinkElement => {
    const link = document.createElement("link");
    link.id = id;
    link.rel = rel;
    link.href = href;
    return link;
  };

  const newFavicon = createFavicon("dynamic-favicon", "icon", url);
  const newAppleFavicon = createFavicon(
    "apple-touch-icon",
    "apple-touch-icon",
    url
  );

  // Append new favicon elements to the document head
  document.head.appendChild(newFavicon);
  document.head.appendChild(newAppleFavicon);

  // Update the document title
  document.title = title;
}

export function FindIndex(arr: any[], rid: any) {
  return arr.findIndex((i: any) => i.reqId === rid);
}

export const formatFileName = (fileName: string) => {
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return `${formattedDate}_${formattedTime}_${fileName}`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};