import React, { createContext, useContext, useEffect, useReducer } from "react";
import _ from "lodash";
import { FileData } from "chonky";
import { useGlobal } from "../global";
import { useAxios } from "../hooks";

export const SimpleFileReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOAD_FILES":
      return {
        ...state,
        loadFiles: action.value,
        refresh: action.refresh,
        loadContacts: (state.loadContacts ?? 0) + 1,
      };
    case "SET_FILES":
      const files = _.filter(
        _.map(action.value, (f) => {
          return {
            id: f?.folder_Id ?? f?.name ?? "error",
            name: f?.name ?? "error",
            isDir: f?.is_Folder ?? false,
            uri: `api/files/${state.path}/download/${state.investmentId}/${state.date}/${f?.name}`,
          };
        }),
        (x) => {
          return x.name != "error";
        }
      );
      const links = _.map(
        _.filter(files, (x) => {
          return !x.isDir;
        }),
        (f) => {
          return {
            uri: `api/files/${state.path}/download/${state.investmentId}/${state.date}/${f.name}`,
          };
        }
      );
      //console.log(links);
      return { ...state, files: files, links: links };

    case "DOWNLOAD_FILE":
      return {
        ...state,
        download: action.value,
        downloadFile: (state.downloadFile || 0) + 1,
      };
    case "DELETE_FILE":
      const finalFiles = _.filter(
        state.files,
        (x: FileData) => x.name != action.value
      );
      //console.log("delete " + action.value);
      return {
        ...state,
        files: finalFiles,
        delete: action.value,
        deleteFile: (state.deleteFile || 0) + 1,
      };
    case "UPLOAD_FILE":
      const exists = _.find(state.files, (x: any) => {
        return x.name == action.name;
      });
      if (exists) {
        if (
          !confirm(
            "There is already a file with the same name.  Are you sure you want to upload?"
          )
        )
          return;
      }
      return {
        ...state,
        file: action.value,
        uploadFile: (state.uploadFile || 0) + 1,
      };

    default:
      return state;
  }
};
interface State {
  date: string;
  files: {
    id: string;
    name: string;
    isDir: boolean;
    uri: string;
  }[];
  folders: any[];
  fullPath: string;
  investmentId: string;
  links: any[];
  loadContacts: number;
  loadFiles: number;
  path: string;
  refresh: any;
}
export type SimpleFileProviderContextTypes = {
  props: any;
  state: State;
  loadFiles: any;
  downloadFile: any;
  uploadFile: any;
  refresh: any;
  deleteFile: any;
};
export const SimpleFileContext = createContext<
  Partial<SimpleFileProviderContextTypes>
>({});

export const SimpleFileProvider = (props: any) => {
  const root = { id: "root", name: "Root", isDir: true };
  const { toggleLoader, setError, setSuccess, isInternal } = useGlobal();
  const [state, dispatch] = useReducer(SimpleFileReducer, {
    folders: [root],
    files: [],
    links: [],
    fullPath: "",
    path: props.path,
    investmentId: props.investmentId,
    date: props.date,
  });

  //get list
  useAxios({
    method: "get",
    url: `api/files/${state.path}/${state.investmentId}/${state.date}`,
    trigger: state.loadFiles,
    callback: (data: any) => {
      let result =  data.data.files ?? [];//_.concat(data.data.folders,);
      setFiles(result);
    },
  });

  useAxios({
    method: "post",
    url: `api/files/${state.path}/upload/${state.investmentId}/${state.date}`,
    options: state.file,
    trigger: state.uploadFile,
    callback: (data: any) => {
      if (!data.success) setError(data.message);
      else setSuccess("File uploaded");
    },
  });

  useAxios({
    method: "get",
    url: `api/files/${state.path}/download/${state.investmentId}/${state.date}/${state.download}`,
    trigger: state.downloadFile,
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

  isInternal &&
    useAxios({
      method: "get",
      url: `api/files/${state.path}/delete/${state.investmentId}/${state.date}/${state.delete}`,
      trigger: state.deleteFile,
      callback: (_response: any) => {
        setSuccess("File deleted");
        toggleLoader(false);
        refresh();
      },
    });

  const setFiles = (files: any) => {
    dispatch({ type: "SET_FILES", value: files });
  };

  const loadFiles = () => {
    dispatch({ type: "LOAD_FILES", value: (state.loadFiles || 0) + 1 });
  };

  const refresh = () => {
    dispatch({
      type: "LOAD_FILES",
      value: (state.loadFiles || 0) + 1,
      refresh: true,
    });
  };
  const downloadFile = (file: string) => {
    dispatch({ type: "DOWNLOAD_FILE", value: file });
  };
  const deleteFile = (file: string) => {
    dispatch({ type: "DELETE_FILE", value: file });
  };

  const uploadFile = (name: string, file: FormData) => {
    dispatch({
      type: "UPLOAD_FILE",
      name: name,
      value: file,
    });
  };
  useEffect(() => {
    loadFiles();
  }, []);
  return (
    <SimpleFileContext.Provider
      value={{
        props: props,
        state: state,
        loadFiles: loadFiles,
        downloadFile: downloadFile,
        uploadFile: uploadFile,
        deleteFile: deleteFile,
        refresh: refresh,
      }}
    >
      {props.children}
    </SimpleFileContext.Provider>
  );
};

export const useSimpleFiles = () => useContext(SimpleFileContext);
