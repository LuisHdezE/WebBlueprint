import rawView from './blog-list.view.json';
import type { BlogContentProvider } from '../application/blog.contracts';
import type { BlogListViewDto } from '../application/blog.dto';

function isPost(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const post = value as Record<string, unknown>;
  return ['id', 'title', 'excerpt', 'category', 'status', 'publishedAt', 'readTime'].every((key) => typeof post[key] === 'string')
    && !!post.author && typeof post.author === 'object'
    && typeof (post.author as Record<string, unknown>).name === 'string'
    && typeof (post.author as Record<string, unknown>).role === 'string';
}

function mapBlogListView(value: unknown): BlogListViewDto {
  if (!value || typeof value !== 'object') throw new Error('Invalid blog list content.');
  const view = value as Record<string, unknown>;
  for (const key of ['title', 'description', 'searchLabel', 'searchPlaceholder', 'allCategoriesLabel', 'emptyTitle', 'emptyDescription']) {
    if (typeof view[key] !== 'string' || !view[key]) throw new Error(`Invalid blog list field: ${key}`);
  }
  if (!Array.isArray(view.posts) || !view.posts.every(isPost)) throw new Error('Invalid blog list posts.');
  return value as BlogListViewDto;
}

export class JsonBlogContentProvider implements BlogContentProvider {
  private readonly view = mapBlogListView(rawView);
  getListView(): BlogListViewDto { return this.view; }
}
