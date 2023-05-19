import { BaseAPI, BaseAPIResponse } from "./baseAPI";
import { AxiosRequestConfig } from "axios";
import { LookupItem } from "../../../utils/types";

export class SignatureAdminAPI extends BaseAPI {
  getSignatureAdminUsers = async () => {
    const config: AxiosRequestConfig = {
      headers: { "Cache-Control": "no-cache" },
    };

    try {
      const res = await this.axios.get<BaseAPIResponse<LookupItem[]>>(
        "signatureadmin/users",
        config
      );
      return res.data;
    } catch (error: any) {
      console.log("error", error);
      this.setError(String(error));
      return;
    }
  };
}
