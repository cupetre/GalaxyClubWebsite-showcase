import { NewReservation } from "./NewReservation";

export interface Reservation extends NewReservation{
  id: number,
  table: number,
  createdAt?: string
}
