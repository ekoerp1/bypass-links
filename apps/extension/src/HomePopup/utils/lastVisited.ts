import { trpcApi } from '@/apis/trpcApi';
import { STORAGE_KEYS } from '@bypass/shared';

export const syncLastVisitedToStorage = async () => {
  const lastVisited = await trpcApi.firebaseData.lastVisitedGet.query();
  await chrome.storage.local.set({ [STORAGE_KEYS.lastVisited]: lastVisited });
};

export const resetLastVisited = async () => {
  await chrome.storage.local.remove(STORAGE_KEYS.lastVisited);
};
