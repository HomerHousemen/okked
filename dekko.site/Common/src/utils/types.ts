export interface LookupItem {
  id: number;
  name: string;
  active?: boolean;
}

export enum ApprovalType {
  "Capital Call" = 1,
  "Distribution" = 2,
}

export interface Approval {
  id: number;
  investmentId: string;
  date: Date | string;
  approvalType: ApprovalType;
  userInternalId: number;
  approved?: boolean;
  notes: string;
  active: boolean;
}

export interface ApprovalKey {
  investmentId: string;
  date: Date | string;
  approvalType: ApprovalType;
}

export interface ApprovalRequest {
  investmentId: string;
  date: Date | string;
  approvalType: ApprovalType;
  userInternalId: number;
  approved: boolean;
  notes: string;
}

export enum ApprovalStatus {
  NOT_STARTED = 0,
  STARTED = 1,
  APPROVED = 2,
  NOT_APPROVED = 3,
  COMPLETED = 4,
}

export interface ApprovalInfo {
  approvalStatus: ApprovalStatus;
  callDate: Date;
  dueDate: Date;
  id: number;
  investmentId: number;
  lastUpdated: Date;
}

export interface Investor {
  active: boolean;
  id: number;
  investmentEntity: boolean;
  name: string;
}
export interface InvestorRecord {
  active: boolean;
  federalTypeId: number;
  id: number;
  identifier?: string;
  investmentEntity?: boolean;
  lastUpdated: string; // or Date?
  name: string;
  paymentMethodId: number;
  primaryInvestor?: string;
  updatedBy: string;
  fein?: string;
}

export interface InvestorContactRecord {
  contactName: string;
  email: string;
  emailFiles: boolean;
  emailMemos: boolean;
  id: number;
  investorId: number;
  lastUpdated: string; // or Date?
  primaryPhone: string;
  secondaryPhone: string;
  updatedBy: string;
}

export interface InvestorAddressRecord {
  contactName: string;
  email: string;
  emailFiles: boolean;
  emailMemos: boolean;
  id: number;
  investorId: number;
  lastUpdated: string; // or Date?
  primaryPhone: string;
  secondaryPhone: string;
  updatedBy: string;
}

export interface InvestorContactRecord {
  addressType: string;
  city: string;
  countryCode: string;
  id: number;
  investorId: number;
  lastUpdated: string; // or Date?
  state: string;
  streetAddress: string;
  updatedBy: string;
  zipCode: string;
}

export interface Signature {
  investmentId: number;
  signature: string;
  userInternalId: number;
}

export interface Debt {
  fixedOrFloating: "Fixed" | "Floating";
  id: number;
  interestRate: string;
  investmentId: number;
  lastUpdated: string; // or Date?
  lender: string;
  loanBalance: number;
  maturityDate: string; // or Date?
  requiredDSCR: string;
  updatedBy: string;
}

export interface FMV {
  dateQuarter: string; // or Date?
  displayQuarter: string;
  grossValue: number;
  id: number;
  investmentId: number;
  lastUpdated: string; // or Date?
  napPercent: number;
  napTotalValue: number;
  napValue: number;
  napWorkingCapital: number;
  netValue: number;
  otherCosts: number;
  outstandingDebt: number;
  quarter: number;
  taxAbatement: number;
  updatedBy: string; // or Date?
  workingCapital: number;
  year: number;
}

export interface Projection {
  id: number;
  date: string; // or Date?
  investmentId: number;
  operational: number;
  transactional: number;
  asOfDate: string; // or Date?
}

export interface WebsiteData {
  data: string; // string encoded version of decodedData
  decodedData?: WebsiteFormData;
  investmentId: number;
  lastUpdated: string; // or Date?
  updatedBy: string;
}

export interface WebsiteFormData {
  address: string;
  cardDescription: string;
  city: string;
  details: string;
  featuredOn: string;
  googleEarth: string;
  id: string;
  notes: string;
  numUnits: string;
  office: string;
  ownershipStatus: string;
  pageDescription: string;
  propertyType: string;
  socialMedia_facebook: string;
  socialMedia_instagram: string;
  socialMedia_linkedIn: string;
  socialMedia_twitter: string;
  sortOrder: string;
  sqFt: string;
  state: string;
  status: string;
  title: string;
  webAddress: string;
  yearCompleted: string;
}

export interface Investment {
  active: boolean;
  entityClassification: number;
  id: number;
  identifier: string;
  name: string;
  nickname: string;
  partnerOffice: string;
}

export interface Lookups {
  accountingContacts: LookupItem[];
  years: LookupItem[];
  users: LookupItem[];
  taxForms: LookupItem[];
  taxFormStatuses: LookupItem[];
  taxContacts: LookupItem[];
  propertyManagers: LookupItem[];
  productTypes: LookupItem[];
  paymentMethods: LookupItem[];
  partnerOffices: LookupItem[];
  federalTypes: LookupItem[];
  distributionTypes: LookupItem[];
  countries: LookupItem[];
  capitalPartners: LookupItem[];
  callTypes: LookupItem[];
  bankNames: LookupItem[];
  addressTypes: LookupItem[];
}
