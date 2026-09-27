import type { BlogArticleBlockDto } from '../application/blog.dto';

export function BlogArticleContent({ blocks }: { blocks: readonly BlogArticleBlockDto[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === 'heading') return <h2 className="pt-2 text-[17px] font-semibold tracking-tight text-slate-900" key={index}>{block.text}</h2>;
        if (block.type === 'quote') return <blockquote className="border-l-2 border-[var(--theme-primary)] bg-slate-50 px-4 py-3 text-[13px] font-medium leading-6 text-slate-700" key={index}>{block.text}</blockquote>;
        if (block.type === 'lead') return <p className="text-[14px] font-medium leading-7 text-slate-700" key={index}>{block.text}</p>;
        return <p className="text-[12px] leading-6 text-slate-600" key={index}>{block.text}</p>;
      })}
    </div>
  );
}
