import { BaseAPI, BaseAPIResponse } from "./baseAPI";

interface Alert {
  route: string;
  alertText: string;
}

export class AlertsAPI extends BaseAPI {
  getAlerts = async (
    userId: number,
    errorRef: React.MutableRefObject<boolean>
  ) => {
    if (errorRef.current) {
      console.log("Skip alerts for error");
      return;
    }
    try {
      const res = await this.axios.get<BaseAPIResponse<Alert[]>>(
        `approval/alerts/${userId}`
      );
      return res.data;
    } catch (error: any) {
      console.log("error in getAlerts", error);
      errorRef.current = true;
      this.setError(String(error));
      return;
    }
  };
}
