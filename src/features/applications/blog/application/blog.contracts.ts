import type { BlogListViewDto } from './blog.dto';
export interface BlogContentProvider { getListView(): BlogListViewDto; }
