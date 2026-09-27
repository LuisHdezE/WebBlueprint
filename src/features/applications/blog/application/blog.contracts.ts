import type { BlogGridViewDto, BlogListViewDto } from './blog.dto';
export interface BlogContentProvider { getListView(): BlogListViewDto; getGridView(): BlogGridViewDto; }
