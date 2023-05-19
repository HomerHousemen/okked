/** @format */

import _ from "lodash";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useGlobal, useStoreContext } from "@dekko/common";
//import { useAxios } from "@dekko/common";
import { useAxios } from "@dekko/common";
export const TableReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_STATE":
      return action.value;
    case "SET_FILTER":
      return { ...state, filter: action.value };
    case "SET_INVESTMENTS":
      return { ...state, investments: action.value };
    case "SET_SORT_DIRECTION":
      return { ...state, sortDirection: action.value };
    case "SET_SORT_COLUMN":
      return { ...state, sortColumn: action.value };
    case "SET_PAGE":
      return { ...state, page: action.value };
    case "SET_ROWS_PER_PAGE":
      return { ...state, rowsPerPage: action.value };
    default:
      return state;
  }
};
export type InvestmentIndexContextTypes = {
  state: any;
  setFilter: any;
  transformedInvestments: any;
  sortHandler: any;
  setPage: any;
  setRowsPerPage: any;
};
export const InvestmentIndexContext = createContext<
  Partial<InvestmentIndexContextTypes>
>({});

export const InvestmentIndexProvider = (props: any) => {
  const { state: storeState, loadInvestments } = useStoreContext();

  const { setSuccess, setError } = useGlobal();
  const [state, dispatch] = useReducer(TableReducer, {
    investments: [],
    //filteredInvestments: [],
    filter: "",
    sortDirection: "asc",
    sortColumn: "name",
    page: 0,
    rowsPerPage: 25,
  });

  //TODO: simplify this, we don't need to jump through these hoops
  useEffect(() => {
    dispatch({
      type: "SET_INVESTMENTS",
      value: storeState.investments,
    });
  }, [storeState.investments]);

  const { toggleLoader } = useGlobal();

  const PAGE_LENGTH = 25;
  
  const sortInvestments = (investmentlist: any) => {
    return _.orderBy(investmentlist, [state.sortColumn], [state.sortDirection]);
  };

  const setPage = (event: any, page: number) => {
    dispatch({ type: "SET_PAGE", value: page });
  };

  const setRowsPerPage = (event: any) => {
    dispatch({
      type: "SET_ROWS_PER_PAGE",
      value: parseInt(event.target.value, 10),
    });
    setPage(null, 0);
  };

  const filterInvestments = () => {
    setPage(null, 0);
    let filterstr = _.upperCase(state.filter);
    let transformed = _.filter(state.investments, (investment: any) => {
      return (
        (!filterstr ||
          filterstr === "" ||
          _.upperCase(investment.identifier).includes(filterstr) ||
          _.upperCase(investment.name).includes(filterstr))
 
      );
    });
    return transformed;
  };

  const filteredInvestments = React.useMemo(
    () => filterInvestments(),
    [
      state.filter,
      state.investments,
    ]
  );
  const sortedInvestments = React.useMemo(
    () => sortInvestments(filteredInvestments),
    [filteredInvestments, state.sortColumn, state.sortDirection]
  );

  const transformInvestments = () => {
    return sortedInvestments;
  };

  const transformedInvestments = useMemo(
    () => transformInvestments(),
    [state.sortColumn, state.sortDirection, filteredInvestments]
  );

  const setFilter = (filter: string) => {
    dispatch({ type: "SET_FILTER", value: filter });
  };

  const setSortDirection = (direction: string) => {
    dispatch({ type: "SET_SORT_DIRECTION", value: direction });
  };

  const setSortColumn = (column: string) => {
    dispatch({ type: "SET_SORT_COLUMN", value: column });
  };

  const sortHandler = (columnName: string) => {
    const isAsc =
      state.sortColumn === columnName && state.sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(columnName);
  };

  return (
    <InvestmentIndexContext.Provider
      value={{
        state: state,
        setFilter: setFilter,
        transformedInvestments: transformedInvestments,
        sortHandler: sortHandler,
        setPage: setPage,
        setRowsPerPage: setRowsPerPage,
      }}
    >
      {props.children}
    </InvestmentIndexContext.Provider>
  );
};

export const useInvestmentIndex = () => useContext(InvestmentIndexContext);
