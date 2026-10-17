import type { SiteStatus } from "../models/SiteStatus";
export const statusRepository = {
  async getStatus(signal?: AbortSignal): Promise<SiteStatus> {
    const response = await fetch("/data/site-status.json", {
      signal,
      cache: "no-cache",
    });
    if (!response.ok) throw Error("Build report unavailable");
    const data = await response.json();
    if (
      data.mode !== "build-report" ||
      !data.counts ||
      !Array.isArray(data.checks)
    )
      throw Error("Invalid build report");
    return data;
  },
};
