/*********************************

 File:       localstorage.js
 Function:   Adapted from old Angular service
 Copyright:  Bertco LLC
 Date:       10/7/2020
 Author:     mkahn

 **********************************/


function ukey(key: string): string {
  return "UD-" + key;
}

export const clear =  (key: string) => localStorage.removeItem(ukey(key));

export const setObjectForKey = (key: string, obj: object) => {
  const jsonObject = JSON.stringify(obj);
  localStorage.setItem(ukey(key), jsonObject);
}

export const getObjectForKey =  (key: string, defaultValue: object) => {
  const jsonObject = localStorage.getItem(ukey(key));
  if (jsonObject) {
    return JSON.parse(jsonObject);
  } else {
    return defaultValue || null;
  }
}

export const setBoolForKey =  (key: string, bool: boolean) => {
  localStorage.setItem(ukey(key), bool ? '1' : '-1');
}

export const getBoolForKey = (key: string, defaultValue: boolean) => {
  const boolVal = localStorage.getItem(ukey(key));
  if (boolVal) {
    return parseInt(boolVal) > 0;  //not a typo, extracts the truthiness
  } else {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      return null;
    }
  }
}

export const setIntForKey = function (key: string, intVal: number) {
  localStorage.setItem(ukey(key), intVal.toString(10));
}

export const getIntForKey =  (key: string, defaultValue: number) => {
  const stringObj = localStorage.getItem(ukey(key));
  if (stringObj) {
    return parseInt(stringObj);
  } else {
    return defaultValue || null;
  }
}

export const setStringForKey = (key: string, stringVal: string) => {
  localStorage.setItem(ukey(key), stringVal);
}

export const getStringForKey = function (key: string, defaultValue: string) {
  const stringObj = localStorage.getItem(ukey(key));
  if (stringObj) {
    return stringObj;
  } else {
    return defaultValue || null;
  }
}
