export type HostName = string;
export type AppName = string;
export type ApDex = number;
export type Version = number;

export type App = {
  name: AppName
  contributors: Array<string>,
  apdex: ApDex,
  version: Version,
  host: Array<HostName>
};

export type Host = Array<AppName>;

export type AppList = Array<App>;

export type HostList = {
  [key: HostName]: Array<AppName>;
};
