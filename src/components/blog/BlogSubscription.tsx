import { useEffect, useRef, useState } from "react";
import { MinecraftButton } from "../MinecraftButton";
import { InventoryText } from "../InventoryText";

export function BlogSubscription({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const address = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState(
    "无需注册，将地址添加到你的 RSS 阅读器即可。",
  );
  const feedUrl = new URL("/feed.xml", location.origin).href;

  useEffect(() => {
    const panel = dialog.current!;
    const previousFocus = document.activeElement;
    panel.showModal();
    return () => {
      panel.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus();
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setFeedback("地址已复制，在 RSS 阅读器中粘贴并添加订阅。");
    } catch {
      address.current?.focus();
      address.current?.select();
      setFeedback("请长按复制，或按 Ctrl+C / Command+C 复制地址。");
    }
  };

  return (
    <dialog
      ref={dialog}
      className="blog-subscription"
      aria-labelledby="blog-subscription-title"
      aria-describedby="blog-subscription-help"
      onCancel={close}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>(
          "input, button, a[href]",
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <h2 id="blog-subscription-title">
        <InventoryText text="订阅博客" color="#ffff55" />
      </h2>
      <div className="subscription-intro">
        <InventoryText text="把 Mineblogcraft 的新文章带回你的阅读器" />
      </div>
      <label htmlFor="blog-feed-address">
        <InventoryText text="RSS 订阅地址" color="#aaa" />
      </label>
      <input
        ref={address}
        id="blog-feed-address"
        type="url"
        value={feedUrl}
        readOnly
        onFocus={(event) => event.currentTarget.select()}
        spellCheck={false}
      />
      <div className="subscription-actions">
        <MinecraftButton aria-label="复制订阅地址" onClick={copy}>
          <InventoryText text="复制地址" />
        </MinecraftButton>
        <a
          className="subscription-feed-link"
          href={feedUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          打开 RSS ↗
        </a>
      </div>
      <div id="blog-subscription-help" className="subscription-help">
        <div>
          <InventoryText text="1. 复制上方订阅地址。" />
        </div>
        <div>
          <InventoryText text="2. 在阅读器中选择添加订阅，粘贴地址。" />
        </div>
        <div>
          <InventoryText
            text="发布新文章后，阅读器检查时即可获取更新。"
            color="#aaa"
          />
        </div>
        <div>
          <InventoryText
            text="仅包含已发布博客，草稿不会进入订阅。"
            color="#aaa"
          />
        </div>
      </div>
      <div className="subscription-feedback" role="status">
        {feedback}
      </div>
      <MinecraftButton aria-label="完成订阅说明" onClick={close}>
        <InventoryText text="完成" />
      </MinecraftButton>
    </dialog>
  );
}
