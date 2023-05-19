import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#264A5D",
    },
  },
});

export const customFontTheme = createTheme({
  typography: {
    fontSize: 10,
  },
  overrides: {
    MuiTableCell: {
      root: {
        //This can be referred from Material UI API documentation.
        padding: "2px 2px 2px 2px",
      },
    },
    MuiButtonBase: {
      root: {
        padding: "2px 2px 2px 2px",
      },
    },
  },
});
