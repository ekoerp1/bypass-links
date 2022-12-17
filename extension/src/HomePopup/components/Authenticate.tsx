import { Dialog, LinearProgress, SvgIcon, Typography } from '@mui/material';
import { setSignedInStatus } from 'GlobalActionCreators';
import { displayToast } from 'GlobalActionCreators/toast';
import { getUserProfile } from 'GlobalHelpers/fetchFromStorage';
import { RootState } from 'GlobalReducers/rootReducer';
import useAuthStore from 'GlobalStore/auth';
import { memo, useCallback, useEffect, useState } from 'react';
import { RiLoginCircleFill, RiLogoutCircleRFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signOut } from '../utils/authentication';
import StyledButton from './StyledButton';

const Authenticate = memo(function Authenticate() {
  const dispatch = useDispatch();
  const authProgress = useAuthStore((state) => state.authProgress);
  const resetAuthProgress = useAuthStore((state) => state.resetAuthProgress);
  const [isFetching, setIsFetching] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { isExtensionActive } = useSelector(
    (state: RootState) => state.extension
  );

  const handleSignIn = async () => {
    setIsFetching(true);
    const isSignedIn = await signIn();
    setIsSignedIn(isSignedIn);
    dispatch(setSignedInStatus(isSignedIn));
    resetAuthProgress();
    setIsFetching(false);
  };

  const handleSignOut = useCallback(async () => {
    setIsFetching(true);
    const isSignedOut = await signOut();
    if (!isSignedOut) {
      dispatch(
        displayToast({
          message: 'Error while logging out',
          severity: 'error',
        })
      );
    } else {
      const isSignedIn = !isSignedOut;
      setIsSignedIn(isSignedIn);
      dispatch(setSignedInStatus(isSignedIn));
    }
    setIsFetching(false);
    resetAuthProgress();
  }, [dispatch, resetAuthProgress]);

  const init = useCallback(async () => {
    const userProfile = await getUserProfile();
    const isSignedIn = Boolean(userProfile);
    setIsSignedIn(isSignedIn);
    dispatch(setSignedInStatus(isSignedIn));
  }, [dispatch]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isSignedIn && !isExtensionActive) {
      handleSignOut();
    }
  }, [handleSignOut, isExtensionActive, isSignedIn]);

  const {
    message,
    progress = 0,
    progressBuffer = 0,
    total = 1,
  } = authProgress || {};
  return (
    <>
      <StyledButton
        showSuccessColor={isSignedIn}
        isLoading={isFetching}
        isDisabled={!isExtensionActive}
        onClick={isSignedIn ? handleSignOut : handleSignIn}
        color="success"
      >
        <SvgIcon>
          {isSignedIn ? <RiLogoutCircleRFill /> : <RiLoginCircleFill />}
        </SvgIcon>
      </StyledButton>
      {isFetching && (
        <Dialog
          sx={{
            '.MuiPaper-root': {
              m: 0,
              top: 0,
              width: '100%',
              position: 'fixed',
              borderRadius: '0px',
              backgroundColor: 'unset',
              backgroundImage: 'unset',
            },
          }}
          open
        >
          <LinearProgress
            variant="buffer"
            value={(progress * 100) / total}
            valueBuffer={(progressBuffer * 100) / total}
            color="secondary"
          />
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontSize: '9px',
              fontStyle: 'italic',
            }}
          >
            {message || 'Loading'}
          </Typography>
        </Dialog>
      )}
    </>
  );
});

export default Authenticate;
