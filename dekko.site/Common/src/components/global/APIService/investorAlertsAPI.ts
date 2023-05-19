import { BaseAPI, BaseAPIResponse } from "./baseAPI";

interface InvestorAlert {
  id: number;
  route: string;
  alertText: string;
}

export class InvestorAlertsAPI extends BaseAPI {
  getAlerts = async (
    userId: number,
    errorRef: React.MutableRefObject<boolean>
  ) => {
    if (errorRef.current) {
      console.log("Skip alerts for error");
      return;
    }
    try {
      const res = await this.axios.get<BaseAPIResponse<InvestorAlert[]>>(
        `alerts/get/${userId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error in getAlerts", error);
      errorRef.current = true;
      this.setError(String(error));
      return;
    }
  };

  viewAlert = async (
      alertId: number,
      userId: number
  ) => {
   
    try {
      const res = await this.axios.get<BaseAPIResponse>(
          `alerts/view/${alertId}/${userId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error in viewAlerts", error);
      this.setError(String(error));
      return;
    }
  };
}
