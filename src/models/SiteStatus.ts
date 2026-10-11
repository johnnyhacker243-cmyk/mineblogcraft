export interface SiteStatus {
  mode: "static-demo" | "live";
  website: {
    name: string;
    status: "online" | "offline";
    response: string;
    version: string;
    lastUpdate: string;
  };
  modules: { name: string; status: "online" | "offline" }[];
  environment: { frontend: string; backend: string; monitoring: string };
}
