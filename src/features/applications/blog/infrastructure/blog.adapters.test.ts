import { describe, expect, it } from 'vitest';
import { JsonBlogContentProvider } from './JsonBlogContentProvider';

describe('blog content adapter', () => {
  it('exposes governed list content', () => {
    const view = new JsonBlogContentProvider().getListView();
    expect(view.posts).toHaveLength(4);
    expect(new Set(view.posts.map((post) => post.id)).size).toBe(view.posts.length);
    expect(view.posts.some((post) => post.status === 'Borrador')).toBe(true);
  });

  it('reuses the canonical post catalog in grid', () => {
    const provider = new JsonBlogContentProvider();
    expect(provider.getGridView().posts).toBe(provider.getListView().posts);
    expect(provider.getGridView().title).toBe('Blog · Cuadrícula');
  });
});
