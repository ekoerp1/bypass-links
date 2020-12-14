import { IconButton } from "@material-ui/core";
import OpenInNewTwoToneIcon from "@material-ui/icons/OpenInNewTwoTone";
import runtime from "ChromeApi/runtime";
import tabs from "ChromeApi/tabs";
import { COLOR } from "GlobalConstants/color";
import { getActiveDisabledColor } from "GlobalUtils/color";
import React, { memo } from "react";
import { useSelector } from "react-redux";

export const OpenDefaultsButton = memo(() => {
  const isSignedIn = useSelector((state) => state.isSignedIn);

  const handleOpenDefaults = () => {
    runtime.sendMessage({ getDefaults: true }).then(({ defaults }) => {
      defaults
        .filter((data) => data && data.alias && data.website)
        .forEach(({ website }) => {
          tabs.create({ url: atob(website), selected: false });
        });
    });
  };

  return (
    <IconButton
      aria-label="OpenDefaults"
      component="span"
      style={getActiveDisabledColor(isSignedIn, COLOR.teal)}
      onClick={handleOpenDefaults}
      disabled={!isSignedIn}
      title={isSignedIn ? "Open Defaults" : undefined}
    >
      <OpenInNewTwoToneIcon fontSize="large" />
    </IconButton>
  );
});