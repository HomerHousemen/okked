import React, {useState} from "react";
import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";
import {TreeItem, TreeView} from "@material-ui/lab";
import {grey} from "@material-ui/core/colors";
import {alpha,  Grid, makeStyles, Paper} from "@material-ui/core";
//import {PrintButton, useGlobal} from "@dekko/common";
import {useSimpleFiles} from "./simpleFileProvider";
import {useGlobal} from "../global";
import {PrintButton} from "../common";

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
    documentView: {
        paddingTop: 24,
    }
});

export const ViewFileWithReport = (props:any) => {
    const {state} = useSimpleFiles();
    const {headers} = useGlobal();
    const [selected, setSelected] = useState("report");
    const classes = useStyles();

    const handleSelect = (_event: any, nodeIds: any) => {
        if (nodeIds === "documents") return;
        setSelected(nodeIds);
    };

    const documentToShow = state?.files[Number(selected)];

    return (
        <>
            <Grid container spacing={10} className={classes.documentView}>
                <Grid item xs={2} className="d-print-none">
                    <TreeView
                        className={classes.root}
                        expanded={["documents"]}
                        selected={[selected]}
                        onNodeSelect={handleSelect}
                    >
                        <TreeItem
                            className={classes.document}
                            nodeId={"report"}
                            label={"Report"}
                        />
                        <TreeItem nodeId="documents" label="Documents">
                            {state?.files.map((file: any, i: number) => (
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
                <Grid item xs={10}>
                    <Paper>

                        {selected === "report" ? (
                            <>
                                <Grid container spacing={0}>
                                    <Grid item xs={11}/>
                                    <Grid item xs={1}>
                                        <PrintButton/>
                                    </Grid>
                                </Grid>
                                {props.children}
                                </>
                        ) : (
                            <DocViewer
                                className="d-print-none"
                                documents={documentToShow ? [documentToShow] : []}
                                requestHeaders={headers as Record<string, string>}
                                style={{width: "100%", height: "100%"}}
                                pluginRenderers={DocViewerRenderers}
                                config={{
                                    header: {
                                        disableHeader: true,
                                        disableFileName: true,
                                    },
                                }}
                            />
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};
