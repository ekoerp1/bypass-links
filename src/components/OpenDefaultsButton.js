import { IconButton } from "@material-ui/core";
import OpenInNewTwoToneIcon from "@material-ui/icons/OpenInNewTwoTone";
import tabs from "ChromeApi/tabs";
import { startHistoryMonitor } from "GlobalActionCreators/index";
import { FIREBASE_DB_REF } from "GlobalConstants/index";
import { COLOR } from "GlobalConstants/color";
import { getActiveDisabledColor } from "GlobalUtils/color";
import { searchOnValue } from "GlobalUtils/firebase";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButtonLoader } from "./Loader";

export const OpenDefaultsButton = memo(() => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.isSignedIn);
  const [isFetching, setIsFetching] = useState(false);

  const handleOpenDefaults = async () => {
    setIsFetching(true);
    dispatch(startHistoryMonitor());
    const snapshot = await searchOnValue(
      FIREBASE_DB_REF.redirections,
      "isDefault",
      true
    );
    const defaults = snapshot.val();
    defaults
      .filter((data) => data && data.alias && data.website)
      .forEach(({ website }) => {
        tabs.create({ url: atob(website), selected: false });
      });
    setIsFetching(false);
  };

  if (isFetching) {
    return <IconButtonLoader />;
  }

  return (
    <IconButton
      aria-label="OpenDefaults"
      component="span"
      style={getActiveDisabledColor(isSignedIn, COLOR.deepPurple)}
      onClick={handleOpenDefaults}
      disabled={!isSignedIn}
      title={isSignedIn ? "Open Defaults" : undefined}
    >
      <OpenInNewTwoToneIcon fontSize="large" />
    </IconButton>
  );
});
