import { AuthenticationContext, AdalConfig } from "react-adal";

const hostname = window && window.location && window.location.hostname;
const isLocal = hostname === "localhost";
const isDev = hostname.includes("name");
const tenant =
  isLocal || isDev
    ? "username.onmicrosoft.com"
    : "company.onmicrosoft.com";
const clientId =
  isLocal || isDev
    ? "628d442b-7422-4575-b2fb-a512dfe107c6"
    : "27acdee5-e7e5-4ff7-9cca-87c9fcc2c9d9";
const api =
  isLocal || isDev
    ? "https://username.onmicrosoft.com/930eed0d-3045-4635-a47b-843de1324452"
    : "https://company.onmicrosoft.com/27acdee5-e7e5-4ff7-9cca-87c9fcc2c9d9";
const redirectUri = isLocal
  ? process.env.LOCALHOST_URL
  : isDev
  ? "https://www.name.llc:5001"
  : "https://dekko.company.com";

export const adalConfig: AdalConfig = {
  tenant: tenant,
  clientId: clientId,
  redirectUri: redirectUri,
  endpoints: { api: api },
  cacheLocation: "sessionStorage",
  loadFrameTimeout: 30 * 1000,
  callback: console.log,
};

export const authContext = new AuthenticationContext(adalConfig);

export const getToken = () => authContext.getCachedToken(adalConfig.clientId);
