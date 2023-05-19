import React, { ReactNode, useEffect, useReducer } from "react";
import _ from "lodash";
import { FileData } from "chonky";
import { useGlobal } from "../global";
import { useAxios } from "../hooks";
import { createGenericContext } from "../../utils/createGenericContext";

const toFilePath = (x: State["folders"]) => {
  const [, ...rest] = x;
  return _.join(
    _.map(rest, (x: any) => {
      return x.name;
    }),
    "/"
  );
};

enum ActionType {
  "LOAD_FILES",
  "SET_FILES",
  "NAV_FOLDER",
  "CREATE_FOLDER",
  "NAV_UP_FOLDER",
  "NAV_UP",
  "DOWNLOAD_FILE",
  "DELETE_FILE",
  "UPLOAD_FILE",
  "SEND_FOLDER_LINK",
  "SET_EMAIL",
  "SET_DATE",
  "LOAD_DATE",
}

type Action = {
  type: ActionType;
  payload?: any;
  value?: any;
  refresh?: boolean;
  name?: any;
  path?: any;
};

type State = {
  folders: any;
  sendEmail: any;
  files: any[];
  fullPath: string;
  //below here are ones added from the reducer
  refresh: any;
  download: any;
  delete: any;
  date: any;
  file: any;
  isInvestor?: boolean;
  //triggers
  loadDateTrigger: number;
  downloadFileTrigger: number;
  uploadFileTrigger: number;
  folderLinkTrigger: number;
  deleteFileTrigger: number;
  loadFilesTrigger: number;
  createFolderTrigger: number;
};

interface FileProviderProps {
  type: string;
  id: number;
  children: ReactNode;
}

export type FileProviderContextTypes = {
  props: FileProviderProps;
  state: State;
  loadFiles: () => void;
  downloadFile: (file: string) => void;
  uploadFile: (name: string, file: FormData) => void;
  navFolder: (folder: string) => void;
  navUp: () => void;
  refresh: () => void;
  deleteFile: (file: string) => void;
  createFolder: (folder: string) => void;
  setEmail: (flag: boolean) => void;
  sendFolderLink: () => void;
};

export const FileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.LOAD_FILES:
      return {
        ...state,
        fullPath: toFilePath(state.folders),
        loadFilesTrigger: action.value,
        refresh: action.refresh,
      };
    case ActionType.SET_FILES:
      const files = _.filter(
        _.map(action.value, (f) => {
          return {
            id: f?.folder_Id ?? f?.name ?? "error",
            name: f?.name ?? "error",
            isDir: f?.is_Folder ?? false,
          };
        }),
        (x) => {
          return x.name != "error";
        }
      );
      return { ...state, files: files };
    case ActionType.NAV_FOLDER:
      let folderNav = _.cloneDeep(state.folders);
      let folder1 = { id: action.value, name: action.value, isDir: true };
      folderNav.push(folder1);
      return {
        ...state,
        folders: folderNav,
        fullPath: toFilePath(folderNav),
        loadFilesTrigger: (state.loadFilesTrigger || 0) + 1,
      };
    case ActionType.CREATE_FOLDER:
      const folderNav2 = _.cloneDeep(state.folders);
      folderNav2.push({ id: action.value, name: action.value, isDir: true });
      return {
        ...state,
        folders: folderNav2,
        fullPath: toFilePath(folderNav2),
        createFolderTrigger: (state.createFolderTrigger || 0) + 1,
      };
    case ActionType.NAV_UP_FOLDER:
      let folders = _.cloneDeep(state.folders);
      //find
      let index = _.indexOf(folders, (x: any) => x.name === action.value);
      let final = _.take(folders, index + 1);
      return {
        ...state,
        folders: final,
        fullPath: toFilePath(final),
        loadFilesTrigger: (state.loadFilesTrigger || 0) + 1,
      };
    case ActionType.NAV_UP:
      let folder = _.cloneDeep(state.folders);
      folder.pop();
      return {
        ...state,
        folders: folder,
        fullPath: toFilePath(folder),
        loadFilesTrigger: (state.loadFilesTrigger || 0) + 1,
      };
    case ActionType.DOWNLOAD_FILE:
      let fullPath = toFilePath(state.folders);
      let withFile = fullPath + "/" + action.value;
      return {
        ...state,
        download: action.value,
        fullPath: withFile,
        downloadFileTrigger: (state.downloadFileTrigger || 0) + 1,
      };
    case ActionType.DELETE_FILE:
      const finalFiles = _.filter(
        state.files,
        (x: FileData) => x.name != action.value
      );
      return {
        ...state,
        files: finalFiles,
        delete: action.value,
        fullPath: toFilePath(state.folders),
        deleteFileTrigger: (state.deleteFileTrigger || 0) + 1,
      };
    case ActionType.UPLOAD_FILE:
      const exists = _.find(state.files, (x: any) => {
        return x.name == action.name;
      });
      if (exists) {
        if (
          !confirm(
            "There is already a file with the same name.  Are you sure you want to upload?"
          )
        )
          return state;
      }
      action.value.append("path", action.path);
      action.value.append("sendEmail", state.sendEmail);
      return {
        ...state,
        file: action.value,
        uploadFileTrigger: (state.uploadFileTrigger || 0) + 1,
      };
    case ActionType.SEND_FOLDER_LINK:
      const formData = new FormData();
      formData.append("path", action.path);
      //formDAta.append should only take a Blob or a string, but will do a string conversion for you
      // we should check if this is working as expected with an array.
      // reference: //developer.mozilla.org/en-US/docs/Web/API/FormData/append
      //@ts-ignore
      return {
        ...state,
        file: formData,
        folderLinkTrigger: (state.folderLinkTrigger || 0) + 1,
      };
    case ActionType.SET_EMAIL:
      return { ...state, sendEmail: action.value };
    case ActionType.SET_DATE:
      return { ...state, date: action.value };
    case ActionType.LOAD_DATE:
      return { ...state, loadDateTrigger: action.value };
    default:
      return state;
  }
};

