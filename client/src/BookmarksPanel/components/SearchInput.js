import { Box, InputBase } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { memo } from "react";
import { throttle } from "throttle-debounce";

/**
 * `searchClassName` should be parent of each row and not parent of all rows
 * `data-text` and `data-subtext` should be applied on same node as of `searchClassName`
 */
const SearchInput = memo(({ searchClassName }) => {
  const handleSearch = (searchText = "") => {
    const lowerSearchText = searchText.toLowerCase();

    document.querySelectorAll(`.${searchClassName}`).forEach((node) => {
      const textsToSearch = [
        node.getAttribute("data-text")?.toLowerCase(),
        node.getAttribute("data-subtext")?.toLowerCase(),
      ];

      const isSearchMatched = textsToSearch.some(
        (text) => text && text.includes(lowerSearchText)
      );

      node.style.display = isSearchMatched ? "" : "none";
    });
  };

  const onChange = throttle(100, (event) => {
    handleSearch(event.target.value?.trim());
  });

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
        },
        width: "auto",
      }}
    >
      <Box
        sx={{
          padding: (theme) => theme.spacing(0, 2),
          height: "100%",
          position: "absolute",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SearchIcon />
      </Box>
      <InputBase
        placeholder="Search…"
        onChange={onChange}
        autoFocus
        sx={{
          "& .MuiInputBase-input": {
            padding: (theme) => theme.spacing(1, 1, 1, 0),
            paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
            transition: (theme) => theme.transitions.create("width"),
            width: "12ch",
            "&:focus": { width: "20ch" },
          },
        }}
      />
    </Box>
  );
});

export default SearchInput;
