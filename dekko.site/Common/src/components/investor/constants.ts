export const initialInvestor = {
  id: 0,
  name: "",
  federalTypeId: 0,
  fein: "",
  lastUpdated: "",
  updatedBy: "",
  active: true,
  paymentMethodId: 1,
};

export const initialAddress = {
  id: 0,
  investorId: 0,
  addressType: "",
  countryCode: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
};

export const initialContact = {
  id: 0,
  investorId: 0,
  contactName: "",
  primaryPhone: "",
  secondaryPhone: "",
  email: "",
  fax: "",
  webUrl: "",
  emailMemos: true,
  emailFiles: true,
};
