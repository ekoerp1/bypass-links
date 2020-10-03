import { EXTENSION_STATE } from "../constants";
import { bypass } from "../utils/bypass";
import { showToast } from "../utils/showToast";

const setExtStateInStorage = (extState) => {
  chrome.storage.sync.set({ extState }, () => {
    console.log(`ExtensionState in storage is set to ${extState}.`);
  });
};

let extensionState = EXTENSION_STATE.ACTIVE;
setExtStateInStorage(extensionState);

const onUpdateCallback = (tabId, changeInfo) => {
  const { url } = changeInfo;
  if (url) {
    bypass(tabId, url, extensionState);
  }
};

const handleExtensionToggle = (command) => {
  if (command === "toggle_bypass_links_extension") {
    const isCurrentlyActive = extensionState === EXTENSION_STATE.ACTIVE;
    extensionState = isCurrentlyActive
      ? EXTENSION_STATE.INACTIVE
      : EXTENSION_STATE.ACTIVE;
    showToast(extensionState);
    setExtStateInStorage(extensionState);
  }
};

//Listen tab url change
chrome.tabs.onUpdated.addListener(onUpdateCallback);

//Listen key press for toggle
chrome.commands.onCommand.addListener(handleExtensionToggle);
