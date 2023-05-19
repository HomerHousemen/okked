import { LookupItem } from "../../../utils/types";
import { BaseAPI, BaseAPIResponse } from "./baseAPI";

export class UsersInternalAPI extends BaseAPI {
  getInvestors = async (userId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<LookupItem[]>>(
        `admin/users-internal/investors/${userId}`
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
        `admin/users-internal/investor/${userId}/${investorId}`
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
        `admin/users-internal/investor/${userId}/${investorId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getPartnerOffices = async (userId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse<LookupItem[]>>(
        `admin/users-internal/partner-offices/${userId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  addPartnerOffice = async (userId: number, partnerOfficeId: number) => {
    try {
      const res = await this.axios.get<BaseAPIResponse>(
        `admin/users-internal/partner-office/${userId}/${partnerOfficeId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  removePartnerOffice = async (userId: number, partnerOfficeId: number) => {
    try {
      const res = await this.axios.delete<BaseAPIResponse>(
        `admin/users-internal/partner-office/${userId}/${partnerOfficeId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };
}
