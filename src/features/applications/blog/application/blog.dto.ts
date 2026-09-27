export interface BlogAuthorDto { name: string; role: string; }
export interface BlogPostDto { id: string; title: string; excerpt: string; category: string; status: 'Publicado' | 'Borrador' | 'Programado'; publishedAt: string; readTime: string; author: BlogAuthorDto; }
export interface BlogCollectionViewDto { title: string; description: string; breadcrumbs: readonly string[]; searchLabel: string; searchPlaceholder: string; categoryLabel: string; allCategoriesLabel: string; resultSingularLabel: string; resultPluralLabel: string; dateLabel: string; readTimeLabel: string; emptyTitle: string; emptyDescription: string; posts: readonly BlogPostDto[]; }
export type BlogListViewDto = BlogCollectionViewDto;
export type BlogGridViewDto = BlogCollectionViewDto;
