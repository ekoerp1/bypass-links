import usePerson from '@bypass/shared/components/Persons/hooks/usePerson';
import { IPerson } from '@bypass/shared/components/Persons/interfaces/persons';
import { VoidFunction } from '@bypass/shared/interfaces/custom';
import { getImageFromFirebase } from '@helpers/firebase/storage';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import md5 from 'md5';
import { memo, useCallback, useEffect, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import ImagePicker from './ImagePicker';

const imageSize = 200;

interface Props {
  person?: IPerson;
  isOpen: boolean;
  onClose: VoidFunction;
  handleSaveClick: (person: IPerson) => void;
}

interface IForm {
  uid?: string;
  name: string;
  imageRef?: string;
}

const AddOrEditPersonDialog = memo<Props>(function AddOrEditPersonDialog({
  person,
  isOpen,
  onClose,
  handleSaveClick,
}) {
  const { resolvePersonImageFromUid } = usePerson();
  const [imageUrl, setImageUrl] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);

  const form = useForm<IForm>({
    initialValues: {
      uid: person?.uid,
      name: person?.name ?? '',
      imageRef: person?.imageRef,
    },
    validate: {
      name: (value) => (value ? null : 'Required'),
    },
  });

  const initImageUrl = useCallback(
    async (uid: string) => {
      const imageUrl = await resolvePersonImageFromUid(uid);
      setImageUrl(imageUrl);
    },
    [resolvePersonImageFromUid]
  );

  useEffect(() => {
    if (person) {
      initImageUrl(person.uid);
    } else {
      form.setFieldValue('uid', md5(Date.now().toString()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initImageUrl, person]);

  const fetchImage = async (ref: string) => {
    const url = await getImageFromFirebase(ref);
    setImageUrl(url);
  };

  const handleImageCropSave = async (imageFirebaseRef: string) => {
    await fetchImage(imageFirebaseRef);
    form.setFieldValue('imageRef', imageFirebaseRef);
  };

  const toggleImagePicker = () => setShowImagePicker(!showImagePicker);

  const handleSave = (values: typeof form.values) => {
    const { uid, name, imageRef } = values;
    if (!uid || !imageRef) {
      return;
    }
    handleSaveClick({
      uid,
      name,
      imageRef,
      taggedUrls: person?.taggedUrls || [],
    });
  };

  const { uid } = form.values;
  return (
    <>
      <Modal
        closeOnClickOutside={false}
        closeOnEscape={false}
        centered
        opened={isOpen}
        onClose={onClose}
        title={person ? 'Edit Person' : 'Add Person'}
        padding={40}
      >
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack>
            <Center>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  alt={imageUrl || 'No Image'}
                  src={imageUrl}
                  size={imageSize}
                  radius="xl"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <ActionIcon
                    radius="xl"
                    variant="subtle"
                    size={imageSize}
                    onClick={toggleImagePicker}
                  >
                    <MdModeEdit size="25px" />
                  </ActionIcon>
                </Box>
              </Box>
            </Center>
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Enter name"
              data-autofocus
              {...form.getInputProps('name')}
            />
            <Button type="submit" color="teal">
              Save
            </Button>
          </Stack>
        </form>
      </Modal>
      {uid && (
        <ImagePicker
          uid={uid}
          isOpen={showImagePicker}
          onDialogClose={toggleImagePicker}
          handleImageSave={handleImageCropSave}
        />
      )}
    </>
  );
});

export default AddOrEditPersonDialog;