const [useFileContext, FileContextProvider] =
  createGenericContext<FileProviderContextTypes>();

const FileProvider = ({ type, id, children }: FileProviderProps) => {
  const root = { id: "root", name: "Root", isDir: true };
  const { toggleLoader, setError, setSuccess, isInternal } = useGlobal();
  const [state, dispatch] = useReducer(FileReducer, {
    folders: [root],
    files: [],
    fullPath: "",
    sendEmail: 2,
    isInvestor: type === "Investor",
    createFolderTrigger: 0,
    folderLinkTrigger: 0,
    deleteFileTrigger: 0,
    loadFilesTrigger: 0,
    uploadFileTrigger: 0,
    downloadFileTrigger: 0,
    loadDateTrigger: 0,
    refresh: () => {},
    download: () => {},
    delete: () => {},
    date: () => {},
    file: () => {},
  });

  //get list
  useAxios({
    method: "post",
    url: `api/files/list`,
    options: {
      type,
      id,
      subPath: state.fullPath,
      refresh: state.refresh,
    },
    trigger: state.loadFilesTrigger,
    callback: (data: any) => {
      let result = _.concat(data.data.folders, data.data.files ?? []);
      setFiles(result);
    },
  });
  useAxios({
    method: "post",
    url: `api/files/folder`,
    options: { type, id, subPath: state.fullPath },
    trigger: state.createFolderTrigger,
    callback: (_data: any) => {
      setSuccess("Folder created");
      setTimeout(loadFiles, 1000);
    },
  });

  useAxios({
    method: "post",
    url: `api/files/folder/link`,
    options: state.file,
    trigger: state.folderLinkTrigger,
    callback: (_data: any) => {
      setSuccess("Link sent");
    },
  });
  useAxios({
    method: "post",
    url: `api/files/upload/`,
    options: state.file,

    trigger: state.uploadFileTrigger,
    callback: (data: any) => {
      if (!data.success) setError(data.message);
      else setSuccess("File uploaded");
    },
  });

  useAxios({
    method: "post",
    url: `api/files/download`,
    trigger: state.downloadFileTrigger,
    options: { type, id, subPath: state.fullPath },
    responseType: "blob",
    callback: (response: any) => {
      toggleLoader(false);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", state.download.replace(/^.*[\\\/]/, ""));
      document.body.appendChild(link);
      link.click();
    },
  });

  //todo move to investor API
  isInternal &&
    useAxios({
      method: "GET",
      url: `api/investor/folder/${id}`,
      trigger: state.loadDateTrigger,
      options: { id },
      callback: (response: any) => {
        if (response.success) {
          setLastFolderDate(response.data);
        }
      },
    });

  isInternal &&
    useAxios({
      method: "post",
      url: `api/files/delete`,
      trigger: state.deleteFileTrigger,
      options: {
        type,
        id,
        subPath: state.fullPath + "/" + state.delete,
      },
      responseType: "blob",
      callback: (_response: any) => {
        setSuccess("File deleted");
        toggleLoader(false);
        refresh();
      },
    });

  const setFiles = (files: any) => {
    dispatch({ type: ActionType.SET_FILES, value: files });
  };

  const loadFiles = () => {
    dispatch({
      type: ActionType.LOAD_FILES,
      value: (state.loadFilesTrigger || 0) + 1,
    });
  };

  const refresh = () => {
    dispatch({
      type: ActionType.LOAD_FILES,
      value: (state.loadFilesTrigger || 0) + 1,
      refresh: true,
    });
  };
  const downloadFile = (file: string) => {
    dispatch({ type: ActionType.DOWNLOAD_FILE, value: file });
  };
  const deleteFile = (file: string) => {
    dispatch({ type: ActionType.DELETE_FILE, value: file });
  };
  const navFolder = (folder: string) => {
    dispatch({ type: ActionType.NAV_FOLDER, value: folder });
  };
  const uploadFile = (name: string, file: FormData) => {
    dispatch({
      type: ActionType.UPLOAD_FILE,
      name: name,
      value: file,
      path: "/" + type + "/" + id + "/" + state.fullPath,
    });
  };
  const createFolder = (folder: string) => {
    dispatch({ type: ActionType.CREATE_FOLDER, value: folder });
  };
  const navUp = () => {
    dispatch({ type: ActionType.NAV_UP });
  };

  const sendFolderLink = () => {
    dispatch({
      type: ActionType.SEND_FOLDER_LINK,
      path: "/" + type + "/" + id + "/" + state.fullPath,
    });
  };
  const setEmail = (flag: boolean) => {
    dispatch({ type: ActionType.SET_EMAIL, value: flag });
  };

  const setLastFolderDate = (date: any) => {
    isInternal && dispatch({ type: ActionType.SET_DATE, value: date });
  };
  useEffect(() => {
    loadFiles();
    if (isInternal && state.isInvestor) {
      dispatch({
        type: ActionType.LOAD_DATE,
        value: (state.loadDateTrigger || 0) + 1,
      });
    }
  }, []);

  return (
    <FileContextProvider
      value={{
        props: { id, type, children },
        state,
        loadFiles,
        downloadFile,
        uploadFile,
        navFolder,
        navUp,
        deleteFile,
        createFolder,
        refresh,
        setEmail,
        sendFolderLink,
      }}
    >
      {children}
    </FileContextProvider>
  );
};
export { useFileContext, FileProvider };
