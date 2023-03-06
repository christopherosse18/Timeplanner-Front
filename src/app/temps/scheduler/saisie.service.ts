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
  public postUsername(reponse: string,username: string, semaineNb: number, jourTravail: JoursTravail, saisie: Saisie): Observable<Saisie>{
    return this.http.post<any>(this.urlBack+"semaine/"+username+"/"+semaineNb
    +"/addsaisie?idJour="+jourTravail.idJourTravail+"&saisieFront="+saisie, reponse)
  }
  public getTempsExist(username: string): Observable<any>{
    return this.http.get(this.urlBack+"utilisateur/existTemps?username="+username);
  }
  public getWeekExist(username: string, date: string):Observable<any>{
    return this.http.get(this.urlBack+"temps/weekExist?username="+username+"&date="+date);
  }
}
