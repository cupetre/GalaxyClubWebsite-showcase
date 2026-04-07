import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-strip.component.html',
  styleUrls: ['./date-strip.component.css'
  ]
})
export class DateStripComponent implements OnInit {

  @Input() selectedDate!: string;
  @Input() dates: any[] = [];

  @Output() dateSelected = new EventEmitter<string>();

  selectDate(date: string): void {
    this.dateSelected.emit(date);
  }
  constructor( ) { }

  ngOnInit() {
  }

}
