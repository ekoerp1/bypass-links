import { Box } from "@material-ui/core";
import { SxProps } from "@material-ui/system";
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Subtract } from "utility-types";
import { bookmarkRowStyles } from "../constants";
import "../scss/withBookmarkRow.scss";

export interface InjectedProps {
  containerStyles: SxProps;
}

interface ExpectedProps {
  isDir: boolean;
  pos: number;
  name?: string;
  url?: string;
  title?: string;
  isSelected?: boolean;
}

const withBookmarkRow = <T extends InjectedProps>(
  Component: React.ComponentType<T>
) =>
  memo<Subtract<T, InjectedProps> & ExpectedProps>(function BookmarkRowHoc(
    props
  ) {
    const { isDir, name, url, pos, isSelected } = props;
    const primaryUniqueId = (isDir ? name : url) || "";

    return (
      <Draggable draggableId={primaryUniqueId} index={pos}>
        {(provided) => (
          <Box
            className="bookmarkRowContainer"
            ref={provided.innerRef}
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            data-is-selected={isSelected}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Component
                {...(props as unknown as T)}
                containerStyles={bookmarkRowStyles}
              />
            </Box>
          </Box>
        )}
      </Draggable>
    );
  });

export default withBookmarkRow;
