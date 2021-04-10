import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import FormatColorTextTwoToneIcon from "@material-ui/icons/FormatColorTextTwoTone";
import runtime from "ChromeApi/runtime";
import { EditDialog } from "GlobalComponents/Dialogs";
import { COLOR } from "GlobalConstants/color";
import { getImageFromFirebase } from "GlobalUtils/firebase";
import { useEffect, useState } from "react";
import { DEFAULT_PERSON_UID } from "SrcPath/TaggingPanel/constants";
import {
  getAllPersonNames,
  getPersonFromUid,
} from "SrcPath/TaggingPanel/utils";

export const FolderDropdown = ({
  folder,
  folderList,
  handleFolderChange,
  variant = "filled",
  hideLabel = false,
}) => {
  if (!folderList || folderList.length < 1) {
    return null;
  }
  return (
    <FormControl variant={variant} size="small" color="secondary">
      {!hideLabel ? <InputLabel id="folders">Folder</InputLabel> : null}
      <Select labelId="folders" value={folder} onChange={handleFolderChange}>
        {folderList.map((folder) => (
          <MenuItem key={folder} value={folder}>
            {folder}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const PersonDropdown = ({
  personUid = DEFAULT_PERSON_UID,
  personList,
  handlePersonChange,
}) => {
  if (!personList || personList.length < 1) {
    return null;
  }
  const menuItems = personList.map(({ uid, name }) => (
    <MenuItem key={uid} value={uid}>
      {name}
    </MenuItem>
  ));
  menuItems.unshift(
    <MenuItem key={DEFAULT_PERSON_UID} value={DEFAULT_PERSON_UID}>
      Select Person
    </MenuItem>
  );
  return (
    <FormControl
      variant="filled"
      size="small"
      color="secondary"
      sx={{ width: "100%" }}
    >
      <InputLabel id="persons">Person</InputLabel>
      <Select labelId="persons" value={personUid} onChange={handlePersonChange}>
        {menuItems}
      </Select>
    </FormControl>
  );
};

export const BookmarkDialog = ({
  url: origUrl,
  origTitle,
  origFolder,
  origPersonUid,
  headerText,
  folderList,
  handleSave,
  handleDelete,
  isOpen,
  onClose,
  isSaveActive,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [person, setPerson] = useState({});
  const [title, setTitle] = useState(origTitle);
  const [folder, setFolder] = useState(origFolder);
  const [personList, setPersonList] = useState([]);
  const [isFetchingPerson, setIsFetchingPerson] = useState(false);

  const initPerson = async (uid) => {
    const person = await getPersonFromUid(uid);
    if (person) {
      setIsFetchingPerson(true);
      const url =
        person.imageRef && (await getImageFromFirebase(person.imageRef));
      setImageUrl(url);
      setPerson(person);
      setIsFetchingPerson(false);
    }
  };

  const initPersonList = async () => {
    const persons = await getAllPersonNames();
    setPersonList(persons);
  };

  useEffect(() => {
    initPersonList();
    initPerson(origPersonUid);
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleFolderChange = (event) => {
    setFolder(event.target.value);
  };
  const handlePersonChange = (event) => {
    const uid = event.target.value;
    initPerson(uid);
  };

  const handleSaveClick = () => {
    handleSave(origUrl, title, folder, person.uid);
    onClose();
  };

  const handleH1Click = async () => {
    const { pageH1 } = await runtime.sendMessage({ fetchPageH1: true });
    setTitle(pageH1);
  };

  const isSaveOptionActive =
    isSaveActive ||
    (title && (title !== origTitle || folder !== origFolder)) ||
    (!origPersonUid && person.uid) ||
    (origPersonUid && origPersonUid !== person.uid);

  return (
    <EditDialog
      headerText={headerText}
      openDialog={isOpen}
      closeDialog={onClose}
      handleSave={handleSaveClick}
      handleDelete={handleDelete}
      isSaveOptionActive={isSaveOptionActive}
    >
      {isFetchingPerson && <LinearProgress color="secondary" />}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          size="small"
          label="Name"
          variant="filled"
          color="secondary"
          title={title}
          value={title}
          onChange={handleTitleChange}
          style={{ flexGrow: "1" }}
        />
        <IconButton
          aria-label="MakeH1asTitle"
          component="span"
          style={COLOR.blue}
          onClick={handleH1Click}
          title="Make H1 as Title"
        >
          <FormatColorTextTwoToneIcon fontSize="large" />
        </IconButton>
      </Box>
      <TextField
        size="small"
        label="Url"
        variant="filled"
        color="secondary"
        title={origUrl}
        value={origUrl}
        InputProps={{ readOnly: true }}
      />
      <FolderDropdown
        folder={folder}
        folderList={folderList}
        handleFolderChange={handleFolderChange}
      />
      <Box
        sx={{ display: "flex", alignItems: "center", margin: "8px 8px 0 0" }}
      >
        <PersonDropdown
          personUid={person.uid}
          personList={personList}
          handlePersonChange={handlePersonChange}
        />
        <Avatar
          alt={person.name}
          src={imageUrl}
          sx={{ width: "70px", height: "70px" }}
        />
      </Box>
    </EditDialog>
  );
};

export const FolderDialog = ({
  origName = "",
  headerText,
  handleSave,
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState(origName);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSaveClick = () => {
    handleSave(name);
    onClose();
  };
  const handleClose = () => {
    setName(origName);
    onClose();
  };

  const isSaveOptionActive = name && name !== origName;
  return (
    <EditDialog
      headerText={headerText}
      openDialog={isOpen}
      closeDialog={handleClose}
      handleSave={handleSaveClick}
      isSaveOptionActive={isSaveOptionActive}
    >
      <TextField
        size="small"
        label="Name"
        variant="filled"
        color="secondary"
        title={name}
        value={name}
        onChange={handleNameChange}
      />
    </EditDialog>
  );
};

export const BulkBookmarksMoveDialog = ({
  origFolder,
  folderList,
  handleSave,
  isOpen,
  onClose,
}) => {
  const [folder, setFolder] = useState(origFolder);

  const handleFolderChange = (event) => {
    setFolder(event.target.value);
  };

  const handleSaveClick = () => {
    handleSave(folder);
    onClose();
  };
  const handleClose = () => {
    setFolder(origFolder);
    onClose();
  };

  const isSaveOptionActive = folder !== origFolder;
  return (
    <EditDialog
      headerText="Move Selected Bookmarks"
      openDialog={isOpen}
      closeDialog={handleClose}
      handleSave={handleSaveClick}
      isSaveOptionActive={isSaveOptionActive}
    >
      <FolderDropdown
        folder={folder}
        folderList={folderList}
        handleFolderChange={handleFolderChange}
      />
    </EditDialog>
  );
};