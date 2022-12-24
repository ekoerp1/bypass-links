import { syncLastVisitedToStorage } from '@/HomePopup/utils/lastVisited';
import { FIREBASE_DB_REF } from '@bypass/shared/constants/firebase';
import { getCurrentTab } from '@helpers/chrome/tabs';
import { getLastVisited } from '@helpers/fetchFromStorage';
import { saveToFirebase } from '@helpers/firebase/database';
import { Button, HoverCard, Text } from '@mantine/core';
import useAuthStore from '@store/auth';
import md5 from 'md5';
import { memo, useEffect, useState } from 'react';
import { FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import { LastVisited } from '../interfaces/lastVisited';

const LastVisitedButton = memo(function LastVisitedButton() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const [isFetching, setIsFetching] = useState(false);
  const [lastVisited, setLastVisited] = useState('');
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [lastVisitedObj, setLastVisitedObj] = useState<LastVisited>({});

  const initLastVisited = async () => {
    setIsFetching(true);
    const lastVisitedObj = await getLastVisited();

    const currentTab = await getCurrentTab();
    const { hostname } = new URL(currentTab.url ?? '');
    const lastVisitedDate = lastVisitedObj[md5(hostname)];
    let displayInfo = '';
    if (lastVisitedDate) {
      const date = new Date(lastVisitedDate);
      displayInfo = `${date.toDateString()}, ${date.toLocaleTimeString()}`;
    }
    setLastVisited(displayInfo);
    setLastVisitedObj(lastVisitedObj);
    setCurrentTab(currentTab);
    setIsFetching(false);
  };

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    initLastVisited();
  }, [isSignedIn, lastVisited]);

  const handleUpdateLastVisited = async () => {
    setIsFetching(true);
    const { hostname } = new URL(currentTab?.url ?? '');
    lastVisitedObj[md5(hostname)] = Date.now();
    const isSuccess = await saveToFirebase(
      FIREBASE_DB_REF.lastVisited,
      lastVisitedObj
    );
    if (isSuccess) {
      await syncLastVisitedToStorage();
    }
    await initLastVisited();
    setIsFetching(false);
  };

  return (
    <HoverCard
      withArrow
      width="90%"
      openDelay={0}
      closeDelay={0}
      disabled={!lastVisited}
    >
      <HoverCard.Target>
        <Button
          variant="light"
          radius="xl"
          loaderPosition="right"
          loading={isFetching}
          disabled={!isSignedIn}
          onClick={handleUpdateLastVisited}
          rightIcon={lastVisited ? <FaCalendarCheck /> : <FaCalendarTimes />}
          fullWidth
          color={lastVisited ? 'teal' : 'red'}
        >
          Visited
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="xs">{lastVisited}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
});

export default LastVisitedButton;
