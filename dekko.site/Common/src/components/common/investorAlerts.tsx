import {
  useAPIServiceContext,
  useGlobal,
  useExternalAuth,
} from "../global";
import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import { NotificationsOutlined } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

interface Alert {
  id: number;
  route: string;
  alertText: string;
}

export const LoadAlertUrl = () => {
  const { state } = useLocation();
  const history = useHistory();
  //@ts-ignore
  const url: string = state.url;
  useEffect(() => {
    history.push(url);
  }, []);
  return <div>Loading {url}</div>;
};

export const InvestorAlerts = () => {
  const { state } = useExternalAuth();
  const { setAlertsCallback } = useGlobal();
  const { investorAlertsAPI } = useAPIServiceContext();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const errorRef = useRef(false);

  const handleClick = (event: any) => {
    if (!alerts.length) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirect = (alertId:number, url: string) => {
    handleClose();
    investorAlertsAPI.viewAlert(alertId, state.username);
    history.push({
      pathname: "/load-alert",
      state: { url },
    });
  };

  const refreshAlerts = () => {
    investorAlertsAPI.getAlerts(state.username, errorRef).then((res) => {
      if (res?.success) {
        setAlerts(res.data);
      }
    });
  };
 
  //set alert viewed.
  
  useEffect(() => {
    setAlertsCallback(refreshAlerts);
    refreshAlerts();
    const id = setInterval(() => {
      if (errorRef.current) {
        clearInterval(id);
        return;
      }
      refreshAlerts();
    }, 60 * 1000 * 15); //run every 15 minutes

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge
          badgeContent={alerts.length}
          color="secondary"
          overlap="rectangular"
        >
          <NotificationsOutlined />
        </Badge>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {alerts.sort((a, b) => a.alertText.localeCompare(b.alertText) ).map((alert, i) => (
          <MenuItem
            key={`alert${i}`}
            onClick={() => redirect(alert.id, alert.route)}
          >
            {alert.alertText}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
