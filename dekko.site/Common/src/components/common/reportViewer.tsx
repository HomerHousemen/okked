import React, { useEffect } from "react";

export const ReportViewer = (props: any) => {
  useEffect(() => {
    if (props.state.report && props.print) window.print();
  }, [props.state.report]);
  return (
    <div
      style={{
        paddingTop: "12px",
        overflow: "auto",
      }}
      dangerouslySetInnerHTML={{ __html: props.state.report }}
    />
  );
};
