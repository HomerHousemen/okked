import React, { useState } from "react";
import {
  FormProvider,
  useGlobal,
  useRouter,
  useStoreContext,
} from "@dekko/common";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Grid } from "@material-ui/core/";
import { FileProvider, Files } from "@dekko/common";
//import { InvestmentReportProvider } from "./investmentReports/investmentReportProvider";
//import { InvestmentReports } from "./investmentReports/investmentReports";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    active: {
      marginTop: "7px",
      fontSize: "18px",
    },

    tab2: {
      minWidth: 70,
      width: 150,
    },
    tab1: {
      minWidth: 70,
      width: 90,
    },
    tab15: {
      minWidth: 70,
      width: 120,
    },
  })
);

export const Investment = (props: any) => {
  const router = useRouter();
  const { setSuccess } = useGlobal();

  const investmentId = router.props.match.params.investmentid;
/*
  const getInitialTab = () => {
    const initialTab = parseInt(router.props.match.params.tab);
    if (isNaN(initialTab)) {
      return 0;
    }
    return initialTab;
  };*/

  const classes = useStyles();
  const [savedId, setSavedId] = useState();
  const [tab, setTab] = useState(0);//getInitialTab());
  const { loadInvestments, getInvestment } = useStoreContext();

  const investment = getInvestment(investmentId);

  return (
    <>
      <h5 className="card-title d-print-none">Investment</h5>
      <h3 className="card-title d-print-none">
        {investment?.name} [{investment?.identifier}]
      </h3>

      <Tabs
        value={tab}
        onChange={(event: any, newTab: number) => setTab(newTab)}
        className={`d-print-none`}
      >
        <Tab className={classes.tab1} label="Files" value={0} />
        
      </Tabs>
      {tab === 0 && (
          <FileProvider type={"Investment"} id={investmentId}>
              <Files />
          </FileProvider>
      )}
    
    </>
  );
};
