import type { BlogGridViewDto, BlogListViewDto, BlogPostViewDto } from './blog.dto';
export interface BlogContentProvider { getListView(): BlogListViewDto; getGridView(): BlogGridViewDto; getPostView(): BlogPostViewDto; }
