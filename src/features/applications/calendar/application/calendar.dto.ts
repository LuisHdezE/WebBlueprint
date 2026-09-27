export type CalendarEventTone = 'primary' | 'success' | 'warning' | 'neutral';
export interface CalendarEventDto { id: string; title: string; date: string; time: string; category: string; tone: CalendarEventTone; }
export interface CalendarDayDto { date: string; dayNumber: number; inCurrentMonth: boolean; isToday: boolean; }
export interface CalendarViewDto { title: string; description: string; breadcrumbs: readonly string[]; monthLabel: string; previousLabel: string; nextLabel: string; todayLabel: string; allCategoriesLabel: string; categoryLabel: string; weekdays: readonly string[]; days: readonly CalendarDayDto[]; events: readonly CalendarEventDto[]; }
