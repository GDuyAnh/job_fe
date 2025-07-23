export enum FemaleStatus {
  Active = 1,
  PendingVerification = 2,
  IncompleteInfo = 3,
  VerifyingIdentity = 4,
  Suspended = 5,
  Deleted = 6,
  VerifyFailed = 7,
}

export enum AccountType {
  Regular = 1,
  Current = 2,
  Savings = 3,
  Other = 99,
}

export enum TypeTag {
  Male = 1,
  Female = 2,
}
