import React, { createContext, useContext, useReducer } from "react";
import _ from "lodash";
import { useGlobal } from "@dekko/common";
import { useAxios } from "@dekko/common";
import { useStoreContext } from "@dekko/common";

export const InvestorReportReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOAD_REPORT_TYPES":
      return { ...state, loadReports: action.value };
    case "SET_REPORT_TYPES":
      return { ...state, reportTypes: action.value };
    case "SET_REPORT_TYPE":
      return { ...state, reportType: action.value };
    case "SET_REPORT":
      return { ...state, report: action.value };
    case "SET_INVESTOR":
      return { ...state, investor: action.value };
    case "SET_STARTDATE":
      return { ...state, startDate: action.value };
    case "SET_ENDDATE":
      return { ...state, endDate: action.value };
    case "GENERATE_REPORT":
      return {
        ...state,
        generateReport: action.value,
        print: (state.print || 0) + 1,
      };
    case "EXPORT_REPORT":
      return { ...state, exportReport: action.value };
    default:
      return state;
  }
};
export type InvestorReportProviderContextTypes = {
  props: any;
  state: any;
  setReportType: any;
  setInvestor: any;
  setStartDate: any;
  setEndDate: any;
  generateReport: any;
  exportReport: any;
};
export const InvestorReportContext = createContext<
  Partial<InvestorReportProviderContextTypes>
>({});

export const InvestorReportProvider = (props: any) => {
  const { toggleLoader } = useGlobal();
  const { getInvestor } = useStoreContext();

  const [state, dispatch] = useReducer(InvestorReportReducer, {
    reportType: 1,
    investorId: 0,
    reportTypes: [
      { id: 1, name: "Capital Activity", type: "StartEndDate" },
      //{ id: 2, name: "Primary Investor", type: "AsOfDate" },
    ],
  });
  useAxios({
    method: "get",
    url: `/api/reports/investor`,
    trigger: state.loadReports,
    callback: (data: any) => {
      setReportTypes(data);
    },
  });
  useAxios({
    method: "post",
    url: `/api/reports/investor`,
    trigger: state.generateReport,
    options: {
      reportId: state.reportType,
      investorId: state.investor?.id,
      investorName: state.investor?.name,
      startDate: state.startDate,
      endDate: state.endDate,
    },
    callback: (data: any) => {
      toggleLoader(false);
      setReport(data);
    },
  });
  const getFilename = () => {
    var report = _.find(
      state.reportTypes,
      (x: any) => x.id === state.reportType
    );
    return (
      (
        state.investor?.name.replace(/([^a-z0-9]+)/gi, "") +
        "_" +
        report.name
      ).replace(/\s/g, "") + ".xlsx"
    );
  };
  //todo move to investor API
  useAxios({
    method: "post",
    url: `/api/reports/investor/export`,
    trigger: state.exportReport,
    options: {
      reportId: state.reportType,
      investorId: state.investor?.id,
      investorName: state.investor?.name,
      startDate: state.startDate,
      endDate: state.endDate,
    },
    responseType: "blob",
    callback: (response: any) => {
      toggleLoader(false);
      var filename = getFilename();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    },
  });
  const setReport = (report: any) => {
    dispatch({ type: "SET_REPORT", value: report });
  };
  const setInvestor = (investorId: any) => {
    const investor = getInvestor(investorId);
    dispatch({ type: "SET_INVESTOR", value: investor });
  };

  const setStartDate = (startDate: any) => {
    dispatch({ type: "SET_STARTDATE", value: startDate });
  };
  const setEndDate = (endDate: any) => {
    dispatch({ type: "SET_ENDDATE", value: endDate });
  };

  const setReportType = (reportType: any) => {
    dispatch({ type: "SET_REPORT_TYPE", value: reportType });
  };
  // const loadReportTypes = () => {
  //   dispatch({
  //     type: "LOAD_REPORT_TYPES",
  //     value: (state.loadReportTypes || 0) + 1,
  //   });
  // };
  const setReportTypes = (reportTypes: any) => {
    dispatch({ type: "SET_REPORT_TYPES", value: reportTypes });
  };
  const generateReport = () => {
    toggleLoader(true);
    dispatch({
      type: "GENERATE_REPORT",
      value: (state.generateReport || 0) + 1,
    });
  };
  const exportReport = () => {
    dispatch({ type: "EXPORT_REPORT", value: (state.exportReport || 0) + 1 });
  };
  //useEffect(() => loadReportTypes(), []);

  return (
    <InvestorReportContext.Provider
      value={{
        props: props,
        state: state,
        setReportType: setReportType,
        setInvestor: setInvestor,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
        generateReport: generateReport,
        exportReport: exportReport,
      }}
    >
      {props.children}
    </InvestorReportContext.Provider>
  );
};

export const useReport = () => useContext(InvestorReportContext);
