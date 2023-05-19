import React, { useCallback, useEffect, useState } from "react";
import {
  FileBrowser,
  FileNavbar,
  FileToolbar,
  FileList,
  ChonkyActions,
  FileHelper,
  ChonkyFileActionData,
  defineFileAction,
  ChonkyIconName,
} from "chonky";
import _ from "lodash";
import { useFileContext } from "./fileProvider";
import { DropzoneAreaBase } from "@pandemicode/material-ui-dropzone";
import Grid from "@material-ui/core/Grid";
import { Button, MenuItem, Select } from "@material-ui/core";
import { CanEdit, InternalOnly } from "../common";
import moment from "moment";
import { useAuth, useGlobal } from "../global";

export const Files = () => {
  const {
    state,
    navUp,
    navFolder,
    loadFiles,
    downloadFile,
    uploadFile,
    deleteFile,
    createFolder,
    refresh,
    setEmail,
    sendFolderLink,
  } = useFileContext();

  const useFileActionHandler = () => {
    const { setSuccess } = useGlobal();
    const checkValidName = (folder:string) => folder.match(/[\\\/|<>:".,?]/)===null;
    return useCallback(
      (data: ChonkyFileActionData) => {
        if (data.id === "download_files") {
          data.state?.selectedFiles.forEach((file) => {
            let name = file.name;
            if (file && !FileHelper.isDirectory(file)) {
              downloadFile(name);
            }
          });
        } else if (data.id.toString() === "refresh") {
          refresh();
        } else if (data.id === "delete_files") {
          if (confirm("Are you sure you want to delete these files?")) {
            data.state.selectedFilesForAction.forEach((x) => {
              let name = x.name;
              deleteFile(name);
            });
          }
        } else if (data.id.toString() === "delete_folder") {
          if (state.folders.length == 1) {
            alert("Cannot delete Root folder.");
            return;
          }
          if (state.files.length > 0) {
            alert(
              "Folder has files or other folders.  Must be empty to delete."
            );
            return;
          }
          if (confirm("Are you sure you want to delete this folder?")) {
            deleteFile("");
            navUp();
          }
        } else if (data.id === ChonkyActions.CreateFolder.id) {
          let folderName = prompt("Provide the name for your new folder:");
          while (folderName && !checkValidName(folderName)){
            alert("Please enter a valid folder name.  Avoid  . , \\  /  \"   :  < >  |  *  ?  ");
            folderName = prompt("Provide the name for your new folder:");
          }
          
          if (folderName) createFolder(folderName);
        } else if (data.id === ChonkyActions.ChangeSelection.id) {
          //console.log(data.payload);
          const { selection } = data.payload;
          const [first] = selection;
          const fileToOpen = _.find(state.files, (x) => {
            return x.id === first;
          });
          if (fileToOpen?.isDir ?? false) {
            navFolder(fileToOpen.name);
          }
        } else if (data.id === ChonkyActions.OpenParentFolder.id) {
          navUp();
        }

        setSuccess(data);
      },
      [downloadFile, navFolder, createFolder, deleteFile, navUp]
    );
  };

  const downloadFileAction = defineFileAction({
    id: "download_files",
    requiresSelection: true,
    fileFilter: (file) => (file && !file.isDir) ?? false,
    button: {
      name: "Download",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.download,
    },
  });

  const deleteFolderAction = defineFileAction({
    id: "delete_folder",
    requiresSelection: false,
    fileFilter: (file) => (file && file.isDir && file.name != "Root") ?? false,
    button: {
      name: "Delete Folder",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.trash,
    },
  });
  const deleteFilesAction = defineFileAction({
    id: "delete_files",
    requiresSelection: true,
    fileFilter: (file) => (file && !file.isDir) ?? false,
    button: {
      name: "Delete Files",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.trash,
    },
  });

  const refreshAction = defineFileAction({
    id: "refresh",
    requiresSelection: false,
    button: {
      name: "Refresh",
      toolbar: true,
      contextMenu: false,
      icon: ChonkyIconName.loading,
    },
  });
  const { isInternal } = useGlobal();
  const authFns = useAuth(isInternal);

  const fileActions =
    !isInternal || authFns?.isRestricted()
      ? [
          refreshAction,
          ChonkyActions.EnableListView,
          ChonkyActions.EnableGridView,
          downloadFileAction,
          ChonkyActions.OpenParentFolder,
        ]
      : [
          refreshAction,
          ChonkyActions.EnableListView,
          ChonkyActions.EnableGridView,
          ChonkyActions.CreateFolder,
          downloadFileAction,
          deleteFilesAction,
          deleteFolderAction,
          ChonkyActions.OpenParentFolder,
        ];

  useEffect(() => {
    loadFiles();
  }, []);


  const [files, setFiles] = useState([]);
  const handleFileAction = useFileActionHandler();
  const fileDropHandler = (files: any) => {
    if (files.length > 0) {
      files.forEach((file: any) => {
        const formData = new FormData();

        formData.append("File", file);
        uploadFile(file.name, formData);
      });
      setFiles([]);
      setTimeout(loadFiles, 2000);
    }
  };

  return (
    <Grid container>
      <InternalOnly>
        <CanEdit>
          <Grid item xs={2}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={7}>
                      Email on Upload{" "}
                    </Grid>
                    <Grid item xs={5}>
                      <Select
                        id="emailType"
                        style={{ width: 80 }}
                        label="Email"
                        value={state?.sendEmail}
                        //@ts-ignore
                        onChange={(e) => setEmail(e.target.value)}
                      >
                        <MenuItem value={0}>None</MenuItem>
                        <MenuItem value={1}>Link</MenuItem>
                        <MenuItem value={2}>Notify</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
              </Grid>
              <Grid item xs={12}>
                
                  <Grid container spacing={1}>
                   {state.isInvestor && state.folders.length > 1 && (
                    <Grid item xs={12}>
                      <Button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to send a link to the current folder?"
                            )
                          )
                            sendFolderLink();
                        }}
                        variant="outlined"
                      >
                        Send Folder Link
                      </Button>
                    </Grid>
                    )}
                  </Grid>
                
                <br />
                {state.date && (
                  <>Last sent: {moment(state.date).format("YYYY-MM-DD")}</>
                )}
              </Grid>
              <Grid item xs={12}>
                <DropzoneAreaBase
                  fileObjects={files}
                  onDrop={fileDropHandler}
                  dropzoneText={"Drop files to upload"}
                />
              </Grid>
            </Grid>
          </Grid>
        </CanEdit>
      </InternalOnly>
      <Grid item xs={12} sm={10}  style={{ minHeight: '500px'}}>
        <FileBrowser
          files={state.files}
          folderChain={state.folders}
          onFileAction={handleFileAction}
          fileActions={fileActions}
          disableDragAndDrop={true}
          disableDefaultFileActions={true}
          defaultFileViewActionId={!isInternal ? ChonkyActions.EnableGridView.id : ChonkyActions.EnableListView.id}
        >
          <FileNavbar />
          <FileToolbar />
          <FileList />
        </FileBrowser>
      </Grid>
    </Grid>
  );
};
