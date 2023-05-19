export enum LocalStorageKeys {
  Investors = "INVESTORS",
  Investments = "INVESTMENTS",
  Lookups = "LOOKUPS",
  username = "USERNAME",
  isSignedIn = "IS_SIGNED_IN",
  timestamp = "_TIMESTAMP",
}

const moreThanOneHourAgo = (date: number) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date < anHourAgo;
};

const _localStorageGet = (
  target: LocalStorageKeys,
  suffix?: LocalStorageKeys
) => {
  const fetchKey = suffix ? target + suffix : target;
  const item = localStorage.getItem(fetchKey);
  if (!item) return null;
  try {
    const parsedItem = JSON.parse(item);
    if (!parsedItem) return null;
    return parsedItem;
  } catch {
    return null;
  }
};

export const localStorageGet = (target: LocalStorageKeys) => {
  const timestamp = _localStorageGet(target, LocalStorageKeys.timestamp);
  if (timestamp && moreThanOneHourAgo(timestamp)) {
    localStorageRemove(target);
    return null;
  }
  return _localStorageGet(target);
};

export const localStorageSet = (
  target: LocalStorageKeys,
  value: any,
  timed?: boolean
) => {
  const stringified = JSON.stringify(value);
  localStorage.setItem(target, stringified);
  if (timed) {
    const timestampTarget = target + LocalStorageKeys.timestamp;
    const timestamp = JSON.stringify(Date.now());
    localStorage.setItem(timestampTarget, timestamp);
  }
};

export const localStorageRemove = (target: LocalStorageKeys) => {
  localStorage.removeItem(target);
  localStorage.removeItem(target + LocalStorageKeys.timestamp);
};
