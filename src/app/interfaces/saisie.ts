import {CalendarEvent} from "angular-calendar";

export interface Saisie extends CalendarEvent{
  idSaisie: string;
  typeSaisie: string;
  heureDebut: string;
  heureFin: string;
  idJourTravail: string;
  username : string;
  semaineNb:number;
}
