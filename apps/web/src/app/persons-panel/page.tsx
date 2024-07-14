'use client';

import { openNewTab } from '@app/utils';
import { getFromLocalStorage } from '@app/utils/storage';
import {
  decryptionMapper,
  getFilteredPersons,
  Header,
  IPerson,
  IPersons,
  Persons,
  sortAlphabetically,
  STORAGE_KEYS,
} from '@bypass/shared';
import { Box, Container } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import PersonVirtualCell from './components/PersonVirtualCell';
import styles from './page.module.css';

export const runtime = 'edge';

const PersonsPage = () => {
  const [persons, setPersons] = useState<IPerson[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getFromLocalStorage<IPersons>(STORAGE_KEYS.persons).then((_persons) => {
      if (!_persons) {
        return;
      }
      const decryptedPersons = Object.entries(_persons || {}).map(
        decryptionMapper
      );
      setPersons(sortAlphabetically(decryptedPersons));
    });
  }, []);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const onLinkOpen = (url: string) => {
    openNewTab(url);
  };

  const filteredPersons = useMemo(
    () => getFilteredPersons(persons, searchText),
    [persons, searchText]
  );
  return (
    <Container size="md" h="100vh" px={0} className={styles.container}>
      <Header
        onSearchChange={handleSearchTextChange}
        text={`Persons Panel (${filteredPersons?.length || 0})`}
      />
      <Box className={styles.innerContainer}>
        {filteredPersons.length > 0 ? (
          <Persons
            persons={filteredPersons}
            onLinkOpen={onLinkOpen}
            bookmarkListProps={{ fullscreen: false }}
            renderPerson={(person) => <PersonVirtualCell person={person} />}
          />
        ) : null}
      </Box>
    </Container>
  );
};

export default PersonsPage;