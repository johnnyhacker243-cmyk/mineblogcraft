import { StaticBlogRepository, type BlogRepository } from "./BlogRepository";
import type { BlogWorld } from "../models/BlogWorld";

export function searchBlogWorlds(
  worlds: BlogWorld[],
  query: string,
): BlogWorld[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return worlds.filter((world) => {
    const text = [world.title, world.description, world.category, ...world.tags]
      .join(" ")
      .toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
export class BlogService {
  constructor(private repository: BlogRepository) {}
  async search(query: string, signal?: AbortSignal) {
    return searchBlogWorlds(await this.repository.getBlogs(signal), query);
  }
}
export const blogService = new BlogService(new StaticBlogRepository());
