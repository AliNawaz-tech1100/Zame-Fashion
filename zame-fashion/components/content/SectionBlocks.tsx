type Block =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "subheading"; text: string };

export function SectionBlocks({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.type === "subheading") {
          return (
            <h3 key={i} className="font-display text-lg font-semibold text-charcoal pt-2">
              {block.text}
            </h3>
          );
        }
        if (block.type === "list") {
          const items = block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ));
          return block.ordered ? (
            <ol key={i} className="space-y-2 font-body text-sm leading-relaxed text-warm-gray list-decimal list-inside">
              {items}
            </ol>
          ) : (
            <ul key={i} className="space-y-2 font-body text-sm leading-relaxed text-warm-gray list-disc list-inside">
              {items}
            </ul>
          );
        }
        return (
          <p key={i} className="font-body text-sm leading-relaxed text-warm-gray">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
