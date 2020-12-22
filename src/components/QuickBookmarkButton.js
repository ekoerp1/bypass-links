import { IconButton } from "@material-ui/core";
import BookmarkBorderTwoToneIcon from "@material-ui/icons/BookmarkBorderTwoTone";
import BookmarkTwoToneIcon from "@material-ui/icons/BookmarkTwoTone";
import { getCurrentTab } from "ChromeApi/tabs";
import { showQuickBookmarkPanel } from "GlobalActionCreators/index";
import { COLOR } from "GlobalConstants/color";
import { FIREBASE_DB_REF } from "GlobalConstants/index";
import { getActiveDisabledColor } from "GlobalUtils/color";
import { getByKey } from "GlobalUtils/firebase";
import md5 from "md5";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButtonLoader } from "./Loader";

const QuickBookmarkButton = memo(() => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.isSignedIn);
  const [bookmark, setBookmark] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const initBookmark = async () => {
    setIsFetching(true);
    const [{ url }] = await getCurrentTab();
    const snapshot = await getByKey(FIREBASE_DB_REF.bookmarks, md5(url));
    const bookmark = snapshot.val();
    setBookmark(bookmark);
    setIsFetching(false);
  };

  useEffect(() => {
    setIsFetching(isSignedIn);
    if (isSignedIn) {
      initBookmark();
    }
  }, [isSignedIn]);

  const handleClick = async () => {
    const payload = {};
    if (bookmark) {
      payload.isBookmarked = true;
      payload.title = decodeURIComponent(atob(bookmark.title));
      payload.url = decodeURIComponent(atob(bookmark.url));
    } else {
      const [{ url, title }] = await getCurrentTab();
      payload.isBookmarked = false;
      payload.title = title;
      payload.url = url;
    }
    dispatch(showQuickBookmarkPanel(payload));
  };

  if (isFetching) {
    return <IconButtonLoader />;
  }

  return bookmark ? (
    <IconButton
      aria-label="Bookmarked"
      component="span"
      style={getActiveDisabledColor(isSignedIn, COLOR.pink)}
      onClick={handleClick}
      disabled={!isSignedIn}
      title={isSignedIn ? "Bookmarked" : undefined}
    >
      <BookmarkTwoToneIcon fontSize="large" />
    </IconButton>
  ) : (
    <IconButton
      aria-label="NotBookmarked"
      component="span"
      style={getActiveDisabledColor(isSignedIn, COLOR.pink)}
      onClick={handleClick}
      disabled={!isSignedIn}
      title={isSignedIn ? "Not Bookmarked" : undefined}
    >
      <BookmarkBorderTwoToneIcon fontSize="large" />
    </IconButton>
  );
});

export default QuickBookmarkButton;