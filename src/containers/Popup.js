import { Box, Typography } from "@material-ui/core/";
import { Authenticate } from "GlobalComponents/Authenticate";
import BookmarksPanelButton from "GlobalComponents/BookmarksPanelButton";
import { EditPanelButton } from "GlobalComponents/EditPanelButton";
import { ManualHistoryPanelButton } from "GlobalComponents/ManualHistoryPanelButton";
import { OpenDefaultsButton } from "GlobalComponents/OpenDefaultsButton";
import OpenForumLinks from "GlobalComponents/OpenForumLinks";
import QuickBookmarkButton from "GlobalComponents/QuickBookmarkButton";
import { Row } from "GlobalComponents/Row";
import { ToggleExtension } from "GlobalComponents/ToggleExtension";
import { ToggleHistory } from "GlobalComponents/ToggleHistory";
import { COLOR } from "GlobalConstants/color";
import React, { memo } from "react";

export const Popup = memo(() => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    padding="16px"
    width="max-content"
  >
    <Typography variant="h5" component="h5" gutterBottom>
      <Box color={COLOR.heading} fontWeight="700">
        BYPASS LINKS
      </Box>
    </Typography>
    <ToggleExtension />
    <ToggleHistory />
    <Row>
      <Authenticate />
      <EditPanelButton />
      <BookmarksPanelButton />
    </Row>
    <Box>
      <ManualHistoryPanelButton />
      <OpenDefaultsButton />
      <QuickBookmarkButton />
    </Box>
    <Box>
      <OpenForumLinks />
    </Box>
  </Box>
));
