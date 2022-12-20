import { SvgIcon, Typography } from '@mui/material';
import { BlackTooltip } from '@bypass/shared/components/StyledComponents';
import { defaultBookmarkFolder } from '@bypass/shared/components/Bookmarks/constants';
import { getCurrentTab } from '@helpers/chrome/tabs';
import { getBookmarks } from '@helpers/fetchFromStorage';
import md5 from 'md5';
import { memo, useEffect, useState } from 'react';
import { BiBookmarkPlus } from 'react-icons/bi';
import { RiBookmark3Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { BOOKMARK_OPERATION } from '@bypass/shared/components/Bookmarks/constants';
import { IBookmark } from '@bypass/shared/components/Bookmarks/interfaces';
import { BMPanelQueryParams } from '@bypass/shared/components/Bookmarks/interfaces/url';
import { getBookmarksPanelUrl } from '@bypass/shared/components/Bookmarks/utils/url';
import StyledButton from './StyledButton';
import { getDecodedBookmark } from '@bypass/shared/components/Bookmarks/utils';
import useBookmark from '@bypass/shared/components/Bookmarks/hooks/useBookmark';
import useAuthStore from '@store/auth';

const QuickBookmarkButton = memo(function QuickBookmarkButton() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const { getFolderFromHash } = useBookmark();
  const [bookmark, setBookmark] = useState<IBookmark | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const initBookmark = async () => {
    setIsFetching(true);
    const currentTab = await getCurrentTab();
    const url = currentTab?.url ?? '';
    const bookmarks = await getBookmarks();
    if (bookmarks) {
      const encodedBookmark = bookmarks.urlList[md5(url)];
      if (encodedBookmark) {
        const decodedBookmark = getDecodedBookmark(encodedBookmark);
        setBookmark(decodedBookmark);
      }
    }
    setIsFetching(false);
  };

  useEffect(() => {
    setIsFetching(isSignedIn);
    if (isSignedIn) {
      initBookmark();
    }
  }, [isSignedIn]);

  const handleClick = async () => {
    const urlParams = {} as Partial<BMPanelQueryParams>;
    if (bookmark) {
      const { url, parentHash } = bookmark;
      const parent = await getFolderFromHash(parentHash);
      urlParams.operation = BOOKMARK_OPERATION.EDIT;
      urlParams.bmUrl = url;
      urlParams.folderContext = atob(parent.name);
    } else {
      const { url } = await getCurrentTab();
      urlParams.operation = BOOKMARK_OPERATION.ADD;
      urlParams.bmUrl = url;
      urlParams.folderContext = defaultBookmarkFolder;
    }
    navigate(getBookmarksPanelUrl(urlParams));
  };

  return (
    <StyledButton
      showSuccessColor={isSignedIn}
      isLoading={isFetching}
      isDisabled={!isSignedIn}
      onClick={handleClick}
      color={bookmark ? 'success' : 'error'}
    >
      {bookmark ? (
        <BlackTooltip
          title={
            <Typography sx={{ fontSize: '13px' }}>
              {bookmark.title.length > 82
                ? `${bookmark.title.substring(0, 82)}...`
                : bookmark.title}
            </Typography>
          }
          arrow
          disableInteractive
        >
          <SvgIcon>
            <RiBookmark3Fill />
          </SvgIcon>
        </BlackTooltip>
      ) : (
        <SvgIcon>
          <BiBookmarkPlus />
        </SvgIcon>
      )}
    </StyledButton>
  );
});

export default QuickBookmarkButton;
