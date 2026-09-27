import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { BlogContentProvider } from '../application/blog.contracts';
import { BlogFilters } from './BlogFilters';
import { BlogPostAuthor, BlogPostStatus } from './BlogPostMeta';
import { blogCategories, filterBlogPosts } from './blogPresentation';

export function BlogGridPage({ contentProvider }: { contentProvider: BlogContentProvider }) {
  const view = contentProvider.getGridView();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => blogCategories(view.posts), [view.posts]);
  const posts = useMemo(() => filterBlogPosts(view.posts, query, category), [category, query, view.posts]);

  return (
    <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
      <SurfaceCard>
        <BlogFilters searchId="blog-grid-search" categoryId="blog-grid-category" searchLabel={view.searchLabel} searchPlaceholder={view.searchPlaceholder} categoryLabel={view.categoryLabel} allCategoriesLabel={view.allCategoriesLabel} categories={categories} query={query} category={category} onQueryChange={setQuery} onCategoryChange={setCategory} />
      </SurfaceCard>

      <div aria-live="polite" className="mt-3 text-[11px] font-medium text-slate-500">{posts.length} {posts.length === 1 ? view.resultSingularLabel : view.resultPluralLabel}</div>
      <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <SurfaceCard className="!p-0" key={post.id}>
            <article className="flex h-full flex-col p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-primary)]">{post.category}</span>
                <BlogPostStatus status={post.status} />
              </div>
              <h2 className="mt-3 text-[14px] font-semibold leading-5 text-slate-900">{post.title}</h2>
              <p className="mt-2 flex-1 text-[11px] leading-5 text-slate-500">{post.excerpt}</p>
              <div className="mt-4 border-t border-slate-100 pt-3"><BlogPostAuthor author={post.author} /></div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                <dt className="text-slate-400">{view.dateLabel}</dt><dd className="text-right font-medium text-slate-600">{post.publishedAt}</dd>
                <dt className="text-slate-400">{view.readTimeLabel}</dt><dd className="text-right font-medium text-slate-600">{post.readTime}</dd>
              </dl>
            </article>
          </SurfaceCard>
        ))}
      </div>
      {posts.length === 0 ? <div className="mt-2"><EmptyState title={view.emptyTitle} description={view.emptyDescription} /></div> : null}
    </PageShell>
  );
}
