import { defaultBookmarkFolder } from "GlobalConstants/index";
import { ROUTES } from "GlobalConstants/routes";
import { serialzeObjectToQueryString } from "GlobalUtils/url";
import md5 from "md5";

export const getFaviconUrl = (url) =>
  `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;

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