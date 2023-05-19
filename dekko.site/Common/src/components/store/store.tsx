import React, { createContext, useEffect, useReducer } from "react";
import { createGenericContext } from "../../utils/createGenericContext";
import {
  localStorageGet,
  LocalStorageKeys,
  localStorageSet,
} from "../../utils/localStorageService";
import { Lookups } from "../../utils/types";
import { useAPIServiceContext, useGlobal } from "../global";
//todo comment out load functions when isExternal is not true
const Reducer = (state: any, action: any) => {
  console.log(action.type);
  switch (action.type) {
    case "LOAD_INVESTMENTS":
      return { ...state, loadInvestments: action.value };
    case "SET_INVESTMENTS":
      return { ...state, investments: action.value };
    case "ADD_INVESTMENT":
      return { ...state, investments: state.investments.concat(action.value) };
    case "LOAD_INVESTORS":
      return { ...state, loadInvestors: action.value };
    case "SET_INVESTORS":
      return { ...state, investors: action.value };
    case "LOAD_LOOKUPS":
      return { ...state, loadLookups: action.value };
    case "SET_LOOKUPS":
      return { ...state, lookups: action.value };
    case "SET_ERROR":
      return { ...state, error: action.value };
    default:
      return state;
  }
};

const [useStoreContext, StoreContextProvider] =
  createGenericContext<StoreProps>();

export type StoreProps = {
  props: any;
  state: {
    investments: {
      active: boolean;
      entityClassification: number;
      id: number;
      identifier: string;
      name: string;
      nickname: string;
      partnerOffice: string;
    }[];
    investors: {
      active: boolean;
      id: number;
      investmentEntity: boolean;
      name: string;
    }[];
    lookups: Lookups;
    loadInvestments: number;
    loadInvestors: number;
  };
  loadStore: any;
  loadInvestments?: any;
  loadInvestors: any;
  getInvestment: any;
  getInvestor: any;
};

const StoreProvider = (props: any) => {
  const { isInternal } = useGlobal();
  const { investmentAPI, investorAPI, miscAPI } = useAPIServiceContext();

  const [state, dispatch] = useReducer(Reducer, {
    investments: isInternal && (LocalStorageKeys.Investments) || [],
    investors: isInternal && localStorageGet(LocalStorageKeys.Investors) || [],
    lookups: localStorageGet(LocalStorageKeys.Lookups) || {
      countries: [],
      addressTypes: [],
      federalTypes: [],
      distributionTypes: [],
      callTypes: [],
      taxForms: [],
      taxFormStatuses: [],
      taxContacts: [],
      accountingContacts: [],
    },
  });

  useEffect(() => {
    //if (!isInternal) return;
    if (state.loadInvestments === undefined) return;
    investmentAPI.getInvestments().then((res) => {
      if (res?.success) {
        if(isInternal) localStorageSet(LocalStorageKeys.Investments, res.data);
        dispatch({ type: "SET_INVESTMENTS", value: res.data });
      }
    });
  }, [state.loadInvestments]);

  useEffect(() => {
    if (state.loadLookups === undefined) return;
    miscAPI.getLookup().then((res) => {
      if (res?.success) {
        localStorageSet(LocalStorageKeys.Lookups, res.data);
        dispatch({ type: "SET_LOOKUPS", value: res.data });
      }
    });
  }, [state.loadLookups]);

  useEffect(() => {
    if (state.loadInvestors === undefined) return;
    investorAPI.getInvestors().then((res) => {
      if (res?.success) {
        if(isInternal) localStorageSet(LocalStorageKeys.Investors, res.data);
        dispatch({ type: "SET_INVESTORS", value: res.data });
      }
    });
  }, [state.loadInvestors]);

  const loadInvestments = () => {
    //if (!isInternal) return;
    dispatch({
      type: "LOAD_INVESTMENTS",
      value: (state.loadInvestments || 0) + 1,
    });
  };

  const loadInvestors = () => {
    dispatch({ type: "LOAD_INVESTORS", value: (state.loadInvestors || 0) + 1 });
  };
  const loadLookups = () => {
    dispatch({ type: "LOAD_LOOKUPS", value: (state.loadLookups || 0) + 1 });
  };

  const getInvestment = (id: number) => {
    const intId = Number(id);
    return state.investments.find((inv: any) => inv.id === intId);
  };
  const getInvestor = (id: number) => {
    const intId = Number(id);
    return state.investors.find((inv: any) => inv.id === intId);
  };
  const loadStore = () => {
    loadInvestments();
    loadInvestors();
    loadLookups();
  };

  return (
    <StoreContextProvider
      value={{
        props,
        state,
        loadStore,
        loadInvestments,
        loadInvestors,
        getInvestment,
        getInvestor,
      }}
    >
      {props.children}
    </StoreContextProvider>
  );
};

export const Context = createContext<Partial<StoreProps>>({});

export { useStoreContext, StoreProvider };
