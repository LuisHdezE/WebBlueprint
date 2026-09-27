import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import type { BlogContentProvider } from '../application/blog.contracts';
import { PageShell } from '@/shell/PageShell';
import { BlogFilters } from './BlogFilters';
import { BlogPostAuthor, BlogPostStatus } from './BlogPostMeta';
import { blogCategories, filterBlogPosts } from './blogPresentation';

export function BlogListPage({ contentProvider }: { contentProvider: BlogContentProvider }) {
  const view = contentProvider.getListView();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => blogCategories(view.posts), [view.posts]);
  const posts = useMemo(() => filterBlogPosts(view.posts, query, category), [category, query, view.posts]);

  return (
    <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
      <SurfaceCard><BlogFilters searchId="blog-search" categoryId="blog-category" searchLabel={view.searchLabel} searchPlaceholder={view.searchPlaceholder} categoryLabel={view.categoryLabel} allCategoriesLabel={view.allCategoriesLabel} categories={categories} query={query} category={category} onQueryChange={setQuery} onCategoryChange={setCategory} /></SurfaceCard>
      <div aria-live="polite" className="mt-3 text-[11px] font-medium text-slate-500">{posts.length} {posts.length === 1 ? view.resultSingularLabel : view.resultPluralLabel}</div>
      <div className="mt-2 space-y-2">
        {posts.map((post) => (
          <SurfaceCard className="!p-0" key={post.id}>
            <article className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-primary)]">{post.category}</span><BlogPostStatus status={post.status} /></div>
                <h2 className="mt-2 text-[14px] font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-1 max-w-4xl text-[11px] leading-5 text-slate-500">{post.excerpt}</p>
                <div className="mt-3"><BlogPostAuthor author={post.author} /></div>
              </div>
              <dl className="grid grid-cols-2 gap-x-5 gap-y-1 border-t border-slate-100 pt-3 text-[10px] lg:min-w-48 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
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
