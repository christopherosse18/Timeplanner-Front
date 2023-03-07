import {CalendarEvent} from "angular-calendar";
import {SemaineTravail} from "./semaineTravail";

export interface Saisie extends CalendarEvent{
  idSaisie: string;
  typeSaisie: string;
  heureDebut: string;
  heureFin: string;
  semaine: SemaineTravail;
  idJourTravail: string;
  username : string;
  semaineNb:number;
  supprime:boolean
}
