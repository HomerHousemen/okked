import React from "react";
import { ILastUpdated } from "./Types";

export const LastUpdated = (props: ILastUpdated) => {
  return (
    <span style={{ fontSize: "10px" }}>
      &nbsp;&nbsp;Last updated on {props.LastUpdated} by {props.UpdatedBy}
    </span>
  );
};
