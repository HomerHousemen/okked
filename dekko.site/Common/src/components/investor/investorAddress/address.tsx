import React from "react";
import { AddressForm } from "./addressForm";
import _ from "lodash";
import { FormProvider } from "../../form";
import { useGlobal } from "../../global";

interface AddressRecord {
  id?: number | null;
  investorId: number;
  addressType: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string | null;
  countryCode: string;
  initialSubmitted?: boolean;
}

interface addressProps {
  address: AddressRecord;
  investorId?: number;
  onSave?: any;
  ref?: any;
}

export const Address: React.FC<addressProps> = ({
  address,
  investorId,
  onSave,
}) => {
  const { setSuccess } = useGlobal();
  return (
    <>
      {!_.isNil(address) && (
        <FormProvider
          initialValues={{ ...address, investorId: investorId }}
          saveurl={"investor\\addresses\\save"}
          onSave={() => {
            onSave();
            setSuccess("Address saved.");
          }}
          initialSubmitted={address.initialSubmitted}
        >
          <AddressForm onDelete={onSave} />
        </FormProvider>
      )}
    </>
  );
};
