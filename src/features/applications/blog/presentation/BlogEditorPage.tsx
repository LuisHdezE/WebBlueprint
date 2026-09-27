import { useState } from 'react';
import { SelectField } from '@/components/forms/SelectField';
import { TextAreaField } from '@/components/forms/TextAreaField';
import { TextField } from '@/components/forms/TextField';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { BlogContentProvider } from '../application/blog.contracts';
import type { BlogArticleBlockDto, BlogPostDto } from '../application/blog.dto';
import { BlogArticleContent } from './BlogArticleContent';
import { BlogPostAuthor, BlogPostStatus } from './BlogPostMeta';

export function BlogEditorPage({ contentProvider }: { contentProvider: BlogContentProvider }) {
  const view = contentProvider.getEditorView();
  const [title, setTitle] = useState(view.post.title);
  const [excerpt, setExcerpt] = useState(view.post.excerpt);
  const [category, setCategory] = useState(view.post.category);
  const [status, setStatus] = useState<BlogPostDto['status']>(view.post.status);
  const [blocks, setBlocks] = useState<BlogArticleBlockDto[]>(view.content.map((block) => ({ ...block })));

  function updateBlock(index: number, patch: Partial<BlogArticleBlockDto>) {
    setBlocks((current) => current.map((block, position) => position === index ? { ...block, ...patch } as BlogArticleBlockDto : block));
  }

  return (
    <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <SurfaceCard><div className="grid gap-4 md:grid-cols-2"><div className="md:col-span-2"><TextField id="blog-editor-title" label={view.titleLabel} value={title} onChange={setTitle} /></div><div className="md:col-span-2"><TextAreaField id="blog-editor-excerpt" label={view.excerptLabel} value={excerpt} onChange={setExcerpt} rows={3} /></div><SelectField id="blog-editor-category" label={view.categoryLabel} value={category} options={view.categories.map((value) => ({ value, label: value }))} onChange={setCategory} /><SelectField id="blog-editor-status" label={view.statusLabel} value={status} options={view.statuses.map((value) => ({ value, label: value }))} onChange={setStatus} /></div></SurfaceCard>
          <SurfaceCard><h2 className="mb-4 text-sm font-semibold text-slate-900">{view.contentLabel}</h2><div className="space-y-4">{blocks.map((block,index)=><div className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3" key={index}><SelectField id={`blog-editor-block-type-${index}`} label={view.blockTypeLabel} value={block.type} options={view.blockTypes.map((value)=>({value,label:view.blockTypeLabels[value]}))} onChange={(type)=>updateBlock(index,{type})}/><TextAreaField id={`blog-editor-block-text-${index}`} label={view.blockTextLabel} value={block.text} onChange={(text)=>updateBlock(index,{text})} rows={3}/></div>)}</div></SurfaceCard>
        </div>
        <div className="xl:sticky xl:top-4 xl:self-start"><SurfaceCard><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{view.previewLabel}</p><article><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--theme-primary)]">{category}</span><BlogPostStatus status={status}/></div><h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{title}</h2><p className="mt-2 text-[12px] leading-5 text-slate-500">{excerpt}</p><div className="mt-4 border-y border-slate-100 py-3"><BlogPostAuthor author={view.post.author}/></div><div className="mt-5"><BlogArticleContent blocks={blocks}/></div></article></SurfaceCard></div>
      </div>
    </PageShell>
  );
}
