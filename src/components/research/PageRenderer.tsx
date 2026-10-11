import type { BookPage } from "../../models/ResearchPaper";
import { InventoryText } from "../InventoryText";
export function PageRenderer({
  page,
  number,
}: {
  page: BookPage;
  number: number;
}) {
  return (
    <section className="book-page" aria-label={`第 ${number} 页`}>
      <div className="book-page-copy">
        {page.map((block, index) =>
          block.kind === "image" ? (
            <figure key={index}>
              <img src={block.src} alt={block.alt} />
            </figure>
          ) : (
            <div className="book-line" key={index}>
              {block.text && (
                <InventoryText
                  text={block.text}
                  color={block.heading ? "#5a3017" : "#292019"}
                  shadow={false}
                />
              )}
            </div>
          ),
        )}
      </div>
    </section>
  );
}
