import type { CalendarViewDto } from './calendar.dto';
export interface CalendarContentProvider { getView(): CalendarViewDto; }
