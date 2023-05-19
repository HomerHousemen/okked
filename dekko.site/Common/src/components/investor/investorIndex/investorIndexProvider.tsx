import React, {
  ChangeEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import _ from "lodash";
import { useGlobal } from "../../global";
import { useAxios } from "../../hooks";
import { useStoreContext } from "../../store";
import { SelectOptionInt } from "../Types";
import { createGenericContext } from "../../../utils/createGenericContext";

type InvestorIndexContextState = {
  investors: SelectOptionInt[];
  filteredInvestors: any[];
  filter: string;
  sortColumn: string;
  sortDirection: "desc" | "asc" | undefined;
  page: number;
  rowsPerPage: number;
  activeFilter: "Y" | "N";
  entityFilter: "Y" | "N";
};

export type InvestorIndexContextTypes = {
  state: InvestorIndexContextState;
  setFilter: (filter: string) => void;
  transformedInvestors: SelectOptionInt[];
  sortHandler: (columnName: string) => void;
  setPage: (_event: any, page: number) => void;
  setRowsPerPage: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  setActiveFilter: (activeFilter: string) => void;
  setEntityFilter: (entityFilter: string) => void;
  deleteInvestor: (investorId: number) => void;
};

const [useInvestorIndexContext, InvestorIndexContextProvider] =
  createGenericContext<InvestorIndexContextTypes>();

export const TableReducer = (state: InvestorIndexContextState, action: any) => {
  switch (action.type) {
    case "SET_STATE":
      return action.value;
    case "SET_FILTER":
      return { ...state, filter: action.value };
    case "SET_INVESTORS":
      return { ...state, investors: action.value };
    case "SET_SORT_DIRECTION":
      return { ...state, sortDirection: action.value };
    case "SET_SORT_COLUMN":
      return { ...state, sortColumn: action.value };
    case "SET_PAGE":
      return { ...state, page: action.value };
    case "SET_ROWS_PER_PAGE":
      return { ...state, rowsPerPage: action.value };
    case "SET_ACTIVE_FILTER":
      return { ...state, activeFilter: action.value };
    case "SET_ENTITY_FILTER":
      return { ...state, entityFilter: action.value };
    case "DELETE_INVESTOR":
      return { ...state, deleteInvestorId: action.value };
    default:
      return state;
  }
};

const InvestorIndexProvider = ({ children }: { children: ReactNode }) => {
  const { loadInvestors, state: storeState } = useStoreContext();

  const { setSuccess, setError, isInternal } = useGlobal();
  const [state, dispatch] = useReducer(TableReducer, {
    investors: storeState.investors,
    filteredInvestors: [],
    filter: "",
    sortDirection: "asc",
    sortColumn: "investorName",
    page: 0,
    rowsPerPage: 25,
    activeFilter: "Y",
    entityFilter: "N",
  });

  //todo move to investor API
  useAxios({
    method: "delete",
    url: `api/investor/${state.deleteInvestorId}`,
    trigger: state.deleteInvestorId,
    callback: (res: any) => {
      if (res.success) {
        loadInvestors();
        setSuccess("Investor deleted");
      } else {
        setError("Error deleting investor");
      }
    },
  });
  const deleteInvestor = (investorId: number) => {
    dispatch({ type: "DELETE_INVESTOR", value: investorId });
  };
  useEffect(() => {
    dispatch({
      type: "SET_INVESTORS",
      value: storeState.investors,
    });
  }, [storeState.investors]);

  const sortInvestors = (
    investorlist: SelectOptionInt[]
  ): SelectOptionInt[] => {
    return _.orderBy(investorlist, [state.sortColumn], [state.sortDirection]);
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

  const filterInvestors = () => {
    setPage(null, 0);
    let filter = _.upperCase(state.filter);
    return _.filter(state.investors, (investor: SelectOptionInt) => {
      const baseFilter =
        !filter || filter === "" || _.upperCase(investor.name).includes(filter);

      if (!isInternal) return baseFilter;
      return (
        baseFilter &&
        (state.activeFilter == "" ||
          (state.activeFilter == "Y" && investor.active) ||
          (state.activeFilter == "N" && !investor.active)) &&
        (state.entityFilter == "" ||
          (state.entityFilter == "Y" && investor.investmentEntity) ||
          (state.entityFilter == "N" && !investor.investmentEntity))
      );
    });
  };

  const filteredInvestors = React.useMemo(
    () => filterInvestors(),
    [state.activeFilter, state.entityFilter, state.filter, state.investors]
  );

  const sortedInvestors = React.useMemo(
    () => sortInvestors(filteredInvestors),
    [filteredInvestors, state.sortColumn, state.sortDirection]
  );

  const transformInvestors = () => {
    return sortedInvestors;
  };

  const transformedInvestors = useMemo(
    () => transformInvestors(),
    [state.sortColumn, state.sortDirection, filteredInvestors]
  );

  const setFilter = (filter: string) => {
    dispatch({ type: "SET_FILTER", value: filter });
  };

  const setActiveFilter = (activeFilter: string) => {
    dispatch({ type: "SET_ACTIVE_FILTER", value: activeFilter });
    //console.log(activeFilter);
  };
  const setEntityFilter = (entityFilter: string) => {
    dispatch({ type: "SET_ENTITY_FILTER", value: entityFilter });
    //console.log(entityFilter);
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
    <InvestorIndexContextProvider
      value={{
        state,
        setFilter,
        transformedInvestors,
        sortHandler,
        setPage,
        setRowsPerPage,
        setActiveFilter,
        deleteInvestor,
        setEntityFilter,
      }}
    >
      {children}
    </InvestorIndexContextProvider>
  );
};

export { useInvestorIndexContext, InvestorIndexProvider };
