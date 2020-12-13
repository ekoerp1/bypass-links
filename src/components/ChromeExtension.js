import {
  Box,
  Card,
  CardContent,
  Fab,
  Link,
  Typography,
} from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import chromeLogo from "GlobalIcons/chrome.svg";
import { getExtensionFile } from "GlobalUtils/index";
import React, { memo } from "react";

const cardStyles = { backgroundColor: "#323638" };

export const ChromeExtension = memo(() => {
  const handleExtensionDownload = () => {
    fetch(
      `${__PROD__ ? "/bypass-links" : ""}/${getExtensionFile(__EXT_VERSION__)}`
    )
      .then((transfer) => transfer.blob())
      .then((bytes) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(bytes);
        downloadLink.setAttribute(
          "download",
          getExtensionFile(__EXT_VERSION__)
        );
        downloadLink.click();
        document.removeChild(downloadLink);
      });
  };

  return (
    <Box width="360px" textAlign="left">
      <Card style={cardStyles}>
        <CardContent>
          <Box textAlign="center">
            <Typography variant="h5" component="h2">
              <Box
                component="img"
                src={chromeLogo}
                alt="chrome-logo"
                width="20px"
              />{" "}
              Chrome
            </Typography>
          </Box>
          <Typography color="textSecondary">
            1. Download this extension.
          </Typography>
          <Typography color="textSecondary">
            2. Open{" "}
            <Link href="chrome://extensions/">chrome://extensions/</Link>
          </Typography>
          <Typography color="textSecondary">
            3. Drag and drop the extension to install.
          </Typography>
          <Typography color="textSecondary">
            4. Enjoy freely.
            <span role="img" aria-label="enjoy">
              😃
            </span>
          </Typography>
        </CardContent>
        <Box display="flex" justifyContent="center" pb="16px" pt="8px">
          <Fab variant="extended" onClick={handleExtensionDownload}>
            <CloudDownloadIcon />
            <Box component="span" ml="8px">
              Download Bypass Links
            </Box>
          </Fab>
        </Box>
      </Card>
    </Box>
  );
});
