import {Saisie} from "./saisie";

export interface JoursTravail {
  idJourTravail: string;
  date: string;
  duree: number;
  tempsRealise: number;
  saisies: Saisie[];
}
