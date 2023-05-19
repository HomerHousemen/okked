import { LookupItem } from "../../../utils/types";
import { BaseAPI, BaseAPIResponse } from "./baseAPI";

export class UsersExternalAPI extends BaseAPI {
  getInvestors = async (userId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<LookupItem[]>>(
        `admin/users-external/investors/${userId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  addInvestor = async (userId: number, investorId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse>(
        `admin/users-external/investor/${userId}/${investorId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  removeInvestor = async (userId: number, investorId: number) => {
    try {
      const res = await this.axios.delete<BaseAPIResponse>(
        `admin/users-external/investor/${userId}/${investorId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };
}
