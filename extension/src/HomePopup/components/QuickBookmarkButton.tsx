import {
  BOOKMARK_OPERATION,
  defaultBookmarkFolder,
} from '@bypass/shared/components/Bookmarks/constants';
import useBookmark from '@bypass/shared/components/Bookmarks/hooks/useBookmark';
import { IBookmark } from '@bypass/shared/components/Bookmarks/interfaces';
import { BMPanelQueryParams } from '@bypass/shared/components/Bookmarks/interfaces/url';
import { getDecodedBookmark } from '@bypass/shared/components/Bookmarks/utils';
import { getBookmarksPanelUrl } from '@bypass/shared/components/Bookmarks/utils/url';
import { getCurrentTab } from '@helpers/chrome/tabs';
import { getBookmarks } from '@helpers/fetchFromStorage';
import { Button, HoverCard, Text } from '@mantine/core';
import useAuthStore from '@store/auth';
import md5 from 'md5';
import { memo, useEffect, useState } from 'react';
import { BiBookmarkPlus } from 'react-icons/bi';
import { RiBookmark3Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const QuickBookmarkButton = memo(function QuickBookmarkButton() {
  const navigate = useNavigate();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const { getFolderFromHash } = useBookmark();
  const [bookmark, setBookmark] = useState<IBookmark | null>(null);
  const [isFetching, setIsFetching] = useState(false);

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
    <HoverCard
      withArrow
      width="90%"
      openDelay={0}
      closeDelay={0}
      disabled={!bookmark}
    >
      <HoverCard.Target>
        <Button
          variant="light"
          radius="xl"
          loaderPosition="right"
          loading={isFetching}
          disabled={!isSignedIn}
          onClick={handleClick}
          rightIcon={bookmark ? <RiBookmark3Fill /> : <BiBookmarkPlus />}
          fullWidth
          color={bookmark ? 'teal' : 'red'}
        >
          {bookmark ? 'Unpin' : 'Pin'}
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="xs">{bookmark?.title}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
});

export default QuickBookmarkButton;
