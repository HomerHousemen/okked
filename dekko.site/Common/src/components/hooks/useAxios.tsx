import { useEffect } from "react";
import { useGlobal } from "../global";
import axios, { Method, AxiosRequestConfig, AxiosResponse } from "axios";
import { isNil } from "lodash";
import { adalFetch } from "react-adal";
import { adalConfig, authContext } from "../authentication/adalConfig";

interface UseAxiosProps {
  method: Method;
  url: string;
  responseType?: AxiosRequestConfig["responseType"] | null;
  options?: any;
  trigger?: string | number | boolean;
  callback: ((x: Blob) => void) | ((x: AxiosResponse<any>) => void);
  contentType?: string;
}
export const useAxios = ({
  method,
  url,
  responseType = null,
  options = {},
  trigger,
  callback = () => {},
  contentType = "application/json",
}: UseAxiosProps) => {
  const { setError, setUnauthorized, toggleLoader, isInternal, getToken } =
    useGlobal();

  useEffect(() => {
    if (!trigger) return;
    options = method === "get" ? { params: options } : { data: options };

    if (isInternal) {
      options = {
        method: method,
        url,
        responseType: responseType,
        ...options,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
        },
      };
      adalFetch(authContext, adalConfig.clientId, axios, url, options)
        .then((response) => {
          callback(response.data);
        })
        .catch((errors) => {
          console.log(errors);
          if (
            errors &&
            errors.msg &&
            (errors.msg === "login_required" ||
              errors.msg === "login required" ||
              errors.msg === "interaction_required" ||
              errors.msg === "Token Renewal Failed")
          ) {
            authContext.login();
          }
          toggleLoader(false);
          if (
            !isNil(errors) &&
            !isNil(errors.response) &&
            errors.response.status === 401
          )
            setUnauthorized();
          else
            setError(
              "Internal Server Error.  If this persists contact support."
            );
        });
    } else {
      axios({
        method,
        url,
        responseType,
        ...options,
        headers: {
          //we can remove this since logic makes it always undefined
          ...(isInternal && getToken
            ? { authorization: `Bearer ${getToken()}` }
            : undefined),
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
        },
      })
        .then((response) => {
          callback(response.data);
        })
        .catch((errors) => {
          toggleLoader(false);
          if (
            !isNil(errors) &&
            !isNil(errors.response) &&
            errors.response.status === 401
          )
            setUnauthorized();
          else
            setError(
              "Internal Server Error.  If this persists contact support."
            );
        });
    }
  }, [trigger]);
};
