import { Avatar } from '@/components/data-display/Avatar';
import type { BlogPostDto } from '../application/blog.dto';
import { blogStatusClass } from './blogPresentation';

export function BlogPostStatus({ status }: { status: BlogPostDto['status'] }) {
  return <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${blogStatusClass(status)}`}>{status}</span>;
}

export function BlogPostAuthor({ author }: { author: BlogPostDto['author'] }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={author.name} size="sm" />
      <div><p className="text-[11px] font-semibold text-slate-700">{author.name}</p><p className="text-[10px] text-slate-400">{author.role}</p></div>
    </div>
  );
}
