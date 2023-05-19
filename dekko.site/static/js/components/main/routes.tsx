import { SignIn } from "../signin/signin";

import { ResetPassword } from "../signin/resetPassword";
import {Investors, LoadAlertUrl} from "@dekko/common";
import { Investor } from "../investor";
import {Investment} from "../investments/investment";
import {Investments} from "../investments/investments";

export const Routes = [
  { path: "/investors", component: Investors },
  { path: "/investor/:investorid/:tab?", component: Investor },
  { path: "/investments", component: Investments },
  { path: "/investment/:investmentid", component: Investment },
  { path: "/resetPassword", component: ResetPassword },
  { path: "/load-alert", component: LoadAlertUrl },
  { path: "/", component: SignIn },
];
