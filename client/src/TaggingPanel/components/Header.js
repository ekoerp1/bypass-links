import { Box, IconButton } from "@material-ui/core";
import ArrowBackTwoToneIcon from "@material-ui/icons/ArrowBackTwoTone";
import PersonAddTwoToneIcon from "@material-ui/icons/PersonAddTwoTone";
import SyncTwoToneIcon from "@material-ui/icons/SyncTwoTone";
import { displayToast } from "GlobalActionCreators/index";
import PanelHeading from "GlobalComponents/PanelHeading";
import { COLOR } from "GlobalConstants/color";
import { ROUTES } from "GlobalConstants/routes";
import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { syncPersonsFirebaseWithStorage } from "../utils/sync";
import AddOrEditPersonDialog from "./AddOrEditPersonDialog";

const Header = memo(({ handleAddPerson }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);

  const toggleAddPersonDialog = () => {
    setShowAddPersonDialog(!showAddPersonDialog);
  };

  const handlePersonSave = (person) => {
    handleAddPerson(person);
    toggleAddPersonDialog();
  };

  const handleClose = () => {
    history.push(ROUTES.HOMEPAGE);
  };

  const onSyncClick = async () => {
    if (isSyncing) {
      return;
    }
    setIsSyncing(true);
    try {
      await syncPersonsFirebaseWithStorage();
      dispatch(displayToast({ message: "Persons synced succesfully" }));
    } catch (ex) {
      dispatch(displayToast({ message: ex, severity: "error" }));
    }
    setIsSyncing(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <IconButton
            aria-label="Discard"
            component="span"
            style={COLOR.red}
            onClick={handleClose}
            title="Discard and Close"
          >
            <ArrowBackTwoToneIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="Add"
            component="span"
            style={COLOR.blue}
            onClick={toggleAddPersonDialog}
            title="Add Person"
          >
            <PersonAddTwoToneIcon fontSize="large" />
          </IconButton>
          <IconButton
            aria-label="Sync"
            component="span"
            onClick={onSyncClick}
            title="Sync storage to firebase"
            disabled={isSyncing}
          >
            <SyncTwoToneIcon
              fontSize="large"
              className={isSyncing ? "iconLoading" : null}
              htmlColor={COLOR.orange.color}
            />
          </IconButton>
        </Box>
        <PanelHeading heading="TAGGING PANEL" />
      </Box>
      {showAddPersonDialog && (
        <AddOrEditPersonDialog
          isOpen={showAddPersonDialog}
          onClose={toggleAddPersonDialog}
          handleSaveClick={handlePersonSave}
        />
      )}
    </>
  );
});

export default Header;