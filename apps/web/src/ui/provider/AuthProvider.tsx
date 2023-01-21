import { STORAGE_KEYS } from '@bypass/shared';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { ROUTES } from '../constants/routes';
import { onAuthStateChange } from '../firebase/auth';
import { ITwoFactorAuth } from '../TwoFactorAuth/interface';
import { getFromLocalStorage } from './utils';

interface IAuthContext {
  user: User | null;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<IAuthContext['user']>(null);

  useEffect(() => {
    onAuthStateChange((_user: User | null) => setUser(_user));
  }, []);

  useEffect(() => {
    if (!user || router.pathname === ROUTES.BYPASS_LINKS_WEB) {
      return;
    }
    getFromLocalStorage<ITwoFactorAuth>(STORAGE_KEYS.twoFactorAuth).then(
      (twoFAData) => {
        if (!twoFAData) {
          return;
        }
        if (twoFAData.is2FAEnabled && !twoFAData.isTOTPVerified) {
          router.replace(ROUTES.BYPASS_LINKS_WEB);
        }
      }
    );
  }, [router, user]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useUser = () => {
  const { user } = useContext(AuthContext);

  return {
    user,
    isLoggedIn: Boolean(user?.uid),
  };
};
