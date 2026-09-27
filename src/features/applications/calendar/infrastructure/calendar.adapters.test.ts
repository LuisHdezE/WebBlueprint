import { describe,expect,it } from 'vitest';
import { JsonCalendarContentProvider } from './JsonCalendarContentProvider';
describe('calendar content adapter',()=>{it('exposes a complete governed month',()=>{const view=new JsonCalendarContentProvider().getView();expect(view.days).toHaveLength(35);expect(view.weekdays).toHaveLength(7);expect(view.events).toHaveLength(6);expect(view.days.filter(day=>day.isToday)).toHaveLength(1);});});
