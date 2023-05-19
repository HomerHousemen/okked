import { AxiosRequestConfig } from "axios";
import {
  Debt,
  FMV,
  Investment,
  Projection,
  Signature,
  WebsiteData,
  WebsiteFormData,
} from "../../../utils/types";
import { BaseAPI, BaseAPIResponse } from "./baseAPI";

export class InvestmentAPI extends BaseAPI {
  getInvestments = async () => {
    try {
      const res = await this.axios.get<BaseAPIResponse<Investment[]>>(
        "investment"
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestmentSignatures = async (investmentId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<Signature[]>>(
        `investment/signatures/${investmentId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestmentDebt = async (investmentId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<Debt[]>>(
        `investment/debt/${investmentId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestmentFMV = async (investmentId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<FMV[]>>(
        `investment/fmv/${investmentId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestmentProjections = async (investmentId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<Projection[]>>(
        `investment/projections/${investmentId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestmentWebsiteData = async (investmentId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<WebsiteData>>(
        `investment/website/${investmentId}`
      );
      const decodedData = JSON.parse(res.data.data.data);

      return {
        ...res.data,
        data: { ...res.data.data, decodedData },
      } as BaseAPIResponse<WebsiteData>;
    } catch (error: any) {
      console.log("error", error);
    //  this.setError(String(error));
      return;
    }
  };

  saveInvestmentWebsiteData = async (
    investmentId: number,
    data: Partial<WebsiteFormData>
  ) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>(
        `investment/website/${investmentId}`,
        data
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getInvestmentExport = async () => {
    const config: AxiosRequestConfig = {
      responseType: "blob",
      headers: { "Cache-Control": "no-cache" },
    };
    try {
      const res = await this.axios.get("investment/export", config);
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
