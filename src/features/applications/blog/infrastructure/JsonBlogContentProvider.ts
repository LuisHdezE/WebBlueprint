import rawView from './blog-list.view.json';
import type { BlogContentProvider } from '../application/blog.contracts';
import type { BlogListViewDto, BlogPostDto } from '../application/blog.dto';

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

function mapBlogListView(value: unknown): BlogListViewDto {
  if (!value || typeof value !== 'object') throw new Error('Invalid blog list content.');
  const view = value as Record<string, unknown>;
  for (const key of ['title', 'description', 'searchLabel', 'searchPlaceholder', 'categoryLabel', 'allCategoriesLabel', 'resultSingularLabel', 'resultPluralLabel', 'dateLabel', 'readTimeLabel', 'emptyTitle', 'emptyDescription']) {
    if (typeof view[key] !== 'string' || !view[key]) throw new Error(`Invalid blog list field: ${key}`);
  }
  if (!Array.isArray(view.breadcrumbs) || view.breadcrumbs.length === 0 || !view.breadcrumbs.every((item) => typeof item === 'string' && item.length > 0)) throw new Error('Invalid blog list breadcrumbs.');
  if (!Array.isArray(view.posts) || !view.posts.every(isPost)) throw new Error('Invalid blog list posts.');
  return value as BlogListViewDto;
}

export class JsonBlogContentProvider implements BlogContentProvider {
  private readonly view = mapBlogListView(rawView);
  getListView(): BlogListViewDto { return this.view; }
}
