import React, {useReducer, useContext } from "react";

export const GlobalReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_STATE":
      return action.value;
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    case "SET_SUCCESS":
      return { ...state, success: action.value };
    case "SET_UNAUTHORIZED":
      return { ...state, unauthorized: action.value };
    case "SET_ALERTS_CALLBACK":
      return { ...state, refreshAlerts: action.value };
    default:
      return state;
  }
};
export type GlobalContextTypes = {
  props: any;
  state: any;
  toggleLoader: any;
  setError: any;
  setSuccess: any;
  setUnauthorized: any;
  round: any;
  showErrorMsg: any;
  isInternal: boolean;
  getToken?: () => string;
  headers?: HeadersInit;
  refreshAlerts: any;
  setAlertsCallback: any;
};

const GlobalContext = React.createContext<GlobalContextTypes | undefined>(
  undefined
);

export const GlobalProvider = (props: any) => {
  const [state, dispatch] = useReducer(GlobalReducer, { loading: false });

  
  const setError = (error: any) => {
    dispatch({ type: "SET_ERROR", value: error });
  };

  const setSuccess = (success: any) => {
    dispatch({ type: "SET_SUCCESS", value: success });
  };

  const setUnauthorized = () => {
    dispatch({
      type: "SET_UNAUTHORIZED",
      value: (state.unauthorized || 0) + 1,
    });
  };
  const refreshAlerts = () => {
    if(state.refreshAlerts)
      state.refreshAlerts();
  };

  const setAlertsCallback = (callback: any) => {
    dispatch({ type: "SET_ALERTS_CALLBACK", value: callback });
  };
  
  const toggleLoader = (loading: any) => {
    dispatch({ type: "SET_LOADING", value: loading });
  };

  const round = (a: any) => {
    const newnumber = Number(a + "").toFixed(12);
    return parseFloat(newnumber);
  };
  const getHeaders = (): HeadersInit => {
    return props.isInternal
      ? { Authorization: `Bearer ${props.getToken()}` }
      : {};
  };

  return (
    <GlobalContext.Provider
      value={{
        props: props,
        state: state,
        toggleLoader: toggleLoader,
        setError: setError,
        setSuccess: setSuccess,
        setUnauthorized: setUnauthorized,
        round: round,
        showErrorMsg: setError,
        isInternal: props.isInternal,
        getToken: props.getToken,
        headers: getHeaders(),
        refreshAlerts: refreshAlerts,
        setAlertsCallback:  setAlertsCallback
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const globalContext = useContext(GlobalContext);
  if (!globalContext)
    throw new Error("No Global.Provider found when calling useGlobal.");
  return globalContext;
};
