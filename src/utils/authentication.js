import storage from "ChromeApi/storage";
import { resetRedirections } from "./redirect";
import { googleSignIn, googleSignOut } from "./firebase";
import { syncFirebaseToStorage } from "./syncFirebaseToStorage";

export const signIn = async () => {
  try {
    const response = await googleSignIn();
    console.log("Login Success ", response);
    syncFirebaseToStorage();
    storage.set({ isSignedIn: true });
    return true;
  } catch (err) {
    console.error("Error occured while signing in. ", err);
    return false;
  }
};

export const signOut = async () => {
  try {
    const response = await googleSignOut();
    console.log("Logout Success ", response);
    storage.set({ isSignedIn: false, redirections: null });
    resetRedirections();
    return true;
  } catch (err) {
    console.error("Error occured while signing out. ", err);
    return false;
  }
};
