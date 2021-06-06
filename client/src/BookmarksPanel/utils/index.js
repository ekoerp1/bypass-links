import storage from "ChromeApi/storage";
import { defaultBookmarkFolder, STORAGE_KEYS } from "GlobalConstants";
import { ROUTES } from "GlobalConstants/routes";
import { serialzeObjectToQueryString } from "GlobalUtils/url";
import md5 from "md5";
import { BM_COUNT_IN_INITAL_VIEW } from "../constants";

export const getFaviconUrl = (url) =>
  `https://www.google.com/s2/favicons?sz=64&domain_url=${
    new URL(url).hostname
  }`;

export const getBookmarksPanelUrl = ({
  folder,
  addBookmark,
  editBookmark,
  url,
  title,
}) => {
  const qsObj = {
    folderContext: folder || defaultBookmarkFolder,
    addBookmark: addBookmark || false,
    editBookmark: editBookmark || false,
    bmUrl: url || "",
    bmTitle: title || "",
  };
  return `${ROUTES.BOOKMARK_PANEL}?${serialzeObjectToQueryString(qsObj)}`;
};

export const getAllFolderNames = (folderList) =>
  Object.entries(folderList).map(([_key, value]) => atob(value.name));

export const isFolderEmpty = (folders, name) => {
  const folder = folders[md5(name)];
  return !folder || folder.length < 1;
};

export const isFolderContainsDir = (folders, hash) =>
  folders[hash] && folders[hash].some(({ isDir }) => isDir);

export const isInInitalView = (position) => position < BM_COUNT_IN_INITAL_VIEW;

export const shouldRenderBookmarks = (folders, contextBookmarks) =>
  folders && contextBookmarks && contextBookmarks.length > 0;

export const getBookmarksObj = async () => {
  const { [STORAGE_KEYS.bookmarks]: bookmarks } = await storage.get(
    STORAGE_KEYS.bookmarks
  );
  return bookmarks;
};

export const getFromHash = async (isDir, hash) => {
  const bookmarks = await getBookmarksObj();
  return isDir ? bookmarks.folderList[hash] : bookmarks.urlList[hash];
};

export const getDecodedBookmark = (bookmark) => ({
  url: decodeURIComponent(atob(bookmark.url)),
  title: decodeURIComponent(atob(bookmark.title)),
  parentHash: bookmark.parentHash,
  taggedPersons: bookmark.taggedPersons,
});

export const getDestinationIndex = (destIndex, selectedBookmarks) => {
  const draggedBookmarksBeforeDestIndex = selectedBookmarks.filter(
    (isSelected, index) => isSelected && index < destIndex
  ).length;
  return draggedBookmarksBeforeDestIndex === 0
    ? destIndex
    : destIndex - draggedBookmarksBeforeDestIndex + 1;
};

export const getBookmarksAfterDrag = (
  bookmarks,
  selectedBookmarks,
  destIndex
) => {
  const { draggedBookmarks, notDraggedBookmarks } = bookmarks.reduce(
    (output, bookmark, index) => {
      if (selectedBookmarks[index]) {
        output.draggedBookmarks.push(bookmark);
      } else {
        output.notDraggedBookmarks.push(bookmark);
      }
      return output;
    },
    { draggedBookmarks: [], notDraggedBookmarks: [] }
  );
  notDraggedBookmarks.splice(destIndex, 0, ...draggedBookmarks);
  return notDraggedBookmarks;
};

export const getSelectedBookmarksAfterDrag = (selectedBookmarks, destIndex) => {
  const selectedBookmarksCount = selectedBookmarks.filter(Boolean).length;
  const selectedBookmarksInNewOrder = selectedBookmarks.fill(false);
  for (let i = destIndex; i < destIndex + selectedBookmarksCount; i++) {
    selectedBookmarksInNewOrder[i] = true;
  }
  return [...selectedBookmarksInNewOrder];
};
