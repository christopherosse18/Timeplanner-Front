import {Departement} from "./departement";
import {Temps} from "./temps";

export interface Utilisateur {
  nom: string;
  prenom: string;
  username: string;
  idUtilisateur: string;
  email: string;
  departements: Departement[];
  temps: Temps;
}
