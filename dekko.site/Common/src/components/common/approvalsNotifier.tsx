import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import { NotificationsOutlined } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAPIServiceContext, useGlobal, useInternalAuth } from "../global";

interface Alert {
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

export const ApprovalsNotifier = () => {
  const { state } = useInternalAuth();
  const { setAlertsCallback } = useGlobal();
  const { alertsAPI } = useAPIServiceContext();
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

  const redirect = (url: string) => {
    handleClose();
    history.push({
      pathname: "/load-alert",
      state: { url },
    });
  };

  const refreshAlerts = () => {
    alertsAPI.getAlerts(state.user.id, errorRef).then((res) => {
      if (res?.success) {
        setAlerts(res.data);
      }
    });
  };

  useEffect(() => {
    if (!state.user.id) return;
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
  }, [state.user.id]);

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
        {alerts.map((approval, i) => (
          <MenuItem
            key={`alert${i}`}
            onClick={() => redirect(approval.route)}
          >
            {approval.alertText}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
