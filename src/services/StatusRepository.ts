import data from "../data/status.json";
import type { SiteStatus } from "../models/SiteStatus";
export interface StatusRepository {
  getStatus(signal?: AbortSignal): Promise<SiteStatus>;
}
export class StaticStatusRepository implements StatusRepository {
  async getStatus(signal?: AbortSignal): Promise<SiteStatus> {
    signal?.throwIfAborted();
    return structuredClone(data) as SiteStatus;
  }
}
export const statusRepository: StatusRepository = new StaticStatusRepository();
