import { Lookups } from "../../../utils/types";
import { BaseAPI, BaseAPIResponse } from "./baseAPI";

export class MiscAPI extends BaseAPI {
  getFromUrl = async (url: string) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<any>>(url);
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getLookup = async () => {
    try {
      const res = await this.axios.get<BaseAPIResponse<Lookups>>("lookup");
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };
}
