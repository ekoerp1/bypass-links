import { SvgIcon } from '@mui/material';
import { BYPASS_KEYS } from 'GlobalConstants';
import runtime from 'GlobalHelpers/chrome/runtime';
import tabs, { getCurrentTab } from 'GlobalHelpers/chrome/tabs';
import { RootState } from 'GlobalReducers/rootReducer';
import useHistoryStore from 'GlobalStore/history';
import { matchHostnames } from 'GlobalUtils/common';
import { memo, useCallback, useEffect, useState } from 'react';
import { MdForum } from 'react-icons/md';
import { useSelector } from 'react-redux';
import StyledButton from './StyledButton';

const isCurrentPageForum = async (url = '') => {
  const hostname = url && new URL(url).hostname;
  return (
    (await matchHostnames(hostname, BYPASS_KEYS.FORUMS)) ||
    (await matchHostnames(hostname, BYPASS_KEYS.FORUMS_V2))
  );
};

const OpenForumLinks = memo(function OpenForumLinks() {
  const startHistoryMonitor = useHistoryStore(
    (state) => state.startHistoryMonitor
  );
  const { isSignedIn } = useSelector((state: RootState) => state.root);
  const [isFetching, setIsFetching] = useState(false);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [isActive, setIsActive] = useState(false);

  const initCurrentTab = async () => {
    const currentTab = await getCurrentTab();
    setCurrentTab(currentTab);
  };
  useEffect(() => {
    initCurrentTab();
  }, []);

  const initIsActive = useCallback(async () => {
    const isActive = isSignedIn && (await isCurrentPageForum(currentTab?.url));
    setIsActive(isActive);
  }, [currentTab?.url, isSignedIn]);

  useEffect(() => {
    initIsActive();
  }, [isSignedIn, currentTab, initIsActive]);

  const handleClick = async () => {
    setIsFetching(true);
    startHistoryMonitor();
    const { forumPageLinks } = await runtime.sendMessage<{
      forumPageLinks: string[];
      url: string;
    }>({
      getForumPageLinks: currentTab?.id,
      url: currentTab?.url,
    });
    forumPageLinks.forEach((url) => {
      tabs.create({ url, selected: false });
    });
    setIsFetching(false);
  };

  return (
    <StyledButton
      showSuccessColor={isActive}
      isLoading={isFetching}
      isDisabled={!isActive}
      onClick={handleClick}
      color="warning"
    >
      <SvgIcon>
        <MdForum />
      </SvgIcon>
    </StyledButton>
  );
});

export default OpenForumLinks;
