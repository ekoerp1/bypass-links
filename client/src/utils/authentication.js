import storage from "ChromeApi/storage";
import { googleSignIn, googleSignOut } from "./firebase";
import { resetStorage, syncFirebaseToStorage } from "./sync";

export const signIn = async () => {
  try {
    const response = await googleSignIn();
    console.log("Login Success ", response);
    await syncFirebaseToStorage();
    storage.set({ isSignedIn: true });
    return true;
  } catch (err) {
    console.error("Error occured while signing in. ", err);
    return false;
  }
};

export const signOut = async () => {
  try {
    await resetStorage();
    await googleSignOut();
    console.log("Logout Success");
    storage.set({ isSignedIn: false, redirections: null });
    return true;
  } catch (err) {
    console.error("Error occured while signing out. ", err);
    return false;
  }
};