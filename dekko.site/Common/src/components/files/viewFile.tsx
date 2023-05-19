import React, { useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useSimpleFiles } from "./simpleFileProvider";
import { getToken } from "../authentication";

import { alpha, makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";

import TreeItem from "@material-ui/lab/TreeItem";
import { grey } from "@material-ui/core/colors";
import { Grid, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  document: {
    paddingLeft: -10,
    borderLeft: `1px solid ${alpha(grey[900], 0.4)}`,
  },
});

interface File {
  id: string;
  name: string;
  isDir: boolean;
  uri: string;
}

export const ViewFile = () => {
  const { state }: { state?: { files: File[] } } = useSimpleFiles();
  const header = { authorization: `Bearer ${getToken()}` };
  const [selected, setSelected] = useState("0");

  const classes = useStyles();

  const handleSelect = (_event: any, nodeIds: any) => {
    //console.log("nodeIds", nodeIds);
    if (nodeIds === "documents") return;
    setSelected(nodeIds);
  };

  //consider adding this to state
  const documentToShow = state?.files[Number(selected)];

  return (
    <>
      <Grid container spacing={10}>
        <Grid item xs={4}>
          <TreeView
            className={classes.root}
            expanded={["documents"]}
            selected={[selected]}
            onNodeSelect={handleSelect}
          >
            <TreeItem nodeId="documents" >
              {state?.files.map((file, i) => (
                <TreeItem
                  key={i}
                  className={classes.document}
                  nodeId={String(i)}
                  label={file.name}
                />
              ))}
            </TreeItem>
          </TreeView>
        </Grid>

        {/* //consider adding hidden instead of new render */}
        <Grid item xs={8}>
          <Paper>

              <DocViewer
                documents={documentToShow ? [documentToShow] : []}
                requestHeaders={header}
                style={{ width: "100%", height: "100%" }}
                pluginRenderers={DocViewerRenderers}
                config={{
                  header: {
                    disableHeader: true,
                    disableFileName: true,
                  },
                }}
              />
            
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
