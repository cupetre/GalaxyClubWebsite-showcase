import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from "./topbar/topbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { TablesGridComponent } from "./tables-grid/tables-grid.component";
import { DateStripComponent } from "./date-strip/date-strip.component";
import { ReservationService } from '../core/services/reservation.service';
import { Reservation } from '../core/services/Reservation';
import { NewReservation } from '../core/services/NewReservation';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TopbarComponent,
    SidebarComponent,
    TablesGridComponent,
    DateStripComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sessions: any = {};
  selectedDate = this.dateStr(0);
  dates: any[] = [];
  dayReservations: Reservation[] = [];
  allSlots: string[] = [];

  constructor(private reservationService: ReservationService) {

  }

  ngOnInit(): void {
    this.buildDates();
    this.buildSlots();
    this.filterReservations();
  }

  ngOnDestroy(): void {
    Object.values(this.sessions).forEach((s: any) => {
      if (s.intervalId) clearInterval(s.intervalId);
    });
  }

  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  populateDates() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 15; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const value = this.formatDateLocal(d);

      const label =
        (i === 0 ? 'Today' : dayNames[d.getDay()]) +
        ' — ' +
        d.getDate() +
        ' ' +
        monthNames[d.getMonth()];

      this.dates.push({ value, label });
    }
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.filterReservations();
  }

  openSession(res: any): void {
    if (!this.sessions[res.id]) {
      this.sessions[res.id] = {
        elapsedSec: 0,
        running: false,
        intervalId: null,
        totalPaid: null
      };
    }

    this.sessions = { ...this.sessions };
  }

  startSession(id: number): void {
    const session = this.sessions[id];
    if (!session || session.running) return;

    session.running = true;
    session.intervalId = setInterval(() => {
      session.elapsedSec++;
      this.sessions = { ...this.sessions };
    }, 1000);

    this.sessions = { ...this.sessions };
  }

  stopSession(id: number): void {
    const session = this.sessions[id];
    if (!session || !session.running) return;

    clearInterval(session.intervalId);
    session.running = false;
    session.totalPaid = this.calcCost(session.elapsedSec);

    this.sessions = { ...this.sessions };
  }

  private filterReservations(): void {
    this.reservationService.getReservationsByDate(this.selectedDate).subscribe({
      next: (reservations) => {
        this.dayReservations = reservations;
      },
      error: (err) => {
        console.error('Failed to load reservations, frontend problem: ', err);
        this.dayReservations = [];
      }
    });
  }

  private buildDates(): void {
    this.dates = [];

    const today = this.dateStr(0);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (let i = 0; i < 15; i++) {
      const value = this.dateStr(i);
      const d = new Date(value + 'T00:00:00');

      this.dates.push({
        value,
        dayShort: days[d.getDay()].slice(0, 3),
        dayNumber: d.getDate(),
        isToday: value === today,
        label: (i === 0 ? 'Today' : days[d.getDay()]) + ' — ' + d.getDate() + ' ' + months[d.getMonth()]
    });
    }
  }

  private buildSlots(): void {
    for (let h = 14; h <= 23; h++) {
      this.allSlots.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 23) {
        this.allSlots.push(`${String(h).padStart(2, '0')}:30`);
      }
    }
    this.allSlots.push('00:00');
  }

  private dateStr(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private calcCost(sec: number): number {
    return Math.round((sec / 3600) * 200);
  }

  // from here its only for the create reservation api

  selectedModalDate: string = '';
  showCreateModal = false;
  modalStartSlot: number | null = null;
  modalEndSlot: number | null = null;

  showTimeSection = false;

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeCreateModal();
    }
  }

  onModalDateChange() {
    if (!this.selectedModalDate) return;

    this.showTimeSection = true
    this.modalStartSlot = null;
    this.modalEndSlot = null;
  }

  slotToMin(index: number): number {
    const [h, m] = this.allSlots[index].split(':').map(Number);
    return (h === 0 ? 24 : h) * 60 + m;
  }

  selectModalTime(i: number) {
    // if nothing , do nothing, if both selected set start , logic for reselecting starttime
    if (this.modalStartSlot === null || this.modalEndSlot !== null) {
      this.modalStartSlot = i;
      this.modalEndSlot = null;
      return;
    }

    // if new slot is same or older, check startslot
    if (i <= this.modalStartSlot) {
      this.modalStartSlot = i;
      this.modalEndSlot = null;
      return;
    }

    const duration = this.slotToMin(i) - this.slotToMin(this.modalStartSlot);

    if (duration > 240) {
      alert('Maximum Reservation is 4 hours.');
      return;
    }

    this.modalEndSlot = i;
  }

  get modalTimeHint(): string {
    if (this.modalStartSlot === null) {
      return 'Click a start time, then an end time.';
    }

    if (this.modalEndSlot === null) {
      return `Start: ${this.allSlots[this.modalStartSlot]} - now select an end time.`;
    }

    const dur = this.slotToMin(this.modalEndSlot) - this.slotToMin(this.modalStartSlot);
    return `${this.allSlots[this.modalStartSlot]} => ${this.allSlots[this.modalEndSlot]} - Duration: ${dur} min`;
  }

  createReservation(name: string, phone: string) {
    if (!name || !phone || this.modalStartSlot === null || this.modalEndSlot === null || !this.selectedModalDate) {
      alert("You're missing one of the properties.")
      return;
    }

    const reservation: NewReservation = {
      name: name,
      phone: phone,
      date: this.selectedModalDate,
      startTime: this.allSlots[this.modalStartSlot],
      endTime: this.allSlots[this.modalEndSlot]
    };

    this.reservationService.createReservation(reservation).subscribe({
      next: (savedReservation) => {
        console.log(savedReservation.id);
        console.log(savedReservation.createdAt);
        alert('Reservation Confirmed!');
        this.showCreateModal = false;
        this.reset();
        this.filterReservations();
      },
      error: (err) => {
        if (err.status === 409) {
          alert("No tables are available for that time");
        } else {
          console.error(err);
          alert('Reservation failed');
        }
      }
    });
  }

  refreshDashboard() {
    this.reset();
    this.filterReservations();
  }

  reset() {
    this.selectedModalDate = '';
    this.modalStartSlot = null;
    this.modalEndSlot = null;
    this.showTimeSection = false;
    this.showCreateModal = false;
  }

}
