import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../core/services/reservation.service';
import { NewReservation } from '../../../core/services/NewReservation';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Reserve',
  templateUrl: './Reserve.component.html',
  styleUrls: ['./Reserve.component.css'],
  imports: [FormsModule,
    CommonModule,
    NgIf
  ]
})

export class ReserveComponent implements OnInit {

  // prajme dates i mu davame celosna struktura za kako da ocekuva da bidi dates array-o
  dates: { value: string, label: string }[] = [];
  slots: string[] = [];

  selectedDate: string = '';
  startSlot: number | null = null;
  endSlot: number | null = null;

  showTimeSection = false;
  showReservationModal = false;
  showTournamentModal = false;

  constructor(private _reservationService: ReservationService) {

  }

  ngOnInit() {
    this.populateDates();
    this.generateSlots();
  }

  // local and main method for date formating
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

  generateSlots() {
    for (let h = 14; h <= 23; h++) {
      this.slots.push(`${String(h).padStart(2, '0')}:00`); // template for creating 2 digit hour + 2 digit minutes

      if (h < 23) {
        this.slots.push(`${String(h).padStart(2, '0')}:30`); // does same , adds half hours
      }
    }

    this.slots.push('00:00');
  }

  // when date is selected show time, set nulls on start and endslots
  onDateChange() {
    if (!this.selectedDate) return;

    this.showTimeSection = true;
    this.startSlot = null;
    this.endSlot = null;
  }

  selectTime(i: number) {

    // if nothing , do nothing, if both selected set start , logic for reselecting starttime
    if (this.startSlot === null || this.endSlot !== null) {
      this.startSlot = i;
      this.endSlot = null;
      return;
    }

    // if new slot is same or older, check startslot
    if (i <= this.startSlot) {
      this.startSlot = i;
      this.endSlot = null;
      return;
    }

    const duration = this.slotToMin(i) - this.slotToMin(this.startSlot);

    if (duration > 240) {
      alert('Maximum Reservation is 4 hours.');
      return;
    }

    this.endSlot = i;
  }

  //calculate the 4 hours
  slotToMin(index: number): number {
    const [h, m] = this.slots[index].split(':').map(Number);
    return (h === 0 ? 24 : h) * 60 + m;
  }

  get durationHint(): string {
    if (this.startSlot === null) {
      return 'Click a start time, then an end time.';
    }

    if (this.endSlot === null) {
      return `Start: ${this.slots[this.startSlot]} - now select an end time.`;
    }

    const dur = this.slotToMin(this.endSlot) - this.slotToMin(this.startSlot);
    return `${this.slots[this.startSlot]} => ${this.slots[this.endSlot]} - Duration: ${dur} min`;
  }

  submitReservation() {
    if (!this.selectedDate || this.startSlot === null || this.endSlot === null) {
      alert('Please select date and time.');
      return;
    }

    this.showReservationModal = true;
  }

  submitTournament() {
    this.showTournamentModal = true;
  }

  finalConfirm(name: string,phone: string)
    {

    if (!name || !phone) {
      alert('Please provide name and number.');
      return;
    }

    if (!this.selectedDate || this.startSlot === null || this.endSlot === null) {
      alert('Please enter dates');
      return;
    }

    const reservation: NewReservation = {
      name: name,
      phone: phone,
      date: this.selectedDate,
      startTime: this.slots[this.startSlot],
      endTime: this.slots[this.endSlot]
    };

    this._reservationService.createReservation(reservation).subscribe({
      next: (savedReservation) => {
        console.log(savedReservation.id);
        console.log(savedReservation.createdAt);
        alert('Reservation Confirmed!');
        this.showReservationModal = false;
        this.reset();
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

  finalTournamentConfirm(
    name: string,
    email: string,
    phoneNumber: string,
    prefDates: string,
    numberPlayers: number,
    notes: string
  ) {
    if (!name || !email || !phoneNumber || !prefDates || !numberPlayers || !notes) {
      alert('Please provide full information.');
      return;
    }

    alert('✓ Tournament request received! We\'ll contact you soon, ' + name + '.');

    this.showTournamentModal = false;
  }

  reset() {
    this.selectedDate = '';
    this.startSlot = null;
    this.endSlot = null;
    this.showTimeSection = false;
    this.showReservationModal = false;
    this.showTournamentModal = false;
  }

}
