import { Typography } from "@material-ui/core";
import { COLOR } from "GlobalConstants/color";

const titleStyles = {
  fontSize: "18px",
  marginRight: "14px",
  fontWeight: "700",
  color: COLOR.heading,
};

const PanelHeading = ({ heading, containerStyles = {} }) => (
  <Typography
    component="span"
    variant="h1"
    display="inline"
    sx={{ ...titleStyles, ...containerStyles }}
  >
    {heading}
  </Typography>
);

export default PanelHeading;