import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
  APIServiceProvider,
  ExternalAuthProvider,
  GlobalProvider,
  StoreProvider, theme,
} from "@dekko/common";
import { Main } from "./components/main";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import {ThemeProvider} from "@material-ui/core";

const App = (props: any | undefined) => {
  useEffect(() => {
    document.title = "Dekko";
  }, []);
  return (
    <GlobalProvider {...props} isInternal={false}>
      <APIServiceProvider>
        <StoreProvider>
          <ExternalAuthProvider>
            <ThemeProvider theme={theme}>
              <Router>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Main {...props} />
                </MuiPickersUtilsProvider>
              </Router>
            </ThemeProvider>
          </ExternalAuthProvider>
        </StoreProvider>
      </APIServiceProvider>
    </GlobalProvider>
  );
};

export default App;
