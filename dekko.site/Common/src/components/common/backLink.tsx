import React from "react";
import { NavLink as Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  backLink: {
    verticalAlign: "bottom",
    marginBottom: 6,
    fontSize: 18,
  },
}));

export const BackLink = (props: any) => {
  const classes = useStyles();

  return (
    <>
      <Link to={props.link} className={classes.backLink + " d-print-none"}>
        {"<"} Back
      </Link>
    </>
  );
};
