export interface BlogAuthorDto { name: string; role: string; }
export interface BlogPostDto { id: string; title: string; excerpt: string; category: string; status: 'Publicado' | 'Borrador' | 'Programado'; publishedAt: string; readTime: string; author: BlogAuthorDto; }
export interface BlogListViewDto { title: string; description: string; searchLabel: string; searchPlaceholder: string; allCategoriesLabel: string; emptyTitle: string; emptyDescription: string; posts: readonly BlogPostDto[]; }
