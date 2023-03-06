import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utilisateur} from "../../interfaces/utilisateur";
import {JoursTravail} from "../../interfaces/jourTravail";
import {Saisie} from "../../interfaces/saisie";

@Injectable({
  providedIn: 'root'
})
export class SaisieService {
  private urlBack = 'http://localhost:8080/'

  constructor(private http: HttpClient) { }
  public postSaisie(reponse: string, saisie: Saisie): Observable<Saisie>{
    return this.http.post<any>(this.urlBack+"semaine/"+saisie.username+"/"+saisie.semaineNb
    +"/addSaisie?idJour="+saisie.idJourTravail+"&typeSaisie="+saisie.typeSaisie+"&debut="+saisie.heureDebut+"&fin="+saisie.heureFin, reponse)
  }
  public getTempsExist(username: string): Observable<any>{
    return this.http.get(this.urlBack+"utilisateur/existTemps?username="+username);
  }
  public getWeekExist(username: string, date: string):Observable<any>{
    return this.http.get(this.urlBack+"temps/weekExist?username="+username+"&date="+date);
  }
}
