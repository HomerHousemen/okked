import {
  useInternalAuth,
  useExternalAuth,
  InternalAuthContextTypes,
  ExternalAuthContextTypes,
} from "..";

export const useAuth = (
  isInternal: boolean
): Partial<InternalAuthContextTypes> & Partial<ExternalAuthContextTypes> =>
  isInternal ? useInternalAuth() : useExternalAuth();
