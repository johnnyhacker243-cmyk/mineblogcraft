import data from "../data/blogs.json";
import type { BlogWorld } from "../models/BlogWorld";

export interface BlogRepository {
  getBlogs(signal?: AbortSignal): Promise<BlogWorld[]>;
}
export class StaticBlogRepository implements BlogRepository {
  async getBlogs(): Promise<BlogWorld[]> {
    return data.map((blog) => ({ ...blog, tags: [...blog.tags] }));
  }
}
