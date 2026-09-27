import type { BlogPostDto } from '../application/blog.dto';

export function blogStatusClass(status: BlogPostDto['status']) {
  if (status === 'Publicado') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Programado') return 'bg-sky-50 text-sky-700';
  return 'bg-amber-50 text-amber-700';
}

export function filterBlogPosts(posts: readonly BlogPostDto[], query: string, category: string) {
  const needle = query.trim().toLocaleLowerCase();
  return posts.filter((post) => (category === 'all' || post.category === category)
    && (!needle || [post.title, post.excerpt, post.author.name].some((value) => value.toLocaleLowerCase().includes(needle))));
}

export function blogCategories(posts: readonly BlogPostDto[]) {
  return [...new Set(posts.map((post) => post.category))];
}
