import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

setChonkyDefaults({ iconComponent: ChonkyIconFA });
const rootElement = document.getElementById("root");

Sentry.init({
  dsn: "https://077bdc0f865d4e628591d5d5af41a71a@o1088629.ingest.sentry.io/6335891",
  integrations: [new BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.1,
});
ReactDOM.render(<App brandLogoPath="images/logo.png" />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
