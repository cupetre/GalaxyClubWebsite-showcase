import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Reservation } from '../../core/services/Reservation';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnChanges {

  @Input() sessions: any = {};
  @Input() reservations: Reservation[] = [];

  @Output() startClicked = new EventEmitter<number>();
  @Output() stopClicked = new EventEmitter<number>();

  sessionCards: { reservation: Reservation; session: any }[] = [];

  ngOnChanges(): void {
    this.buildSessionCards();
  }

  buildSessionCards(): void {
    this.sessionCards = Object.keys(this.sessions)
      .map(id => {
        const numericId = Number(id);
        const reservation = this.reservations.find(r => r.id === numericId);

        if (!reservation) {
          return null;
        }

        return {
          reservation,
          session: this.sessions[numericId]
        };
      })
      .filter((item): item is { reservation: Reservation; session: any } => item !== null);
  }

  formatSec(sec: number): string {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  getStatusLabel(session: any): string {
    if (session.running) return 'Running';
    return 'Ready';
  }

  constructor() { }

  ngOnInit() {
  }

}
