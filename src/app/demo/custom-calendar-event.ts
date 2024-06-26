// custom-calendar-event.ts
import { CalendarEvent } from 'angular-calendar';

export interface CustomCalendarEvent extends CalendarEvent {
  username?: string;
}
