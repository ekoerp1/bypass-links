import { IBookmarksObj, STORAGE_KEYS } from '@bypass/shared';

export const getAllFolderNames = (folderList: IBookmarksObj['folderList']) =>
  Object.entries(folderList).map(([_key, value]) => atob(value.name));

export const isFolderContainsDir = (
  folders: IBookmarksObj['folders'],
  hash: string
) => folders[hash] && folders[hash].some(({ isDir }) => isDir);

export const setBookmarksInStorage = async (bookmarksObj: IBookmarksObj) => {
  await chrome.storage.local.set({
    [STORAGE_KEYS.bookmarks]: bookmarksObj,
    hasPendingBookmarks: true,
  });
};
