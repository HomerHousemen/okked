import React, { createContext, useContext } from "react";

export const RouterContext = createContext<Partial<{ props: any }>>({});

export const RouterProvider = (props: any) => {
  return (
    <RouterContext.Provider value={{ props: props }}>
      {props.children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
