import rawListView from './blog-list.view.json';
import rawGridView from './blog-grid.view.json';
import type { BlogContentProvider } from '../application/blog.contracts';
import type { BlogCollectionViewDto, BlogGridViewDto, BlogListViewDto, BlogPostDto } from '../application/blog.dto';

const statuses: readonly BlogPostDto['status'][] = ['Publicado', 'Borrador', 'Programado'];

function isPost(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const post = value as Record<string, unknown>;
  return ['id', 'title', 'excerpt', 'category', 'publishedAt', 'readTime'].every((key) => typeof post[key] === 'string')
    && statuses.includes(post.status as BlogPostDto['status'])
    && !!post.author && typeof post.author === 'object'
    && typeof (post.author as Record<string, unknown>).name === 'string'
    && typeof (post.author as Record<string, unknown>).role === 'string';
}

function mapCollectionView(value: unknown, posts: readonly BlogPostDto[]): BlogCollectionViewDto {
  if (!value || typeof value !== 'object') throw new Error('Invalid blog collection content.');
  const view = value as Record<string, unknown>;
  for (const key of ['title', 'description', 'searchLabel', 'searchPlaceholder', 'categoryLabel', 'allCategoriesLabel', 'resultSingularLabel', 'resultPluralLabel', 'dateLabel', 'readTimeLabel', 'emptyTitle', 'emptyDescription']) {
    if (typeof view[key] !== 'string' || !view[key]) throw new Error(`Invalid blog collection field: ${key}`);
  }
  if (!Array.isArray(view.breadcrumbs) || view.breadcrumbs.length === 0 || !view.breadcrumbs.every((item) => typeof item === 'string' && item.length > 0)) throw new Error('Invalid blog collection breadcrumbs.');
  return { ...(value as Omit<BlogCollectionViewDto, 'posts'>), posts };
}

const canonicalPosts = (() => {
  const value = rawListView as Record<string, unknown>;
  if (!Array.isArray(value.posts) || !value.posts.every(isPost)) throw new Error('Invalid canonical blog posts.');
  return value.posts as BlogPostDto[];
})();

export class JsonBlogContentProvider implements BlogContentProvider {
  private readonly listView = mapCollectionView(rawListView, canonicalPosts);
  private readonly gridView = mapCollectionView(rawGridView, canonicalPosts);
  getListView(): BlogListViewDto { return this.listView; }
  getGridView(): BlogGridViewDto { return this.gridView; }
}
