import { useMemo, useState } from 'react';
import { Avatar } from '@/components/data-display/Avatar';
import { SearchField } from '@/components/forms/SearchField';
import { SelectField } from '@/components/forms/SelectField';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import type { BlogContentProvider } from '../application/blog.contracts';
import type { BlogPostDto } from '../application/blog.dto';
import { PageShell } from '@/shell/PageShell';

function statusClass(status: BlogPostDto['status']) {
  if (status === 'Publicado') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Programado') return 'bg-sky-50 text-sky-700';
  return 'bg-amber-50 text-amber-700';
}

export function BlogListPage({ contentProvider }: { contentProvider: BlogContentProvider }) {
  const view = contentProvider.getListView();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => [...new Set(view.posts.map((post) => post.category))], [view.posts]);
  const posts = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return view.posts.filter((post) => (category === 'all' || post.category === category)
      && (!needle || [post.title, post.excerpt, post.author.name].some((value) => value.toLocaleLowerCase().includes(needle))));
  }, [category, query, view.posts]);

  return (
    <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
      <SurfaceCard>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <SearchField id="blog-search" label={view.searchLabel} onChange={setQuery} placeholder={view.searchPlaceholder} value={query} />
          <SelectField id="blog-category" label={view.categoryLabel} onChange={setCategory} value={category} options={[{ value: 'all', label: view.allCategoriesLabel }, ...categories.map((item) => ({ value: item, label: item }))]} />
        </div>
      </SurfaceCard>

      <div aria-live="polite" className="mt-3 text-[11px] font-medium text-slate-500">{posts.length} {posts.length === 1 ? view.resultSingularLabel : view.resultPluralLabel}</div>
      <div className="mt-2 space-y-2">
        {posts.map((post) => (
          <SurfaceCard className="!p-0" key={post.id}>
            <article className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-primary)]">{post.category}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(post.status)}`}>{post.status}</span>
                </div>
                <h2 className="mt-2 text-[14px] font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-1 max-w-4xl text-[11px] leading-5 text-slate-500">{post.excerpt}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Avatar name={post.author.name} size="sm" />
                  <div><p className="text-[11px] font-semibold text-slate-700">{post.author.name}</p><p className="text-[10px] text-slate-400">{post.author.role}</p></div>
                </div>
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
