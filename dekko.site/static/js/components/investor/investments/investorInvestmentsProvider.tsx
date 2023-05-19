import _ from "lodash";
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useAxios } from "@dekko/common";
import moment from "moment";

export const TableReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_STATE":
      return action.value;
    case "SET_FILTER":
      return { ...state, filter: action.value };
    case "LOAD_INVESTMENTS":
      return { ...state, loadInvestments: action.value };
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
    case "SET_AS_OF_DATE":
      return { ...state, asOfDate: action.value };
    default:
      return state;
  }
};
export type InvestorInvestmentsContextTypes = {
  state: any;
  setFilter: any;
  transformedInvestments: any;
  sortHandler: any;
  setPage: any;
  setRowsPerPage: any;
  setAsOfDate: any;
};
export const InvestorInvestmentsContext = createContext<
  Partial<InvestorInvestmentsContextTypes>
>({});

export const InvestorInvestmentsProvider = (props: any) => {
  const [state, dispatch] = useReducer(TableReducer, {
    investorId: props.investorId,
    investments: [],
    //filteredInvestments: [],
    filter: "",
    sortDirection: "asc",
    sortColumn: "name",
    page: 0,
    rowsPerPage: 25,
    asOfDate: new Date(),
  });
  const setInvestments = (investments: any) => {
    dispatch({ type: "SET_INVESTMENTS", value: investments });
  };

  //todo move to investor API
  useAxios({
    method: "get",
    url: `api/investor/investments/${props.investorId}/${moment(
      state.asOfDate
    ).format("YYYYMMDD")}`,
    trigger: state.loadInvestments,
    callback: (res: any) => {
      if (res.success) {
        setInvestments(res.data);
        //console.log(res.data);
      }
    },
  });
  useEffect(() => {
    dispatch({
      type: "LOAD_INVESTMENTS",
      value: (state.loadInvestments || 0) + 1,
    });
  }, []);

  const sortInvestments = (investmentlist: any) => {
    return _.orderBy(investmentlist, [state.sortColumn], [state.sortDirection]);
  };

  const setPage = (_event: any, page: number) => {
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
    const filterstr = _.upperCase(state.filter);
    const transformed = _.filter(state.investments, (investment: any) => {
      return (
        !filterstr ||
        filterstr === "" ||
        _.upperCase(investment.identifier).includes(filterstr) ||
        _.upperCase(investment.name).includes(filterstr)
      );
    });
    return transformed;
  };

  const filteredInvestments = React.useMemo(
    () => filterInvestments(),
    [state.filter, state.investments]
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

  const setAsOfDate = (asOfDate: any) => {
    dispatch({ type: "SET_AS_OF_DATE", value: asOfDate });
    dispatch({
      type: "LOAD_INVESTMENTS",
      value: (state.loadInvestments || 0) + 1,
    });
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
    <InvestorInvestmentsContext.Provider
      value={{
        state: state,
        setFilter: setFilter,
        transformedInvestments: transformedInvestments,
        sortHandler: sortHandler,
        setPage: setPage,
        setRowsPerPage: setRowsPerPage,
        setAsOfDate: setAsOfDate,
      }}
    >
      {props.children}
    </InvestorInvestmentsContext.Provider>
  );
};

export const useInvestorInvestments = () =>
  useContext(InvestorInvestmentsContext);
