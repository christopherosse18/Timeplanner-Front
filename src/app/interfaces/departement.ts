import {ContratJour} from "./contratJour";

export interface Departement {
  idDepartement: string;
  nom: string;
  contratJours: ContratJour[];
}
