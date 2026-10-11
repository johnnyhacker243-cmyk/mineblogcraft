import { useState } from "react";
import { EnchantmentTable } from "./EnchantmentTable";
import { InventoryText } from "../InventoryText";
import { audioManager } from "../../managers/AudioManager";
export function EnchantmentSearch({
  query,
  setQuery,
  count,
}: {
  query: string;
  setQuery: (value: string) => void;
  count: number;
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const visible = hover || focused || !!query;
  return (
    <div
      className={`enchantment-search ${visible ? "search-revealed" : ""}`}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <form
        className="enchantment-search-box"
        aria-label="附魔检索"
        onSubmit={(e) => {
          e.preventDefault();
          audioManager.book();
        }}
      >
        <label htmlFor="paper-search">
          <InventoryText text="附魔检索 · 搜索知识之书" color="#ffff55" />
        </label>
        <input
          id="paper-search"
          value={query}
          onFocus={() => audioManager.book()}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="标题 / 作者 / 分类 / 关键词"
          maxLength={100}
          autoComplete="off"
        />
        <div className="search-result-status" role="status">
          <InventoryText
            text={query ? `找到 ${count} 篇结果` : "输入关键词，唤醒藏书"}
            color="#aaa"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                audioManager.book();
              }}
              aria-label="清空搜索"
            >
              ×
            </button>
          )}
        </div>
      </form>
      <button
        type="button"
        className="enchantment-hotspot"
        aria-label="打开论文搜索"
        onClick={() => {
          audioManager.book();
          document.getElementById("paper-search")?.focus();
        }}
      >
        <EnchantmentTable />
        <InventoryText text="附魔检索" color="#d8c8ff" />
      </button>
    </div>
  );
}
