export const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  ID_TOKEN: "id_token",
  USER: "user",
};

export const setStorageItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getStorageItem = (key: string) => {
  return localStorage.getItem(key);
};

export const removeStorageItem = (key: string) => {
  localStorage.removeItem(key);
};

export const clearStorage = () => {
  localStorage.clear();
};
