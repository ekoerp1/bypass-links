import { IconButton } from "@material-ui/core";
import CollectionsBookmarkTwoToneIcon from "@material-ui/icons/CollectionsBookmarkTwoTone";
import { COLOR } from "GlobalConstants/color";
import { ROUTES } from "GlobalConstants/routes";
import { getActiveDisabledColor } from "GlobalUtils/color";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const BookmarksPanelButton = memo(() => {
  const isSignedIn = useSelector((state) => state.isSignedIn);
  const history = useHistory();

  const handleShowEditPanel = () => {
    history.push(ROUTES.BOOKMARK_PANEL);
  };

  return (
    <IconButton
      aria-label="OpenBookmarsPanel"
      component="span"
      style={getActiveDisabledColor(isSignedIn, COLOR.blue)}
      onClick={handleShowEditPanel}
      disabled={!isSignedIn}
      title={isSignedIn ? "Open Bookmarks Panel" : undefined}
    >
      <CollectionsBookmarkTwoToneIcon fontSize="large" />
    </IconButton>
  );
});

export default BookmarksPanelButton;
