import scripting from "GlobalHelpers/chrome/scripting";
import tabs from "GlobalHelpers/chrome/tabs";

const automate = () => {
  const menuOptionButton = document.querySelector<HTMLButtonElement>(
    "[aria-label^='More menu options']"
  );
  menuOptionButton?.click();
  const menuOptions = document.querySelector<HTMLDivElement>(
    "[aria-label^='Search Menu'] div"
  )?.children as unknown as HTMLElement[];
  if (!menuOptions) {
    return;
  }
  const menuOption = [...menuOptions].find(
    (option) => option.innerText === "Delete activity by"
  );
  menuOption?.click();
  setTimeout(() => {
    const timeRangeOptions = document.querySelector<HTMLUListElement>(
      "[aria-label^='Time range selection']"
    )?.children as unknown as HTMLElement[];
    if (!timeRangeOptions) {
      return;
    }
    const option = [...timeRangeOptions].find(
      (option) => option.innerText === "Last hour"
    );
    option?.dispatchEvent(
      new MouseEvent("mousedown", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
    option?.dispatchEvent(
      new MouseEvent("mouseup", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
  }, 500);
};

export const manageGoogleActivity = async () => {
  const tab = await tabs.create({
    url: "https://myactivity.google.com/activitycontrols/webandapp",
  });
  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (info.status === "complete" && tabId === tab.id) {
      await scripting.executeScript({
        target: { tabId },
        func: automate,
      });
      setTimeout(() => {
        tabs.remove(tabId);
      }, 3000);
    }
  });
};
