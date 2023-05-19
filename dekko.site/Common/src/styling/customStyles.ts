import { makeStyles } from "@material-ui/core";

export const useTableStyles = makeStyles((theme) => ({
  filterToolbar: {
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    backgroundColor: "#fafafa",
    paddingBottom: 16,
    paddingTop: 16,
  },
  tableContainer: {
    [theme.breakpoints.up("sm")]: {
      maxHeight: 600,
    },
  },
  filterInput: {
    margin: 4,
    [theme.breakpoints.up("sm")]: {
      minWidth: "275px",
    },
  },
  filterActive: {
    margin: 4,
    minWidth: "105px",
  },
  filterClassification: {
    margin: 4,
    minWidth: "155px",
  },
  dropdownStyle: {
    margin: 4,
    minWidth: 200,
  },
  newButton: {
    margin: 4,
    marginRight: "auto",
    maxWidth: 300,
  },
  pageRow: {
    height: 40,
  },
  pageCell: {
    padding: 0,
    margin: 0,
  },
  table: {
    height: "100%",
  },
  dialog: {
    padding: 5,
  },
  delete: {
    margin: 0,
    padding: 0,
  },
  button: {
    margin: theme.spacing(1),
  },
}));
