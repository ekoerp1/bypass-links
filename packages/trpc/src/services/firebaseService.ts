import { getFirebasePublicConfig, getFullDbPath } from '@bypass/shared';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

interface Firebase {
  ref: string;
  uid?: string;
  isAbsolute?: boolean;
  data: any;
}

/**
 * We split the credentials json that we get from firebase admin because:
 * Vercel stringifies the json and JSON.parse fails on the private key.
 *
 * SERVICE_ACCOUNT_KEY: contains the credetials json except the private_key
 * FIREBASE_PRIVATE_KEY: contains the private key
 */

const firebasePublicConfig = getFirebasePublicConfig();

const getFirebaseCredentials = () => {
  const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY ?? '');
  return cert({
    ...serviceAccountKey,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
  });
};

const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: getFirebaseCredentials(),
        databaseURL: firebasePublicConfig.databaseURL,
      });

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

/**
 * REALTIME DATABASE
 */
export const getFromFirebase = async ({
  ref,
  uid,
  isAbsolute,
}: Omit<Firebase, 'data'>) =>
  database.ref(getFullDbPath(ref, uid, isAbsolute)).once('value');

export const saveToFirebase = async ({
  ref,
  uid,
  data,
  isAbsolute,
}: Firebase) => database.ref(getFullDbPath(ref, uid, isAbsolute)).set(data);

export const removeFromFirebase = async ({
  ref,
  uid,
  isAbsolute,
}: Omit<Firebase, 'data'>) =>
  database.ref(getFullDbPath(ref, uid, isAbsolute)).remove();

export const getUser = (uid: string) => auth.getUser(uid);