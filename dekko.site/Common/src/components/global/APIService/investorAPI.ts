import { AxiosRequestConfig } from "axios";
import {
  Investor,
  InvestorAddressRecord,
  InvestorContactRecord,
  InvestorRecord,
} from "../../../utils/types";
import { BaseAPI, BaseAPIResponse } from "./baseAPI";

export class InvestorAPI extends BaseAPI {
  getInvestors = async () => {
    try {
      const res = await this.axios.get<BaseAPIResponse<Investor[]>>("investor");
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestor = async (investorId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<InvestorRecord>>(
        `investor/${investorId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestorContacts = async (investorId: number) => {
    try {
      const res = await this.axios.get<
        BaseAPIResponse<InvestorContactRecord[]>
      >(`investor/contacts/${investorId}`);
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestorAddresses = async (investorId: number) => {
    try {
      const res = await this.axios.get<
        BaseAPIResponse<InvestorAddressRecord[]>
      >(`investor/addresses/${investorId}`);
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestorInvestments = async (investorId: number, date: any) => {
    const config: AxiosRequestConfig = {
      responseType: "blob",
      headers: { "Cache-Control": "no-cache" },
    };
    try {
      const res = await this.axios.get(
        `investor/investmentsexport/${investorId}/${date}`,
        config
      );
      //this API doe not follow the success:true pattern the rest of the APIs do
      // so I had to create it myself.
      return { ...res, success: true } as BaseAPIResponse<Blob>;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestorIndex = async () => {
    const config: AxiosRequestConfig = {
      responseType: "blob",
      headers: { "Cache-Control": "no-cache" },
    };
    try {
      const res = await this.axios.get("investor/export/", config);
      //this API doe not follow the success:true pattern the rest of the APIs do
      // so I had to create it myself.
      return { ...res, success: true } as BaseAPIResponse<Blob>;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };
}
