import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewReservation } from './NewReservation';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';
import { environment } from "../../environments/environment.prod";
import { Reservation } from './Reservation';

@Injectable({
  providedIn: 'root'
})

export class ReservationService  {

  private apiUrl = `${environment.apiUrl}/reservation`;

  constructor(private http: HttpClient) { }

  createReservation(newReservation: NewReservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, newReservation);
  }

  ownerCreateReservation(newReservation: NewReservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/owner`, newReservation);
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getReservationsByDate(date: Date | string): Observable<Reservation[]> {
    const formattedDate = this.formatDateOnly(date);
    return this.http.get<Reservation[]>(`${this.apiUrl}/date/${formattedDate}`);
  }

  getReservationsByDateAndTable(date: Date | string, table: number): Observable<Reservation[]> {
    const formattedDate = this.formatDateOnly(date);
    return this.http.get<Reservation[]>(`${this.apiUrl}/date/${formattedDate}/table/${table}`);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private formatDateOnly(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
}
