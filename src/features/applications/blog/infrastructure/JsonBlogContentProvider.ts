import rawListView from './blog-list.view.json';
import rawGridView from './blog-grid.view.json';
import rawPostView from './blog-post.view.json';
import rawEditorView from './blog-editor.view.json';
import type { BlogContentProvider } from '../application/blog.contracts';
import type { BlogArticleBlockDto, BlogCollectionViewDto, BlogEditorViewDto, BlogGridViewDto, BlogListViewDto, BlogPostDto, BlogPostViewDto } from '../application/blog.dto';

const statuses: readonly BlogPostDto['status'][] = ['Publicado', 'Borrador', 'Programado'];
const blockTypes: readonly BlogArticleBlockDto['type'][] = ['lead', 'heading', 'paragraph', 'quote'];

function isPost(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const post = value as Record<string, unknown>;
  return ['id', 'title', 'excerpt', 'category', 'publishedAt', 'readTime'].every((key) => typeof post[key] === 'string')
    && statuses.includes(post.status as BlogPostDto['status'])
    && !!post.author && typeof post.author === 'object'
    && typeof (post.author as Record<string, unknown>).name === 'string'
    && typeof (post.author as Record<string, unknown>).role === 'string';
}

function hasBreadcrumbs(view: Record<string, unknown>) {
  return Array.isArray(view.breadcrumbs) && view.breadcrumbs.length > 0 && view.breadcrumbs.every((item) => typeof item === 'string' && item.length > 0);
}

function mapCollectionView(value: unknown, posts: readonly BlogPostDto[]): BlogCollectionViewDto {
  if (!value || typeof value !== 'object') throw new Error('Invalid blog collection content.');
  const view = value as Record<string, unknown>;
  for (const key of ['title', 'description', 'searchLabel', 'searchPlaceholder', 'categoryLabel', 'allCategoriesLabel', 'resultSingularLabel', 'resultPluralLabel', 'dateLabel', 'readTimeLabel', 'emptyTitle', 'emptyDescription']) {
    if (typeof view[key] !== 'string' || !view[key]) throw new Error(`Invalid blog collection field: ${key}`);
  }
  if (!hasBreadcrumbs(view)) throw new Error('Invalid blog collection breadcrumbs.');
  return { ...(value as Omit<BlogCollectionViewDto, 'posts'>), posts };
}

function mapPostView(value: unknown, posts: readonly BlogPostDto[]): BlogPostViewDto {
  if (!value || typeof value !== 'object') throw new Error('Invalid blog post content.');
  const view = value as Record<string, unknown>;
  for (const key of ['title', 'description', 'postId', 'dateLabel', 'readTimeLabel']) if (typeof view[key] !== 'string' || !view[key]) throw new Error(`Invalid blog post field: ${key}`);
  if (!hasBreadcrumbs(view)) throw new Error('Invalid blog post breadcrumbs.');
  if (!Array.isArray(view.content) || !view.content.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const block = item as Record<string, unknown>;
    return blockTypes.includes(block.type as BlogArticleBlockDto['type']) && typeof block.text === 'string' && block.text.length > 0;
  })) throw new Error('Invalid blog article blocks.');
  const post = posts.find((item) => item.id === view.postId);
  if (!post) throw new Error('Blog post detail references an unknown canonical post.');
  return { title: view.title as string, description: view.description as string, breadcrumbs: view.breadcrumbs as string[], dateLabel: view.dateLabel as string, readTimeLabel: view.readTimeLabel as string, post, content: view.content as BlogArticleBlockDto[] };
}

function mapEditorView(value: unknown, postView: BlogPostViewDto): BlogEditorViewDto {
  if (!value || typeof value !== 'object') throw new Error('Invalid blog editor content.');
  const view = value as Record<string, unknown>;
  for (const key of ['title','description','postId','titleLabel','excerptLabel','categoryLabel','statusLabel','contentLabel','previewLabel','blockTypeLabel','blockTextLabel']) if (typeof view[key] !== 'string' || !view[key]) throw new Error(`Invalid blog editor field: ${key}`);
  if (!hasBreadcrumbs(view)) throw new Error('Invalid blog editor breadcrumbs.');
  if (view.postId !== postView.post.id) throw new Error('Blog editor must reference the canonical article post.');
  if (!Array.isArray(view.categories) || !view.categories.every((item) => typeof item === 'string')) throw new Error('Invalid blog editor categories.');
  if (!Array.isArray(view.statuses) || !view.statuses.every((item) => statuses.includes(item as BlogPostDto['status']))) throw new Error('Invalid blog editor statuses.');
  if (!Array.isArray(view.blockTypes) || !view.blockTypes.every((item) => blockTypes.includes(item as BlogArticleBlockDto['type']))) throw new Error('Invalid blog editor block types.');
  const labels = view.blockTypeLabels as Record<string, unknown>;
  if (!labels || typeof labels !== 'object' || !blockTypes.every((type) => typeof labels[type] === 'string')) throw new Error('Invalid blog editor block labels.');
  return { ...(value as Omit<BlogEditorViewDto,'post'|'content'>), post: postView.post, content: postView.content };
}

const canonicalPosts = (() => {
  const value = rawListView as Record<string, unknown>;
  if (!Array.isArray(value.posts) || !value.posts.every(isPost)) throw new Error('Invalid canonical blog posts.');
  return value.posts as BlogPostDto[];
})();

export class JsonBlogContentProvider implements BlogContentProvider {
  private readonly listView = mapCollectionView(rawListView, canonicalPosts);
  private readonly gridView = mapCollectionView(rawGridView, canonicalPosts);
  private readonly postView = mapPostView(rawPostView, canonicalPosts);
  private readonly editorView = mapEditorView(rawEditorView, this.postView);
  getListView(): BlogListViewDto { return this.listView; }
  getGridView(): BlogGridViewDto { return this.gridView; }
  getPostView(): BlogPostViewDto { return this.postView; }
  getEditorView(): BlogEditorViewDto { return this.editorView; }
}
