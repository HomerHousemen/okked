import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Tabs, Tab, Grid } from "@material-ui/core/";
import {
  initialInvestor,
  InvestorAddresses,
  InvestorContacts,
  FileProvider,
  Files,
  useRouter,
  useAPIServiceContext,
  InvestorRecord,
} from "@dekko/common";
import { InvestorInvestmentsProvider } from "./investments/investorInvestmentsProvider";
import { InvestorInvestments } from "./investments/investorInvestments";
import { InvestorInfo } from "./investorInfo";
import { InvestorReportProvider } from "./investorReports/investorReportProvider";
import { InvestorReports } from "./investorReports/investorReports";

const getInitialTab = (tab: any) => {
  const initialTab = parseInt(tab);
  if (isNaN(initialTab)) {
    return 0;
  }
  return initialTab;
};

export const Investor = () => {
  const router = useRouter();
  const { investorAPI } = useAPIServiceContext();
  const [investor, setInvestor] = useState<InvestorRecord>(initialInvestor);
  const [tab, setTab] = useState(getInitialTab(router.props.match.params.tab));

  const investorId = router.props.match.params.investorid;

  useEffect(() => {
    investorAPI.getInvestor(investorId).then((res) => {
      if (res?.success) {
        setInvestor(res.data);
      }
    });
  }, []);

  return (
    <>
      <h5 className="card-title d-print-none">Investor</h5>
      <h3 className="card-title d-print-none">{investor?.name}</h3>
      <Tabs
        value={tab}
        onChange={(_event: any, newTab: number) => setTab(newTab)}
        className="d-print-none"
        style={{ paddingBottom: "12px" }}
        variant="scrollable"
      >
        <Tab label="Info" value={0} />
        <Tab label="Investments" value={1} />
        <Tab label="Reports" value={2} />
        <Tab label="Files" value={3} />
      </Tabs>
      {tab === 0 && (
        <Grid container spacing={3} className="root">
          <Grid item xs={12} sm={4}>
            <InvestorInfo investor={investor} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InvestorAddresses investorId={investorId} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InvestorContacts investorId={investorId} />
          </Grid>
        </Grid>
      )}
      {tab === 1 && (
        <InvestorInvestmentsProvider investorId={investorId}>
          <InvestorInvestments />
        </InvestorInvestmentsProvider>
      )}
      {tab === 2 && (
        <InvestorReportProvider>
          <InvestorReports investorId={investorId} />
        </InvestorReportProvider>
      )}
      {tab === 3 && (
        <FileProvider type={"Investor"} id={investorId}>
          <Files />
        </FileProvider>
      )}
    </>
  );
};
