import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { BlogContentProvider } from '../application/blog.contracts';
import { BlogArticleContent } from './BlogArticleContent';
import { BlogPostAuthor, BlogPostStatus } from './BlogPostMeta';

export function BlogPostPage({ contentProvider }: { contentProvider: BlogContentProvider }) {
  const view = contentProvider.getPostView();
  return (
    <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
      <SurfaceCard className="!p-0">
        <article className="mx-auto max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-primary)]">{view.post.category}</span>
            <BlogPostStatus status={view.post.status} />
          </div>
          <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{view.post.title}</h1>
          <p className="mt-3 text-[13px] leading-6 text-slate-500">{view.post.excerpt}</p>
          <div className="mt-5 flex flex-col gap-3 border-y border-slate-100 py-4 sm:flex-row sm:items-center sm:justify-between">
            <BlogPostAuthor author={view.post.author} />
            <dl className="grid grid-cols-2 gap-x-5 gap-y-1 text-[10px] sm:min-w-56">
              <dt className="text-slate-400">{view.dateLabel}</dt><dd className="text-right font-medium text-slate-600">{view.post.publishedAt}</dd>
              <dt className="text-slate-400">{view.readTimeLabel}</dt><dd className="text-right font-medium text-slate-600">{view.post.readTime}</dd>
            </dl>
          </div>
          <div className="mt-6"><BlogArticleContent blocks={view.content} /></div>
        </article>
      </SurfaceCard>
    </PageShell>
  );
}
