import { EXTENSION_STATE, FIREBASE_DB_REF } from "../constants";
import { signIn, signOut } from "../utils/authentication";
import { bypass, redirect } from "../utils/bypass";
import {
  getExtensionState,
  isExtensionActive,
  setExtStateInStorage,
} from "../utils/common";
import { saveDataToFirebase } from "../utils/extensionIndex";
import { getFromFirebase } from "../utils/firebase";
import { syncFirebaseToStorage } from "../utils/syncFirebaseToStorage";

const onUpdateCallback = async (tabId, changeInfo) => {
  const { url } = changeInfo;
  const extState = await getExtensionState();
  if (url && isExtensionActive(extState)) {
    const currentTabUrl = new URL(url);
    bypass(tabId, currentTabUrl);
    redirect(tabId, currentTabUrl);
  }
};

const onFirstTimeInstall = () => {
  setExtStateInStorage(EXTENSION_STATE.ACTIVE);
  syncFirebaseToStorage();
};

const onMessageReceive = (message, sender, sendResponse) => {
  if (message.triggerSignIn) {
    signIn().then((isSignedIn) => {
      sendResponse({ isSignedIn });
    });
  } else if (message.triggerSignOut) {
    signOut().then((isSignedOut) => {
      sendResponse({ isSignedOut });
    });
  } else if (message.getRedirections) {
    getFromFirebase(FIREBASE_DB_REF.redirections).then((snapshot) => {
      sendResponse({ redirections: snapshot.val() });
    });
  } else if (message.saveRedirectionRules) {
    saveDataToFirebase(message.saveRedirectionRules, sendResponse);
  }
  return true;
};

const onStorageChange = (changedObj, storageType) => {
  if (storageType !== "sync") {
    return;
  }
  const { extState } = changedObj;
  if (extState) {
    const icon = isExtensionActive(extState.newValue)
      ? "bypass_link_on_128.png"
      : "bypass_link_off_128.png";
    chrome.browserAction.setIcon({ path: icon });
  }
};

//Listen tab url change
chrome.tabs.onUpdated.addListener(onUpdateCallback);

//First time extension install
chrome.runtime.onInstalled.addListener(onFirstTimeInstall);

//Listen to dispatched messages
chrome.runtime.onMessage.addListener(onMessageReceive);

//Listen to chrome storage changes
chrome.storage.onChanged.addListener(onStorageChange);
