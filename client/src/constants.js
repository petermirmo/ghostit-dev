export const nonEditableUserFields = [
  "_id",
  "__v",
  "password",
  "tempID",
  "stripeCustomerID",
  "stripeSubscriptionID",
  "country",
  "signedInAsUser",
  "dateCreated"
];
export const cantShowUserFields = [
  "__v",
  "password",
  "country",
  "signedInAsUser",
  "defaultCalendarID",
  "dateCreated",
  "updatedAt"
];
export const postingTypes = [
  { name: "facebook" },
  { name: "twitter", maxCharacters: 280 },
  { name: "linkedin", maxCharacters: 700 },
  { name: "blog" },
  { name: "newsletter" },
  { name: "instagram" }
];

export const roles = ["demo", "client", "manager", "admin"];
