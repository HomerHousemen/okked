import { BaseAPI, BaseAPIResponse } from "./baseAPI";
import { Approval } from "../../../utils/types";

export class ApprovalsAPI extends BaseAPI {
  addApprovalUser = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>("approval", data);
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  deleteApprovalUser = async (approvalId: Approval["id"]) => {
    try {
      const res = await this.axios.delete<BaseAPIResponse>(
        `approval/${approvalId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  sendAlertEmail = async (approvalId: Approval["id"]) => {
    try {
      await this.axios.get<BaseAPIResponse>(`approval/resend/${approvalId}`);
      this.setSuccess("Resent alert email");
    } catch (error) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  getIsActiveApprover = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<
        BaseAPIResponse<{ isActiveApprover: boolean }>
      >("approval/isActiveApprover", data);
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  stopApproval = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>("approval/stop", data);
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  startApproval = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>(
        "approval/start",
        data
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  processApproval = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>(
        "approval/process",
        data
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  genMemos = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>(
        "approval/genmemos",
        data
      );
      if (res.data.success) {
        this.setSuccess("Memos generated");
      }

      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };

  sendMemos = async (data: Partial<Approval>) => {
    try {
      const res = await this.axios.post<BaseAPIResponse>("approval/send", data);
      if (res.data.success) {
        this.setSuccess("Completed");
      }

      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };
}
