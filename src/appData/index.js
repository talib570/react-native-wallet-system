export let currentUser = {};
export let translator = "";
export let isAppLoaded = false;
export let currentUserID = null;

export const setCurrentUser = (userData, userID) => {
  currentUser = userData;
  currentUser["userID"] = userID;
};

export const setTranslatorObj = (translatorObj) => {
  translator = translatorObj;
};

export const setAppLoaded = (status) => {
  isAppLoaded = status;
};

export const setCurrentUserID = (userID) => {
  currentUserID = userID;
};
