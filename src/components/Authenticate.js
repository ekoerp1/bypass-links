import { IconButton } from "@material-ui/core";
import CloudDoneTwoToneIcon from "@material-ui/icons/CloudDoneTwoTone";
import CloudOffTwoTone from "@material-ui/icons/CloudOffTwoTone";
import runtime from "ChromeApi/runtime";
import storage from "ChromeApi/storage";
import { setSignedInStatus } from "GlobalActionCreators/";
import { COLOR } from "GlobalConstants/color";
import { getActiveDisabledColor } from "GlobalUtils/color";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Authenticate = memo(() => {
  const dispatch = useDispatch();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const isExtensionActive = useSelector((state) => state.isExtensionActive);

  const handleSignIn = () => {
    runtime.sendMessage({ triggerSignIn: true }).then(({ isSignedIn }) => {
      setIsSignedIn(isSignedIn);
      dispatch(setSignedInStatus(isSignedIn));
    });
  };

  const handleSignOut = useCallback(() => {
    runtime.sendMessage({ triggerSignOut: true }).then(({ isSignedOut }) => {
      const isSignedIn = !isSignedOut;
      setIsSignedIn(isSignedIn);
      dispatch(setSignedInStatus(isSignedIn));
    });
  }, [dispatch]);

  useEffect(() => {
    storage.get(["isSignedIn"]).then(({ isSignedIn }) => {
      setIsSignedIn(isSignedIn);
      dispatch(setSignedInStatus(isSignedIn));
    });
  }, []);

  useEffect(() => {
    if (isSignedIn && !isExtensionActive) {
      handleSignOut();
    }
  }, [handleSignOut, isExtensionActive, isSignedIn]);

  return isSignedIn ? (
    <IconButton
      aria-label="SignOut"
      component="span"
      style={COLOR.green}
      onClick={handleSignOut}
      title="Click to SignOut"
      disabled={!isExtensionActive}
    >
      <CloudDoneTwoToneIcon fontSize="large" />
    </IconButton>
  ) : (
    <IconButton
      aria-label="SignIn"
      component="span"
      style={getActiveDisabledColor(isExtensionActive, COLOR.red)}
      onClick={handleSignIn}
      title="Click to SignIn"
      disabled={!isExtensionActive}
    >
      <CloudOffTwoTone fontSize="large" />
    </IconButton>
  );
});
