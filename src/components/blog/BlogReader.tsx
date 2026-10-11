import type { BlogWorld } from "../../models/BlogWorld";
import { WorldCover } from "./WorldCover";
import { InventoryText } from "../InventoryText";
import { MinecraftButton } from "../MinecraftButton";
import { BlogText } from "./BlogText";
export function BlogReader({
  world,
  back,
}: {
  world: BlogWorld;
  back: () => void;
}) {
  return (
    <section className="blog-reader" aria-label="博客文章">
      <header>
        <div className="reader-cover">
          <WorldCover image={world.image} />
        </div>
        <h1>
          <BlogText text={world.title} />
        </h1>
        <BlogText
          text={`${world.createTime} · ${world.category}`}
          color="#aaa"
        />
      </header>
      <article tabIndex={0} aria-label={world.title}>
        {world.content
          .split(/\n+/)
          .filter(Boolean)
          .map((paragraph, index) =>
            paragraph.startsWith("## ") ? (
              <h2 key={index}>
                <BlogText
                  text={paragraph.slice(3)}
                  color="#ffff55"
                  width={310}
                />
              </h2>
            ) : (
              <p key={index}>
                <BlogText text={paragraph} width={310} />
              </p>
            ),
          )}
      </article>
      <footer>
        <MinecraftButton aria-label="返回世界列表" onClick={back}>
          <InventoryText text="返回" />
        </MinecraftButton>
      </footer>
    </section>
  );
}
