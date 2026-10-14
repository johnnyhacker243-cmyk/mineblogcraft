import data from "../data/blogs.json";
import type { BlogWorld } from "../models/BlogWorld";

export interface BlogRepository {
  getBlogs(signal?: AbortSignal): Promise<BlogWorld[]>;
  getContent(blog: BlogWorld, signal?: AbortSignal): Promise<string>;
}
export class StaticBlogRepository implements BlogRepository {
  async getBlogs(): Promise<BlogWorld[]> {
    return data.map((blog) => ({
      ...blog,
      tags: [...blog.tags],
    })) as BlogWorld[];
  }
  async getContent(blog: BlogWorld, signal?: AbortSignal) {
    if (!blog.file) return blog.content;
    const response = await fetch(blog.file, { signal });
    if (!response.ok) throw Error("Blog content unavailable");
    return response.text();
  }
}
export const blogRepository: BlogRepository = new StaticBlogRepository();
