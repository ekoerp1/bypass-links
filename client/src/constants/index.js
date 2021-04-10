export const LINKVERTISE_API_BASE_URL =
  "https://publisher.linkvertise.com/api/v1/redirect/link";

export const MEDIUM_HOMEPAGE = "https://medium.com/";

export const MEDIUM_WHITELISTED = [
  "https://medium.com/@suncommander",
  "https://medium.com/me/",
];

export const EXTENSION_STATE = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const STORAGE_KEYS = {
  bookmarks: "bookmarks",
  bypass: "bypass",
  mappedRedirections: "mappedRedirections",
  redirections: "redirections",
  lastVisited: "lastVisited",
  persons: "persons",
};

export const BYPASS_KEYS = {
  LINKVERTISE: "LINKVERTISE",
  BONSAI: "BONSAI",
  BONSAILINK: "BONSAILINK",
  FORUMS: "FORUMS",
  JUSTPASTEIT: "JUSTPASTEIT",
  PASTELINK: "PASTELINK",
  RENTRY: "RENTRY",
  MEDIUM: "MEDIUM",
};

const dbPrefix = __PROD__ ? "prod" : "dev";

export const FIREBASE_DB_REF = {
  bookmarks: `${dbPrefix}/${STORAGE_KEYS.bookmarks}`,
  bypass: `${dbPrefix}/${STORAGE_KEYS.bypass}`,
  redirections: `${dbPrefix}/${STORAGE_KEYS.redirections}`,
  lastVisited: `${dbPrefix}/${STORAGE_KEYS.lastVisited}`,
  persons: `${dbPrefix}/${STORAGE_KEYS.persons}`,
};

export const FIREBASE_STORAGE_REF = {
  persons: STORAGE_KEYS.persons,
};

export const defaultBookmarkFolder = "Bookmarks bar";