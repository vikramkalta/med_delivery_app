const getItem = (key) => {
  let storageItem = localStorage.getItem(key);
  if (storageItem) {
    try {
      storageItem = JSON.parse(storageItem);
    } catch (error) {
      console.log("Data type is not json", error);
    }
    return storageItem;
  } else {
    return null;
  }
};
const setItem = (key, value) => {
  try {
    value = JSON.stringify(value);
  } catch (error) {
    console.log("Data type is not json", error);
  }
  localStorage.setItem(key, value);
};
const removeItem = (key) => localStorage.removeItem(key);

export { getItem, setItem, removeItem };
