import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import React, { useEffect } from "react";
import { createGenericContext } from "../../../utils/createGenericContext";
import { useGlobal } from "../globalProvider";
import { AlertsAPI } from "./alertsAPI";
import { ApprovalsAPI } from "./approvalsAPI";
import { MiscAPI } from "./miscAPI";
import { InvestmentAPI } from "./investmentAPI";
import { InvestorAPI } from "./investorAPI";
import { SignatureAdminAPI } from "./signatureAdminAPI";
import { UsersExternalAPI } from "./usersExternalAPI";
import { UsersInternalAPI } from "./usersInternalAPI";
import { InvestorAlertsAPI } from "./investorAlertsAPI";
import { useInternalAuth } from "../authProviders/internalAuthProvider";
import { useExternalAuth } from "../authProviders/externalAuthProvider";
import {
  ExternalAuthContextTypes,
  InternalAuthContextTypes,
} from "../authProviders/authTypes";
import {
  LocalStorageKeys,
  localStorageRemove,
} from "../../../utils/localStorageService";

type APIs = {
  miscAPI: MiscAPI;
  alertsAPI: AlertsAPI;
  approvalsAPI: ApprovalsAPI;
  investorAPI: InvestorAPI;
  usersInternalAPI: UsersInternalAPI;
  usersExternalAPI: UsersExternalAPI;
  investmentAPI: InvestmentAPI;
  signatureAdminAPI: SignatureAdminAPI;
  investorAlertsAPI: InvestorAlertsAPI;
};

const [useAPIServiceContext, APIServiceContextProvider] =
  createGenericContext<APIs>();

const tempSetSignedOut = () => {
  // we should be calling auth.setSignedOut when we are getting an API 401
  // but currently, auth is undefined at the time that the apiServiceProvider runs
  // for now I'm creating duplicate logic to delete the signIn items from localstorage
  // and redirect to the login page
  localStorageRemove(LocalStorageKeys.username);
  localStorageRemove(LocalStorageKeys.isSignedIn);
  window.location.href = "/";
};

const configureAxiosInstance = ({
  axiosInstance,
  headers,
  setError,
  auth,
}: {
  axiosInstance: AxiosInstance;
  headers: AxiosRequestConfig["headers"];
  setError: (error: string) => void;
  auth: Partial<ExternalAuthContextTypes> | Partial<InternalAuthContextTypes>;
}) => {
  axiosInstance.interceptors.request.use((config) => {
    config.headers = headers;
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      if (
        typeof response.data === "string" &&
        response.data.includes("You need to enable JavaScript to run this app")
      ) {
        const customError = new Error("API ERROR");
        response.status = 401;
        setError("API Error");
        return Promise.reject(customError);
      }
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log("you are not logged in, setting you to log out");
        auth.setSignedOut ? auth.setSignedOut() : tempSetSignedOut();
      }
      console.log("err in intercepted response", error);
      setError(String(error));
      return Promise.reject(error);
    }
  );
};

const APIServiceProvider = (props: any) => {
  const { headers, setError, setSuccess, isInternal } = useGlobal();
  const internalAuth = useInternalAuth();
  const externalAuth = useExternalAuth();

  const auth = isInternal ? internalAuth : externalAuth;

  const axiosInstance = axios.create({
    baseURL: "api",
  });
  configureAxiosInstance({ axiosInstance, headers, setError, auth });
  const apiMethods = { setError, setSuccess };

  useEffect(() => {
    configureAxiosInstance({ axiosInstance, headers, setError, auth });
  }, [headers]);

  // create a new API class here and add it ot the provider's value to use it in the app
  const miscAPI = new MiscAPI(axiosInstance, apiMethods);
  const alertsAPI = new AlertsAPI(axiosInstance, apiMethods);
  const investorAlertsAPI = new InvestorAlertsAPI(axiosInstance, apiMethods);
  const approvalsAPI = new ApprovalsAPI(axiosInstance, apiMethods);
  const investorAPI = new InvestorAPI(axiosInstance, apiMethods);
  //todo consider adding isInternal check safety for internal-only APIs
  const usersInternalAPI = new UsersInternalAPI(axiosInstance, apiMethods);
  const usersExternalAPI = new UsersExternalAPI(axiosInstance, apiMethods);
  const investmentAPI = new InvestmentAPI(axiosInstance, apiMethods);
  const signatureAdminAPI = new SignatureAdminAPI(axiosInstance, apiMethods);

  return (
    <APIServiceContextProvider
      value={{
        miscAPI,
        alertsAPI,
        approvalsAPI,
        investorAPI,
        usersInternalAPI,
        usersExternalAPI,
        investmentAPI,
        signatureAdminAPI, 
        investorAlertsAPI
          
      }}
    >
      {props.children}
    </APIServiceContextProvider>
  );
};

export { useAPIServiceContext, APIServiceProvider };
