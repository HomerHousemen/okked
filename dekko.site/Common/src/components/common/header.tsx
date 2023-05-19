import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import MenuIcon from "@material-ui/icons/Menu";
import { LocationDescriptor } from "history";
import { useExternalAuth, useGlobal, useInternalAuth } from "../global";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { IsAdmin } from "./isAdmin";
import { ApprovalsNotifier } from "./approvalsNotifier";
import {InvestorAlerts} from "./investorAlerts";

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: grey[100],
  },
  blankSpace: {
    flexGrow: 1,
  },
}));

interface Page {
  title: string;
  function: () => void;
  route?: string;
}

const getPages = ({
  handleRoutes,
  signOut,
  state,
  isInternal,
}: any): { pages: Page[]; adminPages?: Page[] } => {
  const externalPages: Page[] = [
    {
      title: "Investors",
      function: () => handleRoutes("/investors"),
      route: "/investors",
    },
    {
      title: "Investments",
      function: () => handleRoutes("/investments"),
      route: "/investments",
    },
    {
      title: state.username,
      function: () => handleRoutes("#"),
      route: "#",
    },
    {
      title: "Change Password",
      function: () => handleRoutes("/resetPassword"),
    },
    { title: "Sign Out", function: signOut },
  ];

  const internalPages: Page[] = [
    {
      title: "Investments",
      function: () => handleRoutes("/investments"),
      route: "/investments",
    },
    {
      title: "Investors",
      function: () => handleRoutes("/investors"),
      route: "/investors",
    },
    {
      title: "Taxes",
      function: () => handleRoutes("/taxes"),
      route: "/taxes",
    },
    {
      title: "Reports",
      function: () => handleRoutes("/reports"),
      route: "/reports",
    },
    {
      title: state.username,
      function: () => handleRoutes("#"),
      route: "#",
    },
  ];

  const adminPages: Page[] = [
    {
      title: "Internal Users",
      function: () => handleRoutes("/admin/user-internal"),
      route: "/admin/user-internal",
    },
    {
      title: "External Users",
      function: () => handleRoutes("/admin/user-external"),
      route: "/admin/user-external",
    },
    {
      title: "Signatures",
      function: () => handleRoutes("/admin/signatures"),
      route: "/admin/signatures",
    },
    {
      title: "Import Capital Schedule",
      function: () => handleRoutes("/admin/import-schedule"),
      route: "/admin/import-schedule",
    },
    {
      title: "Tax Dashboard",
      function: () => handleRoutes("/admin/tax-admin"),
      route: "/admin/tax-admin",
    },
    {
      title: "External User Logs",
      function: () => handleRoutes("/admin/external-logs"),
      route: "/admin/external-logs",
    },
  ];

  return isInternal
    ? { pages: internalPages, adminPages }
    : { pages: externalPages };
};

interface HeaderProps {
  brandLogoPath: string;
}

const MobileMenu = ({
  pages,
  adminPages,
}: {
  pages: Page[];
  adminPages?: Page[];
}) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();
  const { isInternal } = useGlobal();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    window.addEventListener("resize", handleCloseNavMenu);
    return () => window.removeEventListener("resize", handleCloseNavMenu);
  }, []);

  return (
    <Box
      sx={{
        alignContent: "right",
        alignSelf: "right",
        flexGrow: 1,
        display: { xs: "flex", md: "none" },
      }}
    >
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={(e) => handleOpenNavMenu(e)}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
      >
        {pages.map((page: any) => {
          const isCurrent = page.route === pathname;

          return (
            <MenuItem
              key={page.title}
              onClick={() => {
                page.function();
                handleCloseNavMenu();
              }}
            >
              <Typography style={{ fontWeight: isCurrent ? 600 : 400 }}>
                {page.title}
              </Typography>
            </MenuItem>
          );
        })}
        {isInternal && adminPages && (
          <AdminMenu closeParent={handleCloseNavMenu} adminPages={adminPages} />
        )}
      </Menu>
    </Box>
  );
};

const DesktopMenu = ({
  pages,
  adminPages,
}: {
  pages: Page[];
  adminPages?: Page[];
}) => {
  const { pathname } = useLocation();
  const { isInternal } = useGlobal();

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {pages.map((page) => {
        const isCurrent = page.route === pathname;

        return (
          <Button
            key={page.title}
            style={{
              fontSize: "16px",
              textTransform: "none",
              fontWeight: isCurrent ? 600 : 400,
            }}
            onClick={() => {
              page.function();
            }}
          >
            {page.title}
          </Button>
        );
      })}
      {isInternal && adminPages && <AdminMenu adminPages={adminPages} />}
    </Box>
  );
};

export const Header = ({ brandLogoPath }: HeaderProps) => {
  const classes = useStyles();
  const externalAuth = useExternalAuth();
  const internalAuth = useInternalAuth();
  const history = useHistory();
  const { isInternal } = useGlobal();
  const { state, isSignedIn, signOut } = isInternal
    ? internalAuth
    : externalAuth;
  const handleRoutes = (path: LocationDescriptor<unknown>) => {
    history.push(path);
  };
  const { pages, adminPages } = getPages({
    handleRoutes,
    signOut,
    state,
    isInternal,
  });

  return (
    <header className={"d-print-none"}>
      <AppBar className={classes.header} position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <a href={isSignedIn() ? "/investors" : "/"}>
              <img
                src={brandLogoPath}
                className="d-inline-block align-top"
                alt="North American Properties"
              />
            </a>
            <div className={classes.blankSpace} />
            {isSignedIn() && (
              <>
                <Box sx={{ flexGrow: 0 }}>
                  <MobileMenu pages={pages} adminPages={adminPages} />
                  <DesktopMenu pages={pages} adminPages={adminPages} />
                </Box>
                {isInternal && <ApprovalsNotifier />}
                {!isInternal && <InvestorAlerts />}
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
};

const AdminMenu = ({
  closeParent,
  adminPages,
}: {
  adminPages: Page[];
  closeParent?: () => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { pathname } = useLocation();
  const history = useHistory();
  const isMobile = useMediaQuery((t: Theme) => t.breakpoints.down("sm"));
  const handleRoutes = (path: LocationDescriptor<unknown>) => {
    history.push(path);
    handleClose();
    closeParent && closeParent();
  };

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <IsAdmin>
      {isMobile ? (
        <MenuItem onClick={handleMenu}>
          Admin
          <ArrowDropDownIcon />
        </MenuItem>
      ) : (
        <Button
          style={{ fontSize: "16px", textTransform: "none" }}
          onClick={handleMenu}
        >
          Admin <ArrowDropDownIcon />
        </Button>
      )}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        {adminPages.map((page) => {
          const isCurrent = page.route === pathname;

          return (
            <MenuItem
              key={page.title}
              style={{ fontWeight: isCurrent ? 600 : 400 }}
              onClick={() => page.route && handleRoutes(page.route)}
            >
              {page.title}
            </MenuItem>
          );
        })}
      </Menu>
    </IsAdmin>
  );
};
