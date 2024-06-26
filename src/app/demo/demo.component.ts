import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { startOfDay, endOfDay, isSameDay, isSameMonth } from 'date-fns';
import { SharedService } from '../shared.service';
import { EventColor } from 'calendar-utils';
import { CustomCalendarEvent } from './custom-calendar-event'; // Import the custom interface
import { AuthService } from '../services/auth.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#34c759',
    secondary: '#D3EFD1',
  },
  purple: {
    primary: '#8e44ad',
    secondary: '#EBDEF0',
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  selectedReservationId: string | number | undefined | null = null;

  currentUserRole: string = '';
  userId: string | null = null;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CustomCalendarEvent;
  } = { action: '', event: {} as CustomCalendarEvent };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CustomCalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CustomCalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();
  events: CustomCalendarEvent[] = []; // Use the custom interface
  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private sharedService: SharedService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('id'); 
    console.log('userId', this.userId);

    this.authService.getUserRole().subscribe(role => {
      this.currentUserRole = role;
      this.loadReservations();
    });
  }

  getRandomColor(): EventColor {
    const colorKeys = Object.keys(colors);
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    return colors[colorKeys[randomIndex]];
  }

  loadReservations(): void {
    this.sharedService.getAllReservations().subscribe((reservations: any[]) => {
      console.log(reservations);
      if (this.currentUserRole === 'User') {
        reservations = reservations.filter(reservation => reservation.statut === 'confirmed' && reservation.user.id === Number(this.userId));
        console.log (' mes reservations',reservations);
      }
      this.events = reservations
        .filter(reservation => reservation.statut === 'confirmed')
        .map(reservation => ({
          username: `${reservation.user?.firstName || ''} ${reservation.user?.lastName || ''}`.trim() || 'Unknown', // Add username here
          title: reservation.bien?.name || 'No Name',
          start: new Date(reservation.date_debut),
          end: new Date(reservation.date_fin),
          color: this.getRandomColor(),  // Attribution d'une couleur aléatoire
          actions: this.actions,
          allDay: reservation.allDay,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        }));
      this.refresh.next();
    });
  }

  dayClicked({ date, events }: { date: Date; events: CustomCalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CustomCalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CustomCalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  scrollToTable() {
    const table = document.getElementById('reservation-table');
    if (table) {
      table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  selectReservation(reservationId: string | number | undefined): void {
    this.selectedReservationId = reservationId;
    console.log('selectedReservationId', this.selectedReservationId);
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }
}
