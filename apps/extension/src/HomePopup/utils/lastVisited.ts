import { FIREBASE_DB_REF, STORAGE_KEYS } from '@bypass/shared';
import storage from '@helpers/chrome/storage';
import { getFromFirebase } from '@helpers/firebase/database';
import { LastVisited } from '../interfaces/lastVisited';

export const syncLastVisitedToStorage = async () => {
  const lastVisited = await getFromFirebase<LastVisited>(
    FIREBASE_DB_REF.lastVisited
  );
  await storage.set({ [STORAGE_KEYS.lastVisited]: lastVisited });
  console.log(`Last visited is set to`, lastVisited);
};

export const resetLastVisited = async () => {
  await storage.remove(STORAGE_KEYS.lastVisited);
};
