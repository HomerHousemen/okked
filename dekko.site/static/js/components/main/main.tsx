import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import _ from "lodash";
import { FlashMessage, Loader, RouterProvider, Header } from "@dekko/common";
import { useExternalAuth } from "@dekko/common";
import { SignIn } from "../signin/signin";
import { Routes } from "./routes";
import { Container, Theme, useMediaQuery } from "@material-ui/core";

export const Main = (props: any) => {
  const { isSignedIn } = useExternalAuth();
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up("sm"));

  const renderApp = (route: any, routerProps: any) => {
    const ComponentProvider = route.provider;
    const ComponentToRender = route.component;

    const authorizedToView = () => {
      return route.component === SignIn || isSignedIn();
    };

    return (
      <RouterProvider {...routerProps}>
        <Container maxWidth="xl">
          {authorizedToView() ? (
            route.provider ? (
              <ComponentProvider>
                <ComponentToRender />
              </ComponentProvider>
            ) : (
              <ComponentToRender />
            )
          ) : (
            <Redirect to="/" />
          )}
        </Container>
      </RouterProvider>
    );
  };

  return (
    <>
      <Header brandLogoPath={props.brandLogoPath} />
      <FlashMessage />
      <Loader />
      <div>
        <Switch>
          {_.map(Routes, (route: any, idx: any) => (
            <Route
              key={idx}
              path={`${route.path}`}
              render={(routerProps: any) => renderApp(route, routerProps)}
            />
          ))}
        </Switch>
      </div>
    </>
  );
};
