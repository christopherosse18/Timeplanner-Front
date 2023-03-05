import {JoursTravail} from "./jourTravail";

export interface SemaineTravail {
  idSemaineTravail: string;
  numSemaine: number;
  joursTravail: JoursTravail[];
  heuresRealisees: number;
  heuresDues: number;
}
