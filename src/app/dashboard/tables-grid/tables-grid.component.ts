import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Reservation } from '../../core/services/Reservation';

@Component({
  selector: 'app-tables-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables-grid.component.html',
  styleUrls: ['./tables-grid.component.css']
})
export class TablesGridComponent implements OnInit {

  ngOnInit(){
  }

  @Input() selectedDate!: string;
  @Input() dayReservations: Reservation[] = [];
  @Input() sessions: any = {};
  @Input() allSlots: string[] = [];

  @Output() sessionOpened = new EventEmitter<Reservation>();

  dayTitle = '';
  isToday = false;

  ngOnChanges(): void {
    this.buildHeading();
  }

  openSession(reservation: Reservation): void {
    this.sessionOpened.emit(reservation);
  }

  buildHeading(): void {
    const d = new Date(this.selectedDate + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.dayTitle = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    this.isToday = this.selectedDate === todayStr;
  }

  getReservationStartingAt(tableNum: number, slot: string): Reservation | undefined {
    return this.dayReservations.find(r => r.table === tableNum && r.startTime === slot);
  }

  isOccupied(tableNum: number, slot: string): boolean {
    const reservations = this.dayReservations.filter(r => r.table === tableNum);
    const slotMin = this.timeToMin(slot);

    return reservations.some(r =>
      slotMin >= this.timeToMin(r.startTime) &&
      slotMin < this.timeToMin(r.endTime)
    );
  }

  isActive(tableNum: number, slot: string): boolean {
    const res = this.getReservationStartingAt(tableNum, slot);
    return !!res && !!this.sessions[res.id]?.running;
  }

  private timeToMin(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return (h === 0 ? 24 : h) * 60 + m;
  }
}
