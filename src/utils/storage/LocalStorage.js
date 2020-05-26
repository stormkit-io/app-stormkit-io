import SessionStorage, { fallbackStore } from "./SessionStorage";

const w = typeof window !== "undefined";

// istanbul ignore if
if (w && "localStorage" in window === false) {
  throw new Error("Browser unsupported. Please upgrade your browser");
}

const UNDEF = void 0;
const storage = w
  ? window.localStorage
  : /* istanbul ignore next */ fallbackStore;

/**
 * The constructor. If value is provided, the function will be used as a setter,
 * otherwise a getter.
 *
 * @param {string} key
 * @param {*|=} value
 * @return {*}
 * @constructor
 */
const LocalStorage = (key, value) => {
  if (value !== UNDEF) {
    return LocalStorage.set(key, value);
  } else {
    return LocalStorage.get(key);
  }
};

LocalStorage.fallbackStorage = SessionStorage;

/**
 * Set a key-value pair. The value will be automatically JSON.stringify-ed.
 *
 * @param {string} key
 * @param {*} value
 * @return {*} The value provided
 */
LocalStorage.set = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    LocalStorage.fallbackStorage.set(key, value);
  }

  return value;
};

/**
 * Return the stored value. The return value will be JSON.parse-d automatically.
 *
 * @param {string} key
 * @param {*|=} retVal The default return value.
 * @return {*} A parsed json object or null if value does not exist
 */
LocalStorage.get = (key, retVal = null) => {
  try {
    const value =
      storage.getItem(key) || LocalStorage.fallbackStorage.get(key, retVal);
    return JSON.parse(value) || retVal;
  } catch (e) {
    return retVal;
  }
};

/**
 * Delete the key from localStorage.
 *
 * @param {string} key
 * @return {*} The deleted value
 */
LocalStorage.del = key => {
  const value = LocalStorage.get(key);
  storage.removeItem(key);
  return value;
};

/**
 * Clear the local storage.
 */
LocalStorage.clear = () => storage.clear();

export default LocalStorage;
