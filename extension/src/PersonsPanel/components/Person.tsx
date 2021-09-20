import { Avatar, Badge, Box, IconButton, Typography } from "@mui/material";
import ContextMenu from "GlobalComponents/ContextMenu";
import { MenuOption } from "GlobalInterfaces/menu";
import { memo, useCallback, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiBookmark2Fill } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import { IPerson } from "../interfaces/persons";
import { resolvePersonImageFromUid } from "../utils";
import { getPersonsPanelUrl } from "../utils/urls";
import AddOrEditPersonDialog from "./AddOrEditPersonDialog";
import BookmarksList from "./BookmarksList";

const imageStyles = { width: 100, height: 100 };

export interface Props {
  person: IPerson;
  openBookmarksListUid: string;
  handleEditPerson: (person: IPerson) => void;
  handlePersonDelete: (person: IPerson) => void;
}

const Person = memo<Props>(
  ({ person, openBookmarksListUid, handleEditPerson, handlePersonDelete }) => {
    const history = useHistory();
    const { uid, name, taggedUrls } = person;
    const [imageUrl, setImageUrl] = useState("");
    const [showBookmarksList, setShowBookmarksList] = useState(false);
    const [showEditPersonDialog, setShowEditPersonDialog] = useState(false);
    const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);

    const handleDeleteOptionClick = useCallback(() => {
      handlePersonDelete(person);
    }, [handlePersonDelete, person]);

    const toggleEditPersonDialog = useCallback(() => {
      setShowEditPersonDialog(!showEditPersonDialog);
    }, [showEditPersonDialog]);

    useEffect(() => {
      const menuOptions = [
        {
          onClick: toggleEditPersonDialog,
          text: "Edit",
          icon: AiFillEdit,
        },
        {
          onClick: handleDeleteOptionClick,
          text: "Delete",
          icon: RiBookmark2Fill,
        },
      ];
      setMenuOptions(menuOptions);
    }, [handleDeleteOptionClick, toggleEditPersonDialog]);

    useEffect(() => {
      resolvePersonImageFromUid(uid).then((url) => {
        setImageUrl(url);
      });
    }, [uid, person]);

    useEffect(() => {
      setShowBookmarksList(openBookmarksListUid === uid);
    }, [openBookmarksListUid, uid]);

    const handlePersonSave = (updatedPerson: IPerson) => {
      handleEditPerson(updatedPerson);
      toggleEditPersonDialog();
    };

    const taggedUrlsCount =
      taggedUrls && !!taggedUrls.length ? taggedUrls.length : 0;

    const openBookmarksList = () => {
      history.push(getPersonsPanelUrl({ openBookmarksList: uid }));
    };

    return (
      <>
        <IconButton
          sx={{ padding: "0px", margin: "10px 0px" }}
          onClick={openBookmarksList}
        >
          <Box
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 16px",
              cursor: "pointer",
              height: "156px",
              width: "156px",
            }}
          >
            <ContextMenu getMenuOptions={() => menuOptions}>
              <Badge
                badgeContent={taggedUrlsCount}
                color="primary"
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Avatar alt={name} src={imageUrl} sx={imageStyles} />
              </Badge>
              <Typography
                sx={{
                  display: "-webkit-box",
                  fontSize: "14px",
                  width: "110px",
                  overflow: "hidden",
                  wordBreak: "break-word",
                  m: "auto",
                }}
                style={{
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
                title={name}
              >
                {name}
              </Typography>
            </ContextMenu>
          </Box>
        </IconButton>
        {showBookmarksList && (
          <BookmarksList
            name={name}
            imageUrl={imageUrl}
            taggedUrls={taggedUrls}
          />
        )}
        {showEditPersonDialog && (
          <AddOrEditPersonDialog
            person={person}
            isOpen={showEditPersonDialog}
            onClose={toggleEditPersonDialog}
            handleSaveClick={handlePersonSave}
          />
        )}
      </>
    );
  }
);

export default Person;
