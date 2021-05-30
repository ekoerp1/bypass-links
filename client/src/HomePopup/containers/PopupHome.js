import { Box, Typography } from "@material-ui/core/";
import { Row } from "GlobalComponents/Row";
import { COLOR } from "GlobalConstants/color";
import { memo } from "react";
import Authenticate from "../components/Authenticate";
import BookmarksPanelButton from "../components/BookmarksPanelButton";
import LastVisitedButton from "../components/LastVisitedButton";
import HistoryPanelButton from "../components/HistoryPanelButton";
import OpenDefaultsButton from "../components/OpenDefaultsButton";
import OpenForumLinks from "../components/OpenForumLinks";
import QuickBookmarkButton from "../components/QuickBookmarkButton";
import ShortcutsPanelButton from "../components/ShortcutsPanelButton";
import PersonsPanelButton from "../components/PersonsPanelButton";
import ToggleExtension from "../components/ToggleExtension";
import ToggleHistory from "../components/ToggleHistory";
import UserProfile from "../components/UserProfile";
import TwoFactorAuthenticate from "../components/TwoFactorAuthenticate";

const PopupHome = memo(() => (
  <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        width: "max-content",
      }}
    >
      <Typography variant="h5" component="h5" gutterBottom>
        <Box sx={{ color: COLOR.heading, fontWeight: "700" }}>BYPASS LINKS</Box>
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ marginRight: "10px" }}>
          <ToggleExtension />
          <ToggleHistory />
        </Box>
        <UserProfile />
      </Box>
      <Row>
        <Authenticate />
        <ShortcutsPanelButton />
        <BookmarksPanelButton />
      </Row>
      <Box>
        <HistoryPanelButton />
        <OpenDefaultsButton />
        <QuickBookmarkButton />
      </Box>
      <Box>
        <OpenForumLinks />
        <LastVisitedButton />
        <PersonsPanelButton />
      </Box>
    </Box>
    <TwoFactorAuthenticate />
  </>
));

export default PopupHome;
