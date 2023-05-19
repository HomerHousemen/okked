import React from "react";
import { ContactForm } from "./contactForm";
import _ from "lodash";
import { FormProvider } from "../../form";
import { useGlobal } from "../../global";

interface ContactRecord {
  id?: number | null;
  investorId: number;
  contactName: string | null;
  primaryPhone: string | null;
  email: string | null;
  secondaryPhone: string | null;
  //fax: string | null,
  //webUrl: string | null,
  initialSubmitted?: boolean;
  emailMemos: boolean;
  emailFiles: boolean;
}

interface contactProps {
  contact: ContactRecord;
  investorId?: number;
  onSave?: any;
  ref?: any;
}

export const Contact: React.FC<contactProps> = ({
  contact,
  investorId,
  onSave,
}) => {
  const { setSuccess } = useGlobal();
  return (
    <>
      {!_.isNil(contact) && (
        <FormProvider
          initialValues={{ ...contact, investorId: investorId }}
          saveurl={"investor/contacts/save"}
          onSave={() => {
            onSave();
            setSuccess("Contact saved.");
          }}
          initialSubmitted={contact.initialSubmitted}
        >
          <ContactForm onDelete={onSave} />
        </FormProvider>
      )}
    </>
  );
};
